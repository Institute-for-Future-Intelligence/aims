/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import ifiLogo from './assets/ifi-logo.png';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { setMessage, visitHomepage } from './helpers';
import MainMenu from './mainMenu';
import { ProjectType, SpaceshipDisplayMode, VERSION } from './constants';
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
import { AlertFilled, CloudTwoTone, ShareAltOutlined, LinkOutlined, UploadOutlined } from '@ant-design/icons';
import SplitPane from './components/splitPane.tsx';
import { useRefStore } from './stores/commonRef.ts';
import { Badge, Button, Popover, Space } from 'antd';
import Cockpit from './view/cockpit.tsx';
import PeriodicTable from './periodicTable.tsx';
import { Util } from './Util.ts';
import i18n from './i18n/i18n.ts';
import Messenger from './messengers.tsx';

const AppCreator = React.memo(({ viewOnly = false }: { viewOnly: boolean }) => {
  const setCommonStore = useStore(Selector.set);
  const user = useStore(Selector.user);
  const latestVersion = usePrimitiveStore(Selector.latestVersion);
  const loggable = useStore.getState().loggable;
  const language = useStore(Selector.language);
  const hideGallery = useStore(Selector.hideGallery);
  const chamberViewerPercentWidth = useStore(Selector.chamberViewerPercentWidth);
  const projectType = useStore(Selector.projectType);
  const projectOwner = useStore(Selector.projectOwner);
  const projectTitle = useStore(Selector.projectTitle);
  const loadChemicalElements = useStore(Selector.loadChemicalElements);
  const loadProvidedMolecularProperties = useStore(Selector.loadProvidedMolecularProperties);
  const showAccountSettingsPanel = usePrimitiveStore(Selector.showAccountSettingsPanel);
  const changed = usePrimitiveStore(Selector.changed);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const spaceshipDisplayMode = useStore(Selector.spaceshipDisplayMode);
  const navigationView = useStore(Selector.navigationView);
  const showPeriodicTable = usePrimitiveStore(Selector.showPeriodicTable);

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

  const [latestVersionReminder, setLatestVersionReminder] = useState<boolean>(false);

  const firstLoadRef = useRef<boolean>(true);

  useEffect(() => {
    if (latestVersion) setLatestVersionReminder(VERSION.localeCompare(latestVersion) < 0);
  }, [latestVersion]);

  useEffect(() => {
    if (firstLoadRef.current) {
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
      firstLoadRef.current = false;
    }
    // eslint-disable-next-line
  }, []);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const setNavigationView = (selected: boolean) => {
    setCommonStore((state) => {
      state.projectState.navigationView = selected;
      if (selected) {
        state.projectState.showInstructionPanel = false;
        state.projectState.spaceshipDisplayMode = SpaceshipDisplayMode.INSIDE_VIEW;
      } else {
        state.projectState.spaceshipDisplayMode = SpaceshipDisplayMode.NONE;
      }
    });
    usePrimitiveStore.getState().set((state) => {
      state.enableRotate = !selected;
    });
  };

  const isOwner = user.uid && user.uid === projectOwner;

  console.log('x');

  return (
    <div className="App" id={'whole-app'}>
      <div
        style={{
          backgroundColor: 'lightblue',
          height: '72px',
          paddingTop: '10px',
          textAlign: 'start',
          userSelect: 'none',
        }}
      >
        <Badge
          offset={['10px', '0px']}
          count={
            latestVersionReminder ? (
              <AlertFilled style={{ color: 'red', cursor: 'pointer' }} title={t('message.NewVersionAvailable', lang)} />
            ) : undefined
          }
        >
          <Space
            style={{
              marginLeft: '90px',
              verticalAlign: 'middle',
              cursor: 'pointer',
              userSelect: 'none',
              fontSize: '30px',
            }}
            title={'Artificial Intelligence for Molecular Sciences (AIMS)'}
            onClick={visitHomepage}
          >
            {`${t('name.AIMS', lang)}`}
          </Space>
        </Badge>
        {projectTitle && (
          <CloudTwoTone
            twoToneColor={isOwner ? 'blue' : 'gray'}
            style={{
              paddingLeft: '24px',
              verticalAlign: 'bottom',
            }}
          />
        )}
        <Space
          style={{
            paddingLeft: '4px',
            fontSize: '16px',
            verticalAlign: 'bottom',
            userSelect: 'none',
            color: isOwner ? 'black' : 'gray',
          }}
          title={t('projectPanel.ProjectTitle', lang)}
        >
          {projectTitle ? projectTitle + (isOwner && changed ? ' *' : '') : ''}
          {!viewOnly && isOwner && changed && (
            <Button
              type="primary"
              size={'small'}
              style={{ marginLeft: '10px' }}
              title={t('menu.project.SaveProject', lang)}
              onClick={() => {
                usePrimitiveStore.getState().setSaveProjectFlag(true);
                if (loggable) {
                  setCommonStore((state) => {
                    state.actionInfo = {
                      name: 'Save Project',
                      timestamp: new Date().getTime(),
                    };
                  });
                }
              }}
            >
              {t('word.Save', lang)}
            </Button>
          )}
          {!viewOnly && projectTitle && (
            <Popover
              content={
                <Space direction={'vertical'}>
                  <Space direction={'horizontal'}>
                    <LinkOutlined style={{ fontSize: '20px' }} />
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (!user.uid || !projectTitle) return;
                        Util.generateProjectLink(user.uid, projectTitle, () => {
                          setMessage('success', i18n.t('projectListPanel.ProjectLinkGeneratedInClipBoard', lang) + '.');
                        });
                      }}
                    >
                      {t('word.CopyLink', lang)}
                    </span>
                  </Space>
                  <Space direction={'vertical'}>
                    <Space direction={'horizontal'}>
                      <ShareAltOutlined style={{ fontSize: '20px' }} />
                      <span>{t('word.ShareVia', lang)}</span>
                    </Space>
                    <ShareLinks size={36} round={true} margin={'8px'} style={{ paddingLeft: '24px' }} />
                  </Space>
                </Space>
              }
            >
              <UploadOutlined
                title={t('word.Share', lang)}
                style={{ paddingLeft: '10px', fontSize: '20px', color: 'navy', cursor: 'pointer' }}
              />
            </Popover>
          )}
        </Space>
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
            color: hideGallery ? 'antiquewhite' : 'dimgray',
          }}
        >
          <img alt="IFI Logo" src={ifiLogo} height="30px" style={{ verticalAlign: 'bottom' }} />
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
              bottom: '6px',
              left: '6px',
              zIndex: 999,
              userSelect: 'none',
            }}
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

      <MainMenu viewOnly={viewOnly} />
      <DropdownContextMenu>
        {/* must specify the height here for the floating window to have correct boundary check*/}
        <div style={{ height: 'calc(100vh - 72px)' }}>
          <SplitPane
            hideGallery={!hideGallery}
            maxWidth={100}
            defaultSize={!hideGallery ? 100 - chamberViewerPercentWidth : 0}
            onChange={(size) => {
              setCommonStore((state) => {
                state.projectState.chamberViewerPercentWidth = 100 - size;
              });
              useRefStore.getState().resizeCanvases(size);
              setChanged(true);
            }}
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
          {projectType === ProjectType.DRUG_DISCOVERY && spaceshipDisplayMode === SpaceshipDisplayMode.INSIDE_VIEW && (
            <Cockpit />
          )}
          {projectType === ProjectType.MOLECULAR_MODELING && navigationView && <Cockpit />}
          <KeyboardListener setNavigationView={setNavigationView} />
        </div>
      </DropdownContextMenu>
      <CloudManager viewOnly={viewOnly} />
      {showAccountSettingsPanel && <AccountSettingsPanel />}
      {!viewOnly && <AcceptCookie />}
      {showPeriodicTable && (
        <PeriodicTable
          close={() => {
            usePrimitiveStore.getState().set((state) => {
              state.showPeriodicTable = false;
            });
          }}
        />
      )}
      <Messenger />
    </div>
  );
});

export default AppCreator;
