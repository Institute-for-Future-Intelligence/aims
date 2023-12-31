/*
 * @Copyright 2023. Institute for Future Intelligence, Inc.
 */

import { usePrimitiveStore } from '../stores/commonPrimitive';

export interface MenuItemProps {
  hasPadding?: boolean;
  stayAfterClick?: boolean;
  textSelectable?: boolean;
  update?: boolean;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  stayAfterClick,
  hasPadding,
  textSelectable = true,
  update,
  onClick,
  children,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (onClick) {
      onClick(e);
    }
    if (stayAfterClick) {
      e.stopPropagation();
    }
    if (update) {
      usePrimitiveStore.getState().updateContextMenu();
    }
  };

  return (
    <span
      onClick={handleClick}
      style={{
        userSelect: textSelectable ? 'auto' : 'none',
        // display: 'inline-block',
        width: '100%',
        paddingLeft: hasPadding ? '24px' : '0px',
      }}
    >
      {children}
    </span>
  );
};
