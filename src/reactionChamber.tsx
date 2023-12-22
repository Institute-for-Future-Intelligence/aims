/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { DEFAULT_FOV, DEFAULT_SHADOW_CAMERA_FAR, HALF_PI } from './programmaticConstants';
import { OrbitControls } from '@react-three/drei';
import Lights from './lights';
import Axes from './view/axes';
import MolecularViewer from './molecularViewer';
import { MoleculeData } from './types';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';

export interface ReactionChamberProps {
  moleculeData: MoleculeData;
}

const ReactionChamber = ({ moleculeData }: ReactionChamberProps) => {
  const viewerStyle = useStore(Selector.chamberViewerStyle);
  const viewerBackground = useStore(Selector.chamberViewerBackground);
  const viewerAxes = useStore(Selector.chamberViewerAxes);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <Canvas
      ref={canvasRef}
      shadows={false}
      gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
      frameloop={'demand'}
      style={{ height: '100%', width: '100%', backgroundColor: viewerBackground }}
      camera={{
        fov: DEFAULT_FOV,
        far: DEFAULT_SHADOW_CAMERA_FAR,
        up: [0, 0, 1],
        position: [0, 0, 20],
        rotation: [HALF_PI / 2, 0, HALF_PI / 2],
      }}
    >
      <OrbitControls />
      <Lights />
      {viewerAxes && <Axes />}
      <MolecularViewer moleculeData={moleculeData} style={viewerStyle} highQuality={true} />
    </Canvas>
  );
};

export default React.memo(ReactionChamber);
