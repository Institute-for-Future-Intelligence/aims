/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  DEFAULT_FOV,
  DEFAULT_LIGHT_INTENSITY,
  DEFAULT_SHADOW_CAMERA_FAR,
  DEFAULT_SHADOW_MAP_SIZE,
  HALF_PI,
} from './programmaticConstants';
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';
import Axes from './view/axes';
import MolecularViewer from './view/molecularViewer';
import { MoleculeData } from './types';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { DirectionalLight, Vector3 } from 'three';
import { usePrimitiveStore } from './stores/commonPrimitive';

export interface ReactionChamberProps {
  moleculeData: MoleculeData | null;
}

const ReactionChamber = ({ moleculeData }: ReactionChamberProps) => {
  const setCommonStore = useStore(Selector.set);
  const viewerStyle = useStore(Selector.chamberViewerStyle);
  const viewerColoring = useStore(Selector.chamberViewerColoring);
  const viewerBackground = useStore(Selector.chamberViewerBackground);
  const viewerAxes = useStore(Selector.chamberViewerAxes);
  const shininess = useStore(Selector.chamberViewerShininess) ?? 1000;
  const cameraPosition = useStore(Selector.cameraPosition);
  const autoRotate = usePrimitiveStore(Selector.autoRotate);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onControlEnd = (e: any) => {
    const control = e.target;
    setCommonStore((state) => {
      const p = control.object.position as Vector3;
      state.cameraPosition[0] = p.x;
      state.cameraPosition[1] = p.y;
      state.cameraPosition[2] = p.z;
      const q = control.target as Vector3;
      state.panCenter[0] = q.x;
      state.panCenter[1] = q.y;
      state.panCenter[2] = q.z;
    });
  };

  const lightRef = useRef<DirectionalLight>(null);

  return (
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
        position: new Vector3().fromArray(cameraPosition),
        rotation: [HALF_PI / 2, 0, HALF_PI / 2],
      }}
    >
      <OrbitControls
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
        position={new Vector3().fromArray(cameraPosition ?? [1, 1, 1])}
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
  );
};

export default React.memo(ReactionChamber);
