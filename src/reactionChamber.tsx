/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_UP,
  DEFAULT_FOV,
  DEFAULT_LIGHT_INTENSITY,
  DEFAULT_SHADOW_CAMERA_FAR,
  DEFAULT_SHADOW_MAP_SIZE,
  HALF_PI,
  ProjectType,
  SpaceshipDisplayMode,
} from './constants';
import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import Axes from './view/axes';
import DynamicsViewer from './view/dynamicsViewer.tsx';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { DirectionalLight, Euler, PerspectiveCamera, Vector2, Vector3 } from 'three';
import DockingSettings from './view/dockingSettings.tsx';
import { ReactionChamberControls } from './controls';
import Spaceship from './view/spaceship.tsx';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import DynamicsSettings from './view/dynamicsSettings.tsx';
import DockingViewer from './view/dockingViewer.tsx';
import ToolBarButtons from './view/toolBarButtons.tsx';
import { useRefStore } from './stores/commonRef.ts';
import { usePrimitiveStore } from './stores/commonPrimitive.ts';
import { MoleculeTransform } from './types.ts';
import SimulationControls from './view/simulationControls.tsx';
import EnergyGraph from './view/energyGraph.tsx';
import { Molecule } from './models/Molecule.ts';
import { Atom } from './models/Atom.ts';
import { VT_CONVERSION_CONSTANT } from './models/physicalConstants.ts';
import { ModelUtil } from './models/ModelUtil.ts';
import { setMessage } from './helpers.tsx';
import { useTranslation } from 'react-i18next';
import { Undoable } from './undo/Undoable.ts';
import InstructionPanel from './view/instructionPanel.tsx';
import SpeedGraph from './view/speedGraph.tsx';

