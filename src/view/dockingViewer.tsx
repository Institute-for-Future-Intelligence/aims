/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DirectionalLight, Raycaster, Vector3 } from 'three';
import { ProteinTS } from '../models/ProteinTS.ts';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { MoleculeData, MoleculeTransform } from '../types';
import AtomJS from '../lib/chem/Atom';
import BondJS from '../lib/chem/Bond';
import { AtomTS } from '../models/AtomTS';
import { BondTS } from '../models/BondTS';
import { Util } from '../Util';
import ComplexVisual from '../lib/ComplexVisual';
import { ThreeEvent, extend, useThree, Camera } from '@react-three/fiber';
import {
  COLORING_MAP,
  MATERIAL_MAP,
  MolecularViewerColoring,
  MolecularViewerMaterial,
  MolecularViewerStyle,
  STYLE_MAP,
} from './displayOptions';
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { useRefStore } from '../stores/commonRef';
import { loadMolecule, setProperties } from './moleculeTools.ts';
import ModelContainer from './modelContainer.tsx';
import Picker from '../lib/ui/Picker.js';
import RCGroup from '../lib/gfx/RCGroup.js';
import settings from '../lib/settings';

extend({ RCGroup });

export interface DockingViewerProps {
  protein: MoleculeData | null;
  style: MolecularViewerStyle;
  material: MolecularViewerMaterial;
  coloring: MolecularViewerColoring;
  selector?: string;
  lightRef?: React.RefObject<DirectionalLight>;
  setLoading?: (loading: boolean) => void;
  onPointerOver?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

const DockingViewer = React.memo(
  ({
    protein,
    style,
    material,
    coloring,
    selector,
    setLoading,
    onPointerOver,
    onPointerLeave,
    onPointerDown,
  }: DockingViewerProps) => {
    const setCommonStore = useStore(Selector.set);
    const projectViewerMaterial = useStore(Selector.projectViewerMaterial);
    const projectViewerStyle = useStore(Selector.projectViewerStyle);
    const ligand = useStore(Selector.ligand);
    const ligandTransform =
      useStore.getState().projectState.ligandTransform ?? ({ x: 0, y: 0, z: 0, euler: [0, 0, 0] } as MoleculeTransform);

    const [proteinComplex, setProteinComplex] = useState<any>();
    const [ligandComplex, setLigandComplex] = useState<any>();

    const centerRef = useRef<Vector3>(new Vector3());
    const groupRef = useRef<RCGroup>(null);
    const proteinGroupRef = useRef<RCGroup>(null);
    const ligandGroupRef = useRef<RCGroup>(null);
    const cameraRef = useRef<Camera | undefined>();
    const raycasterRef = useRef<Raycaster | undefined>();

    const { invalidate, camera, raycaster, gl } = useThree();

    const mode = useMemo(() => {
      return STYLE_MAP.get(style);
    }, [style]);

    const colorer = useMemo(() => {
      return COLORING_MAP.get(coloring);
    }, [coloring]);

    useEffect(() => {
      cameraRef.current = camera;
      raycasterRef.current = raycaster;
      useRefStore.setState({
        cameraRef: cameraRef,
        raycasterRef: raycasterRef,
      });
    }, [camera, raycaster, cameraRef, raycasterRef]);

    useEffect(() => {
      if (!protein) {
        setProteinComplex(undefined);
        return;
      }
      loadMolecule(protein, processProteinResult);
    }, [protein]);

    const processProteinResult = (result: any) => {
      setProteinComplex(result);
      const name = result.name;
      const metadata = result.metadata;
      const atoms: AtomTS[] = [];
      centerRef.current.set(0, 0, 0);
      const n = result._atoms.length;
      for (let i = 0; i < n; i++) {
        const atom = result._atoms[i] as AtomJS;
        centerRef.current.add(atom.position);
      }
      if (n > 0) {
        centerRef.current.multiplyScalar(1 / n);
      }
      groupRef.current?.position.copy(centerRef.current.clone().negate());
      for (let i = 0; i < result._atoms.length; i++) {
        const atom = result._atoms[i] as AtomJS;
        atoms.push({
          elementSymbol: Util.capitalizeFirstLetter(atom.element.name),
          position: (atom.position as Vector3).clone().sub(centerRef.current),
        } as AtomTS);
      }
      const bonds: BondTS[] = [];
      for (let i = 0; i < result._bonds.length; i++) {
        const bond = result._bonds[i] as BondJS;
        const atom1 = bond._left;
        const atom2 = bond._right;
        const elementSymbol1 = atom1.element.name;
        const elementSymbol2 = atom2.element.name;
        bonds.push(
          new BondTS(
            {
              elementSymbol: elementSymbol1,
              position: (atom1.position as Vector3).clone().sub(centerRef.current),
            } as AtomTS,
            {
              elementSymbol: elementSymbol2,
              position: (atom2.position as Vector3).clone().sub(centerRef.current),
            } as AtomTS,
          ),
        );
      }
      const residues = result._residues;
      const chains = result._chains;
      const structures = result.structures;
      const molecules = result._molecules;
      setCommonStore((state) => {
        state.proteinData = {
          name,
          metadata,
          atoms,
          bonds,
          residues,
          chains,
          structures,
          molecules,
          centerOffset: centerRef.current.clone(),
        } as ProteinTS;
      });
      if (protein) {
        setProperties(protein, result._atoms.length, result._bonds.length);
      }
    };

    useEffect(() => {
      if (!proteinGroupRef.current || !mode) return;
      proteinGroupRef.current.children = [];
      if (!proteinComplex) return;
      if (setLoading) setLoading(true);

      proteinGroupRef.current.position.set(0, 0, 0);
      const visual = new ComplexVisual(proteinComplex.name, proteinComplex);
      const reps = [
        {
          mode: mode,
          colorer: colorer,
          selector: selector ?? 'all',
          material: MATERIAL_MAP.get(material),
        },
      ];
      visual.resetReps(reps);
      visual
        .rebuild()
        .then(() => {
          if (!proteinGroupRef.current) return;
          proteinGroupRef.current.add(visual);
          const boundingSphere = visual.getBoundaries().boundingSphere;
          usePrimitiveStore.getState().set((state) => {
            state.boundingSphereRadius = boundingSphere.radius;
          });
          invalidate();
        })
        .finally(() => {
          if (setLoading) setLoading(false);
        });
    }, [proteinComplex, material, mode, colorer, selector]);

    useEffect(() => {
      if (!ligand) {
        setLigandComplex(undefined);
        return;
      }
      loadMolecule(ligand, processLigandResult);
    }, [ligand]);

    const processLigandResult = (result: any) => {
      setLigandComplex(result);
    };

    useEffect(() => {
      if (!ligand || !ligandComplex || !ligandGroupRef.current) return;
      const visualLigand = new ComplexVisual(ligand.name, ligandComplex);
      visualLigand.resetReps([
        {
          mode: STYLE_MAP.get(projectViewerStyle),
          colorer: COLORING_MAP.get(MolecularViewerColoring.Element),
          selector: 'all',
          material: MATERIAL_MAP.get(projectViewerMaterial),
        },
      ]);
      visualLigand.rebuild().then(() => {
        if (!ligandGroupRef.current) return;
        ligandGroupRef.current.children.length = 0;
        ligandGroupRef.current.add(visualLigand);
        invalidate();
      });
      useRefStore.setState({ ligandRef: ligandGroupRef });
    }, [ligand, ligandComplex, projectViewerStyle, projectViewerMaterial]);

    useEffect(() => {
      const picker = new Picker(groupRef.current, camera, gl.domElement);
      // @ts-expect-error ignore
      settings.set('pick', 'molecule');
      // @ts-expect-error ignore
      picker.addEventListener('newpick', (event) => {
        console.log('pick', event.obj.molecule);
      });
      return () => {
        picker.dispose();
      };
    }, []);

    return (
      <rCGroup
        ref={groupRef}
        onPointerOver={onPointerOver}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
      >
        <rCGroup name={'Protein'} ref={proteinGroupRef} />
        <rCGroup
          name={'Ligand'}
          ref={ligandGroupRef}
          position={[
            ligandTransform.x + centerRef.current.x,
            ligandTransform.y + centerRef.current.y,
            ligandTransform.z + centerRef.current.z,
          ]}
          rotation={[ligandTransform.euler[0], ligandTransform.euler[1], ligandTransform.euler[2]]}
        />
        <ModelContainer position={groupRef?.current?.position.clone().negate()} />
      </rCGroup>
    );
  },
);

export default DockingViewer;
