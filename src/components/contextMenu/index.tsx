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

export interface ContextMenuProps {
  [key: string]: any;
}

const useContextMenu = () => {
  const contextMenuObjectType = usePrimitiveStore(Selector.contextMenuObjectType);
  const selectedObject = null;

  const ctxRef = useRef(contextMenuObjectType);
  const objRef = useRef(selectedObject);

  // dropdown menu fades out about 0.2s, so we have to preserve the state util the menu is fully disappeared.
  if (contextMenuObjectType !== null) {
    ctxRef.current = contextMenuObjectType;
    objRef.current = selectedObject;
  } else {
    setTimeout(() => {
      ctxRef.current = contextMenuObjectType;
      objRef.current = contextMenuObjectType === null ? null : selectedObject;
    }, 200);
  }

  return [ctxRef.current, objRef.current] as [ObjectType | null, any | null];
};

const DropdownContextMenu: React.FC<ContextMenuProps> = React.memo(({ children }) => {
  usePrimitiveStore((state) => state.contextMenuFlag);

  const [contextMenuObjectType, selectedElement] = useContextMenu();

  const createMenu = () => {
    if (!selectedElement) {
      if (!contextMenuObjectType) return createDefaultMenu();
      return { items: [] };
    }
    switch (contextMenuObjectType) {
      case ObjectType.Atom:
        return { items: [] };
      case ObjectType.Bond:
        return { items: [] };
      case ObjectType.Surface:
        return { items: [] };
      default:
        return { items: [] };
    }
  };

  return (
    <Dropdown trigger={['contextMenu']} menu={createMenu()} overlayClassName="my-overlay">
      {children}
    </Dropdown>
  );
});

export default DropdownContextMenu;
