/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { DEFAULT_FOV, DEFAULT_SHADOW_CAMERA_FAR, HALF_PI } from './programmaticConstants';
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';
import Lights from './lights';
import Axes from './view/axes';
import MolecularViewer from './view/molecularViewer';
import { MoleculeData } from './types';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { Vector3 } from 'three';
import { usePrimitiveStore } from './stores/commonPrimitive';

export interface ReactionChamberProps {
  moleculeData: MoleculeData | null;
}

const ReactionChamber = ({ moleculeData }: ReactionChamberProps) => {
  const setCommonStore = useStore(Selector.set);
  const viewerStyle = useStore(Selector.chamberViewerStyle);
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
      <OrbitControls enableDamping={false} onEnd={onControlEnd} autoRotate={autoRotate} />
      <Lights highQuality />
      {viewerAxes && <Axes />}
      {moleculeData && (
        <MolecularViewer moleculeData={moleculeData} style={viewerStyle} shininess={shininess} highQuality={true} />
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
