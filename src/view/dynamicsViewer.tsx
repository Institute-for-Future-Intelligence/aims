/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DoubleSide, Raycaster } from 'three';
import { MoleculeData } from '../types.ts';
import AtomJS from '../lib/chem/Atom';
import BondJS from '../lib/chem/Bond';
import ComplexVisual from '../lib/ComplexVisual';
import { Camera, ThreeEvent, extend, useThree } from '@react-three/fiber';
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
import { BondTS } from '../models/BondTS.ts';
import { ModelUtil } from '../models/ModelUtil.ts';
import Complex from '../lib/chem/Complex';
import Element from '../lib/chem/Element';
import Molecule from '../lib/chem/Molecule';
import * as Selector from '../stores/selector';
import { useStore } from '../stores/common.ts';
import { MoleculeTS } from '../models/MoleculeTS.ts';
import { useRefStore } from '../stores/commonRef.ts';
import DropPlanes from './dropPlanes.tsx';
import { Box, Edges } from '@react-three/drei';
import RCGroup from '../lib/gfx/RCGroup.js';
import Picker from '../lib/ui/Picker.js';
import settings from '../lib/settings.js';
extend({ RCGroup });

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
    const chain = complex.addChain('MOL' + idx);
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
  const bonds = complex.getBonds() as BondJS[];
  const atoms: AtomTS[] = [];
  for (const m of molecules) {
    atoms.push(...m.atoms);
  }
  for (const b of bonds) {
    const startAtomIndex = (b._left as AtomJS).index;
    const endAtomIndex = (b._right as AtomJS).index;
    const m = ModelUtil.getMolecule(atoms[startAtomIndex], molecules);
    if (m) {
      m.bonds.push({ startAtom: atoms[startAtomIndex], endAtom: atoms[endAtomIndex] } as BondTS);
    }
  }
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
    const testMolecules = useStore(Selector.testMolecules);
    const molecularContainer = useStore(Selector.molecularContainer);
    const molecularContainerVisible = useStore(Selector.molecularContainerVisible);

    const [complex, setComplex] = useState<any>();

    const moleculesRef = useRef<MoleculeTS[]>([]);
    const groupRef = useRef<RCGroup>(null);
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
        moleculesRef: moleculesRef,
      });
    }, [camera, raycaster, cameraRef, raycasterRef, moleculesRef]);

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
        const a = { elementSymbol: atom.element.name, position: atom.position, index: atom.index } as AtomTS;
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
      const reps = [];
      // Don't change the selector below. We use 'chain' to identify molecules as there is no 'molecule' keyword
      // according to https://lifescience.opensource.epam.com/miew/selectors.html
      for (let i = 0; i < testMolecules.length; i++) {
        reps.push({
          mode: mode,
          colorer: colorer,
          selector: 'chain MOL' + i,
          material: MATERIAL_MAP.get(material),
        });
      }
      visual.resetReps(reps);
      visual
        .rebuild()
        .then(() => {
          if (!groupRef.current) return;
          groupRef.current.add(visual, visual.getSelectionGeo());
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

    // picker
    useEffect(() => {
      const picker = new Picker(groupRef.current, camera, gl.domElement);
      // @ts-expect-error ignore
      settings.set('pick', 'molecule');
      // @ts-expect-error ignore
      picker.addEventListener('newpick', (event) => {
        console.log('pick', event.obj);
        let complex = null;
        if (event.obj.atom) {
          complex = event.obj.atom.residue.getChain().getComplex();
        } else if (event.obj.residue) {
          complex = event.obj.residue.getChain().getComplex();
        } else if (event.obj.chain) {
          complex = event.obj.chain.getComplex();
        } else if (event.obj.molecule) {
          complex = event.obj.molecule.complex;
        }

        if (groupRef.current) {
          const visual = groupRef.current.children[0] as ComplexVisual;
          if (visual && (visual.getComplex() === complex || complex === null)) {
            visual.updateSelectionMask(event.obj);
            visual.rebuildSelectionGeometry();
          }
        }
      });

      return () => {
        picker.dispose();
      };
    }, []);

    return (
      <>
        <rCGroup
          ref={groupRef}
          onPointerOver={onPointerOver}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
        />
        {molecularContainerVisible && (
          <Box args={[molecularContainer.lx, molecularContainer.ly, molecularContainer.lz]}>
            <meshStandardMaterial attach="material" opacity={0.1} side={DoubleSide} transparent color={'lightgray'} />
            <Edges scale={1} threshold={15} color="dimgray" />
          </Box>
        )}
        <DropPlanes />
      </>
    );
  },
);

export default DynamicsViewer;
