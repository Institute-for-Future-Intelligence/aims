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
  Screenshot,
  ShininessInput,
  StyleRadioGroup,
  TargetRadioGroup,
} from './defaultMenuItems';

export const createDefaultMenu = () => {
  const lang = { lng: useStore.getState().language };

  const items: MenuProps['items'] = [];

  // auto rotate
  items.push({
    key: 'molecular-viewer-auto-rotate',
    label: <AutoRotateCheckBox />,
  });

  // axes
  items.push({
    key: 'molecular-viewer-axes',
    label: <AxesCheckBox />,
  });

  // target
  items.push({
    key: 'target-submenu',
    label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Target', lang)}</MenuItem>,
    children: [
      {
        key: 'target-radio-group',
        label: <TargetRadioGroup />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  // molecular viewer style
  items.push({
    key: 'molecular-viewer-style-submenu',
    label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Style', lang)}</MenuItem>,
    children: [
      {
        key: 'molecular-viewer-style-radio-group',
        label: <StyleRadioGroup />,
        style: { backgroundColor: 'white' },
      },
      {
        key: 'molecular-viewer-shininess',
        label: <ShininessInput />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  // background color
  items.push({
    key: 'molecular-viewer-background-color',
    label: <BackgroundColor />,
  });

  // screenshot
  items.push({
    key: 'molecular-viewer-screenshot',
    label: <Screenshot />,
  });

  return { items } as MenuProps;
};
