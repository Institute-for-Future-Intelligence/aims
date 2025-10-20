/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common.ts';
import * as Selector from '../../stores/selector';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks.ts';
import { MainMenuItem } from '../menuItem.tsx';
import { UndoableChange } from '../../undo/UndoableChange.ts';
import { ClickEvent, MenuItem, MenuRadioGroup, RadioChangeEvent } from '@szhsin/react-menu';

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

  return <MainMenuItem onClick={reset}>{t('spaceship.ResetOrientation', lang)}</MainMenuItem>;
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

  const onClick = (e: ClickEvent) => {
    e.keepOpen = true;
  };

  return (
    <MenuRadioGroup
      value={size}
      onRadioChange={(e: RadioChangeEvent) => {
        const oldValue = size;
        const newValue = e.value;
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
      <MenuItem type="radio" key={1} value={1} onClick={onClick}>
        {t('word.Small', lang)}
      </MenuItem>
      <MenuItem type="radio" key={2} value={2} onClick={onClick}>
        {t('word.Large', lang)}
      </MenuItem>
    </MenuRadioGroup>
  );
};
