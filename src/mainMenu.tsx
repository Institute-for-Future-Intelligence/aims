/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import zhCN from 'antd/lib/locale/zh_CN';
import zhTW from 'antd/lib/locale/zh_TW';
import enUS from 'antd/lib/locale/en_US';

import React, { useMemo, useState } from 'react';
import { useStore } from './stores/common';
import styled from 'styled-components';
import {Dropdown, Menu, MenuProps, Radio,} from 'antd';
import logo from './assets/aims-logo-32.png';
import About from './about';
import { saveImage, showInfo } from './helpers';
import * as Selector from './stores/selector';
import { Util } from './Util';
import { useTranslation } from 'react-i18next';
import {usePrimitiveStore} from "./stores/commonPrimitive";
import {UNDO_SHOW_INFO_DURATION} from "./constants";
import {Language} from "./types";

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
    const language = useStore.getState().language;
    const undoManager = useStore.getState().undoManager;
    const cloudFile = useStore.getState().cloudFile;
    const changed = usePrimitiveStore.getState().changed;

    const [aboutUs, setAboutUs] = useState(false);

    // Manually update menu when visible to avoid listen to common store change.
    const [updateMenuFlag, setUpdateMenuFlag] = useState(false);

    const handleVisibleChange = (visible: boolean) => {
        if (visible) {
            setUpdateMenuFlag(!updateMenuFlag);
        }
    };

    const {t} = useTranslation();
    const lang = useMemo(() => {
        return {lng: language};
    }, [language]);

    const isMac = useMemo(() => Util.isMac(), []);

    const takeScreenshot = () => {
        if (canvas) {
            saveImage('screenshot.png', canvas.toDataURL('image/png'));
            if (loggable) {
                setCommonStore((state) => {
                    state.actionInfo = {
                        name: 'Take Screenshot',
                        timestamp: new Date().getTime(),
                    };
                });
            }
        }
    };

    const items: MenuProps['items'] = [
        // file menu
        {
            key: 'file',
            type: 'group',
            label: t('menu.fileSubMenu', lang),
            children: [

                {
                    key: 'create-new-file',
                    label: (
                        <Menu.Item
                            onClick={() => {
                                undoManager.clear();
                                setCommonStore((state) => {
                                    // state.createNewFileFlag = true;
                                    // window.history.pushState({}, document.title, HOME_URL);
                                    if (loggable) {
                                        state.actionInfo = {
                                            name: 'Create New File',
                                            timestamp: new Date().getTime(),
                                        };
                                    }
                                });
                            }}
                        >
                            {t('menu.file.CreateNewFile', lang)}
                            <span style={{paddingLeft: '2px', fontSize: 9}}>({isMac ? '⌘' : 'Ctrl'}+F)</span>
                        </Menu.Item>
                    ),
                },

                {
                    key: 'open-local-file',
                    label: (
                        <Menu.Item
                            onClick={() => {
                                undoManager.clear();
                                setCommonStore((state) => {
                                    // state.openLocalFileFlag = true;
                                    // state.cloudFile = undefined;
                                    // window.history.pushState({}, document.title, HOME_URL);
                                    if (loggable) {
                                        state.actionInfo = {
                                            name: 'Open Local File',
                                            timestamp: new Date().getTime(),
                                        };
                                    }
                                });
                            }}
                        >
                            {t('menu.file.OpenLocalFile', lang)}
                            <span style={{paddingLeft: '2px', fontSize: 9}}>({isMac ? '⌘' : 'Ctrl'}+O)</span>...
                        </Menu.Item>
                    ),
                },

                {
                    key: 'save-local-file',
                    label: (
                        <Menu.Item
                            onClick={() => {
                                usePrimitiveStore.getState().set((state) => {
                                    // state.saveLocalFileDialogVisible = true;
                                });
                                if (loggable) {
                                    setCommonStore((state) => {
                                        state.actionInfo = {
                                            name: 'Save as Local File',
                                            timestamp: new Date().getTime(),
                                        };
                                    });
                                }
                            }}
                        >
                            {t('menu.file.SaveAsLocalFile', lang)}
                            <span style={{paddingLeft: '2px', fontSize: 9}}>({isMac ? '⌘' : 'Ctrl'}+S)</span>...
                        </Menu.Item>
                    ),
                },

                {
                    key: 'open-cloud-file',
                    label: (
                        <Menu.Item
                            onClick={() => {
                                usePrimitiveStore.getState().set((state) => {
                                    // state.listCloudFilesFlag = true;
                                });
                                setCommonStore((state) => {
                                    // state.selectedFloatingWindow = 'cloudFilePanel';
                                });
                                if (loggable) {
                                    setCommonStore((state) => {
                                        state.actionInfo = {
                                            name: 'List Cloud Files',
                                            timestamp: new Date().getTime(),
                                        };
                                    });
                                }
                            }}
                        >
                            {t('menu.file.OpenCloudFile', lang)}
                            <span style={{paddingLeft: '2px', fontSize: 9}}>({isMac ? '⌘' : 'Ctrl'}+Shift+O)</span>...
                        </Menu.Item>
                    ),
                },

                {
                    key: 'save-cloud-file',
                    label: (
                        <Menu.Item
                            onClick={() => {
                                // usePrimitiveStore.getState().setSaveCloudFileFlag(true);
                                if (loggable) {
                                    setCommonStore((state) => {
                                        state.actionInfo = {
                                            name: 'Save Cloud File',
                                            timestamp: new Date().getTime(),
                                        };
                                    });
                                }
                            }}
                        >
                            {t('menu.file.SaveCloudFile', lang)}
                            <span style={{paddingLeft: '2px', fontSize: 9}}>({isMac ? '⌘' : 'Ctrl'}+Shift+S)</span>
                        </Menu.Item>
                    ),
                },

                {
                    key: 'save-as-cloud-file',
                    label: (
                        <Menu.Item
                            onClick={() => {
                                setCommonStore((state) => {
                                    // state.showCloudFileTitleDialogFlag = !state.showCloudFileTitleDialogFlag;
                                    // state.showCloudFileTitleDialog = true;
                                    if (loggable) {
                                        state.actionInfo = {
                                            name: 'Save as Cloud File',
                                            timestamp: new Date().getTime(),
                                        };
                                    }
                                });
                            }}
                        >
                            {t('menu.file.SaveAsCloudFile', lang)}...
                        </Menu.Item>
                    ),
                },

                {
                    key: 'screenshot',
                    label: (
                        <Menu.Item key="screenshot" onClick={takeScreenshot}>
                            {t('menu.file.TakeScreenshot', lang)}
                        </Menu.Item>),
                },
            ],
        },

        // edit menu
        {
            key: 'edit',
            type: 'group',
            label: t('menu.editSubMenu', lang),
            children: [
                {
                    key: 'undo',
                    label: (
                        <Menu.Item
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
                            <span style={{paddingLeft: '2px', fontSize: 9}}>({isMac ? '⌘' : 'Ctrl'}+Z)</span>
                        </Menu.Item>
                    ),
                },
                {
                    key: 'redo',
                    label: (
                        <Menu.Item
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
                            <span style={{paddingLeft: '2px', fontSize: 9}}>({isMac ? '⌘' : 'Ctrl'}+Y)</span>
                        </Menu.Item>
                    ),
                },
            ]
        },

        // view menu
        {
            key: 'view',
            type: 'group',
            label: t('menu.viewSubMenu', lang),
            children: [
                {
                    key: 'zoom-out-view',
                    label: (
                        <Menu.Item
                            onClick={() => {
                                // zoomView(1.1);
                            }}
                            style={{paddingLeft: '36px'}}
                        >
                            {t('menu.view.ZoomOut', lang)}
                            <span style={{paddingLeft: '2px', fontSize: 9}}>({isMac ? '⌘' : 'Ctrl'}+])</span>
                        </Menu.Item>),
                },
                {
                    key: 'zoom-in-view',
                    label: (
                        <Menu.Item
                            onClick={() => {
                                // zoomView(0.9);
                            }}
                            style={{paddingLeft: '36px'}}
                        >
                            {t('menu.view.ZoomIn', lang)}
                            <span style={{paddingLeft: '2px', fontSize: 9}}>({isMac ? '⌘' : 'Ctrl'}+[)</span>
                        </Menu.Item>
                    ),
                },
            ]
        },

        // language menu
        {
            key: 'language',
            type: 'group',
            label: t('menu.languageSubMenu', lang),
            children: [
                {
                    key: 'language',
                    label: (
                        <Radio.Group
                            value={language}
                            style={{height: '100px'}}
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
                    )
                }
            ]
        },

        // about window
        {
            key: 'about',
            label: (
                <Menu.Item
                    onClick={() => {
                        setAboutUs(true);
                    }}
                >
                    {t('menu.AboutUs', lang)}...
                </Menu.Item>),
        }
    ];

    return (
        <>
            <Dropdown menu={{items}} trigger={['click']} onOpenChange={handleVisibleChange}>
                <MainMenuContainer>
                    <StyledImage src={logo} title={t('tooltip.clickToOpenMenu', lang)}/>
                    <LabelContainer>
            <span style={{fontSize: '10px', alignContent: 'center', cursor: 'pointer'}}>
              {t('menu.mainMenu', lang)}
            </span>
                    </LabelContainer>
                </MainMenuContainer>
            </Dropdown>
            {aboutUs && <About close={() => setAboutUs(false)}/>}
        </>
    );
};

export default React.memo(MainMenu);
