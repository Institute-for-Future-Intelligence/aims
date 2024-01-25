/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { useLanguage } from '../../hooks.ts';
import { useTranslation } from 'react-i18next';
import { LabelMark, MenuItem } from '../menuItem.tsx';

export const OpenProjectItem = ({ isMac, askToOpenProject }: { isMac: boolean; askToOpenProject: () => void }) => {
  const lang = useLanguage();
  const { t } = useTranslation();

  return (
    <>
      <MenuItem hasPadding={false} onClick={() => askToOpenProject()}>
        {t('menu.project.OpenProject', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+O)</LabelMark>...
      </MenuItem>
    </>
  );
};
