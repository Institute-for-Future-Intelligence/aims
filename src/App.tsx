/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import './App.css';
import i18n from './i18n/i18n';
import ifiLogo from './assets/ifi-logo.png';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { visitHomepage, visitIFI } from './helpers';
import MainMenu from './mainMenu';
import { VERSION } from './constants';
import SplitPane from 'react-split-pane';
import { throttle } from 'lodash';
import MainToolBar from './mainToolBar';
import ShareLinks from './shareLinks';
import testMoleculeUrl1 from './molecules/pdb/aspirin.pdb';
import testMoleculeUrl2 from './molecules/pdb/buckyball.pdb';
import testMoleculeUrl3 from './molecules/pdb/cholesterol.pdb';
import testMoleculeUrl4 from './molecules/pdb/caffeine.pdb';
import testMoleculeUrl5 from './molecules/pdb/ybco.pdb';
import testMoleculeUrl6 from './molecules/pdb/diamond.pdb';
import ProjectGallery from './projectGallery';
import ReactionChamber from './reactionChamber';
import { MoleculeData } from './types';
import AcceptCookie from './acceptCookie';

const App = () => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const projectView = useStore(Selector.projectView);
  const selectedMolecule = useStore(Selector.selectedMolecule);
  const collectedMolecules = useStore(Selector.collectedMolecules);
  const loadChemicalElements = useStore(Selector.loadChemicalElements);
  const params = new URLSearchParams(window.location.search);
  const viewOnly = params.get('viewonly') === 'true';

  useEffect(() => {
    loadChemicalElements();
    setCommonStore((state) => {
      state.collectedMolecules = [
        { name: 'Aspirin', url: testMoleculeUrl1 } as MoleculeData,
        { name: 'Buckyball', url: testMoleculeUrl2 } as MoleculeData,
        { name: 'Cholesterol', url: testMoleculeUrl3 } as MoleculeData,
        { name: 'Caffeine', url: testMoleculeUrl4 } as MoleculeData,
        { name: 'YBCO', url: testMoleculeUrl5 } as MoleculeData,
        { name: 'Diamond', url: testMoleculeUrl6 } as MoleculeData,
      ];
      state.selectedMolecule = state.collectedMolecules[0];
    });
    // eslint-disable-next-line
  }, []);

  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const [chamberRelativeWidth, setChamberRelativeWidth] = useState<number>(60);

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
          {`${i18n.t('name.AIMS', lang)}`}
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
            setChamberRelativeWidth(Math.round(100 - (size / window.innerWidth) * 100));
          }, 5)}
          // must specify the height again for the split pane to resize correctly with the window
          style={{ height: 'calc(100vh - 82px)', display: 'flex' }}
          pane1Style={{
            width: projectView ? 100 - chamberRelativeWidth + '%' : '0',
            minWidth: projectView ? '25%' : 0,
            maxWidth: projectView ? '75%' : 0,
          }}
          pane2Style={{ width: projectView ? chamberRelativeWidth + '%' : '100%' }}
          resizerStyle={{
            cursor: 'col-resize',
            width: projectView ? '6px' : 0,
            minWidth: projectView ? '6px' : 0,
            maxWidth: projectView ? '6px' : 0,
            backgroundImage: 'linear-gradient(to right, white, gray)',
          }}
        >
          {projectView ? (
            <Suspense fallback={null}>
              <ProjectGallery relativeWidth={1 - chamberRelativeWidth * 0.01} moleculeData={collectedMolecules} />
            </Suspense>
          ) : (
            <></>
          )}
          {selectedMolecule ? (
            <Suspense fallback={null}>
              <ReactionChamber moleculeData={selectedMolecule} />
            </Suspense>
          ) : (
            <div>Loading...</div>
          )}
        </SplitPane>
      </div>
      {!viewOnly && <AcceptCookie />}
    </div>
  );
};

export default React.memo(App);
