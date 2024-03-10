/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks';
import { Checkbox, ColorPicker, Radio, RadioChangeEvent, Space } from 'antd';
import { UndoableChange } from '../../undo/UndoableChange';
import { LabelMark, MenuItem } from '../menuItem';
import { UndoableCheck } from '../../undo/UndoableCheck';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { screenshot, showError } from '../../helpers';
import {
  CHAMBER_COLORING_LABELS,
  CHAMBER_STYLE_LABELS,
  MATERIAL_LABELS,
  MolecularViewerColoring,
  MolecularViewerMaterial,
  MolecularViewerStyle,
} from '../../view/displayOptions';
import { SpaceshipDisplayMode } from '../../constants.ts';

export const CutMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore.getState().loggable;
  const pickedMoleculeIndex = usePrimitiveStore.getState().pickedMoleculeIndex;

  const { t } = useTranslation();
  const lang = useLanguage();

  const cutSelectedMolecule = () => {
    if (pickedMoleculeIndex === -1) return;
    usePrimitiveStore.getState().set((state) => {
      state.copiedMoleculeIndex = pickedMoleculeIndex;
    });
    setCommonStore((state) => {
      state.projectState.testMolecules.splice(pickedMoleculeIndex, 1);
      if (loggable) {
        state.actionInfo = {
          name: 'Cut Selected Molecule',
          timestamp: new Date().getTime(),
        };
      }
    });
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={true} onClick={cutSelectedMolecule}>
      {t('word.Cut', lang)}
    </MenuItem>
  );
};

export const CopyMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore.getState().loggable;
  const { t } = useTranslation();
  const lang = useLanguage();

  const copySelectedMolecule = () => {
    usePrimitiveStore.getState().set((state) => {
      state.copiedMoleculeIndex = state.pickedMoleculeIndex;
    });
    if (loggable) {
      setCommonStore((state) => {
        state.actionInfo = {
          name: 'Copy Selected Molecule',
          timestamp: new Date().getTime(),
        };
      });
    }
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={true} onClick={copySelectedMolecule}>
      {t('word.Copy', lang)}
    </MenuItem>
  );
};

export const PasteMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore.getState().loggable;
  const { t } = useTranslation();
  const lang = useLanguage();

  const pasteSelectedMolecule = () => {
    if (loggable) {
      setCommonStore((state) => {
        state.actionInfo = {
          name: 'Paste Selected Molecule',
          timestamp: new Date().getTime(),
        };
      });
    }
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={true} onClick={pasteSelectedMolecule}>
      {t('word.Paste', lang)}
    </MenuItem>
  );
};

export const AutoRotateCheckBox = ({ isMac }: { isMac?: boolean }) => {
  const autoRotate = usePrimitiveStore(Selector.autoRotate);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setAutoRotate = (checked: boolean) => {
    usePrimitiveStore.getState().set((state) => {
      state.autoRotate = checked;
      state.changed = true;
    });
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        checked={autoRotate}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Auto Rotate',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              setAutoRotate(!undoableCheck.checked);
            },
            redo: () => {
              setAutoRotate(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          setAutoRotate(checked);
        }}
      >
        {t('menu.view.AutoRotate', lang)}
        {isMac !== undefined && <LabelMark>({isMac ? '⌘' : 'Ctrl'}+M)</LabelMark>}
      </Checkbox>
    </MenuItem>
  );
};

export const Screenshot = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore.getState().loggable;
  const { t } = useTranslation();
  const lang = useLanguage();

  const takeScreenshot = () => {
    screenshot('reaction-chamber')
      .then(() => {
        if (loggable) {
          setCommonStore((state) => {
            state.actionInfo = {
              name: 'Take Screenshot of Reaction Chamber',
              timestamp: new Date().getTime(),
            };
          });
        }
      })
      .catch((reason) => {
        showError(reason);
      });
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={true} onClick={takeScreenshot}>
      {t('molecularViewer.TakeScreenshot', lang)}
    </MenuItem>
  );
};