const ReactionChamber = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const addUndoable = useStore(Selector.addUndoable);
  const selectedMolecule = useStore(Selector.selectedMolecule);
  const viewerStyle = useStore(Selector.chamberViewerStyle);
  const viewerMaterial = useStore(Selector.chamberViewerMaterial);
  const viewerColoring = useStore(Selector.chamberViewerColoring);
  const viewerBackground = useStore(Selector.chamberViewerBackground);
  const viewerSelector = useStore(Selector.chamberViewerSelector);
  const viewerAxes = useStore(Selector.chamberViewerAxes);
  const viewerFoggy = useStore(Selector.chamberViewerFoggy);
  const cameraPosition = useStore(Selector.cameraPosition);
  const navPosition = useStore.getState().projectState.navPosition;
  const navigationView = useStore.getState().projectState.navigationView;
  const cameraRotation = useStore(Selector.cameraRotation);
  const cameraUp = useStore(Selector.cameraUp);
  const spaceshipDisplayMode = useStore(Selector.spaceshipDisplayMode);
  const protein = useStore(Selector.protein);
  const projectType = useStore(Selector.projectType);
  const xyPlaneVisible = useStore(Selector.xyPlaneVisible);
  const yzPlaneVisible = useStore(Selector.yzPlaneVisible);
  const xzPlaneVisible = useStore(Selector.xzPlaneVisible);
  const energyGraphVisible = useStore(Selector.energyGraphVisible);
  const speedGraphVisible = useStore(Selector.speedGraphVisible);
  const molecularStructureMap = useStore(Selector.molecularStructureMap);
  const testMolecules = useStore(Selector.testMolecules);
  const loggable = useStore(Selector.loggable);
  const logAction = useStore(Selector.logAction);
  const showInstructionPanel = useStore(Selector.showInstructionPanel);
  const chamberViewerPercentWidth = useStore(Selector.chamberViewerPercentWidth);

  const [loading, setLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef<DirectionalLight>(null);
  const clickPointRef = useRef<Vector3 | null>(null);

  const cameraRef = useRefStore.getState().cameraRef;
  const raycasterRef = useRefStore.getState().raycasterRef;
  const planeXYRef = useRefStore.getState().planeXYRef;
  const planeYZRef = useRefStore.getState().planeYZRef;
  const planeXZRef = useRefStore.getState().planeXZRef;
  const warnIfTooManyAtoms = useRefStore.getState().warnIfTooManyAtoms;

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  useEffect(() => {
    useRefStore.setState({
      clickPointRef: clickPointRef,
    });
  }, [clickPointRef]);

  const addMoleculeAt = (point: Vector3) => {
    if (!selectedMolecule) return;
    const structure = molecularStructureMap.get(selectedMolecule.name);
    if (structure?.atoms) {
      setCommonStore((state) => {
        const atoms: Atom[] = [];
        for (const a of structure.atoms) {
          const clone = Atom.clone(a);
          clone.index = a.index;
          if (!clone.fixed) {
            const temperature = state.projectState.temperature;
            const constantTemperature = state.projectState.constantTemperature;
            const currentTemperature = usePrimitiveStore.getState().currentTemperature;
            // FIXME: Somehow when currentTemperature is used, the speed is set too low
            const speed =
              Math.sqrt(constantTemperature ? temperature : Math.max(100, currentTemperature)) * VT_CONVERSION_CONSTANT;
            clone.velocity.x = speed * (ModelUtil.nextGaussian() - 0.5);
            clone.velocity.y = speed * (ModelUtil.nextGaussian() - 0.5);
            clone.velocity.z = speed * (ModelUtil.nextGaussian() - 0.5);
            clone.initialVelocity?.copy(clone.velocity);
          }
          atoms.push(clone);
        }
        const m = new Molecule(selectedMolecule.name, atoms);
        m.data = selectedMolecule.data;
        m.autoBond = selectedMolecule.autoBond;
        m.setCenter(point);
        state.projectState.testMolecules.push(m);
        warnIfTooManyAtoms(m.atoms.length);
      });
    }
  };

  const dropMolecule = (e: React.DragEvent) => {
    const point = getIntersection(e);
    if (point && selectedMolecule) {
      switch (projectType) {
        case ProjectType.MOLECULAR_MODELING: {
          const undoable = {
            name: 'Drop Molecule',
            timestamp: Date.now(),
            undo: () => {
              setCommonStore((state) => {
                state.projectState.testMolecules.splice(testMolecules.length, 1);
              });
            },
            redo: () => {
              addMoleculeAt(point);
            },
          } as Undoable;
          addUndoable(undoable);
          addMoleculeAt(point);
          if (loggable) logAction('Drop molecule at (' + point.x + ', ' + point.y + ', ' + point.z + ')');
          break;
        }
        case ProjectType.DRUG_DISCOVERY: {
          setCommonStore((state) => {
            state.projectState.ligand = { ...selectedMolecule };
            state.projectState.ligandTransform = {
              x: point.x,
              y: point.y,
              z: point.z,
              euler: [0, 0, 0],
            } as MoleculeTransform;
          });
          break;
        }
      }
    } else {
      if (!point) {
        setMessage('info', t('message.TurnOnXYZPlanesForDroppingMolecule', lang));
      }
    }
  };

  const onContextMenu = (e: React.MouseEvent) => {
    const p = getIntersection(e);
    if (p) {
      if (!clickPointRef.current) clickPointRef.current = new Vector3();
      clickPointRef.current.copy(p);
    }
  };

  const getIntersection = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    if (canvasRef.current && cameraRef?.current && raycasterRef?.current) {
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const planes = [];
      if (xyPlaneVisible && planeXYRef?.current) planes.push(planeXYRef.current);
      if (yzPlaneVisible && planeYZRef?.current) planes.push(planeYZRef.current);
      if (xzPlaneVisible && planeXZRef?.current) planes.push(planeXZRef.current);
      raycasterRef.current.setFromCamera(new Vector2(x, y), cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(planes);
      if (intersects.length > 0) {
        return intersects[0].point;
      }
    }
    return null;
  };

  const chamberVisible = chamberViewerPercentWidth > 0.1;

  return (
    <>
      <Canvas
        id={'reaction-chamber'}
        ref={canvasRef}
        shadows={false}
        gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: false }}
        frameloop={'demand'}
        style={{ height: '100%', width: '100%', backgroundColor: viewerBackground }}
        camera={{
          fov: DEFAULT_FOV,
          far: DEFAULT_SHADOW_CAMERA_FAR,
          up: new Vector3().fromArray(cameraUp ?? DEFAULT_CAMERA_UP),
          position: new Vector3().fromArray(cameraPosition ?? DEFAULT_CAMERA_POSITION),
          rotation: new Euler().fromArray(
            cameraRotation
              ? [cameraRotation[0], cameraRotation[1], cameraRotation[2], Euler.DEFAULT_ORDER]
              : [HALF_PI / 2, 0, HALF_PI / 2, Euler.DEFAULT_ORDER],
          ),
        }}
        onDrop={dropMolecule}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onPointerUp={(e) => {
          const p = getIntersection(e);
          if (p) {
            if (!clickPointRef.current) clickPointRef.current = new Vector3();
            clickPointRef.current.copy(p);
          } else {
            clickPointRef.current = null;
          }
          usePrimitiveStore.getState().set((state) => {
            state.enableRotate = true;
          });
        }}
        onContextMenu={onContextMenu}
        onClick={() => canvasRef.current?.focus()}
        onPointerMissed={() => {
          usePrimitiveStore.getState().set((state) => {
            state.selectedPlane = -1;
          });
        }}
      >
        <Resizer />
        <ReactionChamberControls lightRef={lightRef} />
        {/* FIXME: temporary solution to turn on/off fog without updating materials */}
        <fog attach="fog" args={viewerFoggy ? ['#000000', 50, 150] : ['#000000', 0.1, 0]} />
        {viewerFoggy && <ambientLight intensity={0.5} />}
        <directionalLight
          ref={lightRef}
          name={'Directional Light'}
          color="white"
          position={new Vector3()
            .fromArray((navigationView ? navPosition : cameraPosition) ?? DEFAULT_CAMERA_POSITION)
            .add(new Vector3(0, 1, 0))}
          intensity={DEFAULT_LIGHT_INTENSITY}
          castShadow={true}
          shadow-bias={0} // may be used to reduce shadow artifacts
          shadow-mapSize-height={DEFAULT_SHADOW_MAP_SIZE}
          shadow-mapSize-width={DEFAULT_SHADOW_MAP_SIZE}
          shadow-camera-near={1}
          shadow-camera-far={DEFAULT_SHADOW_CAMERA_FAR}
        />
        {/*<Background />*/}
        {viewerAxes && <Axes />}
        {projectType === ProjectType.DRUG_DISCOVERY ? (
          <DockingViewer
            protein={protein}
            style={viewerStyle}
            material={viewerMaterial}
            coloring={viewerColoring}
            selector={viewerSelector}
            setLoading={setLoading}
          />
        ) : (
          <DynamicsViewer
            style={viewerStyle}
            material={viewerMaterial}
            coloring={viewerColoring}
            selector={viewerSelector}
            setLoading={setLoading}
          />
        )}
        {spaceshipDisplayMode === SpaceshipDisplayMode.OUTSIDE_VIEW && <Spaceship />}
        <GizmoHelper alignment="bottom-right" margin={navigationView ? [40, 80] : [30, 30]}>
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor="white"
            hideAxisHeads={true}
            hideNegativeAxes={true}
          />
        </GizmoHelper>
      </Canvas>

      {chamberVisible && projectType === ProjectType.DRUG_DISCOVERY && <DockingSettings />}
      {chamberVisible && projectType === ProjectType.MOLECULAR_MODELING && <DynamicsSettings />}
      {chamberVisible && <ToolBarButtons />}
      {chamberVisible && showInstructionPanel && <InstructionPanel />}
      {chamberVisible && projectType === ProjectType.MOLECULAR_MODELING && <SimulationControls />}
      {chamberVisible && energyGraphVisible && <EnergyGraph />}
      {chamberVisible && speedGraphVisible && <SpeedGraph />}

      {loading && canvasRef.current && (
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                position: 'absolute',
                fontSize: 200,
                right: canvasRef.current.width / 2 - 100,
                bottom: canvasRef.current.height / 2 - 100,
              }}
            />
          }
        />
      )}
    </>
  );
});

const Resizer = () => {
  const { gl, camera } = useThree();

  useEffect(() => {
    if (gl && camera && camera instanceof PerspectiveCamera) {
      useRefStore.setState({
        chamberViewerCanvas: { camera: camera as PerspectiveCamera, gl: gl },
      });
    }
  }, []);

  return null;
};

export default ReactionChamber;
