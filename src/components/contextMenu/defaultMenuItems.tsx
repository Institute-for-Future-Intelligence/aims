/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks';
import { Checkbox, ColorPicker, RadioChangeEvent } from 'antd';
import { UndoableChange } from '../../undo/UndoableChange';
import { LabelMark, MenuItem } from '../menuItem';
import { Radio, Space } from 'antd';
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
