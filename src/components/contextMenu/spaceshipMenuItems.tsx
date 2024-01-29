/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common.ts';
import * as Selector from '../../stores/selector';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks.ts';
import { MenuItem } from '../menuItem.tsx';
import { Radio, RadioChangeEvent, Space } from 'antd';
import { UndoableChange } from '../../undo/UndoableChange.ts';

export const SizeRadioGroup = () => {
  const size = useStore(Selector.spaceshipSize) ?? 1;
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setSize = (size: number) => {
    useStore.getState().set((state) => {
      state.projectState.spaceshipSize = size;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Radio.Group
        value={size}
        onChange={(e: RadioChangeEvent) => {
          const oldValue = size;
          const newValue = e.target.value;
          const undoableChange = {
            name: 'Select Spaceship Size',
            timestamp: Date.now(),
            oldValue: oldValue,
            newValue: newValue,
            undo: () => {
              setSize(undoableChange.oldValue as number);
            },
            redo: () => {
              setSize(undoableChange.newValue as number);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setSize(newValue);
        }}
      >
        <Space direction="vertical">
          <Radio key={1} value={1}>
            {t('word.Small', lang)}
          </Radio>
          <Radio key={2} value={2}>
            {t('word.Large', lang)}
          </Radio>
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};
