/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DoubleSide, Group, Raycaster, Vector2 } from 'three';
import { MoleculeData } from '../types';
import AtomJS from '../lib/chem/Atom';
import ComplexVisual from '../lib/ComplexVisual';
import { ThreeEvent, useThree } from '@react-three/fiber';
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
import { Grid, Plane } from '@react-three/drei';
import { HALF_PI } from '../constants.ts';
import { useStore } from '../stores/common.ts';

export interface DynamicsViewerProps {
  molecules: MoleculeData[];
  style: MolecularViewerStyle;
  material: MolecularViewerMaterial;
  coloring: MolecularViewerColoring;
  selector?: string;
  setLoading?: (loading: boolean) => void;
  onPointerOver?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

const generateMolecule = (moleculeName: string, atoms: AtomTS[]) => {
  const complex = new Complex();

  const het = true;
  const altLoc = ' ';
  const occupancy = 1;
  const tempFactor = 1;
  const charge = 0;

  const chain = complex.addChain('A');
  const residue = chain.addResidue('UNK', 1, ' ');

  for (const [i, a] of atoms.entries()) {
    const serial = i + 1;
    const role = undefined;
    const type = Element.getByName(a.elementSymbol);
    residue.addAtom(a.elementSymbol, type, a.position, role, het, serial, altLoc, occupancy, tempFactor, charge);
  }

  const molecule = new Molecule(complex, moleculeName, 1);
  molecule.residues = [residue];
  complex._molecules[0] = molecule;

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
    molecules,
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
    const dropX = usePrimitiveStore(Selector.dropX);
    const dropY = usePrimitiveStore(Selector.dropY);

    const [complex, setComplex] = useState<any>();

    const atomsRef = useRef<AtomTS[]>([]);
    const groupRef = useRef<Group>(null);
    const planeXYRef = useRef<any>();
    const planeYZRef = useRef<any>();
    const planeXZRef = useRef<any>();

    const { invalidate, camera } = useThree();

    const mode = useMemo(() => {
      return STYLE_MAP.get(style);
    }, [style]);

    const colorer = useMemo(() => {
      return COLORING_MAP.get(coloring);
    }, [coloring]);

    useEffect(() => {
      const planes = [];
      if (xyPlaneVisible && planeXYRef.current) planes.push(planeXYRef.current);
      if (yzPlaneVisible && planeYZRef.current) planes.push(planeYZRef.current);
      if (xzPlaneVisible && planeXZRef.current) planes.push(planeXZRef.current);
      const raycaster = new Raycaster();
      raycaster.setFromCamera(new Vector2(dropX, dropY), camera);
      const intersects = raycaster.intersectObjects(planes);
      if (intersects.length > 0) {
        console.log(intersects[0].point, intersects[0].object);
      }
    }, [dropX, dropY]);

    useEffect(() => {
      if (!molecules || molecules.length === 0) {
        setComplex(undefined);
        return;
      }
      atomsRef.current = [];
      for (const [i, m] of molecules.entries()) {
        if (i < molecules.length - 1) {
          loadMolecule(m, processResult);
        } else {
          loadMolecule(m, processResultAndUpdate);
        }
      }
    }, [molecules]);

    const processResult = (result: any) => {
      const n = result._atoms.length;
      for (let i = 0; i < n; i++) {
        const atom = result._atoms[i] as AtomJS;
        atomsRef.current.push({ elementSymbol: atom.element.name, position: atom.position } as AtomTS);
      }
    };

    const processResultAndUpdate = (result: any) => {
      processResult(result);
      const n = atomsRef.current.length;
      if (n > 0) {
        setComplex(generateMolecule('all', atomsRef.current));
        let cx = 0;
        let cy = 0;
        let cz = 0;
        for (const a of atomsRef.current) {
          cx += a.position.x;
          cy += a.position.y;
          cz += a.position.z;
        }
        cx /= n;
        cy /= n;
        cz /= n;
        groupRef.current?.position.set(-cx, -cy, -cz);
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

    const planeSize = 20;
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
              onClick={(e) => {
                console.log(e.point);
              }}
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
            />
          </group>
        )}
      </>
    );
  },
);

export default DynamicsViewer;
