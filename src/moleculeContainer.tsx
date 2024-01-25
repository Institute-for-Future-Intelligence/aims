/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_FOV,
  DEFAULT_LIGHT_INTENSITY,
  DEFAULT_SHADOW_CAMERA_FAR,
  HALF_PI,
} from './constants';
import MolecularViewer from './view/molecularViewer';
import { MoleculeData } from './types';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { MolecularViewerColoring } from './view/displayOptions';
import { DirectionalLight, Vector3 } from 'three';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { ProjectGalleryControls } from './controls';

export interface MoleculeContainerProps {
  width: number;
  height: number;
  moleculeData: MoleculeData | null;
  selected: boolean;
}

const MoleculeContainer = ({ width, height, moleculeData, selected }: MoleculeContainerProps) => {
  const setCommonStore = useStore(Selector.set);
  const viewerStyle = useStore(Selector.projectViewerStyle);
  const viewerMaterial = useStore(Selector.projectViewerMaterial);
  const viewerBackground = useStore(Selector.projectViewerBackground);
  const setChanged = usePrimitiveStore(Selector.setChanged);

  const lightRef = useRef<DirectionalLight>(null);

  const cameraPositionVector = useMemo(() => new Vector3().fromArray(DEFAULT_CAMERA_POSITION), []);

  return (
    <>
      <Canvas
        shadows={false}
        gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true, antialias: true }}
        frameloop={'demand'}
        style={{
          transition: '.5s ease',
          height: height + 'px',
          width: width + 'px',
          backgroundColor: viewerBackground,
          borderRadius: '10px',
          border: selected ? '2px solid red' : '1px solid gray',
          opacity: moleculeData?.excluded ? 0.25 : 1,
        }}
        camera={{
          fov: DEFAULT_FOV,
          far: DEFAULT_SHADOW_CAMERA_FAR,
          up: [0, 0, 1],
          position: cameraPositionVector,
          rotation: [HALF_PI / 2, 0, HALF_PI / 2],
        }}
        onMouseDown={() => {
          setCommonStore((state) => {
            state.selectedMolecule = moleculeData !== state.selectedMolecule ? moleculeData : null;
          });
          setChanged(true);
        }}
        onDoubleClick={() => {
          setCommonStore((state) => {
            state.selectedMolecule = moleculeData;
            state.loadedMolecule = moleculeData;
          });
        }}
      >
        <ProjectGalleryControls lightRef={lightRef} />
        <directionalLight
          name={'Directional Light'}
          ref={lightRef}
          color="white"
          position={cameraPositionVector}
          intensity={DEFAULT_LIGHT_INTENSITY}
          castShadow={false}
        />
        {moleculeData && (
          <MolecularViewer
            moleculeData={moleculeData}
            style={viewerStyle}
            material={viewerMaterial}
            coloring={MolecularViewerColoring.Element}
            isGalleryView={true}
            lightRef={lightRef}
          />
        )}
      </Canvas>
    </>
  );
};

export default React.memo(MoleculeContainer);
