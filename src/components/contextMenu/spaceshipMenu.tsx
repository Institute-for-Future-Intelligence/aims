/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import type { MenuProps } from 'antd';
import { AxesCheckBox } from './defaultMenuItems';

export const createSpaceshipMenu = () => {
  const lang = { lng: useStore.getState().language };

  const items: MenuProps['items'] = [];

  items.push({
    key: 'molecular-viewer-axes',
    label: <AxesCheckBox />,
  });

  return { items } as MenuProps;
};
