/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
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
import { generateComplex, generateVdwLines, loadMolecule } from './moleculeTools.ts';
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
import { Billboard, Instance, Instances, Line, Sphere, Text } from '@react-three/drei';
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
import { PickMode, UNIT_VECTOR_POS_Y } from '../constants.ts';
import { useDataStore } from '../stores/commonData.ts';
import { Triple } from '../models/Triple.ts';
import { getAngularBondDefinition } from '../models/AngularBondDefinition.ts';
import { Quadruple } from '../models/Quadruple.ts';
import { getTorsionalBondDefinition } from '../models/TorsionalBondDefinition.ts';
import { TorsionalBond } from '../models/TorsionalBond.ts';

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
    const updateViewerFlag = usePrimitiveStore(Selector.updateViewerFlag);
    const pickMode = usePrimitiveStore(Selector.pickMode);
    const pickedAtom = usePrimitiveStore(Selector.pickedAtom);
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
    const resetSimulation = usePrimitiveStore(Selector.resetSimulation);

    const [complex, setComplex] = useState<any>();
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);

    const moleculesRef = useRef<Molecule[]>([]);
    const vdwBondsRef = useRef<VdwBond[]>([]);
    const atomIndexRef = useRef<number>(-1);
    const groupRef = useRef<RCGroup>(null);
    const cameraRef = useRef<Camera | undefined>();
    const raycasterRef = useRef<Raycaster | undefined>();
    const boundingBoxRef = useRef<Box3 | undefined>();
    const molecularDynamicsRef = useRef<MolecularDynamics | null>(null);
    const moleculeMapRef = useRef<Map<Molecule, Molecule>>(new Map<Molecule, Molecule>());
    const energyTimeSeries = useDataStore(Selector.energyTimeSeries);

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
      moleculesRef.current.length = 0;
      moleculeMapRef.current.clear();
      if (!testMolecules || testMolecules.length === 0) {
        setComplex(undefined);
        molecularDynamicsRef.current = null;
        energyTimeSeries.clear();
        return;
      }
      if (setLoading) setLoading(true);
      for (const m of testMolecules) {
        loadMolecule(m, processResult);
      }
    }, [testMolecules, resetSimulation]);

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
        if (molecule.name === 'NaCl') {
          // modify the force field for salt crystal (temporary solution)
          if (atom.element.name === 'NA') a.charge = 1;
          else if (atom.element.name === 'CL') a.charge = -1;
          a.epsilon = 0.05;
        } else {
          // temporary solution
          if (a.elementSymbol === 'C' || a.elementSymbol === 'H') {
            a.epsilon = 0.01;
          }
        }
        if (molecule.atoms) {
          a.position.copy(molecule.atoms[i].position);
          a.velocity.copy(molecule.atoms[i].velocity);
          a.force.copy(molecule.atoms[i].force);
        }
        a.initialPosition?.copy(a.position);
        a.initialVelocity?.copy(a.velocity);
        mol.atoms.push(a);
      }
      molecule.radialBonds.length = 0;
      const k = result._bonds.length;
      for (let i = 0; i < k; i++) {
        const bond = result._bonds[i] as BondJS;
        const length = bond.calcLength();
        const index1 = bond._left.index;
        const index2 = bond._right.index;
        mol.radialBonds.push(new RadialBond(mol.atoms[index1], mol.atoms[index2], length));
        molecule.radialBonds.push(new RadialBond(molecule.atoms[index1], molecule.atoms[index2], length));
      }
      const aBonds: Triple[] = getAngularBondDefinition(molecule.name);
      if (aBonds.length > 0) {
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
      const tBonds: Quadruple[] = getTorsionalBondDefinition(molecule.name);
      if (tBonds.length > 0) {
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
      moleculeMapRef.current.set(molecule, mol);
      if (moleculeMapRef.current.size === testMolecules.length) {
        // store the new molecules in a map because this call is asynchronous, so we cannot guarantee the order
        // testMolecules and moleculesRef must have the same order
        for (const m of testMolecules) {
          const m2 = moleculeMapRef.current.get(m);
          if (m2) moleculesRef.current.push(m2);
        }
        moleculeMapRef.current.clear();
        setComplex(generateComplex(moleculesRef.current));
        molecularDynamicsRef.current = new MolecularDynamics(moleculesRef.current, molecularContainer);
        molecularDynamicsRef.current.timeStep = timeStep;
        usePrimitiveStore.getState().set((state) => {
          state.updateInfoFlag = !state.updateInfoFlag;
        });
      }
    };

    useEffect(() => {
      if (!groupRef.current || !mode) return;
      groupRef.current.children = [];
      if (!complex) return;
      for (const [i, r] of complex._residues.entries()) {
        const m = moleculesRef.current[i];
        if (m) {
          for (const [j, a] of r._atoms.entries()) {
            a.temperature = ModelUtil.convertToTemperatureFactor(
              m.atoms[j].getKineticEnergy(),
              kineticEnergyScaleFactor,
            );
          }
        }
      }
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
    ]);

    useEffect(() => {
      const picker = new Picker(groupRef.current, camera, gl.domElement);
      // @ts-expect-error ignore
      settings.set('pick', pickMode);
      // @ts-expect-error ignore
      picker.addEventListener('newpick', (event) => {
        switch (pickMode) {
          case PickMode.MOLECULE: {
            const pickedMoleculeIndex = event.obj.molecule ? event.obj.molecule.index - 1 : -1;
            usePrimitiveStore.getState().set((state) => {
              state.pickedMoleculeIndex = pickedMoleculeIndex;
              state.pickedAtom = null;
            });
            break;
          }
          case PickMode.ATOM: {
            const pickedAtomIndex = event.obj.atom ? event.obj.atom.index : -1;
            if (pickedAtomIndex !== -1) {
              usePrimitiveStore.getState().set((state) => {
                state.pickedAtom = molecularDynamicsRef.current?.atoms[pickedAtomIndex] ?? null;
                state.pickedMoleculeIndex = -1;
              });
            }
            break;
          }
        }
      });
      return () => {
        picker.dispose();
      };
    }, [pickMode]);

    const skinnyStyle = useMemo(() => {
      return (
        viewerStyle === MolecularViewerStyle.BallAndStick ||
        viewerStyle === MolecularViewerStyle.Stick ||
        viewerStyle === MolecularViewerStyle.Wireframe ||
        viewerStyle === MolecularViewerStyle.AtomIndex
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
        {pickedAtom && (
          <Sphere
            position={pickedAtom.position}
            scale={Element.getByName(pickedAtom.elementSymbol).radius * (skinnyStyle ? 0.4 : 1.2)}
          >
            <meshStandardMaterial transparent opacity={0.5} color={'yellow'} />
          </Sphere>
        )}
        {/* draw arrow bodies of the momentum vectors */}
        {momentumVisible && (
          <Instances limit={1000} range={1000}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial />
            {moleculesRef.current.map((m) => {
              const arr = [];
              const quaternion = new Quaternion();
              const normalized = new Vector3();
              arr.push(
                m.atoms.map((a, i) => {
                  const radius = Element.getByName(a.elementSymbol).radius * (skinnyStyle ? 0.25 : 1);
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
            {moleculesRef.current.map((m) => {
              const arr = [];
              const quaternion = new Quaternion();
              const normalized = new Vector3();
              arr.push(
                m.atoms.map((a, i) => {
                  const radius = Element.getByName(a.elementSymbol).radius * (skinnyStyle ? 0.25 : 1);
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
            {moleculesRef.current.map((m) => {
              const arr = [];
              const quaternion = new Quaternion();
              const normalized = new Vector3();
              arr.push(
                m.atoms.map((a, i) => {
                  const radius = Element.getByName(a.elementSymbol).radius * (skinnyStyle ? 0.25 : 1);
                  const force = a.force.length() * forceScaleFactor * 1000;
                  normalized.copy(a.force).normalize();
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
            {moleculesRef.current.map((m) => {
              const arr = [];
              const quaternion = new Quaternion();
              const normalized = new Vector3();
              arr.push(
                m.atoms.map((a, i) => {
                  const radius = Element.getByName(a.elementSymbol).radius * (skinnyStyle ? 0.25 : 1);
                  const force = a.force.length() * forceScaleFactor * 1000;
                  normalized.copy(a.force).normalize();
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
        <ModelContainer />
        {pickedMoleculeIndex !== -1 && showMover && <Movers center={[0, 0, 0]} length={moleculeLengths} />}
      </>
    );
  },
);

export default DynamicsViewer;
