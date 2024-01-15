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

const CreateNewProjectItem = ({ isMac }: { isMac: boolean }) => {
  const createProjectDialog = usePrimitiveStore(Selector.createProjectDialog);
  const lang = useLanguage();

  const handleClick = () => {
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

  return (
    <>
      <MenuItem hasPadding={false} onClick={handleClick}>
        {i18n.t('menu.project.CreateNewProject', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+F)</LabelMark>...
      </MenuItem>
      {createProjectDialog && <NewProjectDialog saveAs={false} />}
    </>
  );
};

const OpenProjectItem = ({ isMac }: { isMac: boolean }) => {
  const setCommonStore = useStore.getState().set;
  const lang = useLanguage();

  const handleClick = () => {
    usePrimitiveStore.getState().set((state) => {
      state.showProjectsFlag = true;
    });
    setCommonStore((state) => {
      state.selectedFloatingWindow = 'projectListPanel';
    });
    if (useStore.getState().loggable) {
      setCommonStore((state) => {
        state.actionInfo = {
          name: 'Open Project',
          timestamp: new Date().getTime(),
        };
      });
    }
  };

  return (
    <>
      <MenuItem hasPadding={false} onClick={handleClick}>
        {i18n.t('menu.project.OpenProject', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+O)</LabelMark>...
      </MenuItem>
    </>
  );
};

const SaveProjectItem = ({ isMac }: { isMac: boolean }) => {
  const lang = useLanguage();

  const handleClick = () => {
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

  return (
    <>
      <MenuItem hasPadding={false} onClick={handleClick}>
        {i18n.t('menu.project.SaveProject', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+S)</LabelMark>
      </MenuItem>
    </>
  );
};

const SaveProjectAsItem = ({ isMac }: { isMac: boolean }) => {
  const saveProjectDialog = usePrimitiveStore(Selector.saveProjectAsDialog);
  const lang = useLanguage();

  const handleClick = () => {
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

  return (
    <>
      <MenuItem hasPadding={false} onClick={handleClick}>
        {i18n.t('menu.project.SaveProjectAs', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+Shift+S)</LabelMark>...
      </MenuItem>
      {saveProjectDialog && <NewProjectDialog saveAs={true} />}
    </>
  );
};

export const createProjectMenu = (viewOnly: boolean, isMac: boolean) => {
  const items: MenuProps['items'] = [];

  items.push({
    key: 'create-new-project',
    label: <CreateNewProjectItem isMac={isMac} />,
  });

  items.push({
    key: 'open-project',
    label: <OpenProjectItem isMac={isMac} />,
  });

  items.push({
    key: 'save-project',
    label: <SaveProjectItem isMac={isMac} />,
  });

  items.push({
    key: 'save-project-as',
    label: <SaveProjectAsItem isMac={isMac} />,
  });

  return items;
};
