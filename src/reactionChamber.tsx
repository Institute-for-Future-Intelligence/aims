/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_UP,
  DEFAULT_FOV,
  DEFAULT_LIGHT_INTENSITY,
  DEFAULT_SHADOW_CAMERA_FAR,
  DEFAULT_SHADOW_MAP_SIZE,
  HALF_PI,
} from './constants';
import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import Axes from './view/axes';
import MolecularViewer from './view/molecularViewer';
import { MoleculeData } from './types';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { DirectionalLight, Euler, Vector3 } from 'three';
import ExperimentSettings from './view/experimentSettings';
import { ReactionChamberControls } from './controls';

export interface ReactionChamberProps {
  moleculeData: MoleculeData | null;
}

const ReactionChamber = React.memo(({ moleculeData }: ReactionChamberProps) => {
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef<DirectionalLight>(null);

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
          up: new Vector3().fromArray(cameraUp ?? DEFAULT_CAMERA_UP),
          position: new Vector3().fromArray(cameraPosition ?? DEFAULT_CAMERA_POSITION),
          rotation: new Euler().fromArray(
            cameraRotation
              ? [cameraRotation[0], cameraRotation[1], cameraRotation[2], Euler.DEFAULT_ORDER]
              : [HALF_PI / 2, 0, HALF_PI / 2, Euler.DEFAULT_ORDER],
          ),
        }}
      >
        <ReactionChamberControls lightRef={lightRef} />
        {viewerFoggy && <fog attach="fog" args={['#000000', 50, 150]} />}
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
        {viewerAxes && <Axes />}
        {moleculeData && (
          <MolecularViewer
            moleculeData={moleculeData}
            style={viewerStyle}
            material={viewerMaterial}
            coloring={viewerColoring}
            chamber={true}
            selector={viewerSelector}
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
});

export default ReactionChamber;
