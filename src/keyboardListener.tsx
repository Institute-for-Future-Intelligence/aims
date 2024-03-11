/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { ActionInfo, MoleculeTransform } from './types';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { UndoableCheck } from './undo/UndoableCheck';
import { showInfo } from './helpers';
import i18n from './i18n/i18n';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { FlightControl, ProjectType, SpaceshipDisplayMode, UNDO_SHOW_INFO_DURATION } from './constants';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { askToCreateProject, askToOpenProject, saveProject, saveProjectAs } from './components/mainMenu/projectMenu';
import { resetView, zoomView } from './components/mainMenu/viewMenu';
import { startFlying, stopFlying } from './fly.ts';
import { useRefStore } from './stores/commonRef.ts';

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
  const projectType = useStore(Selector.projectType);
  const selectedPlane = usePrimitiveStore(Selector.selectedPlane);
  const xyPlaneVisible = useStore(Selector.xyPlaneVisible);
  const yzPlaneVisible = useStore(Selector.yzPlaneVisible);
  const xzPlaneVisible = useStore(Selector.xzPlaneVisible);
  const testMolecules = useStore(Selector.testMolecules);
  const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const copiedMolecule = usePrimitiveStore(Selector.copiedMolecule);
  const clickPointRef = useRefStore.getState().clickPointRef;
  const moleculesRef = useRefStore.getState().moleculesRef;

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

  const onDelete = (cut: boolean) => {
    if (pickedMoleculeIndex !== -1) {
      usePrimitiveStore.getState().set((state) => {
        if (cut) state.copiedMolecule = { ...testMolecules[pickedMoleculeIndex] };
        state.pickedMoleculeIndex = -1;
      });
      setCommonStore((state) => {
        state.projectState.testMolecules.splice(pickedMoleculeIndex, 1);
        state.projectState.testMoleculeTransforms.splice(pickedMoleculeIndex, 1);
        if (loggable) {
          state.actionInfo = {
            name: 'Delete Selected Molecule',
            timestamp: new Date().getTime(),
          };
        }
      });
    }
  };

  const onCopy = () => {
    if (pickedMoleculeIndex !== -1) {
      usePrimitiveStore.getState().set((state) => {
        state.copiedMolecule = { ...testMolecules[state.pickedMoleculeIndex] };
      });
      if (loggable) {
        setCommonStore((state) => {
          state.actionInfo = {
            name: 'Copy Selected Molecule',
            timestamp: new Date().getTime(),
          };
        });
      }
    }
  };

  const onPaste = () => {
    const p = clickPointRef?.current;
    if (p && copiedMolecule) {
      setCommonStore((state) => {
        const m = { ...copiedMolecule };
        state.projectState.testMolecules.push(m);
        state.projectState.testMoleculeTransforms.push({ x: p.x, y: p.y, z: p.z } as MoleculeTransform);
      });
      if (loggable) {
        setCommonStore((state) => {
          state.actionInfo = {
            name: 'Paste Selected Molecule',
            timestamp: new Date().getTime(),
          };
        });
      }
    }
  };

  const onTranslation = (direction: string, displacement: number) => {
    if (pickedMoleculeIndex === -1) return;
    if (!moleculesRef?.current) return;
    switch (direction) {
      case 'x':
        for (const [i, m] of moleculesRef.current.entries()) {
          if (i === pickedMoleculeIndex) {
            for (const a of m.atoms) {
              a.position.x += displacement;
            }
            break;
          }
        }
        setCommonStore((state) => {
          const m = state.projectState.testMoleculeTransforms[pickedMoleculeIndex];
          if (m) m.x += displacement;
        });
        break;
      case 'y':
        for (const [i, m] of moleculesRef.current.entries()) {
          if (i === pickedMoleculeIndex) {
            for (const a of m.atoms) {
              a.position.y += displacement;
            }
            break;
          }
        }
        setCommonStore((state) => {
          const m = state.projectState.testMoleculeTransforms[pickedMoleculeIndex];
          if (m) m.y += displacement;
        });
        break;
      case 'z':
        for (const [i, m] of moleculesRef.current.entries()) {
          if (i === pickedMoleculeIndex) {
            for (const a of m.atoms) {
              a.position.z += displacement;
            }
            break;
          }
        }
        setCommonStore((state) => {
          const m = state.projectState.testMoleculeTransforms[pickedMoleculeIndex];
          if (m) m.z += displacement;
        });
        break;
    }
    usePrimitiveStore.getState().set((state) => {
      state.updateViewerFlag = !state.updateViewerFlag;
    });
    if (loggable) {
      setCommonStore((state) => {
        state.actionInfo = {
          name: 'Move Selected Molecule',
          timestamp: new Date().getTime(),
        };
      });
    }
  };

  const handleKeyDown = (key: string) => {
    const ship = useStore.getState().projectState.spaceshipDisplayMode === SpaceshipDisplayMode.OUTSIDE_VIEW;
    switch (key) {
      case 'up':
        if (selectedPlane >= 0) {
          setCommonStore((state) => {
            switch (selectedPlane) {
              case 0:
                if (xyPlaneVisible) state.projectState.xyPlanePosition += 0.1;
                break;
              case 1:
                if (yzPlaneVisible) state.projectState.yzPlanePosition += 0.1;
                break;
              case 2:
                if (xzPlaneVisible) state.projectState.xzPlanePosition += 0.1;
                break;
            }
          });
        } else {
          startFlying(FlightControl.MoveForward);
        }
        break;
      case 'down':
        if (selectedPlane >= 0) {
          setCommonStore((state) => {
            switch (selectedPlane) {
              case 0:
                if (xyPlaneVisible) state.projectState.xyPlanePosition -= 0.1;
                break;
              case 1:
                if (yzPlaneVisible) state.projectState.yzPlanePosition -= 0.1;
                break;
              case 2:
                if (xzPlaneVisible) state.projectState.xzPlanePosition -= 0.1;
                break;
            }
          });
        } else {
          startFlying(FlightControl.MoveBackward);
        }
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
        if (projectType === ProjectType.QSAR_MODELING) {
          onTranslation('x', 1);
        } else {
          startFlying(FlightControl.TranslateInPositiveX);
        }
        break;
      case 'shift+x':
        if (projectType === ProjectType.QSAR_MODELING) {
          onTranslation('x', -1);
        } else {
          startFlying(FlightControl.TranslateInNegativeX);
        }
        break;
      case 'y':
        if (projectType === ProjectType.QSAR_MODELING) {
          onTranslation('y', 1);
        } else {
          startFlying(FlightControl.TranslateInPositiveY);
        }
        break;
      case 'shift+y':
        if (projectType === ProjectType.QSAR_MODELING) {
          onTranslation('y', -1);
        } else {
          startFlying(FlightControl.TranslateInNegativeY);
        }
        break;
      case 'z':
        if (projectType === ProjectType.QSAR_MODELING) {
          onTranslation('z', 1);
        } else {
          startFlying(FlightControl.TranslateInPositiveZ);
        }
        break;
      case 'shift+z':
        if (projectType === ProjectType.QSAR_MODELING) {
          onTranslation('z', -1);
        } else {
          startFlying(FlightControl.TranslateInNegativeZ);
        }
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
        onCopy();
        break;
      case 'ctrl+x':
      case 'meta+x': // for Mac
        onDelete(true);
        break;
      case 'ctrl+v':
      case 'meta+v': // for Mac
        onPaste();
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
        onDelete(false);
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
