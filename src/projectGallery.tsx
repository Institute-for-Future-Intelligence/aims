/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { DataColoring, GraphType, LabelType, ProjectType } from './constants';
import styled from 'styled-components';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  CollapseProps,
  ColorPicker,
  InputNumber,
  List,
  Popover,
  Radio,
  Row,
  Select,
  Slider,
  Space,
} from 'antd';
import {
  BgColorsOutlined,
  CameraOutlined,
  CarryOutOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditFilled,
  EditOutlined,
  ImportOutlined,
  LineChartOutlined,
  LoginOutlined,
  SettingOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { useTranslation } from 'react-i18next';
import { DatumEntry, MoleculeData } from './types';
import TextArea from 'antd/lib/input/TextArea';
import { UndoableChange } from './undo/UndoableChange';
import ImportMoleculeModal from './ImportMoleculeModal';
import { saveSvg, showError, showInfo } from './helpers';
import ParallelCoordinates from './components/parallelCoordinates';
import { ProjectUtil } from './ProjectUtil';
import { usePrimitiveStore } from './stores/commonPrimitive';
import {
  updateDataColoring,
  updateHiddenProperties,
  updateHorizontalLinesScatterPlot,
  updateLineWidthScatterPlot,
  updateSymbolSizeScatterPlot,
  updateVerticalLinesScatterPlot,
  updateXAxisNameScatterPlot,
  updateXMaxScatterPlot,
  updateXMinScatterPlot,
  updateYAxisNameScatterPlot,
  updateYMaxScatterPlot,
  updateYMinScatterPlot,
} from './cloudProjectUtil';
import { Filter, FilterType } from './Filter';
import {
  GALLERY_STYLE_LABELS,
  MATERIAL_LABELS,
  MolecularViewerMaterial,
  MolecularViewerStyle,
} from './view/displayOptions';
import { commonMolecules, drugMolecules, getMolecule } from './internalDatabase';
import MoleculeContainer from './moleculeContainer';
import { CartesianGrid, Dot, DotProps, Label, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { MolecularProperties } from './models/MolecularProperties.ts';

export interface ProjectGalleryProps {
  relativeWidth: number; // (0, 1)
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-self: center;
  align-content: center;
  align-items: center;
  padding-bottom: 20px;
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

const PropertiesHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
  padding-bottom: 6px;
  background: white;
  font-size: 14px;
`;

const ProjectGallery = React.memo(({ relativeWidth }: ProjectGalleryProps) => {
  const setCommonStore = useStore(Selector.set);
  const user = useStore(Selector.user);
  const language = useStore(Selector.language);
  const loggable = useStore.getState().loggable;
  const selectedMolecule = useStore(Selector.selectedMolecule);
  const hoveredMolecule = usePrimitiveStore(Selector.hoveredMolecule);
  const addMolecule = useStore(Selector.addMolecule);
  const removeMolecule = useStore(Selector.removeMolecule);
  const viewerStyle = useStore(Selector.projectViewerStyle);
  const viewerMaterial = useStore(Selector.projectViewerMaterial);
  const viewerBackground = useStore(Selector.projectViewerBackground);
  const labelType = useStore(Selector.labelType);
  const graphType = useStore(Selector.graphType);
  const projectOwner = useStore(Selector.projectOwner);
  const projectType = useStore(Selector.projectType);
  const projectTitle = useStore(Selector.projectTitle);
  const projectDescription = useStore(Selector.projectDescription);
  const projectSortDescending = useStore(Selector.projectSortDesending);
  const projectDataColoring = useStore(Selector.projectDataColoring);
  const projectFilters = useStore(Selector.projectFilters);
  const projectRanges = useStore(Selector.projectRanges);
  const projectMolecules = useStore(Selector.molecules);
  const selectedProperty = useStore(Selector.selectedProperty);
  const hiddenProperties = useStore(Selector.hiddenProperties);
  const xAxisNameScatterPlot = useStore(Selector.xAxisNameScatterPlot);
  const yAxisNameScatterPlot = useStore(Selector.yAxisNameScatterPlot);
  const xMinScatterPlot = useStore(Selector.xMinScatterPlot) ?? 0;
  const xMaxScatterPlot = useStore(Selector.xMaxScatterPlot) ?? 100;
  const yMinScatterPlot = useStore(Selector.yMinScatterPlot) ?? 0;
  const yMaxScatterPlot = useStore(Selector.yMaxScatterPlot) ?? 100;
  const xLinesScatterPlot = useStore(Selector.xLinesScatterPlot);
  const yLinesScatterPlot = useStore(Selector.yLinesScatterPlot);
  const lineWidthScatterPlot = useStore(Selector.lineWidthScatterPlot);
  const dotSizeScatterPlot = useStore(Selector.dotSizeScatterPlot);
  const molecularPropertiesMap = useStore(Selector.molecularPropertiesMap);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const updateTestMoleculeData = useStore(Selector.updateTestMoleculeData);
  const getProvidedMolecularProperties = useStore(Selector.getProvidedMolecularProperties);

  const [updateFlag, setUpdateFlag] = useState<boolean>(false);
  const [updateHiddenFlag, setUpdateHiddenFlag] = useState<boolean>(false);
  const [moleculeName, setMoleculeName] = useState<string>(
    projectType === ProjectType.DRUG_DISCOVERY ? drugMolecules[0].name : commonMolecules[0].name,
  );
  const [moleculeNameDialogVisible, setMoleculeNameDialogVisible] = useState(false);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const isOwner = user.uid === projectOwner;

  const descriptionTextAreaEditableRef = useRef<boolean>(false);
  const descriptionRef = useRef<string | null>(null);
  const descriptionChangedRef = useRef<boolean>(false);
  const descriptionExpandedRef = useRef<boolean>(false);
  const sortedMoleculesRef = useRef<MoleculeData[]>([]); // store a sorted copy of molecules

  useEffect(() => {
    sortedMoleculesRef.current = [];
    if (projectMolecules) {
      for (const m of projectMolecules) {
        sortedMoleculesRef.current.push(m);
      }
      const p = selectedProperty;
      if (p) {
        const prefix = projectSortDescending ? 1 : -1;
        sortedMoleculesRef.current.sort((a, b) => {
          const propertiesA = molecularPropertiesMap.get(a.name);
          const propertiesB = molecularPropertiesMap.get(b.name);
          if (propertiesA && propertiesB) {
            if (p) {
              if (p in propertiesA && p in propertiesB) {
                // @ts-expect-error: Explain what?
                return prefix * (propertiesA[p] - propertiesB[p]);
              }
            }
            return 0;
          }
          return 0;
        });
      }
      setUpdateFlag(!updateFlag);
    }
  }, [projectMolecules, projectSortDescending, selectedProperty, molecularPropertiesMap]);

  const propertySelectionChangedRef = useRef<boolean>(false);
  const dataColoringSelectionRef = useRef<DataColoring>(projectDataColoring ?? DataColoring.ALL);
  const atomCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('atomCount'));
  const bondCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('bondCount'));
  const massSelectionRef = useRef<boolean>(!hiddenProperties?.includes('molecularMass'));
  const logPSelectionRef = useRef<boolean>(!hiddenProperties?.includes('logP'));
  const hBondDonorCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('hydrogenBondDonorCount'));
  const hBondAcceptorCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('hydrogenBondAcceptorCount'));
  const rotatableBondCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('rotatableBondCount'));
  const polarSurfaceAreaSelectionRef = useRef<boolean>(!hiddenProperties?.includes('polarSurfaceArea'));
  const heavyAtomCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('heavyAtomCount'));
  const complexitySelectionRef = useRef<boolean>(!hiddenProperties?.includes('complexity'));
  const densitySelectionRef = useRef<boolean>(!hiddenProperties?.includes('density'));
  const boilingPointSelectionRef = useRef<boolean>(!hiddenProperties?.includes('boilingPoint'));
  const meltingPointSelectionRef = useRef<boolean>(!hiddenProperties?.includes('meltingPoint'));
  const xAxisRef = useRef<string>(xAxisNameScatterPlot ?? 'atomCount');
  const yAxisRef = useRef<string>(yAxisNameScatterPlot ?? 'bondCount');
  const lineWidthRef = useRef<number>(lineWidthScatterPlot ?? 1);
  const dotSizeRef = useRef<number>(dotSizeScatterPlot ?? 4);
  const xLinesRef = useRef<boolean>(xLinesScatterPlot);
  const yLinesRef = useRef<boolean>(yLinesScatterPlot);

  useEffect(() => {
    if (xLinesScatterPlot) {
      xLinesRef.current = xLinesScatterPlot;
    }
  }, [xLinesScatterPlot]);

  useEffect(() => {
    if (yLinesScatterPlot) {
      yLinesRef.current = yLinesScatterPlot;
    }
  }, [yLinesScatterPlot]);

  useEffect(() => {
    if (dotSizeScatterPlot) {
      dotSizeRef.current = dotSizeScatterPlot;
    }
  }, [dotSizeScatterPlot]);

  useEffect(() => {
    if (lineWidthScatterPlot) {
      lineWidthRef.current = lineWidthScatterPlot;
    }
  }, [lineWidthScatterPlot]);

  useEffect(() => {
    if (xAxisNameScatterPlot) {
      xAxisRef.current = xAxisNameScatterPlot;
    }
  }, [xAxisNameScatterPlot]);

  useEffect(() => {
    if (yAxisNameScatterPlot) {
      yAxisRef.current = yAxisNameScatterPlot;
    }
  }, [yAxisNameScatterPlot]);

  useEffect(() => {
    atomCountSelectionRef.current = !hiddenProperties?.includes('atomCount');
    bondCountSelectionRef.current = !hiddenProperties?.includes('bondCount');
    massSelectionRef.current = !hiddenProperties?.includes('molecularMass');
    logPSelectionRef.current = !hiddenProperties?.includes('logP');
    hBondDonorCountSelectionRef.current = !hiddenProperties?.includes('hydrogenBondDonorCount');
    hBondAcceptorCountSelectionRef.current = !hiddenProperties?.includes('hydrogenBondAcceptorCount');
    rotatableBondCountSelectionRef.current = !hiddenProperties?.includes('rotatableBondCount');
    polarSurfaceAreaSelectionRef.current = !hiddenProperties?.includes('polarSurfaceArea');
    heavyAtomCountSelectionRef.current = !hiddenProperties?.includes('heavyAtomCount');
    complexitySelectionRef.current = !hiddenProperties?.includes('complexity');
    densitySelectionRef.current = !hiddenProperties?.includes('density');
    boilingPointSelectionRef.current = !hiddenProperties?.includes('boilingPoint');
    meltingPointSelectionRef.current = !hiddenProperties?.includes('meltingPoint');
    setUpdateFlag(!updateFlag);
  }, [hiddenProperties]);

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

  useEffect(() => {
    descriptionRef.current = projectDescription ?? t('projectPanel.WriteABriefDescriptionAboutThisProject', lang);
  }, [projectDescription]);

  const totalHeight = window.innerHeight;
  const canvasColumns = 3;
  const gridGutter = 8;
  const totalWidth = Math.round(window.innerWidth * relativeWidth);
  const canvasWidth = totalWidth / canvasColumns - gridGutter * (canvasColumns - 1);
  const canvasHeight = (canvasWidth * 2) / 3;

  const closeProject = () => {
    setCommonStore((state) => {
      state.projectView = false;
    });
  };

  const createProjectSettingsContent = useMemo(() => {
    const setGraphType = (graphType: GraphType) => {
      useStore.getState().set((state) => {
        state.projectState.graphType = graphType;
      });
      setChanged(true);
    };

    const setLabelType = (labelType: LabelType) => {
      useStore.getState().set((state) => {
        state.projectState.labelType = labelType;
      });
      setChanged(true);
    };

    const setStyle = (style: MolecularViewerStyle) => {
      useStore.getState().set((state) => {
        state.projectState.projectViewerStyle = style;
      });
      setChanged(true);
    };

    const setMaterial = (material: MolecularViewerMaterial) => {
      useStore.getState().set((state) => {
        state.projectState.projectViewerMaterial = material;
      });
      setChanged(true);
    };

    const setBackground = (color: string) => {
      useStore.getState().set((state) => {
        state.projectState.projectViewerBackground = color;
      });
      setChanged(true);
    };

    return (
      <div style={{ width: '320px', paddingTop: '10px' }} onClick={(e) => e.stopPropagation()}>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('molecularViewer.Style', lang)}: </span>
          </Col>
          <Col span={14}>
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
              {GALLERY_STYLE_LABELS.map((radio, idx) => (
                <Option key={`${idx}-${radio.value}`} value={radio.value}>
                  {t(radio.label, lang)}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('molecularViewer.Material', lang)}: </span>
          </Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={viewerMaterial}
              onChange={(value: MolecularViewerMaterial) => {
                const oldValue = viewerMaterial;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Molecular Viewer Material for Project',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setMaterial(undoableChange.oldValue as MolecularViewerMaterial);
                  },
                  redo: () => {
                    setMaterial(undoableChange.newValue as MolecularViewerMaterial);
                  },
                } as UndoableChange;
                useStore.getState().addUndoable(undoableChange);
                setMaterial(newValue);
              }}
            >
              {MATERIAL_LABELS.map((radio, idx) => (
                <Option key={`${idx}-${radio.value}`} value={radio.value}>
                  {t(radio.label, lang)}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('projectPanel.LabelType', lang)}: </span>
          </Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={labelType}
              onChange={(value: LabelType) => {
                const oldValue = labelType;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Label Type for Project',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setLabelType(undoableChange.oldValue as LabelType);
                  },
                  redo: () => {
                    setLabelType(undoableChange.newValue as LabelType);
                  },
                } as UndoableChange;
                useStore.getState().addUndoable(undoableChange);
                setLabelType(newValue);
              }}
            >
              <Option key={LabelType.NAME} value={LabelType.NAME}>
                {t('projectPanel.MolecularName', lang)}
              </Option>
              <Option key={LabelType.FORMULA} value={LabelType.FORMULA}>
                {t('projectPanel.MolecularFormula', lang)}
              </Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('projectPanel.GraphType', lang)}: </span>
          </Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={graphType}
              onChange={(value: GraphType) => {
                const oldValue = graphType;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Graph Type for Project',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setGraphType(undoableChange.oldValue as GraphType);
                  },
                  redo: () => {
                    setGraphType(undoableChange.newValue as GraphType);
                  },
                } as UndoableChange;
                useStore.getState().addUndoable(undoableChange);
                setGraphType(newValue);
              }}
            >
              <Option key={GraphType.PARALLEL_COORDINATES} value={GraphType.PARALLEL_COORDINATES}>
                {t('projectPanel.ParallelCoordinates', lang)}
              </Option>
              <Option key={GraphType.SCATTER_PLOT} value={GraphType.SCATTER_PLOT}>
                {t('projectPanel.ScatterPlot', lang)}
              </Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('molecularViewer.BackgroundColor', lang)}: </span>
          </Col>
          <Col span={14}>
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
  }, [lang, viewerStyle, viewerMaterial, viewerBackground, labelType, graphType]);

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
                        state.projectState.selectedMolecule = null;
                      });
                      setUpdateFlag(!updateFlag);
                      setChanged(true);
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
            {selectedProperty && (
              <Button
                style={{ border: 'none', padding: '4px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCommonStore((state) => {
                    state.projectState.sortDescending = !state.projectState.sortDescending;
                  });
                }}
              >
                {projectSortDescending ? (
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
              title={
                <div onClick={(e) => e.stopPropagation()}>
                  <SettingOutlined /> {t('projectPanel.ProjectSettings', lang)}
                </div>
              }
              content={createProjectSettingsContent}
            >
              <Button style={{ border: 'none', padding: '4px' }} onClick={(e) => e.stopPropagation()}>
                <SettingOutlined style={{ fontSize: '24px', color: 'gray' }} />
              </Button>
            </Popover>
            {selectedMolecule && (
              <Button
                style={{ border: 'none', padding: '4px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCommonStore((state) => {
                    state.projectState.testMolecule = selectedMolecule;
                  });
                  updateTestMoleculeData();
                  setChanged(true);
                }}
              >
                <LoginOutlined
                  style={{ fontSize: '24px', color: 'gray' }}
                  title={t('projectPanel.OutputSelectedMoleculeToTest', lang)}
                />
              </Button>
            )}
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
              state.projectState.description = e.target.value;
            });
            setUpdateFlag(!updateFlag);
            setChanged(true);
          }}
          onBlur={() => {
            descriptionTextAreaEditableRef.current = false;
          }}
          style={{
            border: descriptionTextAreaEditableRef.current ? '1px solid gray' : 'none',
            paddingLeft: '10px',
            textAlign: 'left',
            resize: descriptionTextAreaEditableRef.current ? 'vertical' : 'none',
          }}
        />
      ),
    },
  ];

  const localSelectProperty = (selected: boolean, property: string) => {
    setCommonStore((state) => {
      if (state.projectState.hiddenProperties) {
        if (selected) {
          if (state.projectState.hiddenProperties.includes(property)) {
            state.projectState.hiddenProperties.splice(state.projectState.hiddenProperties.indexOf(property), 1);
          }
        } else {
          if (!state.projectState.hiddenProperties.includes(property)) {
            state.projectState.hiddenProperties.push(property);
          }
        }
      }
    });
  };

  const selectProperty = (selected: boolean, property: string) => {
    propertySelectionChangedRef.current = true;
    if (isOwner) {
      if (user.uid && projectTitle) {
        updateHiddenProperties(user.uid, projectTitle, property, !selected).then(() => {
          localSelectProperty(selected, property);
        });
      }
    } else {
      localSelectProperty(selected, property);
    }
    setChanged(true);
  };

  const createChoosePropertiesContent = () => {
    return (
      <div>
        <Checkbox
          onChange={(e) => {
            atomCountSelectionRef.current = e.target.checked;
            selectProperty(atomCountSelectionRef.current, 'atomCount');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={atomCountSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.AtomCount', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            bondCountSelectionRef.current = e.target.checked;
            selectProperty(bondCountSelectionRef.current, 'bondCount');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={bondCountSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.BondCount', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            massSelectionRef.current = e.target.checked;
            selectProperty(massSelectionRef.current, 'molecularMass');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={massSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.MolecularMass', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            logPSelectionRef.current = e.target.checked;
            selectProperty(logPSelectionRef.current, 'logP');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={logPSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>log P</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            hBondDonorCountSelectionRef.current = e.target.checked;
            selectProperty(hBondDonorCountSelectionRef.current, 'hydrogenBondDonorCount');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={hBondDonorCountSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.HydrogenBondDonorCount', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            hBondAcceptorCountSelectionRef.current = e.target.checked;
            selectProperty(hBondAcceptorCountSelectionRef.current, 'hydrogenBondAcceptorCount');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={hBondAcceptorCountSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.HydrogenBondAcceptorCount', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            rotatableBondCountSelectionRef.current = e.target.checked;
            selectProperty(rotatableBondCountSelectionRef.current, 'rotatableBondCount');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={rotatableBondCountSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.RotatableBondCount', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            polarSurfaceAreaSelectionRef.current = e.target.checked;
            selectProperty(polarSurfaceAreaSelectionRef.current, 'polarSurfaceArea');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={polarSurfaceAreaSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.PolarSurfaceArea', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            heavyAtomCountSelectionRef.current = e.target.checked;
            selectProperty(heavyAtomCountSelectionRef.current, 'heavyAtomCount');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={heavyAtomCountSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.HeavyAtomCount', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            complexitySelectionRef.current = e.target.checked;
            selectProperty(complexitySelectionRef.current, 'complexity');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={complexitySelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.Complexity', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            densitySelectionRef.current = e.target.checked;
            selectProperty(densitySelectionRef.current, 'density');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={densitySelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.Density', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            boilingPointSelectionRef.current = e.target.checked;
            selectProperty(boilingPointSelectionRef.current, 'boilingPoint');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={boilingPointSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.BoilingPoint', lang)}</span>
        </Checkbox>
        <br />
        <Checkbox
          onChange={(e) => {
            meltingPointSelectionRef.current = e.target.checked;
            selectProperty(meltingPointSelectionRef.current, 'meltingPoint');
            setUpdateHiddenFlag(!updateHiddenFlag);
          }}
          checked={meltingPointSelectionRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.MeltingPoint', lang)}</span>
        </Checkbox>
      </div>
    );
  };

  const localSelectDataColoring = () => {
    setCommonStore((state) => {
      state.projectState.dataColoring = dataColoringSelectionRef.current;
    });
    usePrimitiveStore.getState().set((state) => {
      state.updateProjectsFlag = true;
    });
    setUpdateFlag(!updateFlag);
  };

  const selectDataColoring = (value: DataColoring) => {
    dataColoringSelectionRef.current = value;
    if (isOwner) {
      if (user.uid && projectTitle) {
        updateDataColoring(user.uid, projectTitle, dataColoringSelectionRef.current).then(() => {
          localSelectDataColoring();
        });
      }
    } else {
      localSelectDataColoring();
    }
    setChanged(true);
  };

  const createChooseDataColoringContent = () => {
    return (
      <div>
        <Radio.Group
          onChange={(e) => {
            selectDataColoring(e.target.value);
          }}
          value={projectDataColoring ?? DataColoring.ALL}
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
    if (projectMolecules) {
      for (const m of projectMolecules) {
        const d = {} as DatumEntry;
        const p = molecularPropertiesMap.get(m.name);
        if (p) {
          if (!hiddenProperties?.includes('atomCount')) d['atomCount'] = p.atomCount;
          if (!hiddenProperties?.includes('bondCount')) d['bondCount'] = p.bondCount;
          if (!hiddenProperties?.includes('molecularMass')) d['molecularMass'] = p.molecularMass;
          if (!hiddenProperties?.includes('logP')) d['logP'] = p.logP;
          if (!hiddenProperties?.includes('hydrogenBondDonorCount'))
            d['hydrogenBondDonorCount'] = p.hydrogenBondDonorCount;
          if (!hiddenProperties?.includes('hydrogenBondAcceptorCount'))
            d['hydrogenBondAcceptorCount'] = p.hydrogenBondAcceptorCount;
          if (!hiddenProperties?.includes('rotatableBondCount')) d['rotatableBondCount'] = p.rotatableBondCount;
          if (!hiddenProperties?.includes('polarSurfaceArea')) d['polarSurfaceArea'] = p.polarSurfaceArea;
          if (!hiddenProperties?.includes('heavyAtomCount')) d['heavyAtomCount'] = p.heavyAtomCount;
          if (!hiddenProperties?.includes('complexity')) d['complexity'] = p.complexity;
          if (!hiddenProperties?.includes('density')) d['density'] = p.density;
          if (!hiddenProperties?.includes('boilingPoint')) d['boilingPoint'] = p.boilingPoint;
          if (!hiddenProperties?.includes('meltingPoint')) d['meltingPoint'] = p.meltingPoint;
          d['group'] = projectDataColoring === DataColoring.INDIVIDUALS ? m.name : 'default';
          d['selected'] = selectedMolecule === m;
          d['hovered'] = hoveredMolecule === m;
          d['excluded'] = projectFilters ? ProjectUtil.isExcluded(projectFilters, p) : false;
          d['invisible'] = !!m.invisible;
          data.push(d);
        }
      }
    }
    return data;
  }, [
    molecularPropertiesMap,
    hoveredMolecule,
    selectedMolecule,
    projectMolecules,
    projectDataColoring,
    projectFilters,
    hiddenProperties,
    updateHiddenFlag,
  ]);

  const [variables, titles, units, digits, tickIntegers, types] = useMemo(
    () => [
      ProjectUtil.getVariables(hiddenProperties ?? []),
      ProjectUtil.getTitles(hiddenProperties ?? [], lang),
      ProjectUtil.getUnits(hiddenProperties ?? []),
      ProjectUtil.getDigits(hiddenProperties ?? []),
      ProjectUtil.getTickIntegers(hiddenProperties ?? []),
      ProjectUtil.getTypes(hiddenProperties ?? []),
    ],
    [updateHiddenFlag, lang, hiddenProperties],
  );

  const getMin = (variable: string, defaultValue: number) => {
    let min = defaultValue;
    if (projectRanges) {
      for (const r of projectRanges) {
        if (r.variable === variable) {
          min = r.minimum ?? defaultValue;
          break;
        }
      }
    }
    return min;
  };

  const getMax = (variable: string, defaultValue: number) => {
    let max = defaultValue;
    if (projectRanges) {
      for (const r of projectRanges) {
        if (r.variable === variable) {
          max = r.maximum ?? defaultValue;
          break;
        }
      }
    }
    return max;
  };

  const minima: number[] = useMemo(() => {
    const array: number[] = [];
    if (!hiddenProperties?.includes('atomCount')) array.push(getMin('atomCount', 0));
    if (!hiddenProperties?.includes('bondCount')) array.push(getMin('bondCount', 0));
    if (!hiddenProperties?.includes('molecularMass')) array.push(getMin('molecularMass', 0));
    if (!hiddenProperties?.includes('logP')) array.push(getMin('logP', -10));
    if (!hiddenProperties?.includes('hydrogenBondDonorCount')) array.push(getMin('hydrogenBondDonorCount', 0));
    if (!hiddenProperties?.includes('hydrogenBondAcceptorCount')) array.push(getMin('hydrogenBondAcceptorCount', 0));
    if (!hiddenProperties?.includes('rotatableBondCount')) array.push(getMin('rotatableBondCount', 0));
    if (!hiddenProperties?.includes('polarSurfaceArea')) array.push(getMin('polarSurfaceArea', 0));
    if (!hiddenProperties?.includes('heavyAtomCount')) array.push(getMin('heavyAtomCount', 0));
    if (!hiddenProperties?.includes('complexity')) array.push(getMin('complexity', 0));
    if (!hiddenProperties?.includes('density')) array.push(getMin('density', 0));
    if (!hiddenProperties?.includes('boilingPoint')) array.push(getMin('boilingPoint', -100));
    if (!hiddenProperties?.includes('meltingPoint')) array.push(getMin('meltingPoint', -100));
    return array;
  }, [updateHiddenFlag, projectRanges, hiddenProperties]);

  const maxima: number[] = useMemo(() => {
    const array: number[] = [];
    if (!hiddenProperties?.includes('atomCount')) array.push(getMax('atomCount', 200));
    if (!hiddenProperties?.includes('bondCount')) array.push(getMax('bondCount', 200));
    if (!hiddenProperties?.includes('molecularMass')) array.push(getMax('molecularMass', 1000));
    if (!hiddenProperties?.includes('logP')) array.push(getMax('logP', 10));
    if (!hiddenProperties?.includes('hydrogenBondDonorCount')) array.push(getMax('hydrogenBondDonorCount', 20));
    if (!hiddenProperties?.includes('hydrogenBondAcceptorCount')) array.push(getMax('hydrogenBondAcceptorCount', 20));
    if (!hiddenProperties?.includes('rotatableBondCount')) array.push(getMax('rotatableBondCount', 20));
    if (!hiddenProperties?.includes('polarSurfaceArea')) array.push(getMax('polarSurfaceArea', 200));
    if (!hiddenProperties?.includes('heavyAtomCount')) array.push(getMax('heavyAtomCount', 200));
    if (!hiddenProperties?.includes('complexity')) array.push(getMax('complexity', 2000));
    if (!hiddenProperties?.includes('density')) array.push(getMax('density', 5));
    if (!hiddenProperties?.includes('boilingPoint')) array.push(getMax('boilingPoint', 200));
    if (!hiddenProperties?.includes('meltingPoint')) array.push(getMax('meltingPoint', 50));
    return array;
  }, [updateHiddenFlag, projectRanges, hiddenProperties]);

  const steps: number[] = useMemo(() => {
    const array: number[] = [];
    if (!hiddenProperties?.includes('atomCount')) array.push(1);
    if (!hiddenProperties?.includes('bondCount')) array.push(1);
    if (!hiddenProperties?.includes('molecularMass')) array.push(0.1);
    if (!hiddenProperties?.includes('logP')) array.push(0.1);
    if (!hiddenProperties?.includes('hydrogenBondDonorCount')) array.push(1);
    if (!hiddenProperties?.includes('hydrogenBondAcceptorCount')) array.push(1);
    if (!hiddenProperties?.includes('rotatableBondCount')) array.push(1);
    if (!hiddenProperties?.includes('polarSurfaceArea')) array.push(1);
    if (!hiddenProperties?.includes('heavyAtomCount')) array.push(1);
    if (!hiddenProperties?.includes('complexity')) array.push(1);
    if (!hiddenProperties?.includes('density')) array.push(0.1);
    if (!hiddenProperties?.includes('boilingPoint')) array.push(1);
    if (!hiddenProperties?.includes('meltingPoint')) array.push(1);
    return array;
  }, [updateHiddenFlag, hiddenProperties]);

  const getFilterLowerBound = (variable: string, defaultValue: number) => {
    let lowerBound = defaultValue;
    if (projectFilters) {
      for (const f of projectFilters) {
        if (f.variable === variable) {
          lowerBound = f.lowerBound ?? defaultValue;
          break;
        }
      }
    }
    return lowerBound;
  };

  const getFilterUpperBound = (variable: string, defaultValue: number) => {
    let upperBound = defaultValue;
    if (projectFilters) {
      for (const f of projectFilters) {
        if (f.variable === variable) {
          upperBound = f.upperBound ?? defaultValue;
          break;
        }
      }
    }
    return upperBound;
  };

  const createFilter = (variable: string, defaultUpperBound: number, defaultLowerBound: number) => {
    return {
      variable,
      type: FilterType.Between,
      upperBound: getFilterUpperBound(variable, defaultUpperBound),
      lowerBound: getFilterLowerBound(variable, defaultLowerBound),
    } as Filter;
  };

  const filters: Filter[] = useMemo(() => {
    const array: Filter[] = [];
    if (!hiddenProperties?.includes('atomCount'))
      array.push({ variable: 'atomCount', type: FilterType.None } as Filter);
    if (!hiddenProperties?.includes('bondCount'))
      array.push({ variable: 'bondCount', type: FilterType.None } as Filter);
    if (!hiddenProperties?.includes('molecularMass')) array.push(createFilter('molecularMass', 500, 0));
    if (!hiddenProperties?.includes('logP')) array.push(createFilter('logP', 5, -5));
    if (!hiddenProperties?.includes('hydrogenBondDonorCount')) array.push(createFilter('hydrogenBondDonorCount', 5, 0));
    if (!hiddenProperties?.includes('hydrogenBondAcceptorCount'))
      array.push(createFilter('hydrogenBondAcceptorCount', 10, 0));
    if (!hiddenProperties?.includes('rotatableBondCount')) array.push(createFilter('rotatableBondCount', 10, 0));
    if (!hiddenProperties?.includes('polarSurfaceArea')) array.push(createFilter('polarSurfaceArea', 140, 0));
    if (!hiddenProperties?.includes('heavyAtomCount')) array.push(createFilter('heavyAtomCount', 100, 1));
    if (!hiddenProperties?.includes('complexity')) array.push(createFilter('complexity', 1000, 0));
    if (!hiddenProperties?.includes('density')) array.push(createFilter('density', 5, 0));
    if (!hiddenProperties?.includes('boilingPoint')) array.push(createFilter('boilingPoint', 200, 0));
    if (!hiddenProperties?.includes('meltingPoint')) array.push(createFilter('meltingPoint', 50, 0));
    return array;
  }, [updateHiddenFlag, projectFilters, hiddenProperties]);

  const createGraphSettingsContent = () => {
    return (
      <div>
        <Space style={{ fontSize: '12px', paddingBottom: '8px' }}>
          <Space>{t('projectPanel.GridLines', lang) + ':'}</Space>
          <Checkbox
            onChange={(e) => {
              const checked = e.target.checked;
              xLinesRef.current = checked;
              if (isOwner) {
                if (user.uid && projectTitle) {
                  updateHorizontalLinesScatterPlot(user.uid, projectTitle, checked).then(() => {
                    setCommonStore((state) => {
                      state.projectState.xLinesScatterPlot = checked;
                    });
                  });
                }
              }
              setChanged(true);
            }}
            checked={xLinesRef.current}
          >
            <span style={{ fontSize: '12px' }}>{t('projectPanel.HorizontalLines', lang)}</span>
          </Checkbox>
          <Checkbox
            onChange={(e) => {
              const checked = e.target.checked;
              yLinesRef.current = checked;
              if (isOwner) {
                if (user.uid && projectTitle) {
                  updateVerticalLinesScatterPlot(user.uid, projectTitle, checked).then(() => {
                    setCommonStore((state) => {
                      state.projectState.yLinesScatterPlot = checked;
                    });
                  });
                }
              }
              setChanged(true);
            }}
            checked={yLinesRef.current}
          >
            <span style={{ fontSize: '12px' }}>{t('projectPanel.VerticalLines', lang)}</span>
          </Checkbox>
        </Space>
        <br />
        <Space style={{ fontSize: '12px' }}>
          <Space style={{ width: '80px' }}>{t('projectPanel.SymbolSize', lang) + ':'}</Space>
          <Slider
            style={{ width: '120px' }}
            min={0}
            max={10}
            value={dotSizeRef.current}
            onChange={(v) => {
              dotSizeRef.current = v;
              if (isOwner) {
                if (user.uid && projectTitle) {
                  updateSymbolSizeScatterPlot(user.uid, projectTitle, v).then(() => {
                    setCommonStore((state) => {
                      state.projectState.dotSizeScatterPlot = v;
                    });
                  });
                }
              }
              setChanged(true);
            }}
          />
        </Space>
        <br />
        <Space style={{ fontSize: '12px' }}>
          <Space style={{ width: '80px' }}>{t('projectPanel.LineWidth', lang) + ':'}</Space>
          <Slider
            style={{ width: '120px' }}
            min={0}
            max={6}
            value={lineWidthRef.current}
            onChange={(v) => {
              lineWidthRef.current = v;
              if (isOwner) {
                if (user.uid && projectTitle) {
                  updateLineWidthScatterPlot(user.uid, projectTitle, v).then(() => {
                    setCommonStore((state) => {
                      state.projectState.lineWidthScatterPlot = v;
                    });
                  });
                }
              }
              setChanged(true);
            }}
          />
        </Space>
      </div>
    );
  };

  const createAxisOptions = () => {
    return (
      <>
        <Option key={'atomCount'} value={'atomCount'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.AtomCount', lang)}</span>
        </Option>
        <Option key={'bondCount'} value={'bondCount'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.BondCount', lang)}</span>
        </Option>
        <Option key={'molecularMass'} value={'molecularMass'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.MolecularMass', lang)}</span>
        </Option>
        <Option key={'logP'} value={'logP'}>
          <span style={{ fontSize: '12px' }}>logP</span>
        </Option>
        <Option key={'hydrogenBondDonorCount'} value={'hydrogenBondDonorCount'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.HydrogenBondDonorCount', lang)}</span>
        </Option>
        <Option key={'hydrogenBondAcceptorCount'} value={'hydrogenBondAcceptorCount'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.HydrogenBondAcceptorCount', lang)}</span>
        </Option>
        <Option key={'rotatableBondCount'} value={'rotatableBondCount'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.RotatableBondCount', lang)}</span>
        </Option>
        <Option key={'polarSurfaceArea'} value={'polarSurfaceArea'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.PolarSurfaceArea', lang)}</span>
        </Option>
        <Option key={'heavyAtomCount'} value={'heavyAtomCount'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.HeavyAtomCount', lang)}</span>
        </Option>
        <Option key={'complexity'} value={'complexity'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.Complexity', lang)}</span>
        </Option>
        <Option key={'density'} value={'density'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.Density', lang)}</span>
        </Option>
        <Option key={'boilingPoint'} value={'boilingPoint'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.BoilingPoint', lang)}</span>
        </Option>
        <Option key={'meltingPoint'} value={'meltingPoint'}>
          <span style={{ fontSize: '12px' }}>{t('projectPanel.MeltingPoint', lang)}</span>
        </Option>
      </>
    );
  };

  const createCoordinateSystemSettingsContent = () => {
    return (
      <div style={{ width: '280px' }}>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.SelectXAxis', lang)}: </span>
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '100%' }}
              value={xAxisRef.current}
              onChange={(value) => {
                xAxisRef.current = value;
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateXAxisNameScatterPlot(user.uid, projectTitle, value).then(() => {
                      setCommonStore((state) => {
                        state.projectState.xAxisNameScatterPlot = value;
                      });
                    });
                  }
                }
                setChanged(true);
                setUpdateFlag(!updateFlag);
              }}
            >
              {createAxisOptions()}
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '8px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.SelectYAxis', lang)}: </span>
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '100%' }}
              value={yAxisRef.current}
              onChange={(value) => {
                yAxisRef.current = value;
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateYAxisNameScatterPlot(user.uid, projectTitle, value).then(() => {
                      setCommonStore((state) => {
                        state.projectState.yAxisNameScatterPlot = value;
                      });
                    });
                  }
                }
                setChanged(true);
                setUpdateFlag(!updateFlag);
              }}
            >
              {createAxisOptions()}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.MinimumX', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              style={{ width: '100%' }}
              // min={0}
              // max={1}
              step={1}
              value={xMinScatterPlot}
              onChange={(value) => {
                if (value === null) return;
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateXMinScatterPlot(user.uid, projectTitle, value).then(() => {
                      setCommonStore((state) => {
                        state.projectState.xMinScatterPlot = value;
                      });
                    });
                  }
                }
                setUpdateFlag(!updateFlag);
                setChanged(true);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.MaximumX', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              style={{ width: '100%' }}
              // min={0}
              // max={1}
              step={1}
              value={xMaxScatterPlot}
              onChange={(value) => {
                if (value === null) return;
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateXMaxScatterPlot(user.uid, projectTitle, value).then(() => {
                      setCommonStore((state) => {
                        state.projectState.xMaxScatterPlot = value;
                      });
                    });
                  }
                }
                setUpdateFlag(!updateFlag);
                setChanged(true);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.MinimumY', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              style={{ width: '100%' }}
              // min={0}
              // max={1}
              step={1}
              value={yMinScatterPlot}
              onChange={(value) => {
                if (value === null) return;
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateYMinScatterPlot(user.uid, projectTitle, value).then(() => {
                      setCommonStore((state) => {
                        state.projectState.yMinScatterPlot = value;
                      });
                    });
                  }
                }
                setUpdateFlag(!updateFlag);
                setChanged(true);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.MaximumY', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              style={{ width: '100%' }}
              // min={0}
              // max={1}
              step={1}
              value={yMaxScatterPlot}
              onChange={(value) => {
                if (value === null) return;
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateYMaxScatterPlot(user.uid, projectTitle, value).then(() => {
                      setCommonStore((state) => {
                        state.projectState.yMaxScatterPlot = value;
                      });
                    });
                  }
                }
                setUpdateFlag(!updateFlag);
                setChanged(true);
              }}
            />
          </Col>
        </Row>
      </div>
    );
  };

  const scatterData = useMemo(() => {
    const data: { x: number; y: number }[] = [];
    if (projectMolecules) {
      for (const m of projectMolecules) {
        const prop = molecularPropertiesMap.get(m.name);
        if (prop) {
          const x = prop[xAxisRef.current as keyof MolecularProperties];
          const y = prop[yAxisRef.current as keyof MolecularProperties];
          if (typeof x === 'number' && typeof y === 'number') {
            data.push({ x, y });
          }
        }
      }
    }
    return data;
  }, [xAxisRef.current, yAxisRef.current, projectMolecules, molecularPropertiesMap]);

  const RenderDot: FC<DotProps> = ({ cx, cy }) => {
    return <Dot cx={cx} cy={cy} fill="#8884d8" r={dotSizeRef.current} />;
  };

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
            {t('projectPanel.Project', lang)} :{' '}
            {t(projectType === ProjectType.DRUG_DISCOVERY ? 'term.DrugDiscovery' : 'term.QSARModeling', lang)}
          </span>
          <span
            style={{ cursor: 'pointer' }}
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
          <div
            style={{
              width: '100%',
            }}
            onClick={() => {
              setCommonStore((state) => {
                state.projectState.selectedMolecule = null;
              });
              setChanged(true);
            }}
          >
            <List
              style={{
                height: totalHeight / 2 - (descriptionExpandedRef.current ? 160 : 80),
                paddingTop: '8px',
                paddingLeft: '8px',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
              locale={{ emptyText: t('projectPanel.NoMolecule', lang) }}
              grid={{ column: canvasColumns, gutter: 0 }}
              dataSource={sortedMoleculesRef.current}
              renderItem={(data: MoleculeData) => {
                const prop = getProvidedMolecularProperties(data.name);
                return (
                  <List.Item
                    style={{ height: canvasHeight }}
                    onMouseOver={() => {
                      usePrimitiveStore.getState().set((state) => {
                        state.hoveredMolecule = data;
                      });
                    }}
                    onMouseLeave={() => {
                      usePrimitiveStore.getState().set((state) => {
                        state.hoveredMolecule = null;
                      });
                    }}
                  >
                    <MoleculeContainer
                      width={canvasWidth}
                      height={canvasHeight}
                      moleculeData={data}
                      selected={selectedMolecule?.name === data.name}
                    />
                    <div
                      style={{
                        position: 'relative',
                        left: '10px',
                        textAlign: 'left',
                        bottom: labelType === LabelType.FORMULA ? '26px' : '18px',
                        color: 'gray',
                        fontSize: labelType === LabelType.FORMULA ? '14px' : '10px',
                        fontWeight: 'normal',
                        width: 'calc(100% - 14px)',
                      }}
                    >
                      {labelType === LabelType.FORMULA ? prop?.formula ?? data.name : data.name}
                    </div>
                  </List.Item>
                );
              }}
            />
          </div>

          {/*parallel coordinates*/}

          {data.length > 0 && graphType === GraphType.PARALLEL_COORDINATES && (
            <PropertiesHeader>
              <span style={{ paddingLeft: '20px' }}>{t('projectPanel.Properties', lang)}</span>
              <span>
                <Popover
                  title={
                    <div onClick={(e) => e.stopPropagation()}>
                      <CarryOutOutlined /> {t('projectPanel.ChooseProperties', lang)}
                    </div>
                  }
                  onOpenChange={(visible) => {
                    // TODO
                  }}
                  content={createChoosePropertiesContent()}
                >
                  <Button style={{ border: 'none', paddingRight: 0, background: 'white' }}>
                    <CarryOutOutlined style={{ fontSize: '24px', color: 'gray' }} />
                  </Button>
                </Popover>
                <Popover
                  title={
                    <div onClick={(e) => e.stopPropagation()}>
                      <BgColorsOutlined /> {t('projectPanel.ChooseDataColoring', lang)}
                    </div>
                  }
                  content={createChooseDataColoringContent()}
                >
                  <Button style={{ border: 'none', paddingRight: 0, background: 'white' }}>
                    <BgColorsOutlined style={{ fontSize: '24px', color: 'gray' }} />
                  </Button>
                </Popover>
                <Button
                  style={{ border: 'none', paddingRight: '20px', background: 'white' }}
                  onClick={() => {
                    saveSvg('parallel-coordinates')
                      .then(() => {
                        showInfo(t('message.ScreenshotSaved', lang));
                        if (loggable) {
                          setCommonStore((state) => {
                            state.actionInfo = {
                              name: 'Take Screenshot of Property Space',
                              timestamp: new Date().getTime(),
                            };
                          });
                        }
                      })
                      .catch((reason) => {
                        showError(reason);
                      });
                  }}
                >
                  <CameraOutlined
                    style={{ fontSize: '24px', color: 'gray' }}
                    title={t('projectPanel.GraphScreenshot', lang)}
                  />
                </Button>
              </span>
            </PropertiesHeader>
          )}
          {data.length > 0 && graphType === GraphType.PARALLEL_COORDINATES && (
            <ParallelCoordinates
              id={'parallel-coordinates'}
              width={relativeWidth * window.innerWidth}
              height={totalHeight / 2 - 130}
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
              filters={filters}
              hover={(i: number) => {
                usePrimitiveStore.getState().set((state) => {
                  for (const [index, m] of projectMolecules.entries()) {
                    if (index === i) {
                      state.hoveredMolecule = m;
                      break;
                    }
                  }
                });
              }}
              hoveredIndex={projectMolecules && hoveredMolecule ? projectMolecules.indexOf(hoveredMolecule) : -1}
              selectedIndex={projectMolecules && selectedMolecule ? projectMolecules.indexOf(selectedMolecule) : -1}
            />
          )}

          {/*scatter plot*/}

          {data.length > 0 && graphType === GraphType.SCATTER_PLOT && (
            <PropertiesHeader>
              <span style={{ paddingLeft: '20px' }}>{t('projectPanel.Relationship', lang)}</span>
              <span>
                <Popover
                  title={
                    <div onClick={(e) => e.stopPropagation()}>
                      <LineChartOutlined /> {t('projectPanel.CoordinateSystemSettings', lang)}
                    </div>
                  }
                  content={createCoordinateSystemSettingsContent()}
                >
                  <Button style={{ border: 'none', paddingRight: 0, background: 'white' }}>
                    <LineChartOutlined style={{ fontSize: '24px', color: 'gray' }} />
                  </Button>
                </Popover>
                <Popover
                  title={
                    <div onClick={(e) => e.stopPropagation()}>
                      <TableOutlined /> {t('projectPanel.ScatterPlotSettings', lang)}
                    </div>
                  }
                  content={createGraphSettingsContent()}
                >
                  <Button style={{ border: 'none', paddingRight: 0, background: 'white' }}>
                    <TableOutlined style={{ fontSize: '24px', color: 'gray' }} />
                  </Button>
                </Popover>
                <Button
                  style={{ border: 'none', paddingRight: '20px', background: 'white' }}
                  onClick={() => {
                    saveSvg('scatter-plot')
                      .then(() => {
                        showInfo(t('message.ScreenshotSaved', lang));
                        if (loggable) {
                          setCommonStore((state) => {
                            state.actionInfo = {
                              name: 'Take Screenshot of the Scatter Plot',
                              timestamp: new Date().getTime(),
                            };
                          });
                        }
                      })
                      .catch((reason) => {
                        showError(reason);
                      });
                  }}
                >
                  <CameraOutlined
                    style={{ fontSize: '24px', color: 'gray' }}
                    title={t('projectPanel.GraphScreenshot', lang)}
                  />
                </Button>
              </span>
            </PropertiesHeader>
          )}
          {data.length > 0 && graphType === GraphType.SCATTER_PLOT && (
            <ScatterChart
              id={'scatter-plot'}
              width={relativeWidth * window.innerWidth}
              height={totalHeight / 2 - 130}
              margin={{
                top: 10,
                right: 40,
                bottom: 20,
                left: 10,
              }}
              data={data}
            >
              <CartesianGrid
                strokeWidth="1"
                stroke={'gray'}
                horizontal={xLinesRef.current}
                vertical={yLinesRef.current}
              />
              <XAxis
                dataKey="x"
                fontSize={10}
                type="number"
                domain={[xMinScatterPlot, xMaxScatterPlot]}
                label={
                  <Label
                    value={
                      ProjectUtil.getPropertyName(xAxisRef.current, lang) +
                      ' (' +
                      ProjectUtil.getUnit(xAxisRef.current) +
                      ')'
                    }
                    dy={10}
                    fontSize={11}
                  />
                }
                name={ProjectUtil.getPropertyName(xAxisRef.current, lang)}
                // unit={ProjectUtil.getUnit(xAxisRef.current)}
                strokeWidth={1}
                stroke={'gray'}
              />
              <YAxis
                dataKey="y"
                fontSize={10}
                type="number"
                domain={[yMinScatterPlot, yMaxScatterPlot]}
                label={
                  <Label
                    value={
                      ProjectUtil.getPropertyName(yAxisRef.current, lang) +
                      ' (' +
                      ProjectUtil.getUnit(yAxisRef.current) +
                      ')'
                    }
                    dx={-10}
                    fontSize={11}
                    angle={-90}
                  />
                }
                name={ProjectUtil.getPropertyName(yAxisRef.current, lang)}
                // unit={ProjectUtil.getUnit(yAxisRef.current)}
                strokeWidth={1}
                stroke={'gray'}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload) return null;
                  return (
                    <div
                      style={{
                        textAlign: 'left',
                        fontSize: '12px',
                        backgroundColor: 'white',
                        padding: '10px',
                        border: '1px solid gray',
                        borderRadius: '8px',
                      }}
                    >
                      {payload.map((p) => {
                        return (
                          <div key={p.name}>
                            {p.name}: {p.value}
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              <Scatter
                name="All"
                data={scatterData}
                fill="#8884d8"
                line={true}
                strokeWidth={lineWidthRef.current}
                shape={<RenderDot />}
              />
            </ScatterChart>
          )}
        </CanvasContainer>
        <ImportMoleculeModal
          importByName={() => {
            const m = getMolecule(moleculeName);
            if (m) {
              const added = addMolecule(m);
              if (added) {
                setCommonStore((state) => {
                  state.projectState.selectedMolecule = m;
                });
                setUpdateFlag(!updateFlag);
                setChanged(true);
              } else {
                showError(t('projectPanel.MoleculeAlreadyAdded', lang) + ': ' + moleculeName, 3);
              }
            } else {
              showError(t('projectPanel.MoleculeNotFound', lang) + ': ' + moleculeName, 3);
            }
          }}
          setName={setMoleculeName}
          getName={() => moleculeName}
          setDialogVisible={setMoleculeNameDialogVisible}
          isDialogVisible={() => moleculeNameDialogVisible}
        />
      </ColumnWrapper>
    </Container>
  );
});

export default ProjectGallery;
