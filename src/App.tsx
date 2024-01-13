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
import { VERSION } from './programmaticConstants';
import SplitPane from 'react-split-pane';
import ShareLinks from './shareLinks';
import ProjectGallery from './projectGallery';
import ReactionChamber from './reactionChamber';
import AcceptCookie from './acceptCookie';
import DropdownContextMenu from './components/contextMenu';
import { useTranslation } from 'react-i18next';
import Loading from './loading';
import KeyboardListener from './keyboardListener';
import { usePrimitiveStore } from './stores/commonPrimitive';
import AccountSettingsPanel from './accountSettingsPanel';
import CloudManager from './cloudManager';
import { testMolecules, testProteins } from './internalDatabase';
import { useRefStore } from './stores/commonRef';
import { UndoableCameraChange } from './undo/UndoableCameraChange';

export const getTestMolecule = (name: string) => {
  for (const m of testMolecules) {
    if (name === m.name) return m;
  }
  return null;
};

const App = () => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const addUndoable = useStore(Selector.addUndoable);
  const projectView = useStore(Selector.projectView);
  const chamberViewerPercentWidth = useStore(Selector.chamberViewerPercentWidth);
  const targetProtein = useStore(Selector.targetProtein);
  const collectedMolecules = useStore(Selector.collectedMolecules);
  const loadChemicalElements = useStore(Selector.loadChemicalElements);
  const loadProvidedMolecularProperties = useStore(Selector.loadProvidedMolecularProperties);
  const params = new URLSearchParams(window.location.search);
  const viewOnly = params.get('viewonly') === 'true';
  const showAccountSettingsPanel = usePrimitiveStore(Selector.showAccountSettingsPanel);

  useEffect(() => {
    loadChemicalElements();
    loadProvidedMolecularProperties();
    setCommonStore((state) => {
      if (!state.collectedMolecules || state.collectedMolecules.length === 0) {
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
      if (state.targetProtein !== null) {
        for (const t of testProteins) {
          if (t.name === state.targetProtein.name) {
            state.targetProtein = t;
            break;
          }
        }
      } else {
        state.targetProtein = testProteins[0];
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

  const resetView = () => {
    const orbitControlsRef = useRefStore.getState().orbitControlsRef;
    if (orbitControlsRef?.current) {
      // I don't know why the reset method results in a black screen.
      // So we are resetting it here to a predictable position.
      const z = 100; // TODO: get bounding box
      orbitControlsRef.current.object.position.set(z, z, z);
      orbitControlsRef.current.target.set(0, 0, 0);
      orbitControlsRef.current.update();
      setCommonStore((state) => {
        state.cameraPosition = [z, z, z];
        state.panCenter = [0, 0, 0];
      });
    }
  };

  const zoomView = (scale: number) => {
    const orbitControlsRef = useRefStore.getState().orbitControlsRef;
    if (orbitControlsRef?.current) {
      const p = orbitControlsRef.current.object.position;
      const x = p.x * scale;
      const y = p.y * scale;
      const z = p.z * scale;
      const undoableCameraChange = {
        name: 'Zoom',
        timestamp: Date.now(),
        oldCameraPosition: [p.x, p.y, p.z],
        newCameraPosition: [x, y, z],
        undo: () => {
          const oldX = undoableCameraChange.oldCameraPosition[0];
          const oldY = undoableCameraChange.oldCameraPosition[1];
          const oldZ = undoableCameraChange.oldCameraPosition[2];
          orbitControlsRef.current?.object.position.set(oldX, oldY, oldZ);
          orbitControlsRef.current?.update();
          setCommonStore((state) => {
            state.cameraPosition = [oldX, oldY, oldZ];
          });
        },
        redo: () => {
          const newX = undoableCameraChange.newCameraPosition[0];
          const newY = undoableCameraChange.newCameraPosition[1];
          const newZ = undoableCameraChange.newCameraPosition[2];
          orbitControlsRef.current?.object.position.set(newX, newY, newZ);
          orbitControlsRef.current?.update();
          setCommonStore((state) => {
            state.cameraPosition = [newX, newY, newZ];
          });
        },
      } as UndoableCameraChange;
      addUndoable(undoableCameraChange);
      orbitControlsRef.current.object.position.set(x, y, z);
      orbitControlsRef.current.update();
      setCommonStore((state) => {
        state.cameraPosition = [x, y, z];
      });
    }
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

      <MainMenu viewOnly={viewOnly} resetView={resetView} zoomView={zoomView} />
      <DropdownContextMenu>
        {/* must specify the height here for the floating window to have correct boundary check*/}
        <div style={{ height: 'calc(100vh - 72px)' }}>
          {/* @ts-ignore */}
          <SplitPane
            split={'vertical'}
            onChange={throttle((size) => {
              setCommonStore((state) => {
                state.chamberViewerPercentWidth = Math.round(100 - (size / window.innerWidth) * 100);
              });
            }, 5)}
            // must specify the height again for the split pane to resize correctly with the window
            style={{ height: 'calc(100vh - 72px)', display: 'flex' }}
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
              <ReactionChamber moleculeData={targetProtein} />
            </Suspense>
          </SplitPane>
          <KeyboardListener setNavigationView={setNavigationView} resetView={resetView} zoomView={zoomView} />
        </div>
      </DropdownContextMenu>
      <CloudManager viewOnly={viewOnly} />
      {showAccountSettingsPanel && <AccountSettingsPanel />}
      {!viewOnly && <AcceptCookie />}
    </div>
  );
};

export default React.memo(App);
