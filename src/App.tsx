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
import { OrbitControls, Sphere, Cylinder, Box } from '@react-three/drei';
import Lights from './lights';
import Axes from './view/axes';
import MainToolBar from './mainToolBar';
import ShareLinks from './shareLinks';
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';
import { Color, Vector3 } from 'three';
import testMolecule from './molecules/pdb/buckyball.pdb';
import { Atom } from './Atom';
import { Bond } from './Bond';
import { Molecule } from './Molecule';

const App = () => {
  const language = useStore(Selector.language);
  const projectView = useStore(Selector.projectView);
  const viewOnly = false;
  const moleculeContent = testMolecule;

  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasRelativeWidth, setCanvasRelativeWidth] = useState<number>(50);

  const molecule = useMemo(() => {
    const pdbLoader = new PDBLoader();
    const pdb = pdbLoader.parse(moleculeContent);
    const geometryAtoms = pdb.geometryAtoms;
    const geometryBonds = pdb.geometryBonds;
    const json = pdb.json;
    let positions = geometryAtoms.getAttribute('position');
    const colors = geometryAtoms.getAttribute('color');
    const atoms: Atom[] = [];
    for (let i = 0; i < positions.count; i++) {
      const atom = json.atoms[i];
      atoms.push({
        name: atom[4] as string,
        position: new Vector3(positions.getX(i), positions.getY(i), positions.getZ(i)),
        color: new Color(colors.getX(i), colors.getY(i), colors.getZ(i)),
      });
    }
    positions = geometryBonds.getAttribute('position');
    const bonds: Bond[] = [];
    for (let i = 0; i < positions.count; i += 2) {
      const j = i + 1;
      bonds.push({
        start: new Vector3(positions.getX(i), positions.getY(i), positions.getZ(i)),
        end: new Vector3(positions.getX(j), positions.getY(j), positions.getZ(j)),
      });
    }
    return { atoms, bonds } as Molecule;
  }, [moleculeContent]);

  const showAtoms = () => {
    return (
      <group name={'Atoms'}>
        {molecule.atoms.map((e, index) => {
          return (
            <Sphere
              position={e.position}
              args={[0.5, 16, 16]}
              key={'Atom' + index}
              name={e.name}
              castShadow={false}
              receiveShadow={false}
              onPointerOver={(e) => {}}
              onPointerOut={(e) => {}}
              onPointerDown={(e) => {
                if (e.button === 2) return;
              }}
            >
              <meshStandardMaterial attach="material" color={e.color} />
            </Sphere>
          );
        })}
      </group>
    );
  };

  const showBonds = () => {
    return (
      <group name={'Bonds'}>
        {molecule.bonds.map((e, index) => {
          return (
            <Cylinder
              key={'Bond' + index}
              userData={{ unintersectable: true }}
              name={'Bond' + index}
              castShadow={false}
              receiveShadow={false}
              args={[0.1, 0.1, e.end.distanceTo(e.start), 16, 1]}
              position={e.start.clone().lerp(e.end, 0.5)}
              onUpdate={(self) => {
                self.lookAt(e.end);
              }}
            >
              <meshStandardMaterial attach="material" color={'white'} />
            </Cylinder>
          );
        })}
      </group>
    );
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
          {showAtoms()}
          {showBonds()}
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
