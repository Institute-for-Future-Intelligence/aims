/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks';
import { MolecularViewerStyle } from '../../types';
import { Checkbox, RadioChangeEvent } from 'antd';
import { UndoableChange } from '../../undo/UndoableChange';
import { MenuItem } from '../menuItem';
import { Radio, Space } from 'antd';
import { UndoableCheck } from '../../undo/UndoableCheck';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useTranslation } from 'react-i18next';
import { STYLE_LABELS } from '../../constants';

export const AxesCheckBox = () => {
  const axes = useStore(Selector.chamberViewerAxes);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setAxes = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.chamberViewerAxes = checked;
    });
  };

  const onChange = (e: CheckboxChangeEvent) => {
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
  };

  return (
    <MenuItem stayAfterClick hasPadding={false}>
      <Checkbox checked={axes} onChange={onChange}>
        {t('molecularViewer.Axes', lang)}
      </Checkbox>
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

  const onChange = (e: RadioChangeEvent) => {
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
  };

  return (
    <MenuItem stayAfterClick hasPadding={false}>
      <Radio.Group value={molecularViewerStyle} onChange={onChange}>
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
