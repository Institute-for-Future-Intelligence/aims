/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_FOV,
  DEFAULT_LIGHT_INTENSITY,
  DEFAULT_PAN_CENTER,
  DEFAULT_SHADOW_CAMERA_FAR,
  DEFAULT_SHADOW_MAP_SIZE,
  HALF_PI,
} from './constants';
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';
import Axes from './view/axes';
import MolecularViewer from './view/molecularViewer';
import { MoleculeData } from './types';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { DirectionalLight, Vector3 } from 'three';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { useRefStore } from './stores/commonRef';
import ExperimentSettings from './view/experimentSettings';

export interface ReactionChamberProps {
  moleculeData: MoleculeData | null;
}

const ReactionChamber = ({ moleculeData }: ReactionChamberProps) => {
  const setCommonStore = useStore(Selector.set);
  const viewerStyle = useStore(Selector.projectState).chamberViewerStyle;
  const viewerColoring = useStore(Selector.projectState).chamberViewerColoring;
  const viewerBackground = useStore(Selector.projectState).chamberViewerBackground;
  const viewerAxes = useStore(Selector.projectState).chamberViewerAxes;
  const shininess = useStore(Selector.projectState).chamberViewerShininess ?? 1000;
  const autoRotate = usePrimitiveStore(Selector.autoRotate);
  const cameraPosition = useStore(Selector.cameraPosition);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<any>(null);
  const orbitControlsRef = useRef<any>(null);
  const lightRef = useRef<DirectionalLight>(null);

  const [refVisible, setRefVisible] = useState<boolean>(false);

  useEffect(() => {
    if (cameraRef.current) cameraRef.current.position.fromArray(cameraPosition);
  }, [cameraPosition]);

  // save orbitControlRef to common ref store
  useEffect(() => {
    if (refVisible) {
      useRefStore.setState({
        orbitControlsRef: orbitControlsRef,
      });
    }
  }, [refVisible]);

  const onControlEnd = (e: any) => {
    const control = e.target;
    setCommonStore((state) => {
      const p = control.object.position as Vector3;
      if (!state.cameraPosition) state.cameraPosition = DEFAULT_CAMERA_POSITION;
      if (!state.panCenter) state.panCenter = DEFAULT_PAN_CENTER;
      state.cameraPosition[0] = p.x;
      state.cameraPosition[1] = p.y;
      state.cameraPosition[2] = p.z;
      const q = control.target as Vector3;
      state.panCenter[0] = q.x;
      state.panCenter[1] = q.y;
      state.panCenter[2] = q.z;
    });
  };

  return (
    <>
      <Canvas
        id={'reaction-chamber'}
        ref={canvasRef}
        shadows={false}
        gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
        frameloop={'demand'}
        style={{ height: '100%', width: '100%', backgroundColor: viewerBackground }}
        camera={{
          fov: DEFAULT_FOV,
          far: DEFAULT_SHADOW_CAMERA_FAR,
          up: [0, 0, 1],
          position: new Vector3().fromArray(cameraPosition ?? DEFAULT_CAMERA_POSITION),
          rotation: [HALF_PI / 2, 0, HALF_PI / 2],
        }}
      >
        <OrbitControls
          ref={(e) => {
            orbitControlsRef.current = e;
            setRefVisible(!!e);
            if (e) {
              cameraRef.current = e.object;
            }
          }}
          enableDamping={false}
          onEnd={onControlEnd}
          autoRotate={autoRotate}
          onChange={(e) => {
            if (!e) return;
            const camera = e.target.object;
            if (lightRef.current) {
              // sets the point light to a location above the camera
              lightRef.current.position.set(0, 1, 0);
              lightRef.current.position.add(camera.position);
            }
          }}
        />
        <directionalLight
          ref={lightRef}
          name={'Directional Light'}
          color="white"
          position={new Vector3().fromArray(cameraPosition ?? DEFAULT_CAMERA_POSITION)}
          intensity={DEFAULT_LIGHT_INTENSITY}
          castShadow={true}
          shadow-bias={0} // may be used to reduce shadow artifacts
          shadow-mapSize-height={DEFAULT_SHADOW_MAP_SIZE}
          shadow-mapSize-width={DEFAULT_SHADOW_MAP_SIZE}
          shadow-camera-near={1}
          shadow-camera-far={DEFAULT_SHADOW_CAMERA_FAR}
        />
        {viewerAxes && <Axes />}
        {moleculeData && (
          <MolecularViewer
            moleculeData={moleculeData}
            style={viewerStyle}
            coloring={viewerColoring}
            shininess={shininess}
            highQuality={true}
          />
        )}
        <GizmoHelper alignment="bottom-right" margin={[30, 30]}>
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor="white"
            hideAxisHeads={true}
            hideNegativeAxes={true}
          />
        </GizmoHelper>
      </Canvas>
      <ExperimentSettings />
    </>
  );
};

export default React.memo(ReactionChamber);
