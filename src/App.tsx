/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import testMoleculeUrl1 from './molecules/pdb/aspirin.pdb';
import testMoleculeUrl2 from './molecules/sdf/ibuprofen.sdf';
import testMoleculeUrl3 from './molecules/sdf/paxlovid.sdf';
import testMoleculeUrl4 from './molecules/pcj/caffeine.pcj';
import testMoleculeUrl5 from './molecules/mol2/benzene.mol2';
import testMoleculeUrl6 from './molecules/xyz/glucose.xyz';

import React, { Suspense, useEffect, useMemo } from 'react';
import './App.css';
import ifiLogo from './assets/ifi-logo.png';
import { throttle } from 'lodash';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { visitHomepage, visitIFI } from './helpers';
import MainMenu from './mainMenu';
import { VERSION } from './programmaticConstants';
import SplitPane from 'react-split-pane';
import MainToolBar from './mainToolBar';
import ShareLinks from './shareLinks';
import ProjectGallery from './projectGallery';
import ReactionChamber from './reactionChamber';
import { MoleculeData } from './types';
import AcceptCookie from './acceptCookie';
import DropdownContextMenu from './components/contextMenu';
import { useTranslation } from 'react-i18next';
import Loading from './loading';
import KeyboardListener from './keyboardListener';

export const testMolecules = [
  { name: 'Aspirin', url: testMoleculeUrl1 } as MoleculeData,
  { name: 'Ibuprofen', url: testMoleculeUrl2 } as MoleculeData,
  { name: 'Paxlovid', url: testMoleculeUrl3 } as MoleculeData,
  { name: 'Caffeine', url: testMoleculeUrl4 } as MoleculeData,
  { name: 'Benzene', url: testMoleculeUrl5 } as MoleculeData,
  { name: 'Glucose', url: testMoleculeUrl6 } as MoleculeData,
];

export const getTestMolecule = (name: string) => {
  for (const m of testMolecules) {
    if (name === m.name) return m;
  }
  return null;
};

const App = () => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const projectView = useStore(Selector.projectView);
  const chamberViewerPercentWidth = useStore(Selector.chamberViewerPercentWidth);
  const loadedMolecule = useStore(Selector.loadedMolecule);
  const collectedMolecules = useStore(Selector.collectedMolecules);
  const loadChemicalElements = useStore(Selector.loadChemicalElements);
  const loadProvidedMolecules = useStore(Selector.loadProvidedMolecules);
  const params = new URLSearchParams(window.location.search);
  const viewOnly = params.get('viewonly') === 'true';

  useEffect(() => {
    loadChemicalElements();
    loadProvidedMolecules();
    setCommonStore((state) => {
      if (!state.collectedMolecules.length || state.collectedMolecules.length === 0) {
        state.collectedMolecules = testMolecules;
      }
      if (state.selectedMolecule !== null) {
        for (const m of state.collectedMolecules) {
          if (m.name === state.selectedMolecule.name) {
            state.selectedMolecule = m;
            break;
          }
        }
      } else {
        state.selectedMolecule = state.collectedMolecules[0];
      }
      if (state.loadedMolecule !== null) {
        for (const m of state.collectedMolecules) {
          if (m.name === state.loadedMolecule.name) {
            state.loadedMolecule = m;
            break;
          }
        }
      } else {
        state.loadedMolecule = state.collectedMolecules[0];
      }
    });
    // eslint-disable-next-line
  }, []);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const setNavigationView = (selected: boolean) => {
    setCommonStore((state) => {
      state.navigationView = selected;
      state.enableRotate = !selected;
    });
  };

  const resetView = () => {
    //TODO
  };

  const zoomView = (scale: number) => {
    //TODO
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
          title={t('tooltip.visitAIMSHomePage', lang)}
          onClick={visitHomepage}
        >
          {`${t('name.AIMS', lang)}`}
        </span>{' '}
        🚧
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
            color: 'dimgray',
          }}
        >
          <img
            alt="IFI Logo"
            src={ifiLogo}
            height="30px"
            style={{ verticalAlign: 'bottom', cursor: 'pointer' }}
            title={t('tooltip.gotoIFI', lang)}
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
            title={t('tooltip.gotoIFI', lang)}
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
            &nbsp;&nbsp; &copy;{new Date().getFullYear()} {`${t('name.IFI', lang)}`}
            &nbsp;
            {t('word.VersionInitial', lang) + VERSION + '. ' + t('word.AllRightsReserved', lang) + '. '}
          </div>
        </>
      )}

      {!viewOnly && (
        <ShareLinks size={16} round={true} margin={'2px'} style={{ position: 'absolute', right: '0', top: '90px' }} />
      )}

      {!viewOnly && <MainToolBar signIn={() => {}} signOut={() => {}} />}
      <MainMenu viewOnly={false} canvas={null} />
      <DropdownContextMenu>
        {/* must specify the height here for the floating window to have correct boundary check*/}
        <div style={{ height: 'calc(100vh - 82px)' }}>
          {/* @ts-ignore */}
          <SplitPane
            split={'vertical'}
            onChange={throttle((size) => {
              setCommonStore((state) => {
                state.chamberViewerPercentWidth = Math.round(100 - (size / window.innerWidth) * 100);
              });
            }, 5)}
            // must specify the height again for the split pane to resize correctly with the window
            style={{ height: 'calc(100vh - 82px)', display: 'flex' }}
            pane1Style={{
              width: projectView ? 100 - chamberViewerPercentWidth + '%' : '0',
              minWidth: projectView ? '25%' : 0,
              maxWidth: projectView ? '75%' : 0,
            }}
            pane2Style={{ width: projectView ? chamberViewerPercentWidth + '%' : '100%' }}
            resizerStyle={{
              cursor: 'col-resize',
              width: projectView ? '6px' : 0,
              minWidth: projectView ? '6px' : 0,
              maxWidth: projectView ? '6px' : 0,
              backgroundImage: 'linear-gradient(to right, white, gray)',
            }}
          >
            {projectView ? (
              <Suspense fallback={<Loading />}>
                <ProjectGallery
                  relativeWidth={1 - chamberViewerPercentWidth * 0.01}
                  moleculeData={collectedMolecules}
                />
              </Suspense>
            ) : (
              <></>
            )}
            <Suspense fallback={<Loading />}>
              <ReactionChamber moleculeData={loadedMolecule} />
            </Suspense>
          </SplitPane>
          <KeyboardListener setNavigationView={setNavigationView} resetView={resetView} zoomView={zoomView} />
        </div>
      </DropdownContextMenu>
      {!viewOnly && <AcceptCookie />}
    </div>
  );
};

export default React.memo(App);