export const AxesCheckBox = () => {
  const axes = useStore(Selector.chamberViewerAxes);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setAxes = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerAxes = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        checked={axes}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Axes',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              setAxes(!undoableCheck.checked);
            },
            redo: () => {
              setAxes(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          setAxes(checked);
        }}
      >
        {t('molecularViewer.Axes', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const ContainerCheckBox = () => {
  const visible = useStore(Selector.molecularContainerVisible);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setVisible = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.molecularContainerVisible = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        checked={visible}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Container',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              setVisible(!undoableCheck.checked);
            },
            redo: () => {
              setVisible(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          setVisible(checked);
        }}
      >
        {t('molecularViewer.Container', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const FogCheckBox = () => {
  const foggy = useStore(Selector.chamberViewerFoggy);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setFoggy = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerFoggy = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        checked={foggy}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Fog',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              setFoggy(!undoableCheck.checked);
            },
            redo: () => {
              setFoggy(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          setFoggy(checked);
        }}
      >
        {t('molecularViewer.Fog', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const BackgroundColor = () => {
  const color = useStore(Selector.chamberViewerBackground);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setColor = (color: string) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerBackground = color;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={true}>
      <ColorPicker
        trigger={'hover'}
        value={color}
        onChange={(value, hex) => {
          const selectedColor = hex;
          const undoableChange = {
            name: 'Change Background Color',
            timestamp: Date.now(),
            oldValue: color,
            newValue: selectedColor,
            undo: () => {
              setColor(undoableChange.oldValue as string);
            },
            redo: () => {
              setColor(undoableChange.newValue as string);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setColor(selectedColor);
        }}
      >
        {t('molecularViewer.BackgroundColor', lang)}
      </ColorPicker>
    </MenuItem>
  );
};

export const StyleRadioGroup = () => {
  const molecularViewerStyle = useStore(Selector.chamberViewerStyle);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setStyle = (style: MolecularViewerStyle) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerStyle = style;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Radio.Group
        value={molecularViewerStyle}
        onChange={(e: RadioChangeEvent) => {
          const oldValue = molecularViewerStyle;
          const newValue = e.target.value;
          const undoableChange = {
            name: 'Select Molecular Viewer Style',
            timestamp: Date.now(),
            oldValue: oldValue,
            newValue: newValue,
            undo: () => {
              setStyle(undoableChange.oldValue as MolecularViewerStyle);
            },
            redo: () => {
              setStyle(undoableChange.newValue as MolecularViewerStyle);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setStyle(newValue);
        }}
      >
        <Space direction="vertical">
          {CHAMBER_STYLE_LABELS.map((radio, idx) => (
            <Radio key={`${idx}-${radio.value}`} value={radio.value}>
              {t(radio.label, lang)}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};

export const MaterialRadioGroup = () => {
  const molecularViewerMaterial = useStore(Selector.chamberViewerMaterial);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setMaterial = (material: MolecularViewerMaterial) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerMaterial = material;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Radio.Group
        value={molecularViewerMaterial}
        onChange={(e: RadioChangeEvent) => {
          const oldValue = molecularViewerMaterial;
          const newValue = e.target.value;
          const undoableChange = {
            name: 'Select Molecular Viewer Material',
            timestamp: Date.now(),
            oldValue: oldValue,
            newValue: newValue,
            undo: () => {
              setMaterial(undoableChange.oldValue as MolecularViewerMaterial);
            },
            redo: () => {
              setMaterial(undoableChange.newValue as MolecularViewerMaterial);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setMaterial(newValue);
        }}
      >
        <Space direction="vertical">
          {MATERIAL_LABELS.map((radio, idx) => (
            <Radio key={`${idx}-${radio.value}`} value={radio.value}>
              {t(radio.label, lang)}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};

export const ColoringRadioGroup = () => {
  const molecularViewerColoring = useStore(Selector.chamberViewerColoring);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setColoring = (coloring: MolecularViewerColoring) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerColoring = coloring;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Radio.Group
        value={molecularViewerColoring}
        onChange={(e: RadioChangeEvent) => {
          const oldValue = molecularViewerColoring;
          const newValue = e.target.value;
          const undoableChange = {
            name: 'Select Molecular Viewer Coloring',
            timestamp: Date.now(),
            oldValue: oldValue,
            newValue: newValue,
            undo: () => {
              setColoring(undoableChange.oldValue as MolecularViewerColoring);
            },
            redo: () => {
              setColoring(undoableChange.newValue as MolecularViewerColoring);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setColoring(newValue);
        }}
      >
        <Space direction="vertical">
          {CHAMBER_COLORING_LABELS.map((radio, idx) => (
            <Radio key={`${idx}-${radio.value}`} value={radio.value}>
              {t(radio.label, lang)}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};

export const SpaceshipDisplayModeRadioGroup = () => {
  const mode = useStore(Selector.spaceshipDisplayMode) ?? SpaceshipDisplayMode.NONE;
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setMode = (mode: SpaceshipDisplayMode) => {
    useStore.getState().set((state) => {
      state.projectState.spaceshipDisplayMode = mode;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Radio.Group
        value={mode}
        onChange={(e: RadioChangeEvent) => {
          const oldValue = mode;
          const newValue = e.target.value;
          const undoableChange = {
            name: 'Select Spaceship Mode',
            timestamp: Date.now(),
            oldValue: oldValue,
            newValue: newValue,
            undo: () => {
              setMode(undoableChange.oldValue as SpaceshipDisplayMode);
            },
            redo: () => {
              setMode(undoableChange.newValue as SpaceshipDisplayMode);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setMode(newValue);
        }}
      >
        <Space direction="vertical">
          <Radio key={SpaceshipDisplayMode.NONE} value={SpaceshipDisplayMode.NONE}>
            {t('word.None', lang)}
          </Radio>
          <Radio key={SpaceshipDisplayMode.OUTSIDE_VIEW} value={SpaceshipDisplayMode.OUTSIDE_VIEW}>
            {t('spaceship.OutsideView', lang)}
          </Radio>
          <Radio key={SpaceshipDisplayMode.INSIDE_VIEW} value={SpaceshipDisplayMode.INSIDE_VIEW}>
            {t('spaceship.InsideView', lang)}
          </Radio>
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};
