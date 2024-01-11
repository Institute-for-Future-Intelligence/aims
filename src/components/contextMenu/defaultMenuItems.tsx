/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks';
import { MolecularViewerStyle } from '../../types';
import { Checkbox, ColorPicker, InputNumber, RadioChangeEvent } from 'antd';
import { UndoableChange } from '../../undo/UndoableChange';
import { MenuItem } from '../menuItem';
import { Radio, Space } from 'antd';
import { UndoableCheck } from '../../undo/UndoableCheck';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useTranslation } from 'react-i18next';
import { STYLE_LABELS } from '../../scientificConstants';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { screenshot, showError } from '../../helpers';

export const AutoRotateCheckBox = () => {
  const autoRotate = usePrimitiveStore(Selector.autoRotate);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setAutoRotate = (checked: boolean) => {
    usePrimitiveStore.getState().set((state) => {
      state.autoRotate = checked;
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
  const { t } = useTranslation();
  const lang = useLanguage();

  const setAxes = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.chamberViewerAxes = checked;
    });
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

export const BackgroundColor = () => {
  const color = useStore(Selector.chamberViewerBackground);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setColor = (color: string) => {
    useStore.getState().set((state) => {
      state.chamberViewerBackground = color;
    });
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
  const { t } = useTranslation();
  const lang = useLanguage();

  const setStyle = (style: MolecularViewerStyle) => {
    useStore.getState().set((state) => {
      state.chamberViewerStyle = style;
    });
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
          {STYLE_LABELS.map((radio, idx) => (
            <Radio key={`${idx}-${radio.value}`} value={radio.value}>
              {t(radio.label, lang)}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};

export const ShininessInput = () => {
  const shininess = useStore(Selector.chamberViewerShininess) ?? 1000;
  const { t } = useTranslation();
  const lang = useLanguage();

  const setShininess = (value: number) => {
    useStore.getState().set((state) => {
      state.chamberViewerShininess = value;
    });
  };

  return (
    <MenuItem stayAfterClick hasPadding={true}>
      <Space style={{ paddingRight: '50px' }} title={'[0, 1000]'}>
        {t('molecularViewer.Shininess', lang) + ':'}
      </Space>
      <InputNumber
        min={0}
        max={1000}
        step={1}
        precision={0}
        value={shininess}
        onChange={(value: number | null) => {
          if (value === null) return;
          const oldValue = shininess;
          const newValue = value;
          const undoableChange = {
            name: 'Set Shininess',
            timestamp: Date.now(),
            oldValue: oldValue,
            newValue: newValue,
            undo: () => {
              setShininess(undoableChange.oldValue as number);
            },
            redo: () => {
              setShininess(undoableChange.newValue as number);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setShininess(newValue);
        }}
      />
    </MenuItem>
  );
};
