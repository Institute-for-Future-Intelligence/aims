/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_FOV,
  DEFAULT_LIGHT_INTENSITY,
  DEFAULT_SHADOW_CAMERA_FAR,
  HALF_PI,
} from './constants';
import { OrbitControls } from '@react-three/drei';
import MolecularViewer from './view/molecularViewer';
import { MoleculeData } from './types';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { MolecularViewerColoring } from './view/displayOptions';
import { Vector3 } from 'three';

export interface MoleculeContainerProps {
  width: number;
  height: number;
  moleculeData: MoleculeData | null;
  hovered: boolean;
  selected: boolean;
  shininess: number;
}

const MoleculeContainer = ({ width, height, moleculeData, hovered, selected, shininess }: MoleculeContainerProps) => {
  const setCommonStore = useStore(Selector.set);
  const viewerStyle = useStore(Selector.projectState).projectViewerStyle;
  const viewerBackground = useStore(Selector.projectState).projectViewerBackground;

  const [cameraPosition, setCameraPosition] = useState<number[]>(DEFAULT_CAMERA_POSITION);

  const onControlEnd = (e: any) => {
    const camera = e.target.object;
    const p = camera.position as Vector3;
    setCameraPosition([p.x, p.y, p.z]);
  };

  return (
    <>
      <Canvas
        shadows={false}
        gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
        frameloop={'demand'}
        style={{
          // transition: '.5s ease',
          height: height + 'px',
          width: width + 'px',
          backgroundColor: viewerBackground,
          borderRadius: '10px',
          border: moleculeData?.excluded ? 'none' : selected ? '2px solid red' : '1px solid gray',
        }}
        camera={{
          fov: DEFAULT_FOV,
          far: DEFAULT_SHADOW_CAMERA_FAR,
          up: [0, 0, 1],
          position: new Vector3().fromArray(cameraPosition),
          rotation: [HALF_PI / 2, 0, HALF_PI / 2],
        }}
        onMouseDown={() => {
          setCommonStore((state) => {
            state.selectedMolecule = moleculeData !== state.selectedMolecule ? moleculeData : null;
          });
        }}
        onDoubleClick={() => {
          setCommonStore((state) => {
            state.selectedMolecule = moleculeData;
            state.loadedMolecule = moleculeData;
          });
        }}
      >
        <OrbitControls
          enableDamping={false}
          onEnd={onControlEnd}
          onChange={(e) => {
            if (!e) return;
            const camera = e.target.object;
            setCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
          }}
        />
        <directionalLight
          name={'Directional Light'}
          color="white"
          position={new Vector3().fromArray(cameraPosition ?? DEFAULT_CAMERA_POSITION)}
          intensity={DEFAULT_LIGHT_INTENSITY}
          castShadow={false}
        />
        {moleculeData && (
          <MolecularViewer
            moleculeData={moleculeData}
            style={viewerStyle}
            coloring={MolecularViewerColoring.Element}
            shininess={shininess}
          />
        )}
      </Canvas>
    </>
  );
};

export default React.memo(MoleculeContainer);
