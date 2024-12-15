/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import styled from 'styled-components';
import { Avatar, Button, Dropdown, MenuProps, Modal, Space } from 'antd';
import React, { useMemo } from 'react';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { MenuItem } from './components/menuItem';
import { useTranslation } from 'react-i18next';
import { WarningOutlined } from '@ant-design/icons';

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
  signInAnonymously: () => void;
  signOut: () => void;
}

const MainToolBar = React.memo(({ signIn, signInAnonymously, signOut }: MainToolBarProps) => {
  const language = useStore(Selector.language);
  const user = useStore(Selector.user);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const anonymousSignInCheck = () => {
    Modal.confirm({
      title: `${t('message.SigningInAnonymousAccount', lang)}`,
      icon: <WarningOutlined />,
      type: 'warning',
      onOk: () => {
        signInAnonymously();
      },
      onCancel: () => {},
      okText: `${t('word.Yes', lang)}`,
      cancelText: `${t('word.No', lang)}`,
    });
  };

  const signOutCheck = () => {
    if (user.anonymous) {
      Modal.confirm({
        title: `${t('message.SigningOutAnonymousAccount', lang)}`,
        icon: <WarningOutlined />,
        type: 'warning',
        keyboard: false, // disable Escape key so that onCancel is not called when Escape is pressed
        onOk: () => {
          // swap OK and Cancel so that ENTER maps to cancel
        },
        onCancel: () => {
          signOut();
        },
        okText: `${t('word.No', lang)}`,
        cancelText: `${t('word.Yes', lang)}`,
      });
    } else {
      signOut();
    }
  };

  const avatarMenu: MenuProps['items'] = [
    {
      key: 'account',
      label: (
        <MenuItem
          onClick={() => {
            usePrimitiveStore.getState().set((state) => {
              state.showAccountSettingsPanel = true;
            });
          }}
        >
          {t('avatarMenu.AccountSettings', lang)}
        </MenuItem>
      ),
    },
    {
      key: 'sign-out',
      label: <MenuItem onClick={signOutCheck}>{t('avatarMenu.SignOut', lang)}</MenuItem>,
    },
  ];

  const signInMenu: MenuProps['items'] = [
    {
      key: 'signin-default',
      label: <MenuItem onClick={signIn}>{t('avatarMenu.SignInAsMe', lang)}</MenuItem>,
    },
    {
      key: 'signin-anonymously',
      label: <MenuItem onClick={anonymousSignInCheck}>{t('avatarMenu.SignInAnonymously', lang)}</MenuItem>,
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
            <>
              <span style={{ paddingRight: '10px', fontSize: '12px' }}>
                {t('message.ToSaveYourWorkPleaseSignIn', lang)}
              </span>
              <Dropdown menu={{ items: signInMenu }} trigger={['click']}>
                <Button type="primary">{t('avatarMenu.SignIn', lang)}</Button>
              </Dropdown>
            </>
          )}
        </div>
      </Space>
    </ButtonsContainer>
  );
});

export default MainToolBar;
