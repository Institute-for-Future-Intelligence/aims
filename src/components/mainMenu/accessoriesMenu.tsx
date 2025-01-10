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

export const createAccessoriesMenu = () => {
  const setCommonStore = useStore.getState().set;
  const showInstructionPanel = useStore.getState().projectState.showInstructionPanel;

  const lang = { lng: useStore.getState().language };
  const toggleInstructionPanel = () => {
    setCommonStore((state) => {
      state.projectState.showInstructionPanel = !state.projectState.showInstructionPanel;
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
  ];

  return items;
};
