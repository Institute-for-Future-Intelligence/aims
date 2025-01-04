/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import { Dropdown } from 'antd';
import './style.css';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import * as Selector from '../../stores/selector';
import { useStore } from '../../stores/common.ts';
import { ProjectType } from '../../constants.ts';
import { createDrugDiscoveryDefaultMenu } from './drugDiscoveryDefaultMenu.tsx';
import { createMolecularModelingDefaultMenu } from './molecularModelingDefaultMenu.tsx';

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
  const ligand = useStore(Selector.ligand);
  const protein = useStore(Selector.protein);

  return (
    <Dropdown
      trigger={['contextMenu']}
      menu={
        projectType === ProjectType.DRUG_DISCOVERY
          ? createDrugDiscoveryDefaultMenu(pickedMoleculeIndex, ligand, protein)
          : createMolecularModelingDefaultMenu(
              pickedAtomIndex,
              pickedMoleculeIndex,
              copiedMoleculeIndex,
              cutMolecule,
              selectedPlane,
              testMolecules,
            )
      }
      overlayClassName="my-overlay"
    >
      {children}
    </Dropdown>
  );
};

export default DropdownContextMenu;
