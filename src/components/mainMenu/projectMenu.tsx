/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MenuProps } from 'antd';
import i18n from '../../i18n/i18n';
import { useStore } from '../../stores/common';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { useState } from 'react';
import { useLanguage } from '../../hooks';
import { MenuItem } from '../menuItem';

const CreateNewProjectItem = () => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const lang = useLanguage();

  const handleClick = () => {
    setDialogVisible(true);
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
        {i18n.t('menu.project.CreateNewProject', lang)}...
      </MenuItem>
      {/*{createNewProjectDialogVisible && (*/}
      {/*    <CreateNewProjectDialog saveAs={false} setDialogVisible={setCreateNewProjectDialogVisible} />*/}
      {/*)}*/}
    </>
  );
};

const OpenLocalProjectItem = () => {
  const lang = useLanguage();

  const handleClick = () => {
    if (useStore.getState().loggable) {
      useStore.getState().set((state) => {
        state.actionInfo = {
          name: 'Open Local Project',
          timestamp: new Date().getTime(),
        };
      });
    }
  };

  return (
    <>
      <MenuItem hasPadding={false} onClick={handleClick}>
        {i18n.t('menu.project.OpenLocalProject', lang)}...
      </MenuItem>
    </>
  );
};

const SaveAsLocalProjectItem = () => {
  const lang = useLanguage();

  const handleClick = () => {
    if (useStore.getState().loggable) {
      useStore.getState().set((state) => {
        state.actionInfo = {
          name: 'Save as Local Project',
          timestamp: new Date().getTime(),
        };
      });
    }
  };

  return (
    <>
      <MenuItem hasPadding={false} onClick={handleClick}>
        {i18n.t('menu.project.SaveAsLocalProject', lang)}...
      </MenuItem>
    </>
  );
};

const SaveAsCloudProjectItem = () => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const lang = useLanguage();

  const handleClick = () => {
    setDialogVisible(true);
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
        {i18n.t('menu.project.SaveAsCloudProject', lang)}...
      </MenuItem>
      {/*{saveProjectAsDialogVisible && (*/}
      {/*    <CreateNewProjectDialog saveAs={true} setDialogVisible={setSaveProjectAsDialogVisible} />*/}
      {/*)}*/}
    </>
  );
};

const SaveCloudProjectItem = () => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const lang = useLanguage();

  const handleClick = () => {
    setDialogVisible(true);
    if (useStore.getState().loggable) {
      useStore.getState().set((state) => {
        state.actionInfo = {
          name: 'Save Cloud Project',
          timestamp: new Date().getTime(),
        };
      });
    }
  };

  return (
    <>
      <MenuItem hasPadding={false} onClick={handleClick}>
        {i18n.t('menu.project.SaveCloudProject', lang)}...
      </MenuItem>
      {/*{dialogVisible && (*/}
      {/*    <CreateNewProjectDialog saveAs={true} setDialogVisible={dialogVisible} />*/}
      {/*)}*/}
    </>
  );
};

const ListCloudProjectItem = () => {
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
        {i18n.t('menu.project.OpenCloudProject', lang)}...
      </MenuItem>
    </>
  );
};

export const createProjectMenu = (viewOnly: boolean) => {
  const user = useStore.getState().user;
  const projectInfo = useStore.getState().projectInfo;
  const projectView = useStore.getState().projectView;

  const items: MenuProps['items'] = [];

  // create-new-project
  items.push({
    key: 'create-new-project',
    label: <CreateNewProjectItem />,
  });

  // open-local-project
  items.push({
    key: 'open-local-project',
    label: <OpenLocalProjectItem />,
  });

  // save-as-local-project
  items.push({
    key: 'save-as-local-project',
    label: <SaveAsLocalProjectItem />,
  });

  if (!viewOnly && user.uid) {
    // list-cloud-project
    items.push({
      key: 'list-cloud-project',
      label: <ListCloudProjectItem />,
    });

    // save-cloud-project
    items.push({
      key: 'save-cloud-project',
      label: <SaveCloudProjectItem />,
    });

    // save-as-cloud-project
    items.push({
      key: 'save-as-cloud-project',
      label: <SaveAsCloudProjectItem />,
    });
  }

  return items;
};
