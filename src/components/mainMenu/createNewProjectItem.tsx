/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks.ts';
import { useTranslation } from 'react-i18next';
import { LabelMark, MainMenuItem } from '../menuItem.tsx';
import NewProjectDialog from './newProjectDialog.tsx';
import { askToCreateProject } from './projectMenu.tsx';
import { App } from 'antd';

interface Props {
  isMac: boolean;
  generating: boolean;
}

const NewProjectItem = ({ isMac, generating }: Props) => {
  const createProjectDialog = usePrimitiveStore(Selector.createProjectDialog);
  const lang = useLanguage();
  const { t } = useTranslation();
  const { modal } = App.useApp();

  return (
    <>
      <MainMenuItem disabled={generating} onClick={() => askToCreateProject(modal)}>
        {t('menu.project.CreateNewProject', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+F)</LabelMark>...
      </MainMenuItem>
      {createProjectDialog && <NewProjectDialog saveAs={false} />}
    </>
  );
};

export default NewProjectItem;
