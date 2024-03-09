/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import { Dropdown } from 'antd';
import './style.css';
import { createDefaultMenu } from './defaultMenu';

export interface ContextMenuProps {
  [key: string]: any;
}

const DropdownContextMenu: React.FC<ContextMenuProps> = ({ children }) => {
  return (
    <Dropdown trigger={['contextMenu']} menu={createDefaultMenu()} overlayClassName="my-overlay">
      {children}
    </Dropdown>
  );
};

export default DropdownContextMenu;
