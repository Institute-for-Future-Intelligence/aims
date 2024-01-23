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
  FogCheckBox,
  MaterialRadioGroup,
  Screenshot,
  StyleRadioGroup,
} from './defaultMenuItems';

export const createDefaultMenu = () => {
  const lang = { lng: useStore.getState().language };

  const items: MenuProps['items'] = [];

  items.push({
    key: 'molecular-viewer-auto-rotate',
    label: <AutoRotateCheckBox />,
  });

  items.push({
    key: 'molecular-viewer-axes',
    label: <AxesCheckBox />,
  });

  items.push({
    key: 'molecular-viewer-foggy',
    label: <FogCheckBox />,
  });

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

  items.push({
    key: 'molecular-viewer-background-color',
    label: <BackgroundColor />,
  });

  items.push({
    key: 'molecular-viewer-screenshot',
    label: <Screenshot />,
  });

  return { items } as MenuProps;
};
