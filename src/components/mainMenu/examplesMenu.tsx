/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */
import { MenuProps } from 'antd';
import { MenuItem } from '../menuItem.tsx';
import i18n from 'i18next';
import { useStore } from '../../stores/common.ts';
import { ProjectState } from '../../types.ts';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import { fetchProject } from '../../cloudProjectUtil.ts';
import { HOME_URL } from '../../constants.ts';

export const createExamplesMenu = (viewOnly: boolean) => {
  const lang = { lng: useStore.getState().language };
  const setCommonStore = useStore.getState().set;

  const setProjectState = (projectState: ProjectState) => {
    setCommonStore((state) => {
      state.projectState = { ...projectState };
    });
    usePrimitiveStore.getState().set((state) => {
      state.updateProjectsFlag = true;
    });
  };

  const loadProject = (title: string) => {
    const owner = import.meta.env.VITE_EXAMPLE_PROJECT_OWNER;
    if (title && owner) {
      fetchProject(owner, title, setProjectState).then(() => {});
      if (useStore.getState().loggable) {
        setCommonStore((state) => {
          state.actionInfo = {
            name: 'Open Example: ' + title,
            timestamp: new Date().getTime(),
          };
        });
      }
      if (!viewOnly) {
        window.history.pushState({}, document.title, HOME_URL);
      }
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'nanotechnology',
      label: <MenuItem>{i18n.t('menu.examples.nanotechnologySubMenu', lang)}</MenuItem>,
      children: [
        {
          key: 'Buckyballs',
          label: (
            <MenuItem onClick={() => loadProject('Buckyballs')}>
              {i18n.t('menu.examples.nanotechnology.Buckyballs', lang)}
            </MenuItem>
          ),
        },
      ],
    },
  ];

  return items;
};
