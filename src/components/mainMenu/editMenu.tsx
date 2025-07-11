/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MenuProps } from 'antd';
import i18n from '../../i18n/i18n';
import { useStore } from '../../stores/common';
import { LabelMark, MenuItem } from '../menuItem';
import { UndoManager } from '../../undo/UndoManager';
import { UNDO_SHOW_INFO_DURATION } from '../../constants';
import { setMessage } from '../../helpers.tsx';

export const createEditMenu = (undoManager: UndoManager, isMac: boolean, refresh: () => void) => {
  const lang = { lng: useStore.getState().language };
  const loggable = useStore.getState().loggable;
  const logAction = useStore.getState().logAction;

  const handleUndo = () => {
    if (undoManager.hasUndo()) {
      const commandName = undoManager.undo();
      if (commandName) setMessage('info', i18n.t('menu.edit.Undo', lang) + ': ' + commandName, UNDO_SHOW_INFO_DURATION);
      if (loggable) logAction('Undo');
      refresh();
    }
  };

  const handleRedo = () => {
    if (undoManager.hasRedo()) {
      const commandName = undoManager.redo();
      if (commandName) setMessage('info', i18n.t('menu.edit.Redo', lang) + ': ' + commandName, UNDO_SHOW_INFO_DURATION);
      if (loggable) logAction('Redo');
      refresh();
    }
  };

  const items: MenuProps['items'] = [];

  // undo
  if (undoManager.hasUndo()) {
    items.push({
      key: 'undo',
      label: (
        <MenuItem hasPadding={false} onClick={handleUndo}>
          {i18n.t('menu.edit.Undo', lang) + ': ' + undoManager.getLastUndoName()}
          <LabelMark>({isMac ? '⌘' : 'Ctrl'}+Z)</LabelMark>
        </MenuItem>
      ),
    });
  }

  // redo
  if (undoManager.hasRedo()) {
    items.push({
      key: 'redo',
      label: (
        <MenuItem hasPadding={false} onClick={handleRedo}>
          {i18n.t('menu.edit.Redo', lang) + ': ' + undoManager.getLastRedoName()}
          <LabelMark>({isMac ? '⌘' : 'Ctrl'}+Y)</LabelMark>
        </MenuItem>
      ),
    });
  }

  return items;
};
