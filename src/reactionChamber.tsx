/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
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
import Cockpit from './view/cockpit.tsx';
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
import { RadialBond } from './models/RadialBond.ts';

const ReactionChamber = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const selectedMolecule = useStore(Selector.selectedMolecule);
  const viewerStyle = useStore(Selector.chamberViewerStyle);
  const viewerMaterial = useStore(Selector.chamberViewerMaterial);
  const viewerColoring = useStore(Selector.chamberViewerColoring);
  const viewerBackground = useStore(Selector.chamberViewerBackground);
  const viewerSelector = useStore(Selector.chamberViewerSelector);
  const viewerAxes = useStore(Selector.chamberViewerAxes);
  const viewerFoggy = useStore(Selector.chamberViewerFoggy);
  const cameraPosition = useStore(Selector.cameraPosition);
  const cameraRotation = useStore(Selector.cameraRotation);
  const cameraUp = useStore(Selector.cameraUp);
  const spaceshipDisplayMode = useStore(Selector.spaceshipDisplayMode);
  const protein = useStore(Selector.protein);
  const projectType = useStore(Selector.projectType);
  const xyPlaneVisible = useStore(Selector.xyPlaneVisible);
  const yzPlaneVisible = useStore(Selector.yzPlaneVisible);
  const xzPlaneVisible = useStore(Selector.xzPlaneVisible);
  const energyGraphVisible = useStore(Selector.energyGraphVisible);
  const molecularPropertiesMap = useStore(Selector.molecularPropertiesMap);

  const [loading, setLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef<DirectionalLight>(null);
  const clickPointRef = useRef<Vector3 | null>(null);

  const cameraRef = useRefStore.getState().cameraRef;
  const raycasterRef = useRefStore.getState().raycasterRef;
  const planeXYRef = useRefStore.getState().planeXYRef;
  const planeYZRef = useRefStore.getState().planeYZRef;
  const planeXZRef = useRefStore.getState().planeXZRef;

  useEffect(() => {
    useRefStore.setState({
      clickPointRef: clickPointRef,
    });
  }, [clickPointRef]);

  const dropMolecule = (e: React.DragEvent) => {
    const point = getIntersection(e);
    if (point && selectedMolecule) {
      setCommonStore((state) => {
        switch (state.projectState.type) {
          case ProjectType.MOLECULAR_MODELING: {
            const prop = molecularPropertiesMap.get(selectedMolecule.name);
            if (prop?.atoms) {
              const atoms: Atom[] = [];
              for (const a of prop.atoms) {
                const clone = Atom.clone(a);
                clone.index = a.index;
                atoms.push(clone);
              }
              const radialBonds: RadialBond[] = [];
              if (prop?.radialBonds) {
                for (const b of prop.radialBonds) {
                  radialBonds.push(new RadialBond(atoms[b.atom1.index], atoms[b.atom2.index]));
                }
              }
              const m = new Molecule(selectedMolecule.name, atoms, radialBonds);
              m.setCenter(point);
              state.projectState.testMolecules.push(m);
            }
            break;
          }
          case ProjectType.DRUG_DISCOVERY: {
            state.projectState.ligand = { ...selectedMolecule };
            state.projectState.ligandTransform = {
              x: point.x,
              y: point.y,
              z: point.z,
              euler: [0, 0, 0],
            } as MoleculeTransform;
            break;
          }
        }
      });
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
      const x = ((e.clientX - rect.left) / canvasRef.current.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / canvasRef.current.height) * 2 + 1;
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
            state.selectedPlane = -1;
          });
        }}
        onContextMenu={onContextMenu}
        onClick={() => canvasRef.current?.focus()}
      >
        <ReSizer />
        <ReactionChamberControls lightRef={lightRef} />
        {/* FIXME: temporary solution to turn on/off fog without updating materials */}
        <fog attach="fog" args={viewerFoggy ? ['#000000', 50, 150] : ['#000000', 0.1, 0]} />
        {viewerFoggy && <ambientLight intensity={0.5} />}
        <directionalLight
          ref={lightRef}
          name={'Directional Light'}
          color="white"
          position={new Vector3().fromArray(cameraPosition ?? DEFAULT_CAMERA_POSITION).add(new Vector3(0, 1, 0))}
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
        {spaceshipDisplayMode === SpaceshipDisplayMode.INSIDE_VIEW && <Cockpit />}
        {spaceshipDisplayMode === SpaceshipDisplayMode.OUTSIDE_VIEW && <Spaceship />}
        <GizmoHelper alignment="bottom-right" margin={[30, 30]}>
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor="white"
            hideAxisHeads={true}
            hideNegativeAxes={true}
          />
        </GizmoHelper>
      </Canvas>

      {projectType === ProjectType.DRUG_DISCOVERY && <DockingSettings />}
      {projectType === ProjectType.MOLECULAR_MODELING && <DynamicsSettings />}
      <ToolBarButtons />
      {projectType === ProjectType.MOLECULAR_MODELING && <SimulationControls />}
      {energyGraphVisible && <EnergyGraph />}

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

const ReSizer = () => {
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
