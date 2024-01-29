/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef } from 'react';
import { Dropdown } from 'antd';
import * as Selector from '../../stores/selector';
import './style.css';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { createDefaultMenu } from './defaultMenu';
import { ObjectType } from '../../constants';
import { createSpaceshipMenu } from './spaceshipMenu.tsx';

export interface ContextMenuProps {
  [key: string]: any;
}

const DropdownContextMenu: React.FC<ContextMenuProps> = ({ children }) => {
  usePrimitiveStore((state) => state.contextMenuFlag);
  const contextMenuObjectType = usePrimitiveStore(Selector.contextMenuObjectType);

  const createMenu = () => {
    if (!contextMenuObjectType) return createDefaultMenu();
    switch (contextMenuObjectType) {
      case ObjectType.Spaceship:
        return createSpaceshipMenu();
      default:
        return createDefaultMenu();
    }
  };

  return (
    <Dropdown trigger={['contextMenu']} menu={createMenu()} overlayClassName="my-overlay">
      {children}
    </Dropdown>
  );
};

export default DropdownContextMenu;
