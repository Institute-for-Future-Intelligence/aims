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
import { Button, Checkbox, Col, Collapse, CollapseProps, ColorPicker, List, Popover, Radio, Row, Select } from 'antd';
import {
  BgColorsOutlined,
  CameraOutlined,
  CarryOutOutlined,
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
import { DataColoring, DatumEntry, MolecularViewerStyle, MoleculeData } from './types';
import TextArea from 'antd/lib/input/TextArea';
import { UndoableChange } from './undo/UndoableChange';
import { STYLE_LABELS } from './scientificConstants';
import { getTestMolecule } from './App';
import ImportMoleculeModal from './ImportMoleculeModal';
import { showError, showInfo } from './helpers';
import ParallelCoordinates from './components/parallelCoordinates';
//@ts-ignore
import { saveSvgAsPng } from 'save-svg-as-png';
import { ProjectUtil } from './ProjectUtil';

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
  position: relative;
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

const SolutionSpaceHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
  padding-bottom: 6px;
  background: white;
`;

const ProjectGallery = ({ relativeWidth, moleculeData }: ProjectGalleryProps) => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const selectedMolecule = useStore(Selector.selectedMolecule);
  const collectedMolecules = useStore(Selector.collectedMolecules);
  const addMolecule = useStore(Selector.addMolecule);
  const removeMolecule = useStore(Selector.removeMolecule);
  const viewerStyle = useStore(Selector.projectViewerStyle);
  const viewerBackground = useStore(Selector.projectViewerBackground);
  const projectInfo = useStore(Selector.projectInfo);
  const molecularPropertiesMap = useStore(Selector.molecularPropertiesMap);

  const [loading, setLoading] = useState(false);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);
  const [updateHiddenFlag, setUpdateHiddenFlag] = useState<boolean>(false);
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

  const weightSelectionRef = useRef<boolean>(true);
  const chargeSelectionRef = useRef<boolean>(true);

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

  const totalHeight = window.innerHeight;
  const canvasColumns = 3;
  const gridGutter = 8;
  const totalWidth = Math.round(window.innerWidth * relativeWidth);
  const canvasWidth = totalWidth / canvasColumns - gridGutter * (canvasColumns - 1);
  const canvasHeight = (canvasWidth * 2) / 3;

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

  const createChooseSolutionSolutionContent = () => {
    return (
      <div>
        <Checkbox
          onChange={(e) => {
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={weightSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.MolecularMass', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={chargeSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.ElectricalCharge', lang)}</span>
        </Checkbox>
      </div>
    );
  };

  const createChooseDataColoringContent = () => {
    return (
      <div>
        <Radio.Group
          onChange={(e) => {
            // selectDataColoring(e.target.value);
          }}
          value={projectInfo.dataColoring ?? DataColoring.ALL}
        >
          <Radio style={{ fontSize: '12px' }} value={DataColoring.ALL}>
            {t('projectPanel.SameColorForAllMolecules', lang)}
          </Radio>
          <br />
          <Radio style={{ fontSize: '12px' }} value={DataColoring.INDIVIDUALS}>
            {t('projectPanel.OneColorForEachMolecule', lang)}
          </Radio>
        </Radio.Group>
      </div>
    );
  };

  const data: DatumEntry[] = useMemo(() => {
    const data: DatumEntry[] = [];
    if (collectedMolecules) {
      for (const m of collectedMolecules) {
        const d = {} as DatumEntry;
        const p = molecularPropertiesMap.get(m.name);
        if (p) {
          d['atomCount'] = p.atomCount;
          d['bondCount'] = p.bondCount;
          d['molecularMass'] = p.mass;
          d['electricalCharge'] = p.charge;
          d['group'] = projectInfo.dataColoring === DataColoring.INDIVIDUALS ? m.name : 'default';
          d['selected'] = selectedMolecule === m;
          // d['hovered'] = hoveredMolecule === m;
          d['invisible'] = false;
          data.push(d);
        }
      }
    }
    return data;
  }, [molecularPropertiesMap, selectedMolecule, collectedMolecules, projectInfo.dataColoring, updateHiddenFlag]);

  const [variables, titles, units, digits, tickIntegers, types] = useMemo(
    () => [
      ProjectUtil.getVariables(),
      ProjectUtil.getTitles(lang),
      ProjectUtil.getUnits(lang),
      ProjectUtil.getDigits(),
      ProjectUtil.getTickIntegers(),
      ProjectUtil.getTypes(),
    ],
    [updateHiddenFlag, lang],
  );

  const minima: number[] = useMemo(() => {
    const array: number[] = [];
    array.push(0);
    array.push(0);
    array.push(0);
    array.push(0);
    return array;
  }, [updateHiddenFlag]);

  const maxima: number[] = useMemo(() => {
    const array: number[] = [];
    array.push(100);
    array.push(100);
    array.push(1);
    array.push(1);
    return array;
  }, [updateHiddenFlag]);

  const steps: number[] = useMemo(() => {
    const array: number[] = [];
    array.push(0.1);
    array.push(0.1);
    array.push(0.1);
    array.push(0.1);
    return array;
  }, [updateHiddenFlag]);

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
              height: totalHeight / 2 - (descriptionExpandedRef.current ? 240 : 160),
              paddingTop: '8px',
              paddingLeft: '8px',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
            grid={{ column: canvasColumns, gutter: 0 }}
            dataSource={moleculeData}
            renderItem={(data: MoleculeData) => {
              return (
                <List.Item style={{ height: canvasHeight }} onMouseOver={() => {}} onMouseLeave={() => {}}>
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
                      width: 'calc(100% - 14px)',
                    }}
                  >
                    {data.name}
                  </div>
                </List.Item>
              );
            }}
          ></List>
          <SolutionSpaceHeader>
            <span style={{ paddingLeft: '20px' }}>{t('projectPanel.DistributionInSolutionSpace', lang)}</span>
            <span>
              <Popover
                title={t('projectPanel.ChooseSolutionSpace', lang)}
                onOpenChange={(visible) => {}}
                content={createChooseSolutionSolutionContent()}
              >
                <Button style={{ border: 'none', paddingRight: 0, background: 'white' }}>
                  <CarryOutOutlined style={{ fontSize: '24px', color: 'gray' }} />
                </Button>
              </Popover>
              <Popover title={t('projectPanel.ChooseDataColoring', lang)} content={createChooseDataColoringContent()}>
                <Button style={{ border: 'none', paddingRight: 0, background: 'white' }}>
                  <BgColorsOutlined style={{ fontSize: '24px', color: 'gray' }} />
                </Button>
              </Popover>
              <Button
                style={{ border: 'none', paddingRight: '20px', background: 'white' }}
                onClick={() => {
                  const d = document.getElementById('design-space');
                  if (d) {
                    saveSvgAsPng(d, 'design-space-' + projectInfo.title + '.png').then(() => {
                      showInfo(t('message.ScreenshotSaved', lang));
                    });
                  }
                }}
              >
                <CameraOutlined
                  style={{ fontSize: '24px', color: 'gray' }}
                  title={t('projectPanel.SolutionSpaceScreenshot', lang)}
                />
              </Button>
            </span>
          </SolutionSpaceHeader>
          {data.length > 0 && (
            <ParallelCoordinates
              id={'solution-space'}
              width={relativeWidth * window.innerWidth}
              height={totalHeight / 2 - 120}
              data={data}
              types={types}
              minima={minima}
              maxima={maxima}
              steps={steps}
              variables={variables}
              titles={titles}
              units={units}
              digits={digits}
              tickIntegers={tickIntegers}
              // hover={hover}
              hoveredIndex={-1}
              selectedIndex={collectedMolecules && selectedMolecule ? collectedMolecules.indexOf(selectedMolecule) : -1}
            />
          )}
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
