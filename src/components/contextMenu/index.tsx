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
  const pickedAtomIndex = usePrimitiveStore(Selector.pickedAtomIndex);
  const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const copiedMoleculeIndex = usePrimitiveStore(Selector.copiedMoleculeIndex);
  const cutMolecule = usePrimitiveStore(Selector.cutMolecule);
  const selectedPlane = usePrimitiveStore(Selector.selectedPlane);
  const projectType = useStore(Selector.projectType);
  const testMolecules = useStore(Selector.testMolecules);
  const restraints = useStore(Selector.restraints);
  const ligand = useStore(Selector.ligand);
  const protein = useStore(Selector.protein);

  return (
    <Dropdown
      trigger={['contextMenu']}
      menu={createDefaultMenu(
        projectType,
        pickedAtomIndex,
        pickedMoleculeIndex,
        copiedMoleculeIndex,
        cutMolecule,
        selectedPlane,
        testMolecules,
        restraints,
        ligand,
        protein,
      )}
      overlayClassName="my-overlay"
    >
      {children}
    </Dropdown>
  );
};

export default DropdownContextMenu;
