/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MenuProps } from 'antd';
import i18n from '../../i18n/i18n';
import { useStore } from '../../stores/common';
import * as Selector from '../../stores/selector';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { useLanguage } from '../../hooks';
import { LabelMark, MenuItem } from '../menuItem';
import NewProjectDialog from './newProjectDialog';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const CreateNewProjectItem = ({ isMac }: { isMac: boolean }) => {
  const createProjectDialog = usePrimitiveStore(Selector.createProjectDialog);
  const lang = useLanguage();
  const { t } = useTranslation();

  return (
    <>
      <MenuItem hasPadding={false} onClick={() => askToCreateProject()}>
        {t('menu.project.CreateNewProject', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+F)</LabelMark>...
      </MenuItem>
      {createProjectDialog && <NewProjectDialog saveAs={false} />}
    </>
  );
};

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
  if (useStore.getState().loggable) {
    useStore.getState().set((state) => {
      state.actionInfo = {
        name: 'Create New Project',
        timestamp: new Date().getTime(),
      };
    });
  }
};

const OpenProjectItem = ({ isMac, askToOpenProject }: { isMac: boolean; askToOpenProject: Function }) => {
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
    if (state.loggable) {
      state.actionInfo = {
        name: 'Open Project',
        timestamp: new Date().getTime(),
      };
    }
  });
};

const SaveProjectItem = ({ isMac, saveProject }: { isMac: boolean; saveProject: Function }) => {
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

export const saveProject = () => {
  usePrimitiveStore.getState().set((state) => {
    state.saveProjectFlag = true;
  });
  if (useStore.getState().loggable) {
    useStore.getState().set((state) => {
      state.actionInfo = {
        name: 'Save Project',
        timestamp: new Date().getTime(),
      };
    });
  }
};

const SaveProjectAsItem = ({ isMac, saveProjectAs }: { isMac: boolean; saveProjectAs: Function }) => {
  const saveProjectDialog = usePrimitiveStore(Selector.saveProjectAsDialog);
  const lang = useLanguage();

  return (
    <>
      <MenuItem hasPadding={false} onClick={() => saveProjectAs()}>
        {i18n.t('menu.project.SaveProjectAs', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+Shift+S)</LabelMark>...
      </MenuItem>
      {saveProjectDialog && <NewProjectDialog saveAs={true} />}
    </>
  );
};

export const saveProjectAs = () => {
  usePrimitiveStore.getState().setSaveProjectAsDialog(true);
  if (useStore.getState().loggable) {
    useStore.getState().set((state) => {
      state.actionInfo = {
        name: 'Save Project As',
        timestamp: new Date().getTime(),
      };
    });
  }
};

export const createProjectMenu = (viewOnly: boolean, isMac: boolean) => {
  const items: MenuProps['items'] = [];

  items.push({
    key: 'create-new-project',
    label: <CreateNewProjectItem isMac={isMac} />,
  });

  items.push({
    key: 'open-project',
    label: <OpenProjectItem isMac={isMac} askToOpenProject={askToOpenProject} />,
  });

  items.push({
    key: 'save-project',
    label: <SaveProjectItem isMac={isMac} saveProject={saveProject} />,
  });

  items.push({
    key: 'save-project-as',
    label: <SaveProjectAsItem isMac={isMac} saveProjectAs={saveProjectAs} />,
  });

  return items;
};
