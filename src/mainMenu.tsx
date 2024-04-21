/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import zhCN from 'antd/lib/locale/zh_CN';
import zhTW from 'antd/lib/locale/zh_TW';
import enUS from 'antd/lib/locale/en_US';

import React, { useMemo, useState } from 'react';
import { useStore } from './stores/common';
import styled from 'styled-components';
import { Dropdown, MenuProps, Radio } from 'antd';
import logo from './assets/aims-logo-32.png';
import About from './about';
import * as Selector from './stores/selector';
import { Util } from './Util';
import { useTranslation } from 'react-i18next';
import { MenuItem } from './components/menuItem';
import { createProjectMenu } from './components/mainMenu/projectMenu';
import { createViewMenu } from './components/mainMenu/viewMenu';
import { createEditMenu } from './components/mainMenu/editMenu';
import { Language } from './constants';
import { createExamplesMenu } from './components/mainMenu/examplesMenu.tsx';

const radioStyle = {
  display: 'block',
  height: '30px',
  paddingLeft: '10px',
  lineHeight: '30px',
};

const MainMenuContainer = styled.div`
  width: 100px;
`;

const StyledImage = styled.img`
  position: absolute;
  top: 10px;
  left: 30px;
  height: 40px;
  transition: 0.5s;
  opacity: 1;
  cursor: pointer;
  user-select: none;

  &:hover {
    opacity: 0.5;
  }
`;

const LabelContainer = styled.div`
  position: absolute;
  top: 54px;
  left: 0;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  z-index: 9;
`;

const MainMenu = React.memo(({ viewOnly }: { viewOnly: boolean }) => {
  const setCommonStore = useStore(Selector.set);

  const user = useStore.getState().user;
  const language = useStore(Selector.language);
  const undoManager = useStore.getState().undoManager;
  const projectTitle = useStore.getState().projectState.title;

  const [aboutUs, setAboutUs] = useState(false);

  // Manually update menu when visible to avoid listen to common store change.
  const [updateMenuFlag, setUpdateMenuFlag] = useState(false);

  const hasUndo = undoManager.hasUndo();
  const hasRedo = undoManager.hasRedo();

  const handleVisibleChange = (visible: boolean) => {
    if (visible) {
      setUpdateMenuFlag(!updateMenuFlag);
    }
  };

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const isMac = useMemo(() => Util.isMac(), []);

  const keyHome = useMemo(() => {
    const os = Util.getOS();
    if (os) {
      if (os.includes('OS X')) {
        return 'Ctrl+Alt+H';
      }
      if (os.includes('Chrome')) {
        return 'Ctrl+Alt+H';
      }
    }
    return 'Ctrl+Home';
  }, []);

  const createItems = useMemo(() => {
    const items: MenuProps['items'] = [];

    // project menu
    if (!viewOnly && user.uid) {
      items.push({
        key: 'project-sub-menu',
        label: <MenuItem hasPadding={false}>{t('menu.projectSubMenu', lang)}</MenuItem>,
        children: createProjectMenu(isMac),
      });
    }

    // edit menu
    if (hasUndo || hasRedo) {
      items.push({
        key: 'edit-sub-menu',
        label: <MenuItem hasPadding={false}>{t('menu.editSubMenu', lang)}</MenuItem>,
        children: createEditMenu(undoManager, isMac),
      });
    }

    // view menu
    items.push({
      key: 'view-sub-menu',
      label: <MenuItem hasPadding={false}>{t('menu.viewSubMenu', lang)}</MenuItem>,
      children: createViewMenu(keyHome, isMac),
    });

    // examples menu
    items.push({
      key: 'examples-sub-menu',
      label: <MenuItem hasPadding={false}>{t('menu.examplesSubMenu', lang)}</MenuItem>,
      children: createExamplesMenu(viewOnly),
    });

    // language menu
    const languageMenuItems: MenuProps['items'] = [
      {
        key: 'language',
        label: (
          <MenuItem stayAfterClick>
            <Radio.Group
              value={language}
              style={{ height: '100px' }}
              onChange={(e) => {
                setUpdateMenuFlag(!updateMenuFlag);
                setCommonStore((state) => {
                  state.language = e.target.value;
                  switch (state.language) {
                    case 'zh_cn':
                      state.locale = zhCN;
                      break;
                    case 'zh_tw':
                      state.locale = zhTW;
                      break;
                    default:
                      state.locale = enUS;
                  }
                });
              }}
            >
              <Radio style={radioStyle} value={'en'}>
                {Language.English}
              </Radio>
              <Radio style={radioStyle} value={'zh_cn'}>
                {Language.ChineseSimplified}
              </Radio>
              <Radio style={radioStyle} value={'zh_tw'}>
                {Language.ChineseTraditional}
              </Radio>
            </Radio.Group>
          </MenuItem>
        ),
        style: { backgroundColor: 'white' },
      },
    ];
    items.push({ key: 'language-sub-menu', label: t('menu.languageSubMenu', lang), children: languageMenuItems });

    // about window
    items.push({
      key: 'about',
      label: (
        <MenuItem
          onClick={() => {
            setAboutUs(true);
          }}
        >
          {t('menu.AboutUs', lang)}...
        </MenuItem>
      ),
    });

    return items;
  }, [language, hasUndo, hasRedo, user.uid, projectTitle]);

  return (
    <>
      <Dropdown menu={{ items: createItems }} trigger={['click']} onOpenChange={handleVisibleChange}>
        <MainMenuContainer>
          <StyledImage src={logo} title={t('tooltip.clickToOpenMenu', lang)} />
          <LabelContainer>
            <span style={{ fontSize: '10px', alignContent: 'center', cursor: 'pointer' }}>
              {t('menu.mainMenu', lang)}
            </span>
          </LabelContainer>
        </MainMenuContainer>
      </Dropdown>
      {aboutUs && <About close={() => setAboutUs(false)} />}
    </>
  );
});

export default MainMenu;
