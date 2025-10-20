/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { ClickEvent, EventHandler, MenuItem, SubMenu, SubMenuProps } from '@szhsin/react-menu';
import React, { FC, ReactNode } from 'react';

export interface MenuItemProps {
  hasPadding?: boolean;
  fontWeight?: string;
  stayAfterClick?: boolean;
  textSelectable?: boolean;
  cursor?: string;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

interface LabelMarkProps {
  children?: React.ReactNode;
}

interface MainMenuItemProps {
  hasPadding?: boolean;
  stayAfterClick?: boolean;
  onClick?: EventHandler<ClickEvent>;
  children?: React.ReactNode;
  disabled?: boolean;
  fontWeight?: string;
}

export const LabelMark = ({ children }: LabelMarkProps) => {
  return <span style={{ paddingLeft: '2px', fontSize: 9 }}>{children}</span>;
};

export const AntdMenuItem: FC<MenuItemProps> = ({
  stayAfterClick,
  fontWeight,
  hasPadding,
  textSelectable = true,
  cursor = undefined,
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
  };

  return (
    <span
      onClick={handleClick}
      style={{
        userSelect: textSelectable ? 'auto' : 'none',
        display: 'inline-block',
        fontWeight: fontWeight,
        width: '100%',
        paddingLeft: hasPadding ? '24px' : '0px',
        cursor: cursor ?? 'pointer',
      }}
    >
      {children}
    </span>
  );
};

interface MainSubMenuProps {
  hasPadding?: boolean;
}

export const MainSubMenu = (props: SubMenuProps & MainSubMenuProps) => {
  return (
    <SubMenu
      {...props}
      itemProps={props.hasPadding ? { className: 'submenu-item-haspadding' } : undefined}
      menuStyle={{ minWidth: '5rem', padding: '2px', borderRadius: '0.35rem' }}
    />
  );
};

export const MainMenuItem = ({
  hasPadding,
  stayAfterClick,
  disabled,
  fontWeight,
  onClick,
  children,
}: MainMenuItemProps) => {
  return (
    <MenuItem
      style={{ paddingLeft: hasPadding ? '36px' : '12px', paddingRight: '12px' }}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (stayAfterClick) e.keepOpen = true;
      }}
      disabled={disabled}
    >
      <span style={{ fontWeight: fontWeight }}>{children}</span>
    </MenuItem>
  );
};
