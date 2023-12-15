/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import i18n from './i18n/i18n';
import ifiLogo from './assets/ifi-logo.png';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { visitHomepage, visitIFI } from './helpers';
import MainMenu from './mainMenu';
import { Canvas } from '@react-three/fiber';
import { DEFAULT_FOV, DEFAULT_SHADOW_CAMERA_FAR, HALF_PI, VERSION } from './constants';
import SplitPane from 'react-split-pane';
import { throttle } from 'lodash';
import { OrbitControls } from '@react-three/drei';
import Lights from './lights';
import Axes from './view/axes';
import MainToolBar from './mainToolBar';
import ShareLinks from './shareLinks';
import testMoleculeUrl from './molecules/pdb/aspirin.pdb';
import testMoleculeUrl1 from './molecules/pdb/nacl.pdb';
import testMoleculeUrl2 from './molecules/pdb/buckyball.pdb';
import testMoleculeUrl3 from './molecules/pdb/cholesterol.pdb';
import testMoleculeUrl4 from './molecules/pdb/caffeine.pdb';
import testMoleculeUrl5 from './molecules/pdb/ybco.pdb';
import testMoleculeUrl6 from './molecules/pdb/diamond.pdb';
import MolecularViewer from './molecularViewer';
import { Col, Row } from 'antd';

const App = () => {
  const language = useStore(Selector.language);
  const projectView = useStore(Selector.projectView);
  const loadChemicalElements = useStore(Selector.loadChemicalElements);
  const viewOnly = false;

  useEffect(() => {
    loadChemicalElements();
  }, []);

  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasRelativeWidth, setCanvasRelativeWidth] = useState<number>(60);

  const createCanvas = (moleculeUrl: string, forGallery?: boolean) => {
    return (
      <Canvas
        ref={canvasRef}
        shadows={true}
        gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
        frameloop={'demand'}
        style={{ height: '100%', width: '100%', backgroundColor: forGallery ? 'white' : 'black' }}
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
          {!forGallery && <Axes />}
          <MolecularViewer moleculeUrl={moleculeUrl} />
        </Suspense>
      </Canvas>
    );
  };

  return (
    <div className="App">
      <div
        style={{
          backgroundColor: 'lightblue',
          height: '72px',
          paddingTop: '10px',
          textAlign: 'start',
          userSelect: 'none',
          fontSize: '30px',
        }}
      >
        <span
          style={{
            marginLeft: '120px',
            verticalAlign: 'middle',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          title={i18n.t('tooltip.visitAIMSHomePage', lang)}
          onClick={visitHomepage}
        >
          {`${i18n.t('name.AIMS', lang)}`} 🚧
        </span>
      </div>

      {viewOnly ? (
        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            left: '6px',
            zIndex: 999,
            fontSize: '8px',
            userSelect: 'none',
            color: 'antiquewhite',
          }}
        >
          <img
            alt="IFI Logo"
            src={ifiLogo}
            height="30px"
            style={{ verticalAlign: 'bottom', cursor: 'pointer' }}
            title={i18n.t('tooltip.gotoIFI', lang)}
            onClick={visitIFI}
          />
          {' V ' + VERSION}
        </div>
      ) : (
        <>
          <img
            alt="IFI Logo"
            src={ifiLogo}
            height={projectView ? '24px' : '40px'}
            style={{
              position: 'absolute',
              cursor: 'pointer',
              bottom: '6px',
              left: '6px',
              zIndex: 999,
              userSelect: 'none',
            }}
            title={i18n.t('tooltip.gotoIFI', lang)}
            onClick={visitIFI}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: projectView ? '24px' : '44px',
              zIndex: 999,
              fontSize: '10px',
              userSelect: 'none',
              color: projectView ? 'dimgray' : 'antiquewhite',
            }}
          >
            &nbsp;&nbsp; &copy;{new Date().getFullYear()} {`${i18n.t('name.IFI', lang)}`}
            &nbsp;
            {i18n.t('word.VersionInitial', lang) + VERSION + '. ' + i18n.t('word.AllRightsReserved', lang) + '. '}
          </div>
        </>
      )}

      {!viewOnly && (
        <ShareLinks size={16} round={true} margin={'2px'} style={{ position: 'absolute', right: '0', top: '90px' }} />
      )}

      <MainToolBar signIn={() => {}} signOut={() => {}} />
      <MainMenu viewOnly={false} canvas={null} />
      {/* must specify the height here for the floating window to have correct boundary check*/}
      <div style={{ height: 'calc(100vh - 82px)' }}>
        {/* @ts-ignore */}
        <SplitPane
          split={'vertical'}
          defaultSize={projectView ? '60%' : 0}
          onChange={throttle((size) => {
            setCanvasRelativeWidth(Math.round(100 - (size / window.innerWidth) * 100));
          }, 5)}
          // must specify the height again for the split pane to resize correctly with the window
          style={{ height: 'calc(100vh - 82px)', display: 'flex' }}
          pane1Style={{
            width: projectView ? 100 - canvasRelativeWidth + '%' : '0',
            minWidth: projectView ? '25%' : 0,
            maxWidth: projectView ? '75%' : 0,
          }}
          pane2Style={{ width: projectView ? canvasRelativeWidth + '%' : '100%' }}
          resizerStyle={{
            cursor: 'col-resize',
            width: projectView ? '6px' : 0,
            minWidth: projectView ? '6px' : 0,
            maxWidth: projectView ? '6px' : 0,
            backgroundImage: 'linear-gradient(to right, white, gray)',
          }}
        >
          {projectView ? (
            <div style={{ backgroundColor: 'white', overflowY: 'visible' }}>
              <Row style={{ width: '100%', paddingLeft: '20px', paddingTop: '10px' }} gutter={[6, 6]}>
                <Col style={{ width: '33%', marginRight: '1px', border: '1px solid lightgray' }}>
                  {createCanvas(testMoleculeUrl1, true)}
                </Col>
                <Col style={{ width: '33%', marginRight: '1px', border: '1px solid lightgray' }}>
                  {createCanvas(testMoleculeUrl2, true)}
                </Col>
                <Col style={{ width: '33%', border: '1px solid lightgray' }}>
                  {createCanvas(testMoleculeUrl3, true)}
                </Col>
              </Row>
              <Row
                style={{ width: '100%', paddingLeft: '20px', paddingTop: '2px', paddingBottom: '10px' }}
                gutter={[6, 6]}
              >
                <Col style={{ width: '33%', marginRight: '1px', border: '1px solid lightgray' }}>
                  {createCanvas(testMoleculeUrl4, true)}
                </Col>
                <Col style={{ width: '33%', marginRight: '1px', border: '1px solid lightgray' }}>
                  {createCanvas(testMoleculeUrl5, true)}
                </Col>
                <Col style={{ width: '33%', border: '1px solid lightgray' }}>
                  {createCanvas(testMoleculeUrl6, true)}
                </Col>
              </Row>
            </div>
          ) : (
            <></>
          )}
          {createCanvas(testMoleculeUrl)}
        </SplitPane>
      </div>
    </div>
  );
};

export default React.memo(App);