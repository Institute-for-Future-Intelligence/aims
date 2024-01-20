/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef, useState } from 'react';
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
import { DirectionalLight, Vector3 } from 'three';
import { MolecularViewerColoring } from './view/displayOptions';

export interface MoleculeContainerProps {
  width: number;
  height: number;
  moleculeData: MoleculeData | null;
  hovered: boolean;
  selected: boolean;
}

const MoleculeContainer = ({ width, height, moleculeData, hovered, selected }: MoleculeContainerProps) => {
  const setCommonStore = useStore(Selector.set);
  const viewerStyle = useStore(Selector.projectState).projectViewerStyle;
  const viewerBackground = useStore(Selector.projectState).projectViewerBackground;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<any>(null);
  const orbitControlsRef = useRef<any>(null);
  const lightRef = useRef<DirectionalLight>(null);

  const [cameraPosition, setCameraPosition] = useState<number[]>(DEFAULT_CAMERA_POSITION);

  const onControlEnd = (e: any) => {
    const control = e.target;
    const p = control.object.position as Vector3;
    setCameraPosition([p.x, p.y, p.z]);
  };

  return (
    <>
      <Canvas
        ref={canvasRef}
        shadows={false}
        gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
        frameloop={'demand'}
        style={{
          transition: '.5s ease',
          opacity: hovered ? 0.5 : 1,
          height: height + 'px',
          width: width + 'px',
          backgroundColor: hovered ? 'rgba(225, 225, 225, 0.5)' : viewerBackground,
          borderRadius: '10px',
          border: moleculeData?.excluded ? 'none' : selected ? '2px solid red' : '1px solid gray',
        }}
        camera={{
          fov: DEFAULT_FOV,
          far: DEFAULT_SHADOW_CAMERA_FAR,
          up: [0, 0, 1],
          position: new Vector3().fromArray(DEFAULT_CAMERA_POSITION),
          rotation: [HALF_PI / 2, 0, HALF_PI / 2],
        }}
        onClick={() => {
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
          ref={(e) => {
            orbitControlsRef.current = e;
            if (e) {
              cameraRef.current = e.object;
            }
          }}
          enableDamping={true}
          onEnd={onControlEnd}
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
          castShadow={false}
        />
        {moleculeData && (
          <MolecularViewer moleculeData={moleculeData} style={viewerStyle} coloring={MolecularViewerColoring.Element} />
        )}
      </Canvas>
    </>
  );
};

export default React.memo(MoleculeContainer);
