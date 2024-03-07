/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import i18n from '../../i18n/i18n';
import type { MenuProps } from 'antd';
import { MenuItem } from '../menuItem';
import {
  AutoRotateCheckBox,
  AxesCheckBox,
  BackgroundColor,
  ColoringRadioGroup,
  ContainerCheckBox,
  FogCheckBox,
  MaterialRadioGroup,
  Screenshot,
  SpaceshipDisplayModeRadioGroup,
  StyleRadioGroup,
} from './defaultMenuItems';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import { ProjectType } from '../../constants.ts';

export const createDefaultMenu = () => {
  const lang = { lng: useStore.getState().language };
  const projectType = useStore.getState().projectState.type;
  const contextMenuObjectType = usePrimitiveStore.getState().contextMenuObjectType;

  const items: MenuProps['items'] = [];

  if (contextMenuObjectType === null) {
    items.push({
      key: 'molecular-viewer-auto-rotate',
      label: <AutoRotateCheckBox />,
    });

    items.push({
      key: 'molecular-viewer-axes',
      label: <AxesCheckBox />,
    });

    if (projectType === ProjectType.QSAR_MODELING) {
      items.push({
        key: 'molecular-viewer-container',
        label: <ContainerCheckBox />,
      });
    }

    items.push({
      key: 'molecular-viewer-foggy',
      label: <FogCheckBox />,
    });

    if (projectType === ProjectType.DRUG_DISCOVERY) {
      items.push({
        key: 'spaceship-display-mode-submenu',
        label: <MenuItem hasPadding={true}>{i18n.t('spaceship.SpaceshipDisplay', lang)}</MenuItem>,
        children: [
          {
            key: 'spaceship-display-mode-radio-group',
            label: <SpaceshipDisplayModeRadioGroup />,
            style: { backgroundColor: 'white' },
          },
        ],
      });
    }
  }

  items.push({
    key: 'molecular-viewer-style-submenu',
    label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Style', lang)}</MenuItem>,
    children: [
      {
        key: 'molecular-viewer-style-radio-group',
        label: <StyleRadioGroup />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  items.push({
    key: 'molecular-viewer-material-submenu',
    label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Material', lang)}</MenuItem>,
    children: [
      {
        key: 'molecular-viewer-material-radio-group',
        label: <MaterialRadioGroup />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  items.push({
    key: 'molecular-viewer-coloring-submenu',
    label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Color', lang)}</MenuItem>,
    children: [
      {
        key: 'molecular-viewer-coloring-radio-group',
        label: <ColoringRadioGroup />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  if (contextMenuObjectType === null) {
    items.push({
      key: 'molecular-viewer-background-color',
      label: <BackgroundColor />,
    });

    items.push({
      key: 'molecular-viewer-screenshot',
      label: <Screenshot />,
    });
  }

  return { items } as MenuProps;
};
