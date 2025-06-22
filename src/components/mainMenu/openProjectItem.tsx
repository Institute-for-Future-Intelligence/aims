/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import { useLanguage } from '../../hooks.ts';
import { useTranslation } from 'react-i18next';
import { LabelMark, MenuItem } from '../menuItem.tsx';
import { App } from 'antd';
import { HookAPI } from 'antd/lib/modal/useModal';

export const OpenProjectItem = ({
  isMac,
  askToOpenProject,
}: {
  isMac: boolean;
  askToOpenProject: (modal: HookAPI) => void;
}) => {
  const lang = useLanguage();
  const { t } = useTranslation();
  const { modal } = App.useApp();

  return (
    <>
      <MenuItem hasPadding={false} onClick={() => askToOpenProject(modal)}>
        {t('menu.project.OpenProject', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+O)</LabelMark>...
      </MenuItem>
    </>
  );
};
