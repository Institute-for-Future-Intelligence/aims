/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box3, Raycaster, Vector3, Euler, Mesh } from 'three';
import { MoleculeData, MoleculeTransform } from '../types.ts';
import AtomJS from '../lib/chem/Atom';
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
import { generateComplex, generateVdwLines, loadMolecule } from './moleculeTools.ts';
import { Atom } from '../models/Atom.ts';
import { ModelUtil } from '../models/ModelUtil.ts';
import Element from '../lib/chem/Element';
import * as Selector from '../stores/selector';
import { useStore } from '../stores/common.ts';
import { Molecule } from '../models/Molecule.ts';
import { useRefStore } from '../stores/commonRef.ts';
import ModelContainer from './modelContainer.tsx';
import { Instance, Instances, Line } from '@react-three/drei';
import RCGroup from '../lib/gfx/RCGroup.js';
import Picker from '../lib/ui/Picker.js';
import settings from '../lib/settings.js';
import Movers from './movers.tsx';
import { VdwBond } from '../models/VdwBond.ts';
import { MolecularDynamics } from '../models/MolecularDynamics.ts';
import { LJ_SIGMA_CONVERTER } from '../models/physicalConstants.ts';

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
    const vdwBondsVisible = useStore(Selector.vdwBondsVisible);
    const vdwBondCutoffRelative = useStore(Selector.vdwBondCutoffRelative) ?? 0.5;
    const molecularContainer = useStore(Selector.molecularContainer);

    const [complex, setComplex] = useState<any>();
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);

    const moleculesRef = useRef<Molecule[]>([]);
    const vdwBondsRef = useRef<VdwBond[]>([]);
    const groupRef = useRef<RCGroup>(null);
    const cameraRef = useRef<Camera | undefined>();
    const raycasterRef = useRef<Raycaster | undefined>();
    const boundingBoxRef = useRef<Box3 | undefined>();
    const molecularDynamicsRef = useRef<MolecularDynamics | null>(null);

    const { invalidate, camera, raycaster, gl } = useThree();

    const mode = useMemo(() => {
      return STYLE_MAP.get(style);
    }, [style]);

    const colorer = useMemo(() => {
      return COLORING_MAP.get(coloring);
    }, [coloring]);

    const showMover = false; // temporarily disable 3D movers

    useEffect(() => {
      vdwBondsRef.current = generateVdwLines(moleculesRef.current, vdwBondCutoffRelative * vdwBondCutoffRelative);
      setUpdateFlag(!updateFlag);
    }, [vdwBondCutoffRelative]);

    useEffect(() => {
      cameraRef.current = camera;
      raycasterRef.current = raycaster;
      useRefStore.setState({
        cameraRef: cameraRef,
        raycasterRef: raycasterRef,
        moleculesRef: moleculesRef,
        vdwBondsRef: vdwBondsRef,
        molecularDynamicsRef: molecularDynamicsRef,
      });
    }, [camera, raycaster, cameraRef, raycasterRef, moleculesRef, vdwBondsRef, molecularDynamicsRef]);

    useEffect(() => {
      if (!testMolecules || testMolecules.length === 0) {
        setComplex(undefined);
        return;
      }
      if (setLoading) setLoading(true);
      moleculesRef.current.length = 0;
      for (const [i, m] of testMolecules.entries()) {
        if (testMoleculeTransforms) {
          loadMolecule(m, processResult, testMoleculeTransforms[i]);
        } else {
          loadMolecule(m, processResult);
        }
      }
    }, [testMolecules]);

    const processResult = (result: any, molecule?: MoleculeData, transform?: MoleculeTransform) => {
      const mol = new Molecule(molecule?.name ?? 'unknown', [], []);
      const n = result._atoms.length;
      const c = new Vector3();
      for (let i = 0; i < n; i++) {
        const atom = result._atoms[i] as AtomJS;
        const a = new Atom(atom.index, atom.element.name, atom.position, true);
        a.sigma = atom.element.radius * LJ_SIGMA_CONVERTER;
        a.mass = atom.element.weight;
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
      for (let i = 0; i < n; i++) {
        const a = mol.atoms[i];
        a.initialPosition?.copy(a.position);
        a.initialVelocity?.copy(a.velocity);
      }
      moleculesRef.current.push(mol);
      if (moleculesRef.current.length === testMolecules.length) {
        setComplex(generateComplex(moleculesRef.current));
        molecularDynamicsRef.current = new MolecularDynamics(moleculesRef.current, molecularContainer);
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
          if (vdwBondsVisible) {
            vdwBondsRef.current = generateVdwLines(moleculesRef.current, vdwBondCutoffRelative * vdwBondCutoffRelative);
            setUpdateFlag(!updateFlag); // without this, the vdw bonds will not be drawn initially
          }
          invalidate();
        })
        .finally(() => {
          if (setLoading) setLoading(false);
        });
      return () => {
        if (groupRef.current) {
          groupRef.current.traverse((obj) => {
            if (obj instanceof Mesh) {
              obj.geometry.dispose();
              obj.material.dispose();
            }
          });
        }
      };
    }, [complex, material, mode, colorer, selector, testMolecules, updateViewerFlag, pickedMoleculeIndex]);

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

    const moleculeLengths = useMemo(() => {
      if (pickedMoleculeIndex !== -1 && moleculesRef.current) {
        const mol = moleculesRef.current[pickedMoleculeIndex];
        if (mol) return ModelUtil.getMoleculeLengths(mol);
      }
      return [10, 10, 10];
    }, [pickedMoleculeIndex, moleculesRef]);

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
        {vdwBondsVisible &&
          vdwBondsRef.current &&
          vdwBondsRef.current.map((b, i) => {
            return (
              <Line
                key={i}
                color={'white'}
                dashed={true}
                lineWidth={2}
                dashSize={0.02}
                gapSize={0.04}
                points={[b.atom1.position, b.atom2.position]}
              />
            );
          })}
        <ModelContainer />
        {pickedMoleculeIndex !== -1 && showMover && (
          <Movers
            center={[
              testMoleculeTransforms[pickedMoleculeIndex].x,
              testMoleculeTransforms[pickedMoleculeIndex].y,
              testMoleculeTransforms[pickedMoleculeIndex].z,
            ]}
            length={moleculeLengths}
          />
        )}
      </>
    );
  },
);

export default DynamicsViewer;
