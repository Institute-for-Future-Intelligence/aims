/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { UndoableCheck } from './undo/UndoableCheck';
import { setMessage } from './helpers';
import i18n from './i18n/i18n';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { FlightControl, PickMode, ProjectType, SpaceshipDisplayMode, UNDO_SHOW_INFO_DURATION } from './constants';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { askToCreateProject, askToOpenProject, saveProject, saveProjectAs } from './components/mainMenu/projectMenu';
import { resetView, zoomView } from './components/mainMenu/viewMenu';
import { startFlying, stopFlying } from './fly.ts';
import { useRefStore } from './stores/commonRef.ts';
import { Molecule } from './models/Molecule.ts';
import { App, message } from 'antd';
import { UndoableDeleteMoleculeInChamber } from './undo/UndoableDelete.ts';

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
  'alt',
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
  const logAction = useStore(Selector.logAction);
  const language = useStore(Selector.language);
  const undoManager = useStore(Selector.undoManager);
  const addUndoable = useStore(Selector.addUndoable);
  const projectType = useStore(Selector.projectType);
  const selectedPlane = usePrimitiveStore(Selector.selectedPlane);
  const xyPlaneVisible = useStore(Selector.xyPlaneVisible);
  const yzPlaneVisible = useStore(Selector.yzPlaneVisible);
  const xzPlaneVisible = useStore(Selector.xzPlaneVisible);
  const updateViewer = usePrimitiveStore(Selector.updateViewer);
  const testMolecules = useStore(Selector.testMolecules);
  const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const copiedMoleculeIndex = usePrimitiveStore(Selector.copiedMoleculeIndex);
  const cutMolecule = usePrimitiveStore(Selector.cutMolecule);
  const clickPointRef = useRefStore.getState().clickPointRef;
  const moleculesRef = useRefStore.getState().moleculesRef;
  const warnIfTooManyAtoms = useRefStore.getState().warnIfTooManyAtoms;

  const { modal } = App.useApp();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const toggleNavigationView = () => {
    const undoableCheck = {
      name: 'Set Navigation View',
      timestamp: Date.now(),
      checked: !useStore.getState().projectState.navigationView,
      undo: () => {
        setNavigationView(!undoableCheck.checked);
      },
      redo: () => {
        setNavigationView(undoableCheck.checked);
      },
    } as UndoableCheck;
    addUndoable(undoableCheck);
    setNavigationView(!useStore.getState().projectState.navigationView);
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

  const onDelete = () => {
    if (pickedMoleculeIndex !== -1) {
      const undoable = {
        name: 'Delete Selected Molecule',
        timestamp: Date.now(),
        index: pickedMoleculeIndex,
        molecule: Molecule.clone(testMolecules[pickedMoleculeIndex]),
        undo: () => {
          usePrimitiveStore.getState().set((state) => {
            state.pickedMoleculeIndex = undoable.index;
          });
          setCommonStore((state) => {
            state.projectState.testMolecules.splice(pickedMoleculeIndex, 0, undoable.molecule);
          });
        },
        redo: () => {
          deleteSelectedMolecule(true);
        },
      } as UndoableDeleteMoleculeInChamber;
      addUndoable(undoable);
      deleteSelectedMolecule(false);
    }
  };

  const deleteSelectedMolecule = (redoFlag: boolean) => {
    if (pickedMoleculeIndex !== -1) {
      usePrimitiveStore.getState().set((state) => {
        state.pickedMoleculeIndex = -1;
        state.changed = true;
      });
      setCommonStore((state) => {
        state.projectState.testMolecules.splice(pickedMoleculeIndex, 1);
        if (!redoFlag && state.loggable) state.logAction('Delete Selected Molecule');
      });
    }
  };

  const onCut = () => {
    if (pickedMoleculeIndex !== -1) {
      usePrimitiveStore.getState().set((state) => {
        state.cutMolecule = Molecule.clone(testMolecules[pickedMoleculeIndex]);
        state.pickedMoleculeIndex = -1;
      });
      setCommonStore((state) => {
        state.projectState.testMolecules.splice(pickedMoleculeIndex, 1);
        if (state.loggable) state.logAction('Cut Selected Molecule');
      });
    }
  };

  const onCopy = () => {
    if (pickedMoleculeIndex !== -1) {
      usePrimitiveStore.getState().set((state) => {
        state.copiedMoleculeIndex = state.pickedMoleculeIndex;
      });
      if (loggable) logAction('Copy Selected Molecule');
    }
  };

  const onPaste = () => {
    const p = clickPointRef?.current;
    if (!p) return;
    if (copiedMoleculeIndex !== -1) {
      setCommonStore((state) => {
        const m = Molecule.clone(testMolecules[copiedMoleculeIndex]);
        m.setCenter(p);
        state.projectState.testMolecules.push(m);
        if (state.loggable) state.logAction('Paste Copied Molecule');
        warnIfTooManyAtoms(m.atoms.length);
      });
    } else if (cutMolecule) {
      setCommonStore((state) => {
        const m = Molecule.clone(cutMolecule);
        m.setCenter(p);
        state.projectState.testMolecules.push(m);
        if (state.loggable) state.logAction('Paste Cut Molecule');
        warnIfTooManyAtoms(m.atoms.length);
      });
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
        break;
    }
    updateViewer();
    if (loggable) logAction('Move Selected Molecule');
  };

  const showThrustFlame = (show: boolean) => {
    usePrimitiveStore.getState().set((state) => {
      state.showThrustFlame = show;
    });
  };

  const handleKeyDown = (key: string) => {
    const ship = useStore.getState().projectState.spaceshipDisplayMode === SpaceshipDisplayMode.OUTSIDE_VIEW;
    const navMode = useStore.getState().projectState.navigationView;
    switch (key) {
      case 'up': {
        if (navMode) {
          break;
        }
        if (selectedPlane >= 0 && pickedMoleculeIndex === -1) {
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
      }
      case 'down': {
        if (navMode) {
          break;
        }
        if (selectedPlane >= 0 && pickedMoleculeIndex === -1) {
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
      }
      case 'q':
        if (navMode) {
          break;
        }
        startFlying(ship ? FlightControl.YawLeft : FlightControl.RotateAroundZClockwise);
        break;
      case 'e':
        if (navMode) {
          break;
        }
        startFlying(ship ? FlightControl.YawRight : FlightControl.RotateAroundZCounterclockwise);
        break;
      case 'a':
        if (navMode) {
          showThrustFlame(true);
          break;
        }
        startFlying(ship ? FlightControl.RollLeft : FlightControl.RotateAroundXCounterclockwise);
        break;
      case 'd':
        if (navMode) {
          showThrustFlame(true);
          break;
        }
        startFlying(ship ? FlightControl.RollRight : FlightControl.RotateAroundXClockwise);
        break;
      case 'w':
        if (navMode) {
          showThrustFlame(true);
          break;
        }
        startFlying(ship ? FlightControl.PitchDown : FlightControl.RotateAroundYClockwise);
        break;
      case 's':
        if (navMode) {
          showThrustFlame(true);
          break;
        }
        startFlying(ship ? FlightControl.PitchUp : FlightControl.RotateAroundYCounterclockwise);
        break;
      case 'x':
        if (navMode) {
          showThrustFlame(true);
          break;
        }
        if (projectType === ProjectType.MOLECULAR_MODELING) {
          onTranslation('x', 1);
        } else {
          startFlying(FlightControl.TranslateInPositiveX);
        }
        break;
      case 'shift+x':
        if (navMode) {
          showThrustFlame(true);
          break;
        }
        if (projectType === ProjectType.MOLECULAR_MODELING) {
          onTranslation('x', -1);
        } else {
          startFlying(FlightControl.TranslateInNegativeX);
        }
        break;
      case 'y':
        if (navMode) {
          showThrustFlame(true);
          break;
        }
        if (projectType === ProjectType.MOLECULAR_MODELING) {
          onTranslation('y', 1);
        } else {
          startFlying(FlightControl.TranslateInPositiveY);
        }
        break;
      case 'shift+y':
        if (navMode) {
          showThrustFlame(true);
          break;
        }
        if (projectType === ProjectType.MOLECULAR_MODELING) {
          onTranslation('y', -1);
        } else {
          startFlying(FlightControl.TranslateInNegativeY);
        }
        break;
      case 'z':
        if (navMode) {
          showThrustFlame(true);
          break;
        }
        if (projectType === ProjectType.MOLECULAR_MODELING) {
          onTranslation('z', 1);
        } else {
          startFlying(FlightControl.TranslateInPositiveZ);
        }
        break;
      case 'shift+z':
        if (navMode) {
          showThrustFlame(true);
          break;
        }
        if (projectType === ProjectType.MOLECULAR_MODELING) {
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
        onCut();
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
        askToCreateProject(modal);
        break;
      case 'ctrl+o':
      case 'meta+o': // for Mac
        askToOpenProject(modal);
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
        onDelete();
        break;
      }
      case 'ctrl+z':
      case 'meta+z': // for Mac
        if (undoManager.hasUndo()) {
          const commandName = undoManager.undo();
          if (commandName) {
            message.destroy();
            setMessage('info', i18n.t('menu.edit.Undo', lang) + ': ' + commandName, UNDO_SHOW_INFO_DURATION);
          }
          if (loggable) logAction('Undo');
        }
        break;
      case 'ctrl+y':
      case 'meta+y': // for Mac
        if (undoManager.hasRedo()) {
          const commandName = undoManager.redo();
          if (commandName) {
            message.destroy();
            setMessage('info', i18n.t('menu.edit.Redo', lang) + ': ' + commandName, UNDO_SHOW_INFO_DURATION);
          }
          if (loggable) logAction('Redo');
        }
        break;
      case 'alt': {
        usePrimitiveStore.getState().set((state) => {
          state.pickMode = PickMode.ATOM;
        });
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
        showThrustFlame(false);
        stopFlying();
        break;
      case 'alt': {
        usePrimitiveStore.getState().set((state) => {
          state.pickMode = PickMode.MOLECULE;
        });
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
});

export default KeyboardListener;
