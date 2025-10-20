/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { Checkbox } from 'antd';
import { useStore } from '../../stores/common';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { UndoableCheck } from '../../undo/UndoableCheck';
import { MainMenuItem, MainSubMenu } from '../menuItem.tsx';
import i18n, { t } from 'i18next';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import { useLanguage } from '../../hooks.ts';
import * as Selector from '../../stores/selector';

const AccessoriesMenu = () => {
  const lang = useLanguage();
  const setCommonStore = useStore.getState().set;
  const showInstructionPanel = useStore(Selector.showInstructionPanel);
  const showPeriodicTable = usePrimitiveStore(Selector.showPeriodicTable);
  const setChanged = usePrimitiveStore.getState().setChanged;

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

  return (
    <MainSubMenu label={t('menu.accessoriesSubMenu', lang)}>
      <MainMenuItem stayAfterClick>
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
      </MainMenuItem>

      <MainMenuItem stayAfterClick>
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
      </MainMenuItem>
    </MainSubMenu>
  );
};

export default AccessoriesMenu;
