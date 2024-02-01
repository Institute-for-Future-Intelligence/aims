/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { ActionInfo } from './types';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { UndoableCheck } from './undo/UndoableCheck';
import { showInfo } from './helpers';
import i18n from './i18n/i18n';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { FlightControl, SpaceshipDisplayMode, UNDO_SHOW_INFO_DURATION } from './constants';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { askToCreateProject, askToOpenProject, saveProject, saveProjectAs } from './components/mainMenu/projectMenu';
import { resetView, zoomView } from './components/mainMenu/viewMenu';

export interface KeyboardListenerProps {
  setNavigationView: (selected: boolean) => void;
}

const handleKeys = [
  'a',
  'd',
  'w',
  's',
  'q',
  'e',
  'z',
  'x',
  'y',
  'shift+z',
  'shift+x',
  'shift+y',
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
  'ctrl+shift+s',
  'meta+shift+s',
  'delete',
  'backspace',
  'alt+backspace',
  'f2',
  'f4',
  'ctrl',
];

const KeyboardListener = React.memo(({ setNavigationView }: KeyboardListenerProps) => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);
  const selectNone = useStore(Selector.selectNone);
  const language = useStore(Selector.language);
  const undoManager = useStore(Selector.undoManager);
  const addUndoable = useStore(Selector.addUndoable);
  const selectedObject = useStore(Selector.selectedObject);
  const spaceshipDisplayMode = useStore(Selector.spaceshipDisplayMode);

  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const flightControlScale = 1;

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
    usePrimitiveStore.getState().set((state) => {
      state.autoRotate = false;
    });
  };

  const toggleAutoRotate = () => {
    const undoableCheck = {
      name: 'Auto Rotate',
      timestamp: Date.now(),
      checked: !usePrimitiveStore.getState().autoRotate,
      undo: () => {
        usePrimitiveStore.getState().set((state) => {
          state.autoRotate = !undoableCheck.checked;
        });
      },
      redo: () => {
        usePrimitiveStore.getState().set((state) => {
          state.autoRotate = undoableCheck.checked;
        });
      },
    } as UndoableCheck;
    addUndoable(undoableCheck);
    usePrimitiveStore.getState().set((state) => {
      state.autoRotate = !state.autoRotate;
    });
  };

  let flyTimeout = -1;

  const startFlying = (control: FlightControl) => {
    if (flyTimeout === -1) {
      loop(control);
    }
  };

  const stopFlying = () => {
    clearTimeout(flyTimeout);
    flyTimeout = -1;
  };

  const loop = (control: FlightControl) => {
    if (spaceshipDisplayMode === SpaceshipDisplayMode.OUTSIDE_VIEW) {
      setCommonStore((state) => {
        if (state.projectState.spaceshipRoll === undefined) state.projectState.spaceshipRoll = 0;
        if (state.projectState.spaceshipPitch === undefined) state.projectState.spaceshipPitch = 0;
        if (state.projectState.spaceshipYaw === undefined) state.projectState.spaceshipYaw = 0;
        if (state.projectState.spaceshipZ === undefined) state.projectState.spaceshipZ = 0;
        switch (control) {
          case FlightControl.RollLeft:
            state.projectState.spaceshipRoll += 0.1 * flightControlScale;
            break;
          case FlightControl.RollRight:
            state.projectState.spaceshipRoll -= 0.1 * flightControlScale;
            break;
          case FlightControl.PitchUp:
            state.projectState.spaceshipPitch += 0.1 * flightControlScale;
            break;
          case FlightControl.PitchDown:
            state.projectState.spaceshipPitch -= 0.1 * flightControlScale;
            break;
          case FlightControl.YawLeft:
            state.projectState.spaceshipYaw += 0.1 * flightControlScale;
            break;
          case FlightControl.YawRight:
            state.projectState.spaceshipYaw -= 0.1 * flightControlScale;
            break;
          case FlightControl.MoveForward:
            state.projectState.spaceshipZ -= flightControlScale;
            break;
          case FlightControl.MoveBackward:
            state.projectState.spaceshipZ += flightControlScale;
            break;
        }
      });
    } else {
      setCommonStore((state) => {
        if (state.projectState.drugMoleculeRoll === undefined) state.projectState.drugMoleculeRoll = 0;
        if (state.projectState.drugMoleculePitch === undefined) state.projectState.drugMoleculePitch = 0;
        if (state.projectState.drugMoleculeYaw === undefined) state.projectState.drugMoleculeYaw = 0;
        if (state.projectState.drugMoleculeX === undefined) state.projectState.drugMoleculeX = 0;
        if (state.projectState.drugMoleculeY === undefined) state.projectState.drugMoleculeY = 0;
        if (state.projectState.drugMoleculeZ === undefined) state.projectState.drugMoleculeZ = 0;
        switch (control) {
          case FlightControl.RollLeft:
            state.projectState.drugMoleculeRoll += 0.1 * flightControlScale;
            break;
          case FlightControl.RollRight:
            state.projectState.drugMoleculeRoll -= 0.1 * flightControlScale;
            break;
          case FlightControl.PitchUp:
            state.projectState.drugMoleculePitch += flightControlScale;
            break;
          case FlightControl.PitchDown:
            state.projectState.drugMoleculePitch -= flightControlScale;
            break;
          case FlightControl.YawLeft:
            state.projectState.drugMoleculeYaw += flightControlScale;
            break;
          case FlightControl.YawRight:
            state.projectState.drugMoleculeYaw -= flightControlScale;
            break;
          case FlightControl.MoveInPositiveX:
            state.projectState.drugMoleculeX += flightControlScale;
            break;
          case FlightControl.MoveInNegativeX:
            state.projectState.drugMoleculeX -= flightControlScale;
            break;
          case FlightControl.MoveInPositiveY:
            state.projectState.drugMoleculeY += flightControlScale;
            break;
          case FlightControl.MoveInNegativeY:
            state.projectState.drugMoleculeY -= flightControlScale;
            break;
          case FlightControl.MoveInPositiveZ:
            state.projectState.drugMoleculeZ += flightControlScale;
            break;
          case FlightControl.MoveInNegativeZ:
            state.projectState.drugMoleculeZ -= flightControlScale;
            break;
        }
      });
    }
    flyTimeout = window.setTimeout(loop, 100, control);
  };

  const handleKeyDown = (key: string) => {
    switch (key) {
      case 'up':
        startFlying(FlightControl.MoveForward);
        break;
      case 'down':
        startFlying(FlightControl.MoveBackward);
        break;
      case 'q':
        startFlying(FlightControl.YawLeft);
        break;
      case 'e':
        startFlying(FlightControl.YawRight);
        break;
      case 'a':
        startFlying(FlightControl.RollLeft);
        break;
      case 'd':
        startFlying(FlightControl.RollRight);
        break;
      case 'w':
        startFlying(FlightControl.PitchDown);
        break;
      case 's':
        startFlying(FlightControl.PitchUp);
        break;
      case 'x':
        startFlying(FlightControl.MoveInPositiveX);
        break;
      case 'shift+x':
        startFlying(FlightControl.MoveInNegativeX);
        break;
      case 'y':
        startFlying(FlightControl.MoveInPositiveY);
        break;
      case 'shift+y':
        startFlying(FlightControl.MoveInNegativeY);
        break;
      case 'z':
        startFlying(FlightControl.MoveInPositiveZ);
        break;
      case 'shift+z':
        startFlying(FlightControl.MoveInNegativeZ);
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
        resetView();
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
        askToCreateProject();
        break;
      case 'ctrl+o':
      case 'meta+o': // for Mac
        askToOpenProject();
        break;
      case 'ctrl+s':
      case 'meta+s': // for Mac
        saveProject();
        break;
      case 'ctrl+shift+s':
      case 'meta+shift+s': // for Mac
        saveProjectAs();
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
        selectNone();
        break;
      }
    }
  };

  const handleKeyUp = (key: string) => {
    switch (key) {
      case 'z':
      case 'y':
      case 'x':
      case 'shift+z':
      case 'shift+y':
      case 'shift+x':
      case 'q':
      case 'e':
      case 'a':
      case 'left':
      case 'd':
      case 'right':
      case 'w':
      case 'down':
      case 's':
      case 'up':
        stopFlying();
        break;
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
});

export default KeyboardListener;
