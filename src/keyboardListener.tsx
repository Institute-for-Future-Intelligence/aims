/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { ActionInfo, MoveDirection } from './types';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { UndoableCheck } from './undo/UndoableCheck';
import { showInfo } from './helpers';
import i18n from './i18n/i18n';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { useRefStore } from './stores/commonRef';
import { GRID_RATIO, HOME_URL, UNDO_SHOW_INFO_DURATION } from './constants';

export interface KeyboardListenerProps {
  setNavigationView: (selected: boolean) => void;
  resetView: () => void;
  zoomView: (scale: number) => void;
}

const handleKeys = [
  'left',
  'up',
  'right',
  'down',
  'shift+left',
  'shift+up',
  'shift+right',
  'shift+down',
  'ctrl+shift+left',
  'ctrl+shift+up',
  'ctrl+shift+right',
  'ctrl+shift+down',
  'meta+shift+left',
  'meta+shift+up',
  'meta+shift+right',
  'meta+shift+down',
  'ctrl+f',
  'meta+f',
  'ctrl+o',
  'meta+o',
  'ctrl+s',
  'meta+s',
  'ctrl+c',
  'meta+c',
  'ctrl+x',
  'meta+x',
  'ctrl+v',
  'meta+v',
  'ctrl+[',
  'meta+[',
  'ctrl+]',
  'meta+]',
  'ctrl+z',
  'meta+z',
  'ctrl+y',
  'meta+y',
  'ctrl+m',
  'meta+m',
  'ctrl+u', // navigation controls
  'meta+u',
  'ctrl+b',
  'meta+b',
  'shift',
  'esc',
  'ctrl+home',
  'ctrl+alt+h',
  'ctrl+shift+o',
  'meta+shift+o',
  'ctrl+shift+s',
  'meta+shift+s',
  'delete',
  'backspace',
  'alt+backspace',
  'f2',
  'f4',
  'ctrl',
];

