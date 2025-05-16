/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box3, Euler, Mesh, Quaternion, Raycaster, Vector3 } from 'three';
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
import { generateVdwLines, isCartoon, isCrystal, isSkinny, joinComplexes, loadMolecule } from './moleculeTools.ts';
import { Atom } from '../models/Atom.ts';
import { RadialBond } from '../models/RadialBond.ts';
import { AngularBond } from '../models/AngularBond.ts';
import { ModelUtil } from '../models/ModelUtil.ts';
import Element from '../lib/chem/Element';
import * as Selector from '../stores/selector';
import { useStore } from '../stores/common.ts';
import { Molecule } from '../models/Molecule.ts';
import { useRefStore } from '../stores/commonRef.ts';
import ModelContainer from './modelContainer.tsx';
import {
  Billboard,
  CatmullRomLine,
  Instance,
  Instances,
  Line,
  QuadraticBezierLine,
  Sphere,
  Text,
} from '@react-three/drei';
import RCGroup from '../lib/gfx/RCGroup.js';
import Picker from '../lib/ui/Picker.js';
import settings from '../lib/settings.js';
import Movers from './movers.tsx';
import { VdwBond } from '../models/VdwBond.ts';
import { MolecularDynamics } from '../models/MolecularDynamics.ts';
import {
  KINETIC_ENERGY_COLOR,
  LJ_SIGMA_CONVERTER,
  POTENTIAL_ENERGY_COLOR,
  VAN_DER_WAALS_COLOR,
} from '../models/physicalConstants.ts';
import { PickMode, UNIT_VECTOR_POS_Y, UNIT_VECTOR_POS_Z } from '../constants.ts';
import { useDataStore } from '../stores/commonData.ts';
import { TorsionalBond } from '../models/TorsionalBond.ts';
import Complex from '../lib/chem/Complex';

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
    const setCommonStore = useStore(Selector.set);
    const testMolecules = useStore(Selector.testMolecules);
    const updateViewerFlag = usePrimitiveStore(Selector.updateViewerFlag);
    const updateInfo = usePrimitiveStore(Selector.updateInfo);
    const pickMode = usePrimitiveStore(Selector.pickMode);
    const pickedAtomIndex = usePrimitiveStore(Selector.pickedAtomIndex);
    const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
    const viewerStyle = useStore(Selector.chamberViewerStyle);
    const vdwBondsVisible = useStore(Selector.vdwBondsVisible);
    const vdwBondCutoffRelative = useStore(Selector.vdwBondCutoffRelative) ?? 0.5;
    const momentumVisible = useStore(Selector.momentumVisible);
    const momentumScaleFactor = useStore(Selector.momentumScaleFactor) ?? 1;
    const forceVisible = useStore(Selector.forceVisible);
    const forceScaleFactor = useStore(Selector.forceScaleFactor) ?? 1;
    const kineticEnergyScaleFactor = useStore(Selector.kineticEnergyScaleFactor) ?? 1;
    const molecularContainer = useStore(Selector.molecularContainer);
    const timeStep = useStore(Selector.timeStep);
    const positionTimeSeriesMap = useDataStore(Selector.positionTimeSeriesMap);
    const angularBondsMap = useStore(Selector.angularBondsMap);
    const angularBondsVisible = useStore(Selector.angularBondsVisible);
    const torsionalBondsMap = useStore(Selector.torsionalBondsMap);
    const torsionalBondsVisible = useStore(Selector.torsionalBondsVisible);

    const [complex, setComplex] = useState<any>();
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);

    const moleculesRef = useRef<Molecule[]>([]);
    const complexesRef = useRef<Complex[]>([]);
    const vdwBondsRef = useRef<VdwBond[]>([]);
    const atomIndexRef = useRef<number>(-1);
    const pickedAtomRef = useRef<Atom | null>(null);
    const groupRef = useRef<RCGroup>(null);
    const cameraRef = useRef<Camera | undefined>();
    const raycasterRef = useRef<Raycaster | undefined>();
    const boundingBoxRef = useRef<Box3 | undefined>();
    const molecularDynamicsRef = useRef<MolecularDynamics | null>(null);
    const moleculeMapRef = useRef<Map<Molecule, Molecule>>(new Map<Molecule, Molecule>());
    const complexMapRef = useRef<Map<Molecule, Complex>>(new Map<Molecule, Complex>());
    const energyTimeSeries = useDataStore(Selector.energyTimeSeries);
    const speedArray = useDataStore(Selector.speedArray);

    const { invalidate, camera, raycaster, gl } = useThree();

    const mode = useMemo(() => {
      return STYLE_MAP.get(style);
    }, [style]);

    const specialMode = useMemo(() => {
      return mode === 'CA' || mode === 'TR' || mode === 'TU';
    }, [mode]);

    const colorer = useMemo(() => {
      return COLORING_MAP.get(coloring);
    }, [coloring]);

    const skinnyStyle = useMemo(() => {
      return isSkinny(viewerStyle);
    }, [viewerStyle]);

    const cartoonStyle = useMemo(() => {
      for (const m of testMolecules) {
        if (m.style && isCartoon(m.style)) return true;
      }
      return isCartoon(viewerStyle);
    }, [viewerStyle, testMolecules, updateViewerFlag]);

    const wireframeStyle = useMemo(() => {
      return viewerStyle === MolecularViewerStyle.Wireframe || viewerStyle === MolecularViewerStyle.AtomIndex;
    }, [viewerStyle]);

    const moleculeLengths = useMemo(() => {
      if (pickedMoleculeIndex !== -1 && moleculesRef.current) {
        const mol = moleculesRef.current[pickedMoleculeIndex];
        if (mol) return ModelUtil.getMoleculeLengths(mol);
      }
      return [10, 10, 10];
    }, [pickedMoleculeIndex, moleculesRef]);

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
      moleculesRef.current.length = 0;
      complexesRef.current.length = 0;
      moleculeMapRef.current.clear();
      complexMapRef.current.clear();
      if (!testMolecules || testMolecules.length === 0) {
        setComplex(undefined);
        if (molecularDynamicsRef.current) {
          molecularDynamicsRef.current.atoms.length = 0;
          molecularDynamicsRef.current.radialBonds.length = 0;
          molecularDynamicsRef.current.angularBonds.length = 0;
          molecularDynamicsRef.current.torsionalBonds.length = 0;
          molecularDynamicsRef.current = null;
        }
        updateInfo();
        energyTimeSeries.clear();
        speedArray.length = 0;
        positionTimeSeriesMap.clear();
        vdwBondsRef.current.length = 0;
        return;
      }
      if (setLoading) setLoading(true);
      for (const m of testMolecules) {
        loadMolecule(m, processResult);
      }
    }, [testMolecules]);

    const processResult = (result: any, molecule?: Molecule) => {
      if (!molecule) return;
      const mol = new Molecule(molecule.name ?? 'unknown', []);
      const n = result._atoms.length;
      for (let i = 0; i < n; i++) {
        const atom = result._atoms[i] as AtomJS;
        const a = new Atom(atom.index, atom.element.name, atom.position.clone(), true);
        // the vdw radius for viewer is too big to be used as the LJ radius; reduce it to 75%
        a.sigma = atom.element.radius * LJ_SIGMA_CONVERTER * 0.75;
        a.mass = atom.element.weight;
        // temporary solutions (these parameters should be set via UI)
        // cohesive energy from https://www.knowledgedoor.com/2/elements_handbook/cohesive_energy.html
        if (molecule.name === 'NaCl' || molecule.name === 'CsCl') {
          // modify the force field for salt crystal (temporary solution)
          if (atom.element.name === 'NA') a.charge = 1;
          else if (atom.element.name === 'CS') a.charge = 1;
          else if (atom.element.name === 'CL') a.charge = -1;
          a.epsilon = 0.05;
        } else if (molecule.name === 'Gold') {
          if (atom.element.name === 'AU') {
            a.epsilon = 3.81;
            a.sigma /= 0.85;
          }
        } else if (molecule.name === 'Silver') {
          if (atom.element.name === 'AG') {
            a.epsilon = 2.95;
            a.sigma /= 0.85;
          }
        } else if (molecule.name === 'Iron') {
          if (atom.element.name === 'FE') {
            a.epsilon = 4.28;
            a.sigma /= 0.85;
          }
        } else {
          if (a.elementSymbol === 'C' || a.elementSymbol === 'H' || a.elementSymbol === 'O') {
            a.epsilon = 0.005;
          } else if (a.elementSymbol === 'HE' || a.elementSymbol === 'AR' || a.elementSymbol === 'XE') {
            a.epsilon = 0.001;
          }
        }
        if (molecule.atoms && molecule.atoms[i]) {
          a.position.copy(molecule.atoms[i].position);
          a.velocity.copy(molecule.atoms[i].velocity);
          const force = molecule.atoms[i].force;
          if (force && a.force) a.force.copy(force);
          a.fixed = molecule.atoms[i].fixed;
          a.damp = molecule.atoms[i].damp;
          a.trajectory = molecule.atoms[i].trajectory;
          a.restraint = molecule.atoms[i].restraint?.clone();
          molecule.atoms[i].epsilon = a.epsilon;
          molecule.atoms[i].charge = a.charge;
        }
        a.initialPosition?.copy(a.position);
        a.initialVelocity?.copy(a.velocity);
        mol.atoms.push(a);
      }
      molecule.radialBonds.length = 0;
      if (!isCrystal(molecule.name)) {
        const k = result._bonds.length;
        for (let i = 0; i < k; i++) {
          const bond = result._bonds[i] as BondJS;
          const length = bond.calcLength();
          const index1 = bond._left.index;
          const index2 = bond._right.index;
          mol.radialBonds.push(new RadialBond(mol.atoms[index1], mol.atoms[index2], length));
          molecule.radialBonds.push(new RadialBond(molecule.atoms[index1], molecule.atoms[index2], length));
        }
        let aBonds = useStore.getState().angularBondsMap[mol.name];
        if (!aBonds || aBonds.length === 0) {
          aBonds = ModelUtil.generateAngularBonds(mol.atoms, mol.radialBonds);
          setCommonStore((state) => {
            if (aBonds) {
              state.angularBondsMap[mol.name] = aBonds;
            }
          });
        }
        if (aBonds?.length > 0) {
          for (const x of aBonds) {
            const p1 = result._atoms[x.i].position;
            const p2 = result._atoms[x.j].position;
            const p3 = result._atoms[x.k].position;
            const angle = AngularBond.getAngleFromPositions(p1, p2, p3);
            mol.angularBonds.push(new AngularBond(mol.atoms[x.i], mol.atoms[x.j], mol.atoms[x.k], angle));
            molecule.angularBonds.push(
              new AngularBond(molecule.atoms[x.i], molecule.atoms[x.j], molecule.atoms[x.k], angle),
            );
          }
        }
        let tBonds = useStore.getState().torsionalBondsMap[mol.name];
        if ((!tBonds || tBonds.length === 0) && aBonds) {
          tBonds = ModelUtil.generateTorsionalBonds(mol.atoms, mol.radialBonds, aBonds);
          setCommonStore((state) => {
            if (tBonds) {
              state.torsionalBondsMap[mol.name] = tBonds;
            }
          });
        }
        if (tBonds?.length > 0) {
          for (const x of tBonds) {
            const p1 = result._atoms[x.i].position;
            const p2 = result._atoms[x.j].position;
            const p3 = result._atoms[x.k].position;
            const p4 = result._atoms[x.l].position;
            const dihedral = TorsionalBond.getDihedralFromPositions(p1, p2, p3, p4);
            mol.torsionalBonds.push(
              new TorsionalBond(mol.atoms[x.i], mol.atoms[x.j], mol.atoms[x.k], mol.atoms[x.l], dihedral),
            );
            molecule.torsionalBonds.push(
              new TorsionalBond(
                molecule.atoms[x.i],
                molecule.atoms[x.j],
                molecule.atoms[x.k],
                molecule.atoms[x.l],
                dihedral,
              ),
            );
          }
        }
      }
      moleculeMapRef.current.set(molecule, mol);
      complexMapRef.current.set(molecule, result as Complex);
      if (moleculeMapRef.current.size === testMolecules.length) {
        // store the new molecules in a map because this call is asynchronous, so we cannot guarantee the order
        // testMolecules and moleculesRef must have the same order
        for (const m of testMolecules) {
          const m2 = moleculeMapRef.current.get(m);
          if (m2) moleculesRef.current.push(m2);
          const c2 = complexMapRef.current.get(m);
          if (c2) {
            complexesRef.current.push(c2);
            m.multipleResidues = c2._residues?.length > 1;
          }
        }
        moleculeMapRef.current.clear();
        complexMapRef.current.clear();
        setComplex(joinComplexes(moleculesRef.current, complexesRef.current));
        molecularDynamicsRef.current = new MolecularDynamics(moleculesRef.current, molecularContainer);
        molecularDynamicsRef.current.timeStep = timeStep;
        molecularDynamicsRef.current.updateKineticEnergy();
        usePrimitiveStore.getState().set((state) => {
          state.pickedMoleculeIndex = -1;
          state.pickedAtomIndex = -1;
          state.updateInfoFlag = !state.updateInfoFlag;
          if (molecularDynamicsRef.current)
            state.currentTemperature = molecularDynamicsRef.current.getCurrentTemperature();
        });
      }
    };

    useEffect(() => {
      if (!groupRef.current || !mode) return;
      if (!complex || testMolecules.length === 0) {
        groupRef.current.traverse((obj) => {
          if (obj instanceof Mesh) {
            obj.geometry.dispose();
            obj.material.dispose();
          }
        });
        groupRef.current.children = [];
        invalidate();
        return;
      }

      groupRef.current.children = [];
      for (const [iMol, com] of complexesRef.current.entries()) {
        const m = moleculesRef.current[iMol];
        if (m) {
          let iAtom = 0;
          for (const r of com._residues) {
            for (const a of r._atoms) {
              a.temperature = ModelUtil.convertToTemperatureFactor(
                m.atoms[iAtom++]?.getKineticEnergy(),
                kineticEnergyScaleFactor,
              );
            }
          }
        }
      }
      if (cartoonStyle) {
        complex.updateCartoon();
      }
      const visual = new ComplexVisual(complex.name, complex);
      const reps = [];
      const styleMap: Map<MolecularViewerStyle, string[]> = new Map<MolecularViewerStyle, string[]>();
      const defaultMolArray: string[] = [];
      for (const [i, m] of testMolecules.entries()) {
        if (m.style) {
          let arr = styleMap.get(m.style);
          if (!arr) {
            arr = ['MOL' + i];
            styleMap.set(m.style, arr);
          } else {
            arr.push('MOL' + i);
          }
        } else {
          defaultMolArray.push('MOL' + i);
        }
      }
      if (styleMap.size > 0) {
        // Don't change the selector below. We use 'chain' to identify molecules as there is no 'molecule' keyword
        // according to https://lifescience.opensource.epam.com/miew/selectors.html
        styleMap.forEach((value, key) => {
          const molMode = STYLE_MAP.get(key as MolecularViewerStyle);
          let selector = 'chain';
          for (const name of value) {
            selector += ' ' + name + ',';
          }
          selector = selector.substring(0, selector.length - 1);
          reps.push({
            mode: molMode ?? mode,
            colorer: colorer,
            selector: selector,
            material: MATERIAL_MAP.get(material),
          });
        });
        if (defaultMolArray.length > 0) {
          let selector = 'chain';
          for (const name of defaultMolArray) {
            selector += ' ' + name + ',';
          }
          selector = selector.substring(0, selector.length - 1);
          reps.push({
            mode: mode,
            colorer: colorer,
            selector: selector,
            material: MATERIAL_MAP.get(material),
          });
        }
      } else {
        reps.push({
          mode: mode,
          colorer: colorer,
          selector: 'all',
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
          pickedAtomRef.current =
            pickedAtomIndex !== -1 ? ModelUtil.getAtomByIndex(pickedAtomIndex, moleculesRef.current) : null;
          invalidate();
        })
        .finally(() => {
          if (setLoading) setLoading(false);
        });
      const children = groupRef.current?.children;
      return () => {
        if (children) {
          for (const c of children) {
            c.traverse((obj) => {
              if (obj instanceof Mesh) {
                obj.geometry.dispose();
                obj.material.dispose();
              }
            });
          }
        }
      };
    }, [
      complex,
      material,
      mode,
      colorer,
      selector,
      testMolecules,
      updateViewerFlag,
      pickedMoleculeIndex,
      kineticEnergyScaleFactor,
      vdwBondsVisible,
      vdwBondCutoffRelative,
      pickedAtomIndex,
      moleculesRef,
      specialMode,
      cartoonStyle,
    ]);

    useEffect(() => {
      const picker = new Picker(groupRef.current, camera, gl.domElement, false);
      // @ts-expect-error ignore
      settings.set('pick', pickMode);
      // @ts-expect-error ignore
      picker.addEventListener('newpick', (event) => {
        switch (pickMode) {
          case PickMode.MOLECULE: {
            const pickedIndex = event.obj.molecule ? event.obj.molecule.index - 1 : -1;
            usePrimitiveStore.getState().set((state) => {
              state.pickedMoleculeIndex = pickedIndex;
              state.pickedAtomIndex = -1;
            });
            break;
          }
          case PickMode.ATOM: {
            const pickedIndex = event.obj.atom ? event.obj.atom.index : -1;
            pickedAtomRef.current =
              pickedIndex !== -1 ? ModelUtil.getAtomByIndex(pickedIndex, moleculesRef.current) : null;
            usePrimitiveStore.getState().set((state) => {
              state.pickedAtomIndex = pickedIndex;
              state.pickedMoleculeIndex = -1;
            });
            break;
          }
        }
      });
      return () => {
        picker.dispose();
      };
    }, [pickMode]);

    const getMolecules = (name: string): Molecule[] => {
      const molecules: Molecule[] = [];
      for (const m of moleculesRef.current) {
        if (m.name === name) {
          molecules.push(m);
        }
      }
      return molecules;
    };

    return (
      <>
        <rCGroup
          ref={groupRef}
          onPointerOver={onPointerOver}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
        />
        {style === MolecularViewerStyle.AtomIndex &&
          moleculesRef.current &&
          moleculesRef.current.map((m, i) => {
            if (i === 0) atomIndexRef.current = -1;
            const labels = [];
            labels.push(
              m.atoms.map((a) => {
                atomIndexRef.current++;
                return (
                  <Billboard key={atomIndexRef.current} position={[a.position.x, a.position.y, a.position.z]}>
                    <Text color="white" anchorX="center" anchorY="middle" fontSize={0.25}>
                      {atomIndexRef.current}
                    </Text>
                  </Billboard>
                );
              }),
            );
            return labels;
          })}
        {pickedMoleculeIndex !== -1 && moleculesRef.current && (
          <Instances name={'Highlighter'} limit={1000} range={1000}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial transparent opacity={0.5} />
            {moleculesRef.current[pickedMoleculeIndex]?.atoms.map((a, i) => {
              let scaleFactor = skinnyStyle ? 0.3 : 1.2;
              const style = testMolecules[pickedMoleculeIndex]?.style;
              if (style) scaleFactor = isSkinny(style) ? 0.3 : 1.2;
              return (
                <Instance
                  key={i}
                  scale={Element.getByName(a.elementSymbol).radius * scaleFactor}
                  position={[a.position.x, a.position.y, a.position.z]}
                  color={'yellow'}
                />
              );
            })}
          </Instances>
        )}
        {pickedAtomRef.current && pickedAtomIndex !== -1 && (
          // must use position.x, etc. in order for this to update in a molecular dynamics simulation
          <Sphere
            name={'Highlighter'}
            position={[
              pickedAtomRef.current.position.x,
              pickedAtomRef.current.position.y,
              pickedAtomRef.current.position.z,
            ]}
            scale={Element.getByName(pickedAtomRef.current.elementSymbol).radius * (skinnyStyle ? 0.3 : 1.2)}
          >
            <meshStandardMaterial transparent opacity={0.5} color={'yellow'} />
          </Sphere>
        )}
        {/* draw arrow bodies of the momentum vectors */}
        {momentumVisible && (
          <Instances limit={1000} range={1000}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial />
            {moleculesRef.current.map((m, iMol) => {
              let styleScaleFactor = skinnyStyle ? 0.25 : 1;
              const style = testMolecules[iMol]?.style;
              if (style) styleScaleFactor = isSkinny(style) ? 0.25 : 1;
              const arr = [];
              const quaternion = new Quaternion();
              const normalized = new Vector3();
              arr.push(
                m.atoms.map((a, i) => {
                  const radius = Element.getByName(a.elementSymbol).radius * styleScaleFactor;
                  const momentum = a.mass * a.velocity.length() * momentumScaleFactor;
                  normalized.copy(a.velocity).normalize();
                  quaternion.setFromUnitVectors(UNIT_VECTOR_POS_Y, normalized);
                  const euler = new Euler().setFromQuaternion(quaternion);
                  normalized.multiplyScalar(radius + momentum / 2);
                  return (
                    <Instance
                      key={i}
                      scale={[1, momentum, 1]}
                      position={[a.position.x + normalized.x, a.position.y + normalized.y, a.position.z + normalized.z]}
                      rotation={euler}
                      color={KINETIC_ENERGY_COLOR}
                    />
                  );
                }),
              );
              return arr;
            })}
          </Instances>
        )}
        {/* draw arrow heads of the momentum vectors */}
        {momentumVisible && (
          <Instances limit={1000} range={1000}>
            <coneGeometry args={[0.2, 0.4, 8, 2]} />
            <meshStandardMaterial />
            {moleculesRef.current.map((m, iMol) => {
              let styleScaleFactor = skinnyStyle ? 0.25 : 1;
              const style = testMolecules[iMol]?.style;
              if (style) styleScaleFactor = isSkinny(style) ? 0.25 : 1;
              const arr = [];
              const quaternion = new Quaternion();
              const normalized = new Vector3();
              arr.push(
                m.atoms.map((a, i) => {
                  const radius = Element.getByName(a.elementSymbol).radius * styleScaleFactor;
                  const momentum = a.mass * a.velocity.length() * momentumScaleFactor;
                  normalized.copy(a.velocity).normalize();
                  quaternion.setFromUnitVectors(UNIT_VECTOR_POS_Y, normalized);
                  const euler = new Euler().setFromQuaternion(quaternion);
                  normalized.multiplyScalar(radius + momentum + 0.2);
                  return (
                    <Instance
                      key={i}
                      position={[a.position.x + normalized.x, a.position.y + normalized.y, a.position.z + normalized.z]}
                      rotation={euler}
                      color={KINETIC_ENERGY_COLOR}
                    />
                  );
                }),
              );
              return arr;
            })}
          </Instances>
        )}
        {/* draw arrow bodies of the force vectors */}
        {forceVisible && (
          <Instances limit={1000} range={1000}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial />
            {moleculesRef.current.map((m, iMol) => {
              let styleScaleFactor = skinnyStyle ? 0.25 : 1;
              const style = testMolecules[iMol]?.style;
              if (style) styleScaleFactor = isSkinny(style) ? 0.25 : 1;
              const arr = [];
              const quaternion = new Quaternion();
              const normalized = new Vector3();
              arr.push(
                m.atoms.map((a, i) => {
                  const radius = Element.getByName(a.elementSymbol).radius * styleScaleFactor;
                  const force = (a.force ?? UNIT_VECTOR_POS_Z).length() * forceScaleFactor * 1000;
                  normalized.copy(a.force ?? UNIT_VECTOR_POS_Z).normalize();
                  quaternion.setFromUnitVectors(UNIT_VECTOR_POS_Y, normalized);
                  const euler = new Euler().setFromQuaternion(quaternion);
                  normalized.multiplyScalar(radius + force / 2);
                  return (
                    <Instance
                      key={i}
                      scale={[1, force, 1]}
                      position={[a.position.x + normalized.x, a.position.y + normalized.y, a.position.z + normalized.z]}
                      rotation={euler}
                      color={POTENTIAL_ENERGY_COLOR}
                    />
                  );
                }),
              );
              return arr;
            })}
          </Instances>
        )}
        {/* draw arrow heads of the force vectors */}
        {forceVisible && (
          <Instances limit={1000} range={1000}>
            <coneGeometry args={[0.2, 0.4, 8, 2]} />
            <meshStandardMaterial />
            {moleculesRef.current.map((m, iMol) => {
              let styleScaleFactor = skinnyStyle ? 0.25 : 1;
              const style = testMolecules[iMol]?.style;
              if (style) styleScaleFactor = isSkinny(style) ? 0.25 : 1;
              const arr = [];
              const quaternion = new Quaternion();
              const normalized = new Vector3();
              arr.push(
                m.atoms.map((a, i) => {
                  const radius = Element.getByName(a.elementSymbol).radius * styleScaleFactor;
                  const force = (a.force ?? UNIT_VECTOR_POS_Z).length() * forceScaleFactor * 1000;
                  normalized.copy(a.force ?? UNIT_VECTOR_POS_Z).normalize();
                  quaternion.setFromUnitVectors(UNIT_VECTOR_POS_Y, normalized);
                  const euler = new Euler().setFromQuaternion(quaternion);
                  normalized.multiplyScalar(radius + force + 0.2);
                  return (
                    <Instance
                      key={i}
                      position={[a.position.x + normalized.x, a.position.y + normalized.y, a.position.z + normalized.z]}
                      rotation={euler}
                      color={POTENTIAL_ENERGY_COLOR}
                    />
                  );
                }),
              );
              return arr;
            })}
          </Instances>
        )}
        {/* draw fixed atoms */}
        {moleculesRef.current.map((m, iMol) => {
          let styleScaleFactor = skinnyStyle ? 1 : 4;
          const style = testMolecules[iMol]?.style;
          if (style) styleScaleFactor = isSkinny(style) ? 1 : 4;
          const arr = [];
          arr.push(
            m.atoms.map((a, i) => {
              if (a.fixed) {
                return (
                  <Billboard key={i} position={[a.position.x, a.position.y, a.position.z]}>
                    <Text color="yellow" anchorX="center" anchorY="middle" fontSize={styleScaleFactor}>
                      📌
                    </Text>
                  </Billboard>
                );
              }
            }),
          );
          return arr;
        })}
        {vdwBondsVisible &&
          vdwBondsRef.current &&
          vdwBondsRef.current.map((b, i) => {
            return (
              <Line
                key={i}
                color={VAN_DER_WAALS_COLOR}
                dashed={true}
                lineWidth={2}
                dashSize={0.02}
                gapSize={0.04}
                points={[b.atom1.position, b.atom2.position]}
              />
            );
          })}
        {positionTimeSeriesMap &&
          [...positionTimeSeriesMap.keys()].map((value, i) => {
            const positionTimeSeries = positionTimeSeriesMap.get(value);
            if (positionTimeSeries && positionTimeSeries.size() >= 2) {
              const points = new Array<[number, number, number]>();
              for (const p of positionTimeSeries.array) {
                points.push([p.x, p.y, p.z]);
              }
              return (
                <Line
                  key={i}
                  color={'gray'}
                  dashed={true}
                  lineWidth={2}
                  dashSize={0.02}
                  gapSize={0.1}
                  points={points}
                />
              );
            }
          })}
        {angularBondsVisible &&
          angularBondsMap &&
          Object.keys(angularBondsMap).map((key) => {
            const angles = [];
            const molecules = getMolecules(key);
            const scale = wireframeStyle ? 0.3 : 0.75;
            if (molecules.length > 0) {
              for (const mol of molecules) {
                angles.push(
                  angularBondsMap[key].map((t, i) => {
                    const atom = mol.atoms[t.j];
                    const pi = mol.atoms[t.i].position;
                    const pj = atom.position;
                    const pk = mol.atoms[t.k].position;
                    const vij = new Vector3().subVectors(pi, pj).normalize().multiplyScalar(scale);
                    const vkj = new Vector3().subVectors(pk, pj).normalize().multiplyScalar(scale);
                    const mid = new Vector3().addVectors(vij, vkj);
                    const points = new Array<[number, number, number]>();
                    points.push([pj.x + vij.x, pj.y + vij.y, pj.z + vij.z]);
                    points.push([pj.x + mid.x, pj.y + mid.y, pj.z + mid.z]);
                    points.push([pj.x + vkj.x, pj.y + vkj.y, pj.z + vkj.z]);
                    return (
                      <QuadraticBezierLine
                        key={i}
                        dashed={true}
                        dashSize={0.02}
                        gapSize={0.01}
                        color={'yellow'}
                        lineWidth={1}
                        start={points[0]}
                        mid={points[1]}
                        end={points[2]}
                      />
                    );
                  }),
                );
              }
            }
            return angles;
          })}
        {torsionalBondsVisible &&
          torsionalBondsMap &&
          Object.keys(torsionalBondsMap).map((key) => {
            const dihedrals = [];
            const molecules = getMolecules(key);
            if (molecules.length > 0) {
              for (const mol of molecules) {
                dihedrals.push(
                  torsionalBondsMap[key].map((q, i) => {
                    const pi = mol.atoms[q.i].position;
                    const pj = mol.atoms[q.j].position;
                    const pk = mol.atoms[q.k].position;
                    const pl = mol.atoms[q.l].position;
                    const points = new Array<[number, number, number]>();
                    points.push([pi.x, pi.y, pi.z]);
                    points.push([pj.x, pj.y, pj.z]);
                    points.push([pk.x, pk.y, pk.z]);
                    points.push([pl.x, pl.y, pl.z]);
                    return (
                      <CatmullRomLine
                        key={i}
                        curveType={'chordal'}
                        dashed={true}
                        dashSize={0.02}
                        gapSize={0.01}
                        color={'yellow'}
                        lineWidth={1}
                        tension={0.5}
                        points={points}
                      />
                    );
                  }),
                );
              }
            }
            return dihedrals;
          })}
        <ModelContainer />
        {pickedMoleculeIndex !== -1 && showMover && <Movers center={[0, 0, 0]} length={moleculeLengths} />}
      </>
    );
  },
);

export default DynamicsViewer;
