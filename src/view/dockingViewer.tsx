/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DirectionalLight, DoubleSide, Vector3 } from 'three';
import { ProteinTS } from '../models/ProteinTS.ts';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { MoleculeData } from '../types';
import AtomJS from '../lib/chem/Atom';
import BondJS from '../lib/chem/Bond';
import { AtomTS } from '../models/AtomTS';
import { BondTS } from '../models/BondTS';
import { Util } from '../Util';
import ComplexVisual from '../lib/ComplexVisual';
import { ThreeEvent, extend, useThree } from '@react-three/fiber';
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
import { Box, Edges } from '@react-three/drei';
import DropPlanes from './dropPlanes.tsx';
import Picker from '../lib/ui/Picker.js';
import RCGroup from '../lib/gfx/RCGroup.js';
extend({ RCGroup });

export interface DockingViewerProps {
  moleculeData: MoleculeData | null;
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
    moleculeData,
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
    const parsedResultsMap = useStore(Selector.parsedResultsMap);
    const ligand = useStore(Selector.ligand);
    const updateLigandData = useStore(Selector.updateLigandData);
    const ligandRotation = useStore.getState().projectState.ligandRotation ?? [0, 0, 0];
    const ligandTranslation = useStore.getState().projectState.ligandTranslation ?? [0, 0, 0];
    const molecularContainer = useStore(Selector.molecularContainer);
    const molecularContainerVisible = useStore(Selector.molecularContainerVisible);

    const [complex, setComplex] = useState<any>();

    const groupRef = useRef<RCGroup>(null);
    const proteinGroupRef = useRef<RCGroup>(null);
    const ligandGroupRef = useRef<RCGroup>(null);
    const originalPositions = useRef<Vector3[]>([]);

    const { invalidate, camera, gl } = useThree();

    const mode = useMemo(() => {
      return STYLE_MAP.get(style);
    }, [style]);

    const colorer = useMemo(() => {
      return COLORING_MAP.get(coloring);
    }, [coloring]);

    useEffect(() => {
      if (ligand) {
        originalPositions.current.length = 0;
        const complex = parsedResultsMap.get(ligand.name);
        if (complex) {
          for (const a of complex._atoms) {
            originalPositions.current.push(a.position.clone());
          }
        }
      }
    }, [ligand, parsedResultsMap]);

    useEffect(() => {
      if (!moleculeData) {
        setComplex(undefined);
        return;
      }
      loadMolecule(moleculeData, processResult);
    }, [moleculeData?.name]);

    const processResult = (result: any) => {
      setComplex(result);
      const name = result.name;
      const metadata = result.metadata;
      const atoms: AtomTS[] = [];
      let cx = 0;
      let cy = 0;
      let cz = 0;
      const n = result._atoms.length;
      for (let i = 0; i < n; i++) {
        const atom = result._atoms[i] as AtomJS;
        cx += atom.position.x;
        cy += atom.position.y;
        cz += atom.position.z;
      }
      if (n > 0) {
        cx /= n;
        cy /= n;
        cz /= n;
      }
      groupRef.current?.position.set(-cx, -cy, -cz);
      for (let i = 0; i < result._atoms.length; i++) {
        const atom = result._atoms[i] as AtomJS;
        atoms.push({
          elementSymbol: Util.capitalizeFirstLetter(atom.element.name),
          position: new Vector3(atom.position.x - cx, atom.position.y - cy, atom.position.z - cz),
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
              position: new Vector3(atom1.position.x - cx, atom1.position.y - cy, atom1.position.z - cz),
            } as AtomTS,
            {
              elementSymbol: elementSymbol2,
              position: new Vector3(atom2.position.x - cx, atom2.position.y - cy, atom2.position.z - cz),
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
          centerOffset: new Vector3(cx, cy, cz),
        } as ProteinTS;
      });
      if (moleculeData) {
        setProperties(moleculeData, result._atoms.length, result._bonds.length);
      }
    };

    useEffect(() => {
      if (!proteinGroupRef.current || !mode) return;
      proteinGroupRef.current.children = [];
      if (!complex) return;
      if (setLoading) setLoading(true);

      proteinGroupRef.current.position.set(0, 0, 0);
      const visual = new ComplexVisual(complex.name, complex);
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
    }, [complex, material, mode, colorer, selector]);

    useEffect(() => {
      if (!moleculeData) groupRef.current?.position.set(0, 0, 0);
      if (ligandGroupRef.current) {
        ligandGroupRef.current.children = [];
        if (ligand) {
          const complexLigand = parsedResultsMap.get(ligand.name);
          if (complexLigand) {
            const visualLigand = new ComplexVisual(ligand.name, complexLigand);
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
              updateLigandData();
              ligandGroupRef.current.add(visualLigand);
              invalidate();
            });
          }
          useRefStore.setState((state) => ({ ligandRef: ligandGroupRef }));
        }
      }
    }, [ligand, parsedResultsMap, projectViewerStyle, projectViewerMaterial]);

    // picker
    useEffect(() => {
      const picker = new Picker(groupRef.current, camera, gl.domElement);
      // @ts-ignore
      picker.addEventListener('newpick', (event) => {
        console.log('pick', event.obj);

        // let complex = null;
        // if (event.obj.atom) {
        //   complex = event.obj.atom.residue.getChain().getComplex();
        // } else if (event.obj.residue) {
        //   complex = event.obj.residue.getChain().getComplex();
        // } else if (event.obj.chain) {
        //   complex = event.obj.chain.getComplex();
        // } else if (event.obj.molecule) {
        //   complex = event.obj.molecule.complex;
        // } else {
        // }

        // if (proteinGroupRef.current) {
        //   const visual = proteinGroupRef.current.children[0] as ComplexVisual;
        //   if (visual && (visual.getComplex() === complex || complex === null)) {
        //     visual.updateSelectionMask(event.obj);
        //     visual.rebuildSelectionGeometry();
        //   }
        // }
        // if (ligandGroupRef.current) {
        //   const visual = ligandGroupRef.current.children[0] as ComplexVisual;
        //   if (visual && (visual.getComplex() === complex || complex === null)) {
        //     visual.updateSelectionMask(event.obj);
        //     visual.rebuildSelectionGeometry();
        //   }
        // }
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
        <rCGroup
          name={'Protein'}
          ref={proteinGroupRef}
          // FIXME: adding this would slow down the viewer significantly
          // onContextMenu={(e) => {
          //   e.stopPropagation();
          //   usePrimitiveStore.getState().set((state) => {
          //     state.contextMenuObjectType = ObjectType.Molecule;
          //   });
          // }}
        />
        <rCGroup
          name={'Ligand'}
          ref={ligandGroupRef}
          position={[ligandTranslation[0], ligandTranslation[1], ligandTranslation[2]]}
          rotation={[ligandRotation[0], ligandRotation[1], ligandRotation[2]]}
        />
        {molecularContainerVisible && (
          <Box
            args={[molecularContainer.lx, molecularContainer.ly, molecularContainer.lz]}
            position={groupRef?.current?.position.clone().negate()}
          >
            <meshStandardMaterial attach="material" opacity={0.1} side={DoubleSide} transparent color={'lightgray'} />
            <Edges scale={1} threshold={15} color="dimgray" />
          </Box>
        )}
        <DropPlanes />
      </rCGroup>
    );
  },
);

export default DockingViewer;
