/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { DEFAULT_FOV, DEFAULT_SHADOW_CAMERA_FAR, HALF_PI } from './constants';
import { OrbitControls } from '@react-three/drei';
import Lights from './lights';
import MolecularViewer from './molecularViewer';
import styled from 'styled-components';
import { List } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { useTranslation } from 'react-i18next';

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

const Container = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 30px);
  margin: 0;
  display: flex;
  justify-content: center;
  align-self: center;
  align-content: center;
  align-items: center;
  padding-bottom: 30px;
  opacity: 100%;
  user-select: none;
  tab-index: -1; // set to be not focusable
  z-index: 7; // must be less than other panels
  background: white;
`;

const ColumnWrapper = styled.div`
  background-color: #f8f8f8;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: none;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const Header = styled.div`
  width: 100%;
  height: 24px;
  padding: 10px;
  background-color: #e8e8e8;
  color: #888;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectGallery = ({ relativeWidth, moleculeUrls }: ProjectGalleryProps) => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const canvasColumns = 3;
  const gridGutter = 10;
  const totalWidth = Math.round(window.innerWidth * relativeWidth);
  const canvasWidth = totalWidth / canvasColumns - gridGutter;
  const canvasHeight = canvasWidth * 0.75;

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

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
        <MolecularViewer moleculeUrl={moleculeUrl} />
      </Canvas>
    );
  };

  const closeProject = () => {
    setCommonStore((state) => {
      state.projectView = false;
    });
  };

  return (
    <Container
      onContextMenu={(e) => {
        e.stopPropagation();
      }}
    >
      <ColumnWrapper>
        <Header>
          <span>Title</span>
          <span
            style={{ cursor: 'pointer', paddingRight: '20px' }}
            onMouseDown={() => {
              closeProject();
            }}
            onTouchStart={() => {
              closeProject();
            }}
          >
            <CloseOutlined title={t('word.Close', lang)} />
          </span>
        </Header>
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
      </ColumnWrapper>
    </Container>
  );
};

export default React.memo(ProjectGallery);
