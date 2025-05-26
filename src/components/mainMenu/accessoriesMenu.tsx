/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { Checkbox, MenuProps } from 'antd';
import { useStore } from '../../stores/common';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { UndoableCheck } from '../../undo/UndoableCheck';
import { MenuItem } from '../menuItem.tsx';
import React from 'react';
import i18n from 'i18next';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';

export const createAccessoriesMenu = () => {
  const setCommonStore = useStore.getState().set;
  const showInstructionPanel = useStore.getState().projectState.showInstructionPanel;
  const showPeriodicTable = usePrimitiveStore.getState().showPeriodicTable;
  const setChanged = usePrimitiveStore.getState().setChanged;

  const lang = { lng: useStore.getState().language };

  const toggleInstructionPanel = () => {
    setCommonStore((state) => {
      state.projectState.showInstructionPanel = !state.projectState.showInstructionPanel;
    });
    setChanged(true);
  };

  const togglePeriodicTable = () => {
    usePrimitiveStore.getState().set((state) => {
      state.showPeriodicTable = !state.showPeriodicTable;
    });
  };

  const items: MenuProps['items'] = [
    // instruction-panel-check-box
    {
      key: 'instruction-panel-check-box',
      label: (
        <MenuItem stayAfterClick={false} hasPadding={false}>
          <Checkbox
            style={{ width: '100%' }}
            checked={showInstructionPanel}
            onChange={(e: CheckboxChangeEvent) => {
              const checked = e.target.checked;
              const undoableCheck = {
                name: 'Show/Hide Instruction',
                timestamp: Date.now(),
                checked: checked,
                undo: () => {
                  toggleInstructionPanel();
                },
                redo: () => {
                  toggleInstructionPanel();
                },
              } as UndoableCheck;
              useStore.getState().addUndoable(undoableCheck);
              toggleInstructionPanel();
            }}
          >
            {i18n.t('menu.accessories.Instruction', lang)}
          </Checkbox>
        </MenuItem>
      ),
    },
    // periodic-table-check-box
    {
      key: 'periodic-table-check-box',
      label: (
        <MenuItem stayAfterClick={false} hasPadding={false}>
          <Checkbox
            style={{ width: '100%' }}
            checked={showPeriodicTable}
            onChange={(e: CheckboxChangeEvent) => {
              const checked = e.target.checked;
              const undoableCheck = {
                name: 'Show/Hide Periodic Table',
                timestamp: Date.now(),
                checked: checked,
                undo: () => {
                  togglePeriodicTable();
                },
                redo: () => {
                  togglePeriodicTable();
                },
              } as UndoableCheck;
              useStore.getState().addUndoable(undoableCheck);
              togglePeriodicTable();
            }}
          >
            {i18n.t('menu.accessories.PeriodicTable', lang)}
          </Checkbox>
        </MenuItem>
      ),
    },
  ];

  return items;
};
