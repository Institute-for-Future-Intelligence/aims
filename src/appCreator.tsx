/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { Suspense, useEffect, useMemo } from 'react';
import './App.css';
import ifiLogo from './assets/ifi-logo.png';
import { throttle } from 'lodash';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { visitHomepage, visitIFI } from './helpers';
import MainMenu from './mainMenu';
import { VERSION } from './constants';
import ShareLinks from './shareLinks';
import ProjectGallery from './project/projectGallery.tsx';
import ReactionChamber from './reactionChamber';
import AcceptCookie from './acceptCookie';
import DropdownContextMenu from './components/contextMenu';
import { useTranslation } from 'react-i18next';
import Loading from './loading';
import KeyboardListener from './keyboardListener';
import { usePrimitiveStore } from './stores/commonPrimitive';
import AccountSettingsPanel from './accountSettingsPanel';
import CloudManager from './cloudManager';
import { CloudTwoTone } from '@ant-design/icons';
import SplitPane from './components/splitPane.tsx';

const AppCreator = React.memo(({ viewOnly = false }: { viewOnly: boolean }) => {
  const setCommonStore = useStore(Selector.set);
  const user = useStore(Selector.user);
  const language = useStore(Selector.language);
  const hideGallery = useStore(Selector.hideGallery);
  const chamberViewerPercentWidth = useStore(Selector.chamberViewerPercentWidth);
  const projectOwner = useStore(Selector.projectOwner);
  const projectTitle = useStore(Selector.projectTitle);
  const loadChemicalElements = useStore(Selector.loadChemicalElements);
  const loadProvidedMolecularProperties = useStore(Selector.loadProvidedMolecularProperties);
  const showAccountSettingsPanel = usePrimitiveStore(Selector.showAccountSettingsPanel);

  // const setChanged = usePrimitiveStore(Selector.setChanged);
  // const setSkipChange = usePrimitiveStore(Selector.setSkipChange);
  // const cameraPosition = useStore(Selector.cameraPosition);
  // const panCenter = useStore(Selector.panCenter);
  // useEffect(() => {
  //   if (usePrimitiveStore.getState().skipChange) {
  //     setSkipChange(false);
  //   } else if (!usePrimitiveStore.getState().changed) {
  //     setChanged(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cameraPosition, panCenter]);

  useEffect(() => {
    loadChemicalElements();
    loadProvidedMolecularProperties();
    setCommonStore((state) => {
      // make sure the selected molecule is in the same array of molecules
      if (state.projectState.selectedMolecule) {
        for (const m of state.projectState.molecules) {
          if (m.name === state.projectState.selectedMolecule.name) {
            state.projectState.selectedMolecule = m;
            break;
          }
        }
      }
      // make sure the test molecule is in the same array of molecules
      if (state.projectState.ligand) {
        for (const m of state.projectState.molecules) {
          if (m.name === state.projectState.ligand.name) {
            state.projectState.ligand = m;
            break;
          }
        }
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
    });
    usePrimitiveStore.getState().set((state) => {
      state.enableRotate = !selected;
    });
  };

  const isOwner = user.uid && user.uid === projectOwner;

  console.log('x');

  return (
    <div className="App">
      <div
        style={{
          backgroundColor: 'lightblue',
          height: '72px',
          paddingTop: '10px',
          textAlign: 'start',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            marginLeft: '120px',
            verticalAlign: 'middle',
            cursor: 'pointer',
            userSelect: 'none',
            fontSize: '30px',
          }}
          title={'Artificial Intelligence for Molecular Sciences (AIMS)'}
          onClick={visitHomepage}
        >
          {`${t('name.AIMS', lang)}`}
        </span>
        {projectTitle && (
          <CloudTwoTone
            twoToneColor={isOwner ? 'blue' : 'gray'}
            style={{
              paddingLeft: '10px',
              verticalAlign: 'bottom',
            }}
          />
        )}
        <span
          style={{
            paddingLeft: '2px',
            fontSize: '16px',
            verticalAlign: 'bottom',
            userSelect: 'none',
            color: isOwner ? 'black' : 'gray',
          }}
          title={t('projectPanel.ProjectTitle', lang)}
        >
          {projectTitle ?? ''}
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
            height={hideGallery ? '40px' : '24px'}
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
              left: hideGallery ? '44px' : '24px',
              zIndex: 999,
              fontSize: '10px',
              userSelect: 'none',
              color: hideGallery ? 'antiquewhite' : 'dimgray',
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

      <MainMenu viewOnly={viewOnly} />
      <DropdownContextMenu>
        {/* must specify the height here for the floating window to have correct boundary check*/}
        <div style={{ height: 'calc(100vh - 72px)' }}>
          <SplitPane
            hideGallery={!hideGallery}
            defaultSize={!hideGallery ? 100 - chamberViewerPercentWidth : 0}
            onChange={throttle((size) => {
              setCommonStore((state) => {
                state.projectState.chamberViewerPercentWidth = 100 - size;
              });
            }, 50)}
          >
            {!hideGallery ? (
              <Suspense fallback={<Loading />}>
                <ProjectGallery relativeWidth={1 - chamberViewerPercentWidth * 0.01} />
              </Suspense>
            ) : (
              <></>
            )}
            <Suspense fallback={<Loading />}>
              <ReactionChamber />
            </Suspense>
          </SplitPane>
          <KeyboardListener setNavigationView={setNavigationView} />
        </div>
      </DropdownContextMenu>
      <CloudManager viewOnly={viewOnly} />
      {showAccountSettingsPanel && <AccountSettingsPanel />}
      {!viewOnly && <AcceptCookie />}
    </div>
  );
});

export default AppCreator;
