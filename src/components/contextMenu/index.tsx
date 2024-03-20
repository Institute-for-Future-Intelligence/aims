/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import { Dropdown } from 'antd';
import './style.css';
import { createDefaultMenu } from './defaultMenu';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import * as Selector from '../../stores/selector';
import { useStore } from '../../stores/common.ts';

export interface ContextMenuProps {
  [key: string]: any;
}

const DropdownContextMenu: React.FC<ContextMenuProps> = ({ children }) => {
  const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const copiedMoleculeIndex = usePrimitiveStore(Selector.copiedMoleculeIndex);
  const cutMolecule = usePrimitiveStore(Selector.cutMolecule);
  const selectedPlane = usePrimitiveStore(Selector.selectedPlane);
  const projectType = useStore(Selector.projectType);

  return (
    <Dropdown
      trigger={['contextMenu']}
      menu={createDefaultMenu(projectType, pickedMoleculeIndex, copiedMoleculeIndex, cutMolecule, selectedPlane)}
      overlayClassName="my-overlay"
    >
      {children}
    </Dropdown>
  );
};

export default DropdownContextMenu;
