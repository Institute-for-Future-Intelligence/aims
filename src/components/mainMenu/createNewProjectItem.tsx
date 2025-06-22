/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks.ts';
import { useTranslation } from 'react-i18next';
import { LabelMark, MenuItem } from '../menuItem.tsx';
import NewProjectDialog from './newProjectDialog.tsx';
import { askToCreateProject } from './projectMenu.tsx';
import { App } from 'antd';

export const CreateNewProjectItem = ({ isMac }: { isMac: boolean }) => {
  const createProjectDialog = usePrimitiveStore(Selector.createProjectDialog);
  const lang = useLanguage();
  const { t } = useTranslation();
  const { modal } = App.useApp();

  return (
    <>
      <MenuItem hasPadding={false} onClick={() => askToCreateProject(modal)}>
        {t('menu.project.CreateNewProject', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+F)</LabelMark>...
      </MenuItem>
      {createProjectDialog && <NewProjectDialog saveAs={false} />}
    </>
  );
};
