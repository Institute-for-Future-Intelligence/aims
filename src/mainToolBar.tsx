/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import styled from 'styled-components';
import { Avatar, Button, Dropdown, MenuProps, Popover, Space } from 'antd';
import React, { useMemo } from 'react';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { MenuItem } from './components/menuItem';
import { useTranslation } from 'react-i18next';

const ButtonsContainer = styled.div`
  position: absolute;
  top: 0;
  right: 10px;
  margin: 0;
  padding-bottom: 0;
  padding-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  z-index: 9;
`;

export interface MainToolBarProps {
  signIn: () => void;
  signOut: () => void;
}

const MainToolBar = ({ signIn, signOut }: MainToolBarProps) => {
  const language = useStore(Selector.language);
  const user = useStore(Selector.user);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const avatarMenu: MenuProps['items'] = [
    {
      key: 'account',
      label: (
        <MenuItem
          onClick={() => {
            usePrimitiveStore.getState().set((state) => {
              // state.showAccountSettingsPanel = true;
            });
          }}
        >
          {t('avatarMenu.AccountSettings', lang)}
        </MenuItem>
      ),
    },
    {
      key: 'sign-out',
      label: <MenuItem onClick={signOut}>{t('avatarMenu.SignOut', lang)}</MenuItem>,
    },
  ];

  return (
    <ButtonsContainer>
      <Space direction="horizontal">
        <div style={{ verticalAlign: 'top' }}>
          {user.displayName ? (
            <Dropdown menu={{ items: avatarMenu }} trigger={['click']}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
                title={t('tooltip.clickToAccessAccountSettings', lang)}
              >
                <Avatar size={32} src={user.photoURL} alt={user.displayName} />
              </a>
            </Dropdown>
          ) : (
            <Popover
              title={<div onClick={(e) => e.stopPropagation()}>{t('avatarMenu.PrivacyStatementTitle', lang)}</div>}
              content={
                <div style={{ width: '280px', fontSize: '12px' }}>
                  {t('avatarMenu.PrivacyStatement', lang)}
                  <a target="_blank" rel="noopener noreferrer" href={'https://intofuture.org/aladdin-privacy.html'}>
                    {t('aboutUs.PrivacyPolicy', lang)}
                  </a>
                  .
                </div>
              }
            >
              <Button type="primary" onClick={signIn}>
                {t('avatarMenu.SignIn', lang)}
              </Button>
            </Popover>
          )}
        </div>
      </Space>
    </ButtonsContainer>
  );
};

export default React.memo(MainToolBar);
