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
import { GALLERY_STYLE_LABELS } from './scientificConstants';
import { getTestMolecule } from './App';
import ImportMoleculeModal from './ImportMoleculeModal';
import { saveSvg, showError, showInfo } from './helpers';
import ParallelCoordinates from './components/parallelCoordinates';
import { ProjectUtil } from './ProjectUtil';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { updateDataColoring, updateHiddenProperties } from './cloudProjectUtil';
import { Filter, FilterType } from './Filter';

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

const ProjectGallery = ({ relativeWidth, moleculeData }: ProjectGalleryProps) => {
  const setCommonStore = useStore(Selector.set);
  const user = useStore(Selector.user);
  const language = useStore(Selector.language);
  const loggable = useStore.getState().loggable;
  const selectedMolecule = useStore(Selector.selectedMolecule);
  const hoveredMolecule = usePrimitiveStore(Selector.hoveredMolecule);
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

  const isOwner = user.uid === projectInfo.owner;

  const descriptionTextAreaEditableRef = useRef<boolean>(false);
  const descriptionRef = useRef<string | null>(
    projectInfo.description ?? t('projectPanel.WriteABriefDescriptionAboutThisProject', lang),
  );
  const descriptionChangedRef = useRef<boolean>(false);
  const descriptionExpandedRef = useRef<boolean>(false);

  const propertySelectionChangedRef = useRef<boolean>(false);
  const dataColoringSelectionRef = useRef<DataColoring>(projectInfo.dataColoring ?? DataColoring.ALL);
  const atomCountSelectionRef = useRef<boolean>(!projectInfo.hiddenProperties?.includes('atomCount'));
  const bondCountSelectionRef = useRef<boolean>(!projectInfo.hiddenProperties?.includes('bondCount'));
  const massSelectionRef = useRef<boolean>(!projectInfo.hiddenProperties?.includes('molecularMass'));
  const logPSelectionRef = useRef<boolean>(!projectInfo.hiddenProperties?.includes('logP'));
  const hBondDonorCountSelectionRef = useRef<boolean>(
    !projectInfo.hiddenProperties?.includes('hydrogenBondDonorCount'),
  );
  const hBondAcceptorCountSelectionRef = useRef<boolean>(
    !projectInfo.hiddenProperties?.includes('hydrogenBondAcceptorCount'),
  );
  const rotatableBondCountSelectionRef = useRef<boolean>(!projectInfo.hiddenProperties?.includes('rotatableBondCount'));
  const polarSurfaceAreaSelectionRef = useRef<boolean>(!projectInfo.hiddenProperties?.includes('polarSurfaceArea'));

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

  const hover = (i: number) => {
    if (collectedMolecules) {
      usePrimitiveStore.getState().set((state) => {
        if (i >= 0 && i < collectedMolecules.length) {
          state.hoveredMolecule = collectedMolecules[i];
        } else {
          state.hoveredMolecule = null;
        }
      });
    }
  };

  const createCanvas = (moleculeData: MoleculeData) => {
    return (
      <Canvas
        shadows={false}
        gl={{ preserveDrawingBuffer: true, logarithmicDepthBuffer: true }}
        frameloop={'demand'}
        style={{
          transition: '.5s ease',
          opacity: hoveredMolecule === moleculeData ? 0.5 : 1,
          height: canvasHeight + 'px',
          width: canvasWidth + 'px',
          backgroundColor: hoveredMolecule === moleculeData ? 'rgba(225, 225, 225, 0.5)' : viewerBackground,
          borderRadius: '10px',
          border: moleculeData.excluded
            ? 'none'
            : selectedMolecule === moleculeData
              ? '2px solid red'
              : '1px solid gray',
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
            state.selectedMolecule = moleculeData !== selectedMolecule ? moleculeData : null;
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
              {GALLERY_STYLE_LABELS.map((radio, idx) => (
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

  const localSelectProperty = (selected: boolean, property: string) => {
    setCommonStore((state) => {
      if (state.projectInfo.hiddenProperties) {
        if (selected) {
          if (state.projectInfo.hiddenProperties.includes(property)) {
            state.projectInfo.hiddenProperties.splice(state.projectInfo.hiddenProperties.indexOf(property), 1);
          }
        } else {
          if (!state.projectInfo.hiddenProperties.includes(property)) {
            state.projectInfo.hiddenProperties.push(property);
          }
        }
      }
    });
  };

  const selectProperty = (selected: boolean, property: string) => {
    propertySelectionChangedRef.current = true;
    if (isOwner) {
      if (user.uid && projectInfo.title) {
        updateHiddenProperties(user.uid, projectInfo.title, property, !selected).then(() => {
          localSelectProperty(selected, property);
        });
      }
    } else {
      localSelectProperty(selected, property);
    }
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
      </div>
    );
  };

  const localSelectDataColoring = () => {
    setCommonStore((state) => {
      state.projectInfo.dataColoring = dataColoringSelectionRef.current;
    });
    usePrimitiveStore.getState().set((state) => {
      state.updateProjectsFlag = true;
    });
    setUpdateFlag(!updateFlag);
  };

  const selectDataColoring = (value: DataColoring) => {
    dataColoringSelectionRef.current = value;
    if (isOwner) {
      if (user.uid && projectInfo.title) {
        updateDataColoring(user.uid, projectInfo.title, dataColoringSelectionRef.current).then(() => {
          localSelectDataColoring();
        });
      }
    } else {
      localSelectDataColoring();
    }
  };

  const createChooseDataColoringContent = () => {
    return (
      <div>
        <Radio.Group
          onChange={(e) => {
            selectDataColoring(e.target.value);
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
          if (!projectInfo.hiddenProperties?.includes('atomCount')) d['atomCount'] = p.atomCount;
          if (!projectInfo.hiddenProperties?.includes('bondCount')) d['bondCount'] = p.bondCount;
          if (!projectInfo.hiddenProperties?.includes('molecularMass')) d['molecularMass'] = p.mass;
          if (!projectInfo.hiddenProperties?.includes('logP')) d['logP'] = p.logP;
          if (!projectInfo.hiddenProperties?.includes('hydrogenBondDonorCount'))
            d['hydrogenBondDonorCount'] = p.hydrogenBondDonorCount;
          if (!projectInfo.hiddenProperties?.includes('hydrogenBondAcceptorCount'))
            d['hydrogenBondAcceptorCount'] = p.hydrogenBondAcceptorCount;
          if (!projectInfo.hiddenProperties?.includes('rotatableBondCount'))
            d['rotatableBondCount'] = p.rotatableBondCount;
          if (!projectInfo.hiddenProperties?.includes('polarSurfaceArea')) d['polarSurfaceArea'] = p.polarSurfaceArea;
          d['group'] = projectInfo.dataColoring === DataColoring.INDIVIDUALS ? m.name : 'default';
          d['selected'] = selectedMolecule === m;
          d['hovered'] = hoveredMolecule === m;
          d['excluded'] = projectInfo.filters ? ProjectUtil.isExcluded(projectInfo.filters, p) : false;
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
    collectedMolecules,
    projectInfo.dataColoring,
    projectInfo.filters,
    projectInfo.hiddenProperties,
    updateHiddenFlag,
  ]);

  const [variables, titles, units, digits, tickIntegers, types] = useMemo(
    () => [
      ProjectUtil.getVariables(projectInfo.hiddenProperties ?? []),
      ProjectUtil.getTitles(projectInfo.hiddenProperties ?? [], lang),
      ProjectUtil.getUnits(projectInfo.hiddenProperties ?? [], lang),
      ProjectUtil.getDigits(projectInfo.hiddenProperties ?? []),
      ProjectUtil.getTickIntegers(projectInfo.hiddenProperties ?? []),
      ProjectUtil.getTypes(projectInfo.hiddenProperties ?? []),
    ],
    [updateHiddenFlag, lang, projectInfo.hiddenProperties],
  );

  const getMin = (variable: string, defaultValue: number) => {
    let min = defaultValue;
    if (projectInfo.ranges) {
      for (const r of projectInfo.ranges) {
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
    if (projectInfo.ranges) {
      for (const r of projectInfo.ranges) {
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
    if (!projectInfo.hiddenProperties?.includes('atomCount')) array.push(getMin('atomCount', 0));
    if (!projectInfo.hiddenProperties?.includes('bondCount')) array.push(getMin('bondCount', 0));
    if (!projectInfo.hiddenProperties?.includes('molecularMass')) array.push(getMin('molecularMass', 0));
    if (!projectInfo.hiddenProperties?.includes('logP')) array.push(getMin('logP', -10));
    if (!projectInfo.hiddenProperties?.includes('hydrogenBondDonorCount'))
      array.push(getMin('hydrogenBondDonorCount', 0));
    if (!projectInfo.hiddenProperties?.includes('hydrogenBondAcceptorCount'))
      array.push(getMin('hydrogenBondAcceptorCount', 0));
    if (!projectInfo.hiddenProperties?.includes('rotatableBondCount')) array.push(getMin('rotatableBondCount', 0));
    if (!projectInfo.hiddenProperties?.includes('polarSurfaceArea')) array.push(getMin('polarSurfaceArea', 0));
    return array;
  }, [updateHiddenFlag, projectInfo.ranges, projectInfo.hiddenProperties]);

  const maxima: number[] = useMemo(() => {
    const array: number[] = [];
    if (!projectInfo.hiddenProperties?.includes('atomCount')) array.push(getMax('atomCount', 200));
    if (!projectInfo.hiddenProperties?.includes('bondCount')) array.push(getMax('bondCount', 200));
    if (!projectInfo.hiddenProperties?.includes('molecularMass')) array.push(getMax('molecularMass', 1000));
    if (!projectInfo.hiddenProperties?.includes('logP')) array.push(getMax('logP', 10));
    if (!projectInfo.hiddenProperties?.includes('hydrogenBondDonorCount'))
      array.push(getMax('hydrogenBondDonorCount', 20));
    if (!projectInfo.hiddenProperties?.includes('hydrogenBondAcceptorCount'))
      array.push(getMax('hydrogenBondAcceptorCount', 20));
    if (!projectInfo.hiddenProperties?.includes('rotatableBondCount')) array.push(getMax('rotatableBondCount', 20));
    if (!projectInfo.hiddenProperties?.includes('polarSurfaceArea')) array.push(getMax('polarSurfaceArea', 200));
    return array;
  }, [updateHiddenFlag, projectInfo.ranges, projectInfo.hiddenProperties]);

  const steps: number[] = useMemo(() => {
    const array: number[] = [];
    if (!projectInfo.hiddenProperties?.includes('atomCount')) array.push(1);
    if (!projectInfo.hiddenProperties?.includes('bondCount')) array.push(1);
    if (!projectInfo.hiddenProperties?.includes('molecularMass')) array.push(0.1);
    if (!projectInfo.hiddenProperties?.includes('logP')) array.push(0.1);
    if (!projectInfo.hiddenProperties?.includes('hydrogenBondDonorCount')) array.push(1);
    if (!projectInfo.hiddenProperties?.includes('hydrogenBondAcceptorCount')) array.push(1);
    if (!projectInfo.hiddenProperties?.includes('rotatableBondCount')) array.push(1);
    if (!projectInfo.hiddenProperties?.includes('polarSurfaceArea')) array.push(1);
    return array;
  }, [updateHiddenFlag, projectInfo.hiddenProperties]);

  const getFilterLowerBound = (variable: string, defaultValue: number) => {
    let lowerBound = defaultValue;
    if (projectInfo.filters) {
      for (const f of projectInfo.filters) {
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
    if (projectInfo.filters) {
      for (const f of projectInfo.filters) {
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
    if (!projectInfo.hiddenProperties?.includes('atomCount'))
      array.push({ variable: 'atomCount', type: FilterType.None } as Filter);
    if (!projectInfo.hiddenProperties?.includes('bondCount'))
      array.push({ variable: 'bondCount', type: FilterType.None } as Filter);
    if (!projectInfo.hiddenProperties?.includes('molecularMass')) array.push(createFilter('molecularMass', 500, 0));
    if (!projectInfo.hiddenProperties?.includes('logP')) array.push(createFilter('logP', 5, -5));
    if (!projectInfo.hiddenProperties?.includes('hydrogenBondDonorCount'))
      array.push(createFilter('hydrogenBondDonorCount', 5, 0));
    if (!projectInfo.hiddenProperties?.includes('hydrogenBondAcceptorCount'))
      array.push(createFilter('hydrogenBondAcceptorCount', 10, 0));
    if (!projectInfo.hiddenProperties?.includes('rotatableBondCount'))
      array.push(createFilter('rotatableBondCount', 10, 0));
    if (!projectInfo.hiddenProperties?.includes('polarSurfaceArea'))
      array.push(createFilter('polarSurfaceArea', 140, 0));
    return array;
  }, [updateHiddenFlag, projectInfo.filters, projectInfo.hiddenProperties]);

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
            {t('projectPanel.Project', lang)} : {projectInfo.title ?? t('term.DrugDiscovery', lang)}
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
              height: totalHeight / 2 - (descriptionExpandedRef.current ? 160 : 80),
              paddingTop: '8px',
              paddingLeft: '8px',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
            grid={{ column: canvasColumns, gutter: 0 }}
            dataSource={moleculeData}
            renderItem={(data: MoleculeData) => {
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
                  {createCanvas(data)}
                  <div
                    style={{
                      position: 'relative',
                      left: '10px',
                      textAlign: 'left',
                      bottom: '18px',
                      color: 'gray',
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
          <PropertiesHeader>
            <span style={{ paddingLeft: '20px' }}>{t('projectPanel.Properties', lang)}</span>
            <span>
              <Popover
                title={t('projectPanel.ChooseProperties', lang)}
                onOpenChange={(visible) => {}}
                content={createChoosePropertiesContent()}
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
                  saveSvg('property-space')
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
                  title={t('projectPanel.PropertiesScreenshot', lang)}
                />
              </Button>
            </span>
          </PropertiesHeader>
          {data.length > 0 && (
            <ParallelCoordinates
              id={'property-space'}
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
              hover={hover}
              hoveredIndex={collectedMolecules && hoveredMolecule ? collectedMolecules.indexOf(hoveredMolecule) : -1}
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
