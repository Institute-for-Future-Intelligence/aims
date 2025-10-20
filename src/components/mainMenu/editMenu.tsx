/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import i18n from '../../i18n/i18n';
import { useStore } from '../../stores/common';
import { LabelMark, MainMenuItem } from '../menuItem';
import { UNDO_SHOW_INFO_DURATION } from '../../constants';
import { setMessage } from '../../helpers.tsx';
import { useLanguage } from '../../hooks.ts';
import { SubMenu } from '@szhsin/react-menu';
import { t } from 'i18next';
import * as Selector from './../../stores/selector';
import { useEffect, useState } from 'react';

interface Props {
  isMac: boolean;
}

const EditMenu = ({ isMac }: Props) => {
  const lang = useLanguage();
  const logAction = useStore.getState().logAction;
  const loggable = useStore.getState().loggable;
  const undoManager = useStore(Selector.undoManager);
  const hasUndo = undoManager.hasUndo();
  const hasRedo = undoManager.hasRedo();

  // has to to this to update menu, can't find a way to listen to undoManager change.
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    const pointerup = () => {
      setUpdate((b) => !b);
    };
    window.addEventListener('pointerup', pointerup);
    return () => window.removeEventListener('pointerup', pointerup);
  }, []);

  if (!hasUndo && !hasRedo) return null;

  const handleUndo = () => {
    if (undoManager.hasUndo()) {
      const commandName = undoManager.undo();
      if (commandName) setMessage('info', i18n.t('menu.edit.Undo', lang) + ': ' + commandName, UNDO_SHOW_INFO_DURATION);
      if (loggable) logAction('Undo');
    }
  };

  const handleRedo = () => {
    if (undoManager.hasRedo()) {
      const commandName = undoManager.redo();
      if (commandName) setMessage('info', i18n.t('menu.edit.Redo', lang) + ': ' + commandName, UNDO_SHOW_INFO_DURATION);
      if (loggable) logAction('Redo');
    }
  };

  return (
    <SubMenu label={t('menu.editSubMenu', lang)}>
      {hasUndo && (
        <MainMenuItem onClick={handleUndo}>
          {i18n.t('menu.edit.Undo', lang) + ': ' + undoManager.getLastUndoName()}
          <LabelMark>({isMac ? '⌘' : 'Ctrl'}+Z)</LabelMark>
        </MainMenuItem>
      )}

      {hasRedo && (
        <MainMenuItem onClick={handleRedo}>
          {i18n.t('menu.edit.Redo', lang) + ': ' + undoManager.getLastRedoName()}
          <LabelMark>({isMac ? '⌘' : 'Ctrl'}+Y)</LabelMark>
        </MainMenuItem>
      )}
    </SubMenu>
  );
};

export default EditMenu;
