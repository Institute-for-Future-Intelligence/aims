/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { Suspense, useMemo, useRef, useState } from 'react';
import './App.css';
import i18n from './i18n/i18n';
import ifiLogo from './assets/ifi-logo.png';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { visitHomepage, visitIFI } from './helpers';
import MainMenu from './mainMenu';
import { Canvas } from '@react-three/fiber';
import { DEFAULT_FOV, DEFAULT_SHADOW_CAMERA_FAR, VERSION } from './constants';
import SplitPane from 'react-split-pane';
import { throttle } from 'lodash';
import { OrbitControls } from '@react-three/drei';
import Lights from './lights';
import Axes from './view/axes';
import MainToolBar from './mainToolBar';
import ShareLinks from './shareLinks';
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';
import { Color, Vector3 } from 'three';
// import moleculeUrl from './molecules/pdb/aspirin.txt';
import naclMolecule from './molecules/pdb/nacl.pdb';

const App = () => {
  const language = useStore(Selector.language);
  const projectView = useStore(Selector.projectView);
  const viewOnly = false;
  const pdbLoader = new PDBLoader();

  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasRelativeWidth, setCanvasRelativeWidth] = useState<number>(50);

  const loadMolecule = () => {
    const pdb = pdbLoader.parse(naclMolecule);
    console.log('loaded', pdb);

    const geometryAtoms = pdb.geometryAtoms;
    const geometryBonds = pdb.geometryBonds;
    const json = pdb.json;

    let positions = geometryAtoms.getAttribute('position');
    const colors = geometryAtoms.getAttribute('color');

    const position = new Vector3();
    const color = new Color();

    for (let i = 0; i < positions.count; i++) {
      position.x = positions.getX(i);
      position.y = positions.getY(i);
      position.z = positions.getZ(i);

      color.r = colors.getX(i);
      color.g = colors.getY(i);
      color.b = colors.getZ(i);

      const atom = json.atoms[i];

      console.log(atom);
    }

    positions = geometryBonds.getAttribute('position');

    const start = new Vector3();
    const end = new Vector3();

    for (let i = 0; i < positions.count; i += 2) {
      start.x = positions.getX(i);
      start.y = positions.getY(i);
      start.z = positions.getZ(i);

      end.x = positions.getX(i + 1);
      end.y = positions.getY(i + 1);
      end.z = positions.getZ(i + 1);

      start.multiplyScalar(75);
      end.multiplyScalar(75);
    }

    // pdbLoader.load(moleculeUrl, (pdb) => {
    //   const geometryAtoms = pdb.geometryAtoms;
    //   const geometryBonds = pdb.geometryBonds;
    //   const json = pdb.json;

    //   let positions = geometryAtoms.getAttribute('position');
    //   const colors = geometryAtoms.getAttribute('color');

    //   const position = new Vector3();
    //   const color = new Color();

    //   for (let i = 0; i < positions.count; i++) {
    //     position.x = positions.getX(i);
    //     position.y = positions.getY(i);
    //     position.z = positions.getZ(i);

    //     color.r = colors.getX(i);
    //     color.g = colors.getY(i);
    //     color.b = colors.getZ(i);

    //     const atom = json.atoms[i];

    //     console.log(atom);
    //   }

    //   positions = geometryBonds.getAttribute('position');

    //   const start = new Vector3();
    //   const end = new Vector3();

    //   for (let i = 0; i < positions.count; i += 2) {
    //     start.x = positions.getX(i);
    //     start.y = positions.getY(i);
    //     start.z = positions.getZ(i);

    //     end.x = positions.getX(i + 1);
    //     end.y = positions.getY(i + 1);
    //     end.z = positions.getZ(i + 1);

    //     start.multiplyScalar(75);
    //     end.multiplyScalar(75);
    //   }
    // });

    return <></>;
  };

  const createCanvas = () => {
    return (
      <Canvas
        ref={canvasRef}
        shadows={true}
        gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
        frameloop={'demand'}
        style={{ height: '100%', width: '100%', backgroundColor: 'black' }}
        camera={{ fov: DEFAULT_FOV, far: DEFAULT_SHADOW_CAMERA_FAR, up: [0, 0, 1] }}
      >
        <OrbitControls />
        <Lights />
        <Suspense fallback={null}>
          <Axes />
          {loadMolecule()}
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
              color: 'antiquewhite',
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
          defaultSize={projectView ? '50%' : 0}
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
          {projectView ? <div style={{ backgroundColor: 'white' }} /> : <></>}
          {createCanvas()}
        </SplitPane>
      </div>
    </div>
  );
};

export default React.memo(App);