const KeyboardListener = ({ setNavigationView, resetView, zoomView }: KeyboardListenerProps) => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);
  const selectNone = useStore(Selector.selectNone);
  const language = useStore(Selector.language);
  const undoManager = useStore(Selector.undoManager);
  const addUndoable = useStore(Selector.addUndoable);
  const selectedObject = useStore(Selector.selectedObject);

  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const toggleNavigationView = () => {
    const undoableCheck = {
      name: 'Set Navigation View',
      timestamp: Date.now(),
      checked: !useStore.getState().navigationView,
      undo: () => {
        setNavigationView(!undoableCheck.checked);
      },
      redo: () => {
        setNavigationView(undoableCheck.checked);
      },
    } as UndoableCheck;
    addUndoable(undoableCheck);
    setNavigationView(!useStore.getState().navigationView);
    setCommonStore((state) => {
      state.autoRotate = false;
    });
  };

  const toggleAutoRotate = () => {
    const undoableCheck = {
      name: 'Auto Rotate',
      timestamp: Date.now(),
      checked: !useStore.getState().autoRotate,
      undo: () => {
        setCommonStore((state) => {
          state.autoRotate = !undoableCheck.checked;
        });
      },
      redo: () => {
        setCommonStore((state) => {
          state.autoRotate = undoableCheck.checked;
        });
      },
    } as UndoableCheck;
    addUndoable(undoableCheck);
    setCommonStore((state) => {
      state.autoRotate = !state.autoRotate;
    });
  };

  const getObjectNewPosition = (oldCx: number, oldCy: number, displacement: number, direction: MoveDirection) => {
    switch (direction) {
      case MoveDirection.Left:
        return [oldCx - displacement, oldCy];
      case MoveDirection.Right:
        return [oldCx + displacement, oldCy];
      case MoveDirection.Up:
        return [oldCx, oldCy + displacement];
      case MoveDirection.Down:
        return [oldCx, oldCy - displacement];
    }
  };

  const updateMoveInMap = (displacementMap: Map<string, number>, direction: MoveDirection) => {
    // TODO
  };

  const updateMovementForAll = (displacement: number, direction: MoveDirection) => {
    // TODO
  };

  const getOppositeDirection = (dir: MoveDirection) => {
    if (dir === MoveDirection.Left) return MoveDirection.Right;
    if (dir === MoveDirection.Right) return MoveDirection.Left;
    if (dir === MoveDirection.Up) return MoveDirection.Down;
    if (dir === MoveDirection.Down) return MoveDirection.Up;
    return dir;
  };

  const moveByKey = (direction: MoveDirection, scale: number) => {
    //TODO
  };

  const handleKeyDown = (key: string) => {
    const step = 1;
    switch (key) {
      case 'left':
        moveByKey(MoveDirection.Left, step);
        break;
      case 'shift+left':
        moveByKey(MoveDirection.Left, step / GRID_RATIO);
        break;
      case 'ctrl+shift+left':
      case 'meta+shift+left':
        moveByKey(MoveDirection.Left, step * GRID_RATIO);
        break;
      case 'right':
        moveByKey(MoveDirection.Right, step);
        break;
      case 'shift+right':
        moveByKey(MoveDirection.Right, step / GRID_RATIO);
        break;
      case 'ctrl+shift+right':
      case 'meta+shift+right':
        moveByKey(MoveDirection.Right, step * GRID_RATIO);
        break;
      case 'down':
        moveByKey(MoveDirection.Down, step);
        break;
      case 'shift+down':
        moveByKey(MoveDirection.Down, step / GRID_RATIO);
        break;
      case 'ctrl+shift+down':
      case 'meta+shift+down':
        moveByKey(MoveDirection.Down, step * GRID_RATIO);
        break;
      case 'up':
        moveByKey(MoveDirection.Up, step);
        break;
      case 'shift+up':
        moveByKey(MoveDirection.Up, step / GRID_RATIO);
        break;
      case 'ctrl+shift+up':
      case 'meta+shift+up':
        moveByKey(MoveDirection.Up, step * GRID_RATIO);
        break;
      case 'ctrl+[':
      case 'meta+[': // for Mac
        zoomView(0.9);
        break;
      case 'ctrl+]':
      case 'meta+]': // for Mac
        zoomView(1.1);
        break;
      case 'ctrl+c':
      case 'meta+c': // for Mac
        if (selectedObject) {
          // TODO
        }
        break;
      case 'ctrl+x':
      case 'meta+x': // for Mac
        if (selectedObject) {
          // TODO
        }
        break;
      case 'ctrl+v':
      case 'meta+v': // for Mac
        //TODO
        break;
      case 'ctrl+alt+h': // for Mac and Chrome OS
      case 'ctrl+home':
        // const cameraPosition = useStore.getState().cameraPosition;
        // const panCenter = useStore.getState().panCenter;
        // // if not already reset
        // if (
        //     cameraPosition[0] !== cameraPosition[1] ||
        //     cameraPosition[1] !== cameraPosition[2] ||
        //     cameraPosition[0] !== cameraPosition[2] ||
        //     panCenter[0] !== 0 ||
        //     panCenter[1] !== 0 ||
        //     panCenter[2] !== 0
        // ) {
        //   const undoableResetView = {
        //     name: 'Reset View',
        //     timestamp: Date.now(),
        //     oldCameraPosition: [...cameraPosition],
        //     oldPanCenter: [...panCenter],
        //     undo: () => {
        //       const orbitControlsRef = useRefStore.getState().orbitControlsRef;
        //       if (orbitControlsRef?.current) {
        //         orbitControlsRef.current.object.position.set(
        //             undoableResetView.oldCameraPosition[0],
        //             undoableResetView.oldCameraPosition[1],
        //             undoableResetView.oldCameraPosition[2],
        //         );
        //         orbitControlsRef.current.target.set(
        //             undoableResetView.oldPanCenter[0],
        //             undoableResetView.oldPanCenter[1],
        //             undoableResetView.oldPanCenter[2],
        //         );
        //         orbitControlsRef.current.update();
        //         setCommonStore((state) => {
        //           const v = state.viewState;
        //           v.cameraPosition = [...undoableResetView.oldCameraPosition];
        //           v.panCenter = [...undoableResetView.oldPanCenter];
        //         });
        //       }
        //     },
        //     redo: () => {
        //       resetView();
        //     },
        //   } as UndoableResetView;
        //   addUndoable(undoableResetView);
        //   resetView();
        // }
        break;
      case 'ctrl+u':
      case 'meta+u':
        toggleNavigationView();
        break;
      case 'f4':
      case 'ctrl+m':
      case 'meta+m':
        toggleAutoRotate();
        break;
      case 'ctrl+f':
      case 'meta+f': // for Mac
        setCommonStore((state) => {
          window.history.pushState({}, document.title, HOME_URL);
          if (loggable) {
            state.actionInfo = {
              name: 'Create New File',
              timestamp: new Date().getTime(),
            };
          }
        });
        break;
      case 'ctrl+s':
      case 'meta+s': // for Mac
        if (loggable) {
          setCommonStore((state) => {
            state.actionInfo = {
              name: 'Save Local File',
              timestamp: new Date().getTime(),
            };
          });
        }
        break;
      case 'ctrl+shift+o':
      case 'meta+shift+o': // for Mac
        if (loggable) {
          setCommonStore((state) => {
            state.actionInfo = {
              name: 'List Cloud Files',
              timestamp: new Date().getTime(),
            };
          });
        }
        break;
      case 'ctrl+shift+s':
      case 'meta+shift+s': // for Mac
        if (loggable) {
          setCommonStore((state) => {
            state.actionInfo = {
              name: 'Save Cloud File',
              timestamp: new Date().getTime(),
            };
          });
        }
        break;
      case 'alt+backspace':
      case 'backspace':
      case 'delete': {
        //TODO
        break;
      }
      case 'ctrl+z':
      case 'meta+z': // for Mac
        if (undoManager.hasUndo()) {
          const commandName = undoManager.undo();
          if (commandName) showInfo(i18n.t('menu.edit.Undo', lang) + ': ' + commandName, UNDO_SHOW_INFO_DURATION);
          if (loggable) {
            setCommonStore((state) => {
              state.actionInfo = {
                name: 'Undo',
                timestamp: new Date().getTime(),
              } as ActionInfo;
            });
          }
        }
        break;
      case 'ctrl+y':
      case 'meta+y': // for Mac
        if (undoManager.hasRedo()) {
          const commandName = undoManager.redo();
          if (commandName) showInfo(i18n.t('menu.edit.Redo', lang) + ': ' + commandName, UNDO_SHOW_INFO_DURATION);
          if (loggable) {
            setCommonStore((state) => {
              state.actionInfo = {
                name: 'Redo',
                timestamp: new Date().getTime(),
              } as ActionInfo;
            });
          }
        }
        break;
      case 'esc': {
        useRefStore.getState().setEnableOrbitController(true);
        selectNone();
        break;
      }
      case 'ctrl': {
        break;
      }
    }
  };

  const handleKeyUp = (key: string) => {
    switch (key) {
      case 'shift':
        break;
      case 'ctrl+o':
      case 'meta+o': // for Mac
        // this must be handled as a key-up event because it brings up a native file dialog
        // when the key is down and the corresponding key-up event would never be processed as the focus is lost
        setCommonStore((state) => {
          if (loggable) {
            state.actionInfo = {
              name: 'Open Local File',
              timestamp: new Date().getTime(),
            };
          }
        });
        break;
      case 'ctrl': {
        break;
      }
    }
  };

  useEffect(
    () => () => {
      keyNameRef.current = null;
    },
    [],
  );

  const keyNameRef = useRef<string | null>(null);

  return (
    <>
      <KeyboardEventHandler
        handleKeys={handleKeys}
        handleEventType={'keydown'}
        onKeyEvent={(key, e) => {
          e.preventDefault();
          if (keyNameRef.current === key) return;
          keyNameRef.current = key;
          handleKeyDown(key);
        }}
      />
      <KeyboardEventHandler
        handleKeys={handleKeys}
        handleEventType={'keyup'}
        onKeyEvent={(key, e) => {
          e.preventDefault();
          keyNameRef.current = null;
          handleKeyUp(key);
        }}
      />
    </>
  );
};

export default React.memo(KeyboardListener);
