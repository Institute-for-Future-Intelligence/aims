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
import { saveImage, showInfo } from './helpers';
import * as Selector from './stores/selector';
import { Util } from './Util';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { UNDO_SHOW_INFO_DURATION } from './programmaticConstants';
import { Language } from './types';
import { MenuItem } from './components/menuItem';

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

export interface MainMenuProps {
  viewOnly: boolean;
  canvas?: HTMLCanvasElement | null;
}

const MainMenu = ({ viewOnly, canvas }: MainMenuProps) => {
  const setCommonStore = useStore(Selector.set);
  const setPrimitiveStore = usePrimitiveStore(Selector.setPrimitiveStore);
  const addUndoable = useStore(Selector.addUndoable);

  const user = useStore.getState().user;
  const loggable = useStore.getState().loggable;
  const language = useStore(Selector.language);
  const undoManager = useStore.getState().undoManager;
  const cloudFile = useStore.getState().cloudFile;
  const changed = usePrimitiveStore.getState().changed;

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

  const createItems = useMemo(() => {
    const items: MenuProps['items'] = [];

    // project menu
    const projectMenuItems: MenuProps['items'] = [];
    items.push({ key: 'project-sub-menu', label: t('menu.projectSubMenu', lang), children: projectMenuItems });
    projectMenuItems.push({
      key: 'create-new-project',
      label: (
        <MenuItem
          onClick={() => {
            undoManager.clear();
            setCommonStore((state) => {
              // state.createNewFileFlag = true;
              // window.history.pushState({}, document.title, HOME_URL);
              if (loggable) {
                state.actionInfo = {
                  name: 'Create New Project',
                  timestamp: new Date().getTime(),
                };
              }
            });
          }}
        >
          {t('menu.project.CreateNewProject', lang)}
          <span style={{ paddingLeft: '2px', fontSize: 9 }}>({isMac ? '⌘' : 'Ctrl'}+F)</span>
        </MenuItem>
      ),
    });
    projectMenuItems.push({
      key: 'open-local-project',
      label: (
        <MenuItem
          onClick={() => {
            undoManager.clear();
            setCommonStore((state) => {
              // state.openLocalFileFlag = true;
              // state.cloudFile = undefined;
              // window.history.pushState({}, document.title, HOME_URL);
              if (loggable) {
                state.actionInfo = {
                  name: 'Open Local Project',
                  timestamp: new Date().getTime(),
                };
              }
            });
          }}
        >
          {t('menu.project.OpenLocalProject', lang)}
          <span style={{ paddingLeft: '2px', fontSize: 9 }}>({isMac ? '⌘' : 'Ctrl'}+O)</span>...
        </MenuItem>
      ),
    });
    projectMenuItems.push({
      key: 'save-local-project',
      label: (
        <MenuItem
          onClick={() => {
            usePrimitiveStore.getState().set((state) => {
              // state.saveLocalFileDialogVisible = true;
            });
            if (loggable) {
              setCommonStore((state) => {
                state.actionInfo = {
                  name: 'Save as Local Project',
                  timestamp: new Date().getTime(),
                };
              });
            }
          }}
        >
          {t('menu.project.SaveAsLocalProject', lang)}
          <span style={{ paddingLeft: '2px', fontSize: 9 }}>({isMac ? '⌘' : 'Ctrl'}+S)</span>...
        </MenuItem>
      ),
    });
    projectMenuItems.push({
      key: 'open-cloud-project',
      label: (
        <MenuItem
          onClick={() => {
            usePrimitiveStore.getState().set((state) => {
              // state.listCloudFilesFlag = true;
            });
            setCommonStore((state) => {
              state.selectedFloatingWindow = 'projectListPanel';
            });
            if (loggable) {
              setCommonStore((state) => {
                state.actionInfo = {
                  name: 'List Cloud Projects',
                  timestamp: new Date().getTime(),
                };
              });
            }
          }}
        >
          {t('menu.project.OpenCloudProject', lang)}
          <span style={{ paddingLeft: '2px', fontSize: 9 }}>({isMac ? '⌘' : 'Ctrl'}+Shift+O)</span>...
        </MenuItem>
      ),
    });
    projectMenuItems.push({
      key: 'save-cloud-project',
      label: (
        <MenuItem
          onClick={() => {
            // usePrimitiveStore.getState().setSaveCloudFileFlag(true);
            if (loggable) {
              setCommonStore((state) => {
                state.actionInfo = {
                  name: 'Save Cloud Project',
                  timestamp: new Date().getTime(),
                };
              });
            }
          }}
        >
          {t('menu.project.SaveCloudProject', lang)}
          <span style={{ paddingLeft: '2px', fontSize: 9 }}>({isMac ? '⌘' : 'Ctrl'}+Shift+S)</span>
        </MenuItem>
      ),
    });
    projectMenuItems.push({
      key: 'save-as-cloud-project',
      label: (
        <MenuItem
          onClick={() => {
            setCommonStore((state) => {
              // state.showCloudFileTitleDialogFlag = !state.showCloudFileTitleDialogFlag;
              // state.showCloudFileTitleDialog = true;
              if (loggable) {
                state.actionInfo = {
                  name: 'Save as Cloud Project',
                  timestamp: new Date().getTime(),
                };
              }
            });
          }}
        >
          {t('menu.project.SaveAsCloudProject', lang)}...
        </MenuItem>
      ),
    });

    // edit menu
    if (hasUndo || hasRedo) {
      const editMenuItems: MenuProps['items'] = [];
      items.push({ key: 'edit-sub-menu', label: t('menu.editSubMenu', lang), children: editMenuItems });
      if (hasUndo) {
        editMenuItems.push({
          key: 'undo',
          label: (
            <MenuItem
              onClick={() => {
                if (undoManager.hasUndo()) {
                  const commandName = undoManager.undo();
                  if (commandName) showInfo(t('menu.edit.Undo', lang) + ': ' + commandName, UNDO_SHOW_INFO_DURATION);
                  if (loggable) {
                    setCommonStore((state) => {
                      state.actionInfo = {
                        name: 'Undo',
                        timestamp: new Date().getTime(),
                      };
                    });
                  }
                }
              }}
            >
              {t('menu.edit.Undo', lang) + ': ' + undoManager.getLastUndoName()}
              <span style={{ paddingLeft: '2px', fontSize: 9 }}>({isMac ? '⌘' : 'Ctrl'}+Z)</span>
            </MenuItem>
          ),
        });
      }
      if (hasRedo) {
        editMenuItems.push({
          key: 'redo',
          label: (
            <MenuItem
              onClick={() => {
                if (undoManager.hasRedo()) {
                  const commandName = undoManager.redo();
                  if (commandName) showInfo(t('menu.edit.Redo', lang) + ': ' + commandName, UNDO_SHOW_INFO_DURATION);
                  if (loggable) {
                    setCommonStore((state) => {
                      state.actionInfo = {
                        name: 'Redo',
                        timestamp: new Date().getTime(),
                      };
                    });
                  }
                }
              }}
            >
              {t('menu.edit.Redo', lang) + ': ' + undoManager.getLastRedoName()}
              <span style={{ paddingLeft: '2px', fontSize: 9 }}>({isMac ? '⌘' : 'Ctrl'}+Y)</span>
            </MenuItem>
          ),
        });
      }
    }

    // view menu
    const viewMenuItems: MenuProps['items'] = [];
    items.push({ key: 'view-sub-menu', label: t('menu.viewSubMenu', lang), children: viewMenuItems });
    viewMenuItems.push({
      key: 'zoom-out-view',
      label: (
        <MenuItem
          onClick={() => {
            // zoomView(1.1);
          }}
        >
          {t('menu.view.ZoomOut', lang)}
          <span style={{ paddingLeft: '2px', fontSize: 9 }}>({isMac ? '⌘' : 'Ctrl'}+])</span>
        </MenuItem>
      ),
    });
    viewMenuItems.push({
      key: 'zoom-in-view',
      label: (
        <MenuItem
          onClick={() => {
            // zoomView(0.9);
          }}
        >
          {t('menu.view.ZoomIn', lang)}
          <span style={{ paddingLeft: '2px', fontSize: 9 }}>({isMac ? '⌘' : 'Ctrl'}+[)</span>
        </MenuItem>
      ),
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
  }, [language, hasUndo, hasRedo]);

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
};

export default React.memo(MainMenu);
