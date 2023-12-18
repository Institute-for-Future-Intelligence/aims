/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { DEFAULT_FOV, DEFAULT_SHADOW_CAMERA_FAR, HALF_PI } from './constants';
import { OrbitControls } from '@react-three/drei';
import Lights from './lights';
import Axes from './view/axes';
import MolecularViewer from './molecularViewer';
import { MoleculeData } from './types';

export interface ReactionChamberProps {
  moleculeData: MoleculeData;
}

const ReactionChamber = ({ moleculeData }: ReactionChamberProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <Canvas
      ref={canvasRef}
      shadows={true}
      gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
      frameloop={'demand'}
      style={{ height: '100%', width: '100%', backgroundColor: 'black' }}
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
      <Axes />
      <MolecularViewer moleculeData={moleculeData} />
    </Canvas>
  );
};

export default React.memo(ReactionChamber);
