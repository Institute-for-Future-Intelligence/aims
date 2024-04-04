/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DirectionalLight, Raycaster, Vector3 } from 'three';
import { Protein } from '../models/Protein.ts';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { MoleculeInterface, MoleculeTransform } from '../types';
import AtomJS from '../lib/chem/Atom';
import BondJS from '../lib/chem/Bond';
import { Atom } from '../models/Atom.ts';
import { RadialBond } from '../models/RadialBond.ts';
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
import { loadMolecule } from './moleculeTools.ts';
import ModelContainer from './modelContainer.tsx';
import Picker from '../lib/ui/Picker.js';
import RCGroup from '../lib/gfx/RCGroup.js';
import settings from '../lib/settings';
import { Instance, Instances } from '@react-three/drei';
import Element from '../lib/chem/Element';

extend({ RCGroup });

export interface DockingViewerProps {
  protein: MoleculeInterface | null;
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
    const updateViewerFlag = usePrimitiveStore(Selector.updateViewerFlag);
    const projectViewerMaterial = useStore(Selector.projectViewerMaterial);
    const projectViewerStyle = useStore(Selector.projectViewerStyle);
    const ligand = useStore(Selector.ligand);
    const ligandTransform =
      useStore.getState().projectState.ligandTransform ?? ({ x: 0, y: 0, z: 0, euler: [0, 0, 0] } as MoleculeTransform);
    const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);

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

    // deal with protein

    useEffect(() => {
      if (!protein) {
        setProteinComplex(undefined);
        return;
      }
      if (setLoading) setLoading(true);
      loadMolecule(protein, processProteinResult);
    }, [protein]);

    const processProteinResult = (result: any) => {
      setProteinComplex(result);
      const name = result.name;
      const metadata = result.metadata;
      const atoms: Atom[] = [];
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
        atoms.push(
          new Atom(
            i,
            Util.capitalizeFirstLetter(atom.element.name),
            (atom.position as Vector3).clone().sub(centerRef.current),
          ),
        );
      }
      const bonds: RadialBond[] = [];
      for (let i = 0; i < result._bonds.length; i++) {
        const bond = result._bonds[i] as BondJS;
        const atom1 = bond._left;
        const atom2 = bond._right;
        const elementSymbol1 = atom1.element.name;
        const elementSymbol2 = atom2.element.name;
        bonds.push(
          new RadialBond(
            new Atom(atom1.index, elementSymbol1, (atom1.position as Vector3).clone().sub(centerRef.current)),
            new Atom(atom2.index, elementSymbol2, (atom2.position as Vector3).clone().sub(centerRef.current)),
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
        } as Protein;
      });
    };

    useEffect(() => {
      if (!proteinGroupRef.current || !mode) return;
      proteinGroupRef.current.children = [];
      if (!proteinComplex) return;
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

    // deal with ligand

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
      if (!ligand || !ligandComplex) {
        if (ligandGroupRef.current) {
          ligandGroupRef.current.children.length = 0;
        }
        return;
      }
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
    }, [ligand, ligandComplex, projectViewerStyle, projectViewerMaterial, updateViewerFlag]);

    useEffect(() => {
      const picker = new Picker(groupRef.current, camera, gl.domElement);
      // @ts-expect-error ignore
      settings.set('pick', 'molecule');
      // @ts-expect-error ignore
      picker.addEventListener('newpick', (event) => {
        // For some reason, "molecule" for a ligand may return null
        usePrimitiveStore.getState().set((state) => {
          const m = event.obj.molecule;
          // ligand has only one residue, protein has many
          state.pickedMoleculeIndex = m !== undefined ? (m !== null && m.residues?.length > 1 ? 0 : 1) : -1;
        });
      });
      return () => {
        picker.dispose();
      };
    }, []);

    const skinnyStyle = useMemo(() => {
      return (
        projectViewerStyle === MolecularViewerStyle.BallAndStick ||
        projectViewerStyle === MolecularViewerStyle.Stick ||
        projectViewerStyle === MolecularViewerStyle.Wireframe
      );
    }, [projectViewerStyle]);

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
        {/*don't put this into the ligand group above as it will be reconstructed every update*/}
        {pickedMoleculeIndex === 1 && ligandComplex && (
          <group
            position={[
              ligandTransform.x + centerRef.current.x,
              ligandTransform.y + centerRef.current.y,
              ligandTransform.z + centerRef.current.z,
            ]}
            rotation={[ligandTransform.euler[0], ligandTransform.euler[1], ligandTransform.euler[2]]}
          >
            <Instances limit={1000} range={1000}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial transparent opacity={0.5} />
              {ligandComplex._atoms.map((a: AtomJS, i: number) => {
                return (
                  <Instance
                    key={i}
                    scale={Element.getByName(a.element).radius * (skinnyStyle ? 0.6 : 2.4)}
                    position={[a.position.x, a.position.y, a.position.z]}
                    color={'yellow'}
                  />
                );
              })}
            </Instances>
          </group>
        )}
        <ModelContainer position={groupRef?.current?.position.clone().negate()} />
      </rCGroup>
    );
  },
);

export default DockingViewer;
