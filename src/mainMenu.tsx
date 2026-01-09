/*
 * @Copyright 2023-2026. Institute for Future Intelligence, Inc.
 */

import zhCN from 'antd/lib/locale/zh_CN';
import zhTW from 'antd/lib/locale/zh_TW';
import enUS from 'antd/lib/locale/en_US';

import React, { useMemo, useState } from 'react';
import { useStore } from './stores/common';
import styled from 'styled-components';
import logo from './assets/aims-logo-32.png';
import About from './about';
import * as Selector from './stores/selector';
import { Util } from './Util';
import { useTranslation } from 'react-i18next';
import ProjectMenu from './components/mainMenu/projectMenu';
import ViewMenu from './components/mainMenu/viewMenu';
import EditMenu from './components/mainMenu/editMenu';
import { Language } from './constants';
import ExampleMenu from './components/mainMenu/examplesMenu.tsx';
import AccessoriesMenu from './components/mainMenu/accessoriesMenu.tsx';
import { ClickEvent, Menu, MenuItem, MenuRadioGroup } from '@szhsin/react-menu';
import { MainMenuItem, MainSubMenu } from './components/menuItem.tsx';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import './components/mainMenu/style.css';

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
  const user = useStore(Selector.user);
  const language = useStore(Selector.language);

  const [aboutUs, setAboutUs] = useState(false);

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

  const menuButton = () => (
    <MainMenuContainer>
      <StyledImage src={logo} title={t('tooltip.clickToOpenMenu', lang)} />
      <LabelContainer>
        <span style={{ fontSize: '10px', alignContent: 'center', cursor: 'pointer' }}>{t('menu.mainMenu', lang)}</span>
      </LabelContainer>
    </MainMenuContainer>
  );

  const onLanguageItemClick = (e: ClickEvent) => {
    e.keepOpen = true;
  };

  console.log(user.uid);

  return (
    <>
      <Menu
        menuButton={menuButton}
        menuStyle={{ fontSize: '14px', minWidth: '4rem', borderRadius: '0.35rem' }}
        transition
      >
        {!viewOnly && user.uid && <ProjectMenu isMac={isMac} />}

        {<EditMenu isMac={isMac} />}

        <ViewMenu keyHome={keyHome} isMac={isMac} />

        <AccessoriesMenu />

        <ExampleMenu viewOnly={viewOnly} />

        <MainSubMenu label={t('menu.languageSubMenu', lang)}>
          <MenuRadioGroup
            value={language}
            onRadioChange={(e) => {
              setCommonStore((state) => {
                state.language = e.value;
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
            <MenuItem type="radio" value={'en'} onClick={onLanguageItemClick}>
              {Language.English}
            </MenuItem>
            <MenuItem type="radio" value={'zh_cn'} onClick={onLanguageItemClick}>
              {Language.ChineseSimplified}
            </MenuItem>
            <MenuItem type="radio" value={'zh_tw'} onClick={onLanguageItemClick}>
              {Language.ChineseTraditional}
            </MenuItem>
          </MenuRadioGroup>
        </MainSubMenu>

        <MainMenuItem
          onClick={() => {
            setAboutUs(true);
          }}
        >
          {t('menu.AboutUs', lang)}...
        </MainMenuItem>
      </Menu>
      {aboutUs && <About close={() => setAboutUs(false)} />}
    </>
  );
});

export default MainMenu;
