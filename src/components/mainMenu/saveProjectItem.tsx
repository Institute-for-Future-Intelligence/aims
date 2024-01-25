/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { useLanguage } from '../../hooks.ts';
import { LabelMark, MenuItem } from '../menuItem.tsx';
import i18n from '../../i18n/i18n.ts';

export const SaveProjectItem = ({ isMac, saveProject }: { isMac: boolean; saveProject: () => void }) => {
  const lang = useLanguage();

  return (
    <>
      <MenuItem hasPadding={false} onClick={() => saveProject()}>
        {i18n.t('menu.project.SaveProject', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+S)</LabelMark>
      </MenuItem>
    </>
  );
};
