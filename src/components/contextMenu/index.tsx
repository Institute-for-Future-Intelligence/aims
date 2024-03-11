/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import { Dropdown } from 'antd';
import './style.css';
import { createDefaultMenu } from './defaultMenu';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import * as Selector from '../../stores/selector';

export interface ContextMenuProps {
  [key: string]: any;
}

const DropdownContextMenu: React.FC<ContextMenuProps> = ({ children }) => {
  const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const copiedMolecule = usePrimitiveStore(Selector.copiedMolecule);
  const selectedPlane = usePrimitiveStore(Selector.selectedPlane);

  return (
    <Dropdown
      trigger={['contextMenu']}
      menu={createDefaultMenu(pickedMoleculeIndex, copiedMolecule, selectedPlane)}
      overlayClassName="my-overlay"
    >
      {children}
    </Dropdown>
  );
};

export default DropdownContextMenu;
