/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { DEFAULT_FOV, DEFAULT_SHADOW_CAMERA_FAR, HALF_PI } from './constants';
import { OrbitControls } from '@react-three/drei';
import Lights from './lights';
import MolecularViewer from './molecularViewer';
import styled from 'styled-components';
import { List } from 'antd';

export interface ProjectGalleryProps {
  relativeWidth: number; // (0, 1)
  moleculeUrls: string[];
}

const CanvasContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
`;

const ProjectGallery = ({ relativeWidth, moleculeUrls }: ProjectGalleryProps) => {
  const canvasColumns = 3;
  const gridGutter = 10;
  const totalWidth = Math.round(window.innerWidth * relativeWidth);
  const canvasWidth = totalWidth / canvasColumns - gridGutter;
  const canvasHeight = canvasWidth * 0.75;

  const createCanvas = (moleculeUrl: string) => {
    return (
      <Canvas
        shadows={true}
        gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
        frameloop={'demand'}
        style={{
          height: canvasHeight + 'px',
          width: canvasWidth + 'px',
          backgroundColor: 'white',
          border: '1px solid gray',
        }}
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
        <Suspense fallback={null}>
          <MolecularViewer moleculeUrl={moleculeUrl} />
        </Suspense>
      </Canvas>
    );
  };

  return (
    <CanvasContainer>
      <List
        style={{
          width: '100%',
          height: '100%',
          paddingTop: '10px',
          paddingBottom: '0px',
          paddingLeft: '10px',
          paddingRight: '0px',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
        grid={{ column: canvasColumns, gutter: 0 }}
        dataSource={moleculeUrls}
        renderItem={(url: string) => {
          return (
            <List.Item onMouseOver={() => {}} onMouseLeave={() => {}}>
              {createCanvas(url)}
            </List.Item>
          );
        }}
      ></List>
    </CanvasContainer>
  );
};

export default React.memo(ProjectGallery);
