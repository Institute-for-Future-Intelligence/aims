/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MenuProps, Modal } from 'antd';
import i18n from '../../i18n/i18n';
import { useStore } from '../../stores/common';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { CreateNewProjectItem } from './createNewProjectItem.tsx';
import { OpenProjectItem } from './openProjectItem.tsx';
import { SaveProjectItem } from './saveProjectItem.tsx';
import { SaveProjectAsItem } from './saveProjectAsItem.tsx';
import { MenuItem } from '../menuItem.tsx';
import { Util } from '../../Util.ts';
import { showSuccess } from '../../helpers.tsx';

export const askToCreateProject = () => {
  const lang = { lng: useStore.getState().language };
  if (usePrimitiveStore.getState().changed) {
    Modal.confirm({
      title: i18n.t('message.DoYouWantToSaveChanges', lang),
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        usePrimitiveStore.getState().set((state) => {
          state.saveProjectFlag = true;
        });
        createProject();
      },
      onCancel: () => createProject(),
      okText: i18n.t('word.Yes', lang),
      cancelText: i18n.t('word.No', lang),
    });
  } else {
    createProject();
  }
};

const createProject = () => {
  usePrimitiveStore.getState().setCreateProjectDialog(true);
  if (useStore.getState().loggable) useStore.getState().logAction('Create New Project');
};

export const askToOpenProject = () => {
  const lang = { lng: useStore.getState().language };
  if (usePrimitiveStore.getState().changed) {
    Modal.confirm({
      title: i18n.t('message.DoYouWantToSaveChanges', lang),
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        usePrimitiveStore.getState().set((state) => {
          state.saveProjectFlag = true;
        });
        openProject();
      },
      onCancel: () => openProject(),
      okText: i18n.t('word.Yes', lang),
      cancelText: i18n.t('word.No', lang),
    });
  } else {
    openProject();
  }
};

const openProject = () => {
  usePrimitiveStore.getState().set((state) => {
    state.showProjectsFlag = true;
  });
  useStore.getState().set((state) => {
    state.selectedFloatingWindow = 'projectListPanel';
    if (state.loggable) state.logAction('Open Project');
  });
};

export const saveProject = () => {
  usePrimitiveStore.getState().set((state) => {
    state.saveProjectFlag = true;
  });
  if (useStore.getState().loggable) useStore.getState().logAction('Save Project');
};

export const saveProjectAs = () => {
  usePrimitiveStore.getState().setSaveProjectAsDialog(true);
  if (useStore.getState().loggable) useStore.getState().logAction('Save Project As');
};

export const createProjectMenu = (isMac: boolean) => {
  const items: MenuProps['items'] = [];
  const lang = { lng: useStore.getState().language };
  const user = useStore.getState().user;
  const projectTitle = useStore.getState().projectState.title;

  items.push({
    key: 'create-new-project',
    label: <CreateNewProjectItem isMac={isMac} />,
  });

  items.push({
    key: 'open-project',
    label: <OpenProjectItem isMac={isMac} askToOpenProject={askToOpenProject} />,
  });

  if (useStore.getState().projectState.title) {
    items.push({
      key: 'save-project',
      label: <SaveProjectItem isMac={isMac} saveProject={saveProject} />,
    });
  }

  items.push({
    key: 'save-project-as',
    label: <SaveProjectAsItem isMac={isMac} saveProjectAs={saveProjectAs} />,
  });

  if (user.uid && projectTitle) {
    items.push({
      key: 'generate-project-link',
      label: (
        <MenuItem
          hasPadding={false}
          onClick={() => {
            if (!user.uid || !projectTitle) return;
            Util.generateProjectLink(user.uid, projectTitle, () =>
              showSuccess(i18n.t('projectListPanel.ProjectLinkGeneratedInClipBoard', lang) + '.'),
            );
          }}
        >
          {i18n.t('projectListPanel.GenerateProjectLink', lang)}
        </MenuItem>
      ),
    });
  }

  return items;
};
