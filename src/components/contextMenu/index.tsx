/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import React, { useState } from 'react';
import './style.css';
import * as Selector from '../../stores/selector';
import { useStore } from '../../stores/common.ts';
import { ProjectType } from '../../constants.ts';
import DrugDiscoveryMenu from './drugDiscoveryDefaultMenu.tsx';
import MolecularModelingMenu from './molecularModelingDefaultMenu.tsx';
import { ControlledMenu } from '@szhsin/react-menu';

export interface ContextMenuProps {
  [key: string]: any;
}

const DropdownContextMenu: React.FC<ContextMenuProps> = ({ children }) => {
  const projectType = useStore(Selector.projectType);

  const [isOpen, setOpen] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const menus = () => {
    if (projectType === ProjectType.DRUG_DISCOVERY) {
      return <DrugDiscoveryMenu />;
    } else {
      return <MolecularModelingMenu />;
    }
  };

  return (
    <div
      onContextMenu={(e) => {
        if (typeof document.hasFocus === 'function' && !document.hasFocus()) return;

        e.preventDefault();
        setAnchorPoint({ x: e.clientX, y: e.clientY });
        setOpen(true);
      }}
    >
      {children}
      <ControlledMenu
        anchorPoint={anchorPoint}
        state={isOpen ? 'open' : 'closed'}
        onClose={() => {
          setOpen(false);
        }}
        menuStyle={{ fontSize: '14px', minWidth: '4rem', borderRadius: '0.35rem' }}
      >
        {menus()}
      </ControlledMenu>
    </div>
  );
};

export default DropdownContextMenu;
