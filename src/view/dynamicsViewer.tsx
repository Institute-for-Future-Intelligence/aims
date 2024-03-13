/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box3, Raycaster, Vector3, Euler } from 'three';
import { MoleculeData, MoleculeTransform } from '../types.ts';
import AtomJS from '../lib/chem/Atom';
import BondJS from '../lib/chem/Bond';
import ComplexVisual from '../lib/ComplexVisual';
import { Camera, extend, ThreeEvent, useThree } from '@react-three/fiber';
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
import ModelContainer from './modelContainer.tsx';
import { Instance, Instances } from '@react-three/drei';
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

const generateComplex = (molecules: MoleculeTS[]) => {
  const complex = new Complex();
  for (const [idx, mol] of molecules.entries()) {
    const chain = complex.addChain('MOL' + idx);
    const residue = chain.addResidue(mol.name, idx, ' ');
    for (const [i, a] of mol.atoms.entries()) {
      residue.addAtom(
        a.elementSymbol,
        Element.getByName(a.elementSymbol),
        a.position, // this links to the current atom position vector
        undefined,
        true,
        i + 1,
        ' ',
        1,
        1,
        0,
      );
    }
    const molecule = new Molecule(complex, mol.name, idx + 1);
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
    const testMoleculeTransforms = useStore(Selector.testMoleculeTransforms);
    const updateViewerFlag = usePrimitiveStore(Selector.updateViewerFlag);
    const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
    const viewerStyle = useStore(Selector.chamberViewerStyle);

    const [complex, setComplex] = useState<any>();

    const moleculesRef = useRef<MoleculeTS[]>([]);
    const groupRef = useRef<RCGroup>(null);
    const cameraRef = useRef<Camera | undefined>();
    const raycasterRef = useRef<Raycaster | undefined>();
    const boundingBoxRef = useRef<Box3 | undefined>();

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
      if (setLoading) setLoading(true);
      moleculesRef.current.length = 0;
      for (const [i, m] of testMolecules.entries()) {
        if (testMoleculeTransforms) {
          loadMolecule(m, processResult, false, testMoleculeTransforms[i]);
        } else {
          loadMolecule(m, processResult);
        }
      }
    }, [testMolecules]);

    const processResult = (result: any, molecule?: MoleculeData, transform?: MoleculeTransform) => {
      const mol = { name: molecule?.name, metadata: null, atoms: [], bonds: [] } as MoleculeTS;
      const n = result._atoms.length;
      const c = new Vector3();
      for (let i = 0; i < n; i++) {
        const atom = result._atoms[i] as AtomJS;
        const a = { elementSymbol: atom.element.name, position: atom.position, index: atom.index } as AtomTS;
        if (transform) {
          a.position.x += transform.x ?? 0;
          a.position.y += transform.y ?? 0;
          a.position.z += transform.z ?? 0;
          c.add(a.position);
        }
        mol.atoms.push(a);
      }
      if (transform) {
        c.multiplyScalar(1 / n);
        const euler = new Euler();
        const angles = transform.euler;
        if (angles && angles.length === 3) {
          euler.set(angles[0], angles[1], angles[2]);
        }
        for (let i = 0; i < n; i++) {
          const a = mol.atoms[i];
          const p = a.position.clone().sub(c).applyEuler(euler);
          a.position.copy(p).add(c);
        }
      }
      moleculesRef.current.push(mol);
      if (moleculesRef.current.length === testMolecules.length) {
        setComplex(generateComplex(moleculesRef.current));
      }
    };

    useEffect(() => {
      if (!groupRef.current || !mode) return;
      groupRef.current.children = [];
      if (!complex) return;
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
        .rebuildNow()
        .then(() => {
          if (!groupRef.current) return;
          groupRef.current.add(visual, visual.getSelectionGeo());
          const boundingSphere = visual.getBoundaries().boundingSphere;
          boundingBoxRef.current = visual.getBoundaries().boundingBox;
          usePrimitiveStore.getState().set((state) => {
            state.boundingSphereRadius = boundingSphere.radius;
          });
          invalidate();
        })
        .finally(() => {
          if (setLoading) setLoading(false);
        });
    }, [complex, material, mode, colorer, selector, testMolecules, updateViewerFlag, pickedMoleculeIndex]);

    // picker
    useEffect(() => {
      const picker = new Picker(groupRef.current, camera, gl.domElement);
      // @ts-expect-error ignore
      settings.set('pick', 'molecule');
      // @ts-expect-error ignore
      picker.addEventListener('newpick', (event) => {
        const pickedMoleculeIndex = event.obj.molecule ? event.obj.molecule.index - 1 : -1;
        usePrimitiveStore.getState().set((state) => {
          state.pickedMoleculeIndex = pickedMoleculeIndex;
        });
        // if (groupRef.current) {
        //   const visual = groupRef.current.children[0] as ComplexVisual;
        //   if (visual) {
        //     console.log(event.obj.molecule===complex._molecules[pickedMoleculeIndex])
        //     visual.resetSelectionMask();
        //     visual.updateSelectionMask(event.obj);
        //     visual.rebuildSelectionGeometry();
        //   }
        // }
      });
      return () => {
        picker.dispose();
      };
    }, []);

    const skinnyStyle = useMemo(() => {
      return (
        viewerStyle === MolecularViewerStyle.BallAndStick ||
        viewerStyle === MolecularViewerStyle.Stick ||
        viewerStyle === MolecularViewerStyle.Wireframe
      );
    }, [viewerStyle]);

    return (
      <>
        <rCGroup
          ref={groupRef}
          onPointerOver={onPointerOver}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
        />
        {pickedMoleculeIndex !== -1 && moleculesRef.current && (
          <Instances limit={1000} range={1000}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial transparent opacity={0.5} />
            {moleculesRef.current[pickedMoleculeIndex]?.atoms.map((a, i) => {
              return (
                <Instance
                  key={i}
                  scale={Element.getByName(a.elementSymbol).radius * (skinnyStyle ? 0.4 : 1.2)}
                  position={[a.position.x, a.position.y, a.position.z]}
                  color={'yellow'}
                />
              );
            })}
          </Instances>
        )}
        <ModelContainer />
      </>
    );
  },
);

export default DynamicsViewer;
