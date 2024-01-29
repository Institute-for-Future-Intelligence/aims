/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common.ts';
import * as Selector from '../../stores/selector';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks.ts';
import { MenuItem } from '../menuItem.tsx';
import { ColorPicker, Radio, RadioChangeEvent, Space } from 'antd';
import { UndoableChange } from '../../undo/UndoableChange.ts';

export const ResetOrientation = () => {
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const reset = () => {
    useStore.getState().set((state) => {
      state.projectState.spaceshipRoll = 0;
      state.projectState.spaceshipPitch = 0;
      state.projectState.spaceshipYaw = 0;
      state.projectState.spaceshipX = 0;
      state.projectState.spaceshipY = 0;
      state.projectState.spaceshipZ = 0;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false} onClick={reset}>
      {t('spaceship.ResetOrientation', lang)}
    </MenuItem>
  );
};

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
