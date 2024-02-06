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
import {
  FlightControl,
  SpaceshipDisplayMode,
  UNDO_SHOW_INFO_DURATION,
  UNIT_VECTOR_NEG_X,
  UNIT_VECTOR_NEG_Y,
  UNIT_VECTOR_NEG_Z,
  UNIT_VECTOR_POS_X,
  UNIT_VECTOR_POS_Y,
  UNIT_VECTOR_POS_Z,
} from './constants';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { askToCreateProject, askToOpenProject, saveProject, saveProjectAs } from './components/mainMenu/projectMenu';
import { resetView, zoomView } from './components/mainMenu/viewMenu';
import { useRefStore } from './stores/commonRef';
import { invalidate } from '@react-three/fiber';
import { Euler, Quaternion } from 'three';
import { collide } from './models/physics.ts';

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

let flyTimeout = -1;

export const startFlying = (control: FlightControl) => {
  if (flyTimeout === -1) {
    loop(control);
  }
};

export const stopFlying = () => {
  clearTimeout(flyTimeout);
  flyTimeout = -1;
};

const saveEuler = (rotation: number[], euler: Euler) => {
  rotation[0] = euler.x;
  rotation[1] = euler.y;
  rotation[2] = euler.z;
};

const loop = (control: FlightControl) => {
  const rotationStep = useStore.getState().projectState.rotationStep;
  const translationStep = useStore.getState().projectState.translationStep;
  if (useStore.getState().projectState.spaceshipDisplayMode === SpaceshipDisplayMode.OUTSIDE_VIEW) {
    useStore.getState().set((state) => {
      if (state.projectState.spaceshipRoll === undefined) state.projectState.spaceshipRoll = 0;
      if (state.projectState.spaceshipPitch === undefined) state.projectState.spaceshipPitch = 0;
      if (state.projectState.spaceshipYaw === undefined) state.projectState.spaceshipYaw = 0;
      if (state.projectState.spaceshipZ === undefined) state.projectState.spaceshipZ = 0;
      switch (control) {
        case FlightControl.RollLeft:
          state.projectState.spaceshipRoll += rotationStep;
          break;
        case FlightControl.RollRight:
          state.projectState.spaceshipRoll -= rotationStep;
          break;
        case FlightControl.PitchUp:
          state.projectState.spaceshipPitch += rotationStep;
          break;
        case FlightControl.PitchDown:
          state.projectState.spaceshipPitch -= rotationStep;
          break;
        case FlightControl.YawLeft:
          state.projectState.spaceshipYaw += rotationStep;
          break;
        case FlightControl.YawRight:
          state.projectState.spaceshipYaw -= rotationStep;
          break;
        case FlightControl.MoveForward:
          state.projectState.spaceshipZ -= translationStep;
          break;
        case FlightControl.MoveBackward:
          state.projectState.spaceshipZ += translationStep;
          break;
      }
    });
  } else {
    useStore.getState().set((state) => {
      if (state.projectState.testMoleculeRotation === undefined) state.projectState.testMoleculeRotation = [0, 0, 0];
      if (state.projectState.testMoleculeTranslation === undefined)
        state.projectState.testMoleculeTranslation = [0, 0, 0];
      let collided = false;
      if (state.targetProteinData && state.testMoleculeData) {
        const translation = state.projectState.testMoleculeTranslation;
        collided = collide(state.targetProteinData.atoms, state.testMoleculeData, state.chemicalElements, translation);
      }
      console.log(collided);
      switch (control) {
        // translation
        case FlightControl.TranslateInPositiveX: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.x += translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[0] += translationStep;
          break;
        }
        case FlightControl.TranslateInNegativeX: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.x -= translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[0] -= translationStep;
          break;
        }
        case FlightControl.TranslateInPositiveY: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.y += translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[1] += translationStep;
          break;
        }
        case FlightControl.TranslateInNegativeY: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.y -= translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[1] -= translationStep;
          break;
        }
        case FlightControl.TranslateInPositiveZ: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.z += translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[2] += translationStep;
          break;
        }
        case FlightControl.TranslateInNegativeZ: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.z -= translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[2] -= translationStep;
          break;
        }
        // rotation
        case FlightControl.RotateAroundXClockwise: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_POS_X, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
        case FlightControl.RotateAroundXCounterclockwise: {
          state.projectState.testMoleculeRotation[0] -= rotationStep;
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_NEG_X, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
        case FlightControl.RotateAroundYClockwise: {
          state.projectState.testMoleculeRotation[1] += rotationStep;
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_POS_Y, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
        case FlightControl.RotateAroundYCounterclockwise: {
          state.projectState.testMoleculeRotation[1] -= rotationStep;
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_NEG_Y, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
        case FlightControl.RotateAroundZClockwise: {
          state.projectState.testMoleculeRotation[2] += rotationStep;
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_POS_Z, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
        case FlightControl.RotateAroundZCounterclockwise: {
          state.projectState.testMoleculeRotation[2] -= rotationStep;
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_NEG_Z, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
      }
    });
  }
  flyTimeout = window.setTimeout(loop, 100, control);
};

const KeyboardListener = React.memo(({ setNavigationView }: KeyboardListenerProps) => {
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

  const handleKeyDown = (key: string) => {
    const ship = useStore.getState().projectState.spaceshipDisplayMode === SpaceshipDisplayMode.OUTSIDE_VIEW;
    switch (key) {
      case 'up':
        startFlying(FlightControl.MoveForward);
        break;
      case 'down':
        startFlying(FlightControl.MoveBackward);
        break;
      case 'q':
        startFlying(ship ? FlightControl.YawLeft : FlightControl.RotateAroundZClockwise);
        break;
      case 'e':
        startFlying(ship ? FlightControl.YawRight : FlightControl.RotateAroundZCounterclockwise);
        break;
      case 'a':
        startFlying(ship ? FlightControl.RollLeft : FlightControl.RotateAroundXCounterclockwise);
        break;
      case 'd':
        startFlying(ship ? FlightControl.RollRight : FlightControl.RotateAroundXClockwise);
        break;
      case 'w':
        startFlying(ship ? FlightControl.PitchDown : FlightControl.RotateAroundYClockwise);
        break;
      case 's':
        startFlying(ship ? FlightControl.PitchUp : FlightControl.RotateAroundYCounterclockwise);
        break;
      case 'x':
        startFlying(FlightControl.TranslateInPositiveX);
        break;
      case 'shift+x':
        startFlying(FlightControl.TranslateInNegativeX);
        break;
      case 'y':
        startFlying(FlightControl.TranslateInPositiveY);
        break;
      case 'shift+y':
        startFlying(FlightControl.TranslateInNegativeY);
        break;
      case 'z':
        startFlying(FlightControl.TranslateInPositiveZ);
        break;
      case 'shift+z':
        startFlying(FlightControl.TranslateInNegativeZ);
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
