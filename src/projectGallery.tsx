/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { DEFAULT_FOV, DEFAULT_SHADOW_CAMERA_FAR, HALF_PI } from './programmaticConstants';
import { OrbitControls } from '@react-three/drei';
import Lights from './lights';
import MolecularViewer from './view/molecularViewer';
import styled from 'styled-components';
import { Button, Col, Collapse, CollapseProps, ColorPicker, List, Popover, Row, Select } from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  EditFilled,
  EditOutlined,
  ImportOutlined,
  SettingOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { useTranslation } from 'react-i18next';
import { MolecularViewerStyle, MoleculeData } from './types';
import TextArea from 'antd/lib/input/TextArea';
import { UndoableChange } from './undo/UndoableChange';
import { STYLE_LABELS } from './scientificConstants';
import { getTestMolecule } from './App';
import ImportMoleculeModal from './ImportMoleculeModal';
import { showError } from './helpers';

export interface ProjectGalleryProps {
  relativeWidth: number; // (0, 1)
  moleculeData: MoleculeData[];
}

const { Option } = Select;

const CanvasContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
`;

const Container = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 30px);
  margin: 0;
  display: flex;
  justify-content: center;
  align-self: center;
  align-content: center;
  align-items: center;
  padding-bottom: 30px;
  opacity: 100%;
  user-select: none;
  tab-index: -1; // set to be not focusable
  z-index: 7; // must be less than other panels
  background: white;
`;

