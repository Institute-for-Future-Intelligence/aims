/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import i18n from '../../i18n/i18n';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks';
import { MolecularViewerStyle } from '../../types';
import { RadioChangeEvent } from 'antd';
import { UndoableChange } from '../../undo/UndoableChange';
import { MenuItem } from '../menuItem';
import { Radio, Space } from 'antd';

export const StyleRadioGroup = () => {
  const molecularViewerStyle = useStore(Selector.molecularViewerStyle);
  const lang = useLanguage();

  const setStyle = (style: MolecularViewerStyle) => {
    useStore.getState().set((state) => {
      state.molecularViewerStyle = style;
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

  const radioArray = [
    { value: MolecularViewerStyle.BallAndStick, label: 'molecularViewer.BallAndStick' },
    { value: MolecularViewerStyle.Wireframe, label: 'molecularViewer.Wireframe' },
    { value: MolecularViewerStyle.Stick, label: 'molecularViewer.Stick' },
    { value: MolecularViewerStyle.SpaceFilling, label: 'molecularViewer.SpaceFilling' },
  ];

  return (
    <MenuItem stayAfterClick hasPadding={false}>
      <Radio.Group value={molecularViewerStyle} onChange={onChange}>
        <Space direction="vertical">
          {radioArray.map((radio, idx) => (
            <Radio key={`${idx}-${radio.value}`} value={radio.value}>
              {i18n.t(radio.label, lang)}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};
