/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DoubleSide, Group, Raycaster } from 'three';
import { MoleculeData } from '../types.ts';
import AtomJS from '../lib/chem/Atom';
import ComplexVisual from '../lib/ComplexVisual';
import { Camera, ThreeEvent, useThree } from '@react-three/fiber';
import {
  COLORING_MAP,
  MATERIAL_MAP,
  MolecularViewerColoring,
  MolecularViewerMaterial,
  MolecularViewerStyle,
  STYLE_MAP,
} from './displayOptions';
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { loadMolecule } from './moleculeTools.ts';
import { AtomTS } from '../models/AtomTS.ts';
import Complex from '../lib/chem/Complex';
import Element from '../lib/chem/Element';
import Molecule from '../lib/chem/Molecule';
import * as Selector from '../stores/selector';
import { Grid, Line, Plane } from '@react-three/drei';
import { HALF_PI } from '../constants.ts';
import { useStore } from '../stores/common.ts';
import { MoleculeTS } from '../models/MoleculeTS.ts';
import { useRefStore } from '../stores/commonRef.ts';

export interface DynamicsViewerProps {
  style: MolecularViewerStyle;
  material: MolecularViewerMaterial;
  coloring: MolecularViewerColoring;
  selector?: string;
  setLoading?: (loading: boolean) => void;
  onPointerOver?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

// TODO: We have to generate a complex for each molecule
const generateComplex = (name: string, molecules: MoleculeTS[]) => {
  const complex = new Complex();
  for (const [idx, mol] of molecules.entries()) {
    const chain = complex.addChain('Chain' + idx);
    const residue = chain.addResidue('UNK' + idx, idx, ' ');
    for (const [i, a] of mol.atoms.entries()) {
      residue.addAtom(
        a.elementSymbol,
        Element.getByName(a.elementSymbol),
        a.position,
        undefined,
        true,
        i + 1,
        ' ',
        1,
        1,
        0,
      );
    }
    const molecule = new Molecule(complex, name, idx + 1);
    molecule.residues = [residue];
    complex._molecules.push(molecule);
  }
  complex.finalize({
    needAutoBonding: true,
    detectAromaticLoops: false,
    enableEditing: false,
    serialAtomMap: false,
  });
  return complex;
};

const DynamicsViewer = React.memo(
  ({
    style,
    material,
    coloring,
    selector,
    setLoading,
    onPointerOver,
    onPointerLeave,
    onPointerDown,
  }: DynamicsViewerProps) => {
    const xyPlaneVisible = useStore(Selector.xyPlaneVisible);
    const yzPlaneVisible = useStore(Selector.yzPlaneVisible);
    const xzPlaneVisible = useStore(Selector.xzPlaneVisible);
    const xyPlanePosition = useStore(Selector.xyPlanePosition) ?? 0;
    const yzPlanePosition = useStore(Selector.yzPlanePosition) ?? 0;
    const xzPlanePosition = useStore(Selector.xzPlanePosition) ?? 0;
    const testMolecules = useStore(Selector.testMolecules);

    const [complex, setComplex] = useState<any>();

    const moleculesRef = useRef<MoleculeTS[]>([]);
    const groupRef = useRef<Group>(null);
    const planeXYRef = useRef<any>();
    const planeYZRef = useRef<any>();
    const planeXZRef = useRef<any>();
    const cameraRef = useRef<Camera | undefined>();
    const raycasterRef = useRef<Raycaster | undefined>();

    const { invalidate, camera, raycaster } = useThree();

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
        planeXYRef: planeXYRef,
        planeYZRef: planeYZRef,
        planeXZRef: planeXZRef,
        moleculesRef: moleculesRef,
      });
    }, [camera, raycaster, planeXYRef, planeYZRef, planeXZRef, cameraRef, raycasterRef, moleculesRef]);

    useEffect(() => {
      if (!testMolecules || testMolecules.length === 0) {
        setComplex(undefined);
        return;
      }
      moleculesRef.current.length = 0;
      for (const m of testMolecules) {
        loadMolecule(m, processResult);
      }
    }, [testMolecules]);

    const processResult = (result: any, molecule?: MoleculeData) => {
      const mol = { name: molecule?.name, metadata: null, atoms: [], bonds: [] } as MoleculeTS;
      const n = result._atoms.length;
      for (let i = 0; i < n; i++) {
        const atom = result._atoms[i] as AtomJS;
        const a = { elementSymbol: atom.element.name, position: atom.position } as AtomTS;
        if (molecule) {
          a.position.x += molecule.x ?? 0;
          a.position.y += molecule.y ?? 0;
          a.position.z += molecule.z ?? 0;
        }
        mol.atoms.push(a);
      }
      moleculesRef.current.push(mol);
      if (moleculesRef.current.length === testMolecules.length) {
        setComplex(generateComplex('all', moleculesRef.current));
      }
    };

    useEffect(() => {
      if (!groupRef.current || !mode) return;
      groupRef.current.children = [];
      if (!complex) return;
      if (setLoading) setLoading(true);

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
          if (!groupRef.current) return;
          groupRef.current.add(visual);
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

    const halfPlaneSize = 10;
    const planeSize = 2 * halfPlaneSize;
    const planeOpacity = 0.5;

    return (
      <>
        <group
          ref={groupRef}
          onPointerOver={onPointerOver}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
        />
        {xyPlaneVisible && (
          <group position={[0, 0, xyPlanePosition]}>
            <Plane
              ref={planeXYRef}
              visible={false}
              name={'X-Y Plane'}
              args={[planeSize, planeSize]}
              rotation={[0, 0, 0]}
              onClick={(e) => {
                // console.log('a');
              }}
            >
              <meshStandardMaterial
                attach="material"
                opacity={planeOpacity}
                side={DoubleSide}
                transparent
                color={'blue'}
              />
            </Plane>
            <Grid
              name={'X-Y Grid'}
              args={[planeSize, planeSize]}
              rotation={[HALF_PI, 0, 0]}
              sectionColor={'blue'}
              sectionThickness={1}
              side={DoubleSide}
            />
            <Line
              name={'x-y plane border lines'}
              points={[
                [-halfPlaneSize, -halfPlaneSize, 0],
                [halfPlaneSize, -halfPlaneSize, 0],
                [halfPlaneSize, halfPlaneSize, 0],
                [-halfPlaneSize, halfPlaneSize, 0],
                [-halfPlaneSize, -halfPlaneSize, 0],
              ]}
              color={'blue'}
              lineWidth={2}
            />
          </group>
        )}
        {yzPlaneVisible && (
          <group position={[yzPlanePosition, 0, 0]}>
            <Plane
              ref={planeYZRef}
              visible={false}
              name={'Y-Z Plane'}
              args={[planeSize, planeSize]}
              rotation={[0, HALF_PI, 0]}
            >
              <meshStandardMaterial
                attach="material"
                opacity={planeOpacity}
                side={DoubleSide}
                transparent
                color={'red'}
              />
            </Plane>
            <Grid
              name={'Y-Z Grid'}
              args={[planeSize, planeSize]}
              rotation={[0, 0, HALF_PI]}
              sectionColor={'red'}
              sectionThickness={1}
              side={DoubleSide}
              onClick={(e) => {}}
            />
            <Line
              name={'y-z plane border lines'}
              points={[
                [0, -halfPlaneSize, -halfPlaneSize],
                [0, halfPlaneSize, -halfPlaneSize],
                [0, halfPlaneSize, halfPlaneSize],
                [0, -halfPlaneSize, halfPlaneSize],
                [0, -halfPlaneSize, -halfPlaneSize],
              ]}
              color={'red'}
              lineWidth={2}
            />
          </group>
        )}
        {xzPlaneVisible && (
          <group position={[0, xzPlanePosition, 0]}>
            <Plane
              ref={planeXZRef}
              visible={false}
              name={'X-Z Plane'}
              args={[planeSize, planeSize]}
              rotation={[HALF_PI, 0, 0]}
            >
              <meshStandardMaterial
                attach="material"
                opacity={planeOpacity}
                side={DoubleSide}
                transparent
                color={'green'}
              />
            </Plane>
            <Grid
              name={'X-Z Grid'}
              args={[planeSize, planeSize]}
              rotation={[0, HALF_PI, 0]}
              sectionColor={'green'}
              sectionThickness={1}
              side={DoubleSide}
              onClick={(e) => {}}
            />
            <Line
              name={'x-z plane border lines'}
              points={[
                [-halfPlaneSize, 0, -halfPlaneSize],
                [halfPlaneSize, 0, -halfPlaneSize],
                [halfPlaneSize, 0, halfPlaneSize],
                [-halfPlaneSize, 0, halfPlaneSize],
                [-halfPlaneSize, 0, -halfPlaneSize],
              ]}
              color={'green'}
              lineWidth={2}
            />
          </group>
        )}
      </>
    );
  },
);

export default DynamicsViewer;