const ColumnWrapper = styled.div`
  background-color: #f8f8f8;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: none;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const Header = styled.div`
  width: 100%;
  height: 24px;
  padding: 10px;
  background-color: #e8e8e8;
  color: #888;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectGallery = ({ relativeWidth, moleculeData }: ProjectGalleryProps) => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const selectedMolecule = useStore(Selector.selectedMolecule);
  const addMolecule = useStore(Selector.addMolecule);
  const removeMolecule = useStore(Selector.removeMolecule);
  const viewerStyle = useStore(Selector.projectViewerStyle);
  const viewerBackground = useStore(Selector.projectViewerBackground);
  const projectInfo = useStore(Selector.projectInfo);

  const [loading, setLoading] = useState(false);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);
  const [moleculeName, setMoleculeName] = useState<string>('Aspirin');
  const [moleculeNameDialogVisible, setMoleculeNameDialogVisible] = useState(false);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const descriptionTextAreaEditableRef = useRef<boolean>(false);
  const descriptionRef = useRef<string | null>(
    projectInfo.description ?? t('projectPanel.WriteABriefDescriptionAboutThisProject', lang),
  );
  const descriptionChangedRef = useRef<boolean>(false);
  const descriptionExpandedRef = useRef<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setUpdateFlag(!updateFlag);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFlag]);

  const canvasColumns = 3;
  const gridGutter = 10;
  const totalWidth = Math.round(window.innerWidth * relativeWidth);
  const canvasWidth = totalWidth / canvasColumns - gridGutter;
  const canvasHeight = canvasWidth * 0.75;

  const createCanvas = (moleculeData: MoleculeData) => {
    return (
      <Canvas
        shadows={false}
        gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
        frameloop={'demand'}
        style={{
          height: canvasHeight + 'px',
          width: canvasWidth + 'px',
          backgroundColor: viewerBackground,
          border: selectedMolecule === moleculeData ? '2px solid red' : '1px solid gray',
        }}
        camera={{
          fov: DEFAULT_FOV,
          far: DEFAULT_SHADOW_CAMERA_FAR,
          up: [0, 0, 1],
          position: [0, 0, 20],
          rotation: [HALF_PI / 2, 0, HALF_PI / 2],
        }}
        onClick={() => {
          setCommonStore((state) => {
            state.selectedMolecule = moleculeData;
          });
        }}
        onDoubleClick={() => {
          setCommonStore((state) => {
            state.selectedMolecule = moleculeData;
            state.loadedMolecule = moleculeData;
          });
        }}
      >
        <OrbitControls />
        <Lights />
        <MolecularViewer moleculeData={moleculeData} style={viewerStyle} />
      </Canvas>
    );
  };

  const closeProject = () => {
    setCommonStore((state) => {
      state.projectView = false;
    });
  };

  const createProjectSettingsContent = useMemo(() => {
    const setStyle = (style: MolecularViewerStyle) => {
      useStore.getState().set((state) => {
        state.projectViewerStyle = style;
      });
    };

    const setBackground = (color: string) => {
      useStore.getState().set((state) => {
        state.projectViewerBackground = color;
      });
    };

    return (
      <div style={{ width: '300px', paddingTop: '10px' }} onClick={(e) => e.stopPropagation()}>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={12} style={{ paddingTop: '5px' }}>
            <span>{t('molecularViewer.Style', lang)}: </span>
          </Col>
          <Col span={12}>
            <Select
              style={{ width: '100%' }}
              value={viewerStyle}
              onChange={(value: MolecularViewerStyle) => {
                const oldValue = viewerStyle;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Molecular Viewer Style for Project',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setStyle(undoableChange.oldValue as MolecularViewerStyle);
                  },
                  redo: () => {
                    setStyle(undoableChange.newValue as MolecularViewerStyle);
                  },
                } as UndoableChange;
                useStore.getState().addUndoable(undoableChange);
                setStyle(newValue);
              }}
            >
              {STYLE_LABELS.map((radio, idx) => (
                <Option key={`${idx}-${radio.value}`} value={radio.value}>
                  {t(radio.label, lang)}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={12} style={{ paddingTop: '5px' }}>
            <span>{t('molecularViewer.BackgroundColor', lang)}: </span>
          </Col>
          <Col span={12}>
            <ColorPicker
              style={{ width: '100%' }}
              showText={true}
              value={viewerBackground}
              onChange={(value, hex) => {
                const selectedColor = hex;
                const undoableChange = {
                  name: 'Change Background Color for Project Viewers',
                  timestamp: Date.now(),
                  oldValue: viewerBackground,
                  newValue: selectedColor,
                  undo: () => {
                    setBackground(undoableChange.oldValue as string);
                  },
                  redo: () => {
                    setBackground(undoableChange.newValue as string);
                  },
                } as UndoableChange;
                useStore.getState().addUndoable(undoableChange);
                setBackground(selectedColor);
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }, [lang, viewerStyle, viewerBackground]);

  const descriptionItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <SubHeader>
          <span>{t('projectPanel.ProjectDescription', lang)}</span>
          <span>
            {
              <>
                {descriptionExpandedRef.current && (
                  <Button
                    style={{ border: 'none', padding: '4px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      descriptionTextAreaEditableRef.current = !descriptionTextAreaEditableRef.current;
                      setUpdateFlag(!updateFlag);
                    }}
                  >
                    {descriptionTextAreaEditableRef.current ? (
                      <EditFilled
                        style={{ fontSize: '24px', color: 'gray' }}
                        title={t('projectPanel.MakeDescriptionNonEditable', lang)}
                      />
                    ) : (
                      <EditOutlined
                        style={{ fontSize: '24px', color: 'gray' }}
                        title={t('projectPanel.MakeDescriptionEditable', lang)}
                      />
                    )}
                  </Button>
                )}
                <Button
                  style={{ border: 'none', padding: '4px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoleculeNameDialogVisible(true);
                  }}
                >
                  <ImportOutlined
                    style={{ fontSize: '24px', color: 'gray' }}
                    title={t('projectPanel.ImportMolecule', lang)}
                  />
                </Button>
                {selectedMolecule && (
                  <Button
                    style={{ border: 'none', padding: '4px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMolecule(selectedMolecule);
                      setCommonStore((state) => {
                        state.selectedMolecule = null;
                      });
                      setUpdateFlag(!updateFlag);
                    }}
                  >
                    <DeleteOutlined
                      style={{ fontSize: '24px', color: 'gray' }}
                      title={t('projectPanel.RemoveSelectedMolecule', lang)}
                    />
                  </Button>
                )}
              </>
            }
            {projectInfo.selectedProperty && (
              <Button
                style={{ border: 'none', padding: '4px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCommonStore((state) => {
                    state.projectInfo.sortDescending = !state.projectInfo.sortDescending;
                  });
                }}
              >
                {projectInfo.sortDescending ? (
                  <SortAscendingOutlined
                    style={{ fontSize: '24px', color: 'gray' }}
                    title={t('projectPanel.ClickToFlipSortingOrder', lang)}
                  />
                ) : (
                  <SortDescendingOutlined
                    style={{ fontSize: '24px', color: 'gray' }}
                    title={t('projectPanel.ClickToFlipSortingOrder', lang)}
                  />
                )}
              </Button>
            )}
            <Popover
              title={<div onClick={(e) => e.stopPropagation()}>{t('projectPanel.ProjectSettings', lang)}</div>}
              content={createProjectSettingsContent}
            >
              <Button style={{ border: 'none', padding: '4px' }} onClick={(e) => e.stopPropagation()}>
                <SettingOutlined style={{ fontSize: '24px', color: 'gray' }} />
              </Button>
            </Popover>
          </span>
        </SubHeader>
      ),
      children: (
        <TextArea
          title={
            descriptionTextAreaEditableRef.current
              ? undefined
              : t('projectPanel.DoubleClickToMakeDescriptionEditable', lang)
          }
          bordered={descriptionTextAreaEditableRef.current}
          readOnly={!descriptionTextAreaEditableRef.current}
          value={descriptionRef.current ?? undefined}
          onDoubleClick={() => {
            descriptionTextAreaEditableRef.current = !descriptionTextAreaEditableRef.current;
            setUpdateFlag(!updateFlag);
          }}
          onChange={(e) => {
            descriptionRef.current = e.target.value;
            descriptionChangedRef.current = true;
            setCommonStore((state) => {
              state.projectInfo.description = e.target.value;
            });
            setUpdateFlag(!updateFlag);
          }}
          onBlur={() => {
            descriptionTextAreaEditableRef.current = false;
            if (descriptionChangedRef.current) {
            }
          }}
          style={{
            paddingLeft: '10px',
            textAlign: 'left',
            resize: descriptionTextAreaEditableRef.current ? 'vertical' : 'none',
          }}
        />
      ),
    },
  ];

  return (
    <Container
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <ColumnWrapper>
        <Header>
          <span>
            {t('projectPanel.Project', lang)} : {projectInfo.title ?? 'Sample'}
          </span>
          <span
            style={{ cursor: 'pointer', paddingRight: '20px' }}
            onMouseDown={() => {
              closeProject();
            }}
            onTouchStart={() => {
              closeProject();
            }}
          >
            <CloseOutlined title={t('word.Close', lang)} />
          </span>
        </Header>
        <Collapse
          items={descriptionItems}
          style={{ backgroundColor: 'white', border: 'none' }}
          onChange={(e) => {
            descriptionExpandedRef.current = e.length > 0;
            setUpdateFlag(!updateFlag);
          }}
        />
        <CanvasContainer>
          <List
            style={{
              width: '100%',
              height: '100%',
              paddingTop: '10px',
              paddingBottom: '0px',
              paddingLeft: '10px',
              paddingRight: '0px',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
            grid={{ column: canvasColumns, gutter: 0 }}
            dataSource={moleculeData}
            renderItem={(data: MoleculeData) => {
              return (
                <List.Item onMouseOver={() => {}} onMouseLeave={() => {}}>
                  {createCanvas(data)}
                  <div
                    style={{
                      position: 'relative',
                      left: '10px',
                      textAlign: 'left',
                      bottom: '18px',
                      color: 'black',
                      fontSize: '10px',
                      fontWeight: 'normal',
                    }}
                  >
                    {data.name}
                  </div>
                </List.Item>
              );
            }}
          ></List>
        </CanvasContainer>
        <ImportMoleculeModal
          importByName={() => {
            const m = getTestMolecule(moleculeName);
            if (m) {
              const added = addMolecule(m);
              if (added) {
                setUpdateFlag(!updateFlag);
              } else {
                showError(t('projectPanel.MoleculeAlreadyAdded', lang) + ': ' + moleculeName, 3);
              }
            } else {
              showError(t('projectPanel.MoleculeNotFound', lang) + ': ' + moleculeName, 3);
            }
          }}
          isLoading={() => loading}
          setName={setMoleculeName}
          getName={() => moleculeName}
          setDialogVisible={setMoleculeNameDialogVisible}
          isDialogVisible={() => moleculeNameDialogVisible}
        />
      </ColumnWrapper>
    </Container>
  );
};

export default React.memo(ProjectGallery);
