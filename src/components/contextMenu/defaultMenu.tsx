/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import i18n from '../../i18n/i18n';
import type { MenuProps } from 'antd';
import { MenuItem } from '../menuItem';
import { StyleRadioGroup } from './defaultMenuItems';

export const createDefaultMenu = () => {
  const lang = { lng: useStore.getState().language };

  const items: MenuProps['items'] = [];

  // molecular viewer style
  items.push({
    key: 'molecular-viewer-style-submenu',
    label: <MenuItem>{i18n.t('molecularViewer.Style', lang)}</MenuItem>,
    children: [
      {
        key: 'molecular-viewer-style-radio-group',
        label: <StyleRadioGroup />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  const onClick: MenuProps['onClick'] = ({ key }) => {
    // console.log('clicked on item', key);
  };

  return { items, onClick } as MenuProps;
};
