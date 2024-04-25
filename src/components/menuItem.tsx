/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

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

export const LabelMark = ({ children }: LabelMarkProps) => {
  return <span style={{ paddingLeft: '2px', fontSize: 9 }}>{children}</span>;
};

export const MenuItem: FC<MenuItemProps> = ({
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
