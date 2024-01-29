/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import { MenuProps } from 'antd';
import { MenuItem } from '../menuItem.tsx';
import i18n from '../../i18n/i18n.ts';
import { ResetOrientation, SizeRadioGroup } from './spaceshipMenuItems.tsx';

export const createSpaceshipMenu = () => {
  const lang = { lng: useStore.getState().language };

  const items: MenuProps['items'] = [];

  items.push({
    key: 'spaceship-reset-orientation',
    label: <ResetOrientation />,
  });

  items.push({
    key: 'spaceship-size-submenu',
    label: <MenuItem hasPadding={false}>{i18n.t('word.Size', lang)}</MenuItem>,
    children: [
      {
        key: 'size-radio-group',
        label: <SizeRadioGroup />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  return { items } as MenuProps;
};
