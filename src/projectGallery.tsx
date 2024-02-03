/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DataColoring } from './constants';
import styled from 'styled-components';
import { Button, Checkbox, Col, Collapse, CollapseProps, ColorPicker, List, Popover, Radio, Row, Select } from 'antd';
import {
  LoginOutlined,
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
import { DatumEntry, MoleculeData } from './types';
import TextArea from 'antd/lib/input/TextArea';
import { UndoableChange } from './undo/UndoableChange';
import ImportMoleculeModal from './ImportMoleculeModal';
import { saveSvg, showError, showInfo } from './helpers';
import ParallelCoordinates from './components/parallelCoordinates';
import { ProjectUtil } from './ProjectUtil';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { updateDataColoring, updateHiddenProperties } from './cloudProjectUtil';
import { Filter, FilterType } from './Filter';
import {
  GALLERY_STYLE_LABELS,
  MATERIAL_LABELS,
  MolecularViewerMaterial,
  MolecularViewerStyle,
} from './view/displayOptions';
import { getSampleMolecule } from './internalDatabase';
import MoleculeContainer from './moleculeContainer';

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
  const projectState = useStore(Selector.projectState);
  const molecularPropertiesMap = useStore(Selector.molecularPropertiesMap);
  const setChanged = usePrimitiveStore(Selector.setChanged);

  const [loading, setLoading] = useState(false);
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);
  const [updateHiddenFlag, setUpdateHiddenFlag] = useState<boolean>(false);
  const [moleculeName, setMoleculeName] = useState<string>('Aspirin');
  const [moleculeNameDialogVisible, setMoleculeNameDialogVisible] = useState(false);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const isOwner = user.uid === projectState.owner;

  const descriptionTextAreaEditableRef = useRef<boolean>(false);
  const descriptionRef = useRef<string | null>(null);
  const descriptionChangedRef = useRef<boolean>(false);
  const descriptionExpandedRef = useRef<boolean>(false);
  const sortedMoleculesRef = useRef<MoleculeData[]>([]); // store a sorted copy of molecules

  useEffect(() => {
    sortedMoleculesRef.current = [];
    if (projectState.molecules) {
      for (const m of projectState.molecules) {
        sortedMoleculesRef.current.push(m);
      }
      const p = projectState.selectedProperty;
      if (p) {
        const prefix = projectState.sortDescending ? 1 : -1;
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
  }, [projectState.molecules, projectState.sortDescending, projectState.selectedProperty, molecularPropertiesMap]);

  const propertySelectionChangedRef = useRef<boolean>(false);
  const dataColoringSelectionRef = useRef<DataColoring>(projectState.dataColoring ?? DataColoring.ALL);
  const atomCountSelectionRef = useRef<boolean>(!projectState.hiddenProperties?.includes('atomCount'));
  const bondCountSelectionRef = useRef<boolean>(!projectState.hiddenProperties?.includes('bondCount'));
  const massSelectionRef = useRef<boolean>(!projectState.hiddenProperties?.includes('molecularMass'));
  const logPSelectionRef = useRef<boolean>(!projectState.hiddenProperties?.includes('logP'));
  const hBondDonorCountSelectionRef = useRef<boolean>(
    !projectState.hiddenProperties?.includes('hydrogenBondDonorCount'),
  );
  const hBondAcceptorCountSelectionRef = useRef<boolean>(
    !projectState.hiddenProperties?.includes('hydrogenBondAcceptorCount'),
  );
  const rotatableBondCountSelectionRef = useRef<boolean>(
    !projectState.hiddenProperties?.includes('rotatableBondCount'),
  );
  const polarSurfaceAreaSelectionRef = useRef<boolean>(!projectState.hiddenProperties?.includes('polarSurfaceArea'));

  useEffect(() => {
    atomCountSelectionRef.current = !projectState.hiddenProperties?.includes('atomCount');
    bondCountSelectionRef.current = !projectState.hiddenProperties?.includes('bondCount');
    massSelectionRef.current = !projectState.hiddenProperties?.includes('molecularMass');
    logPSelectionRef.current = !projectState.hiddenProperties?.includes('logP');
    hBondDonorCountSelectionRef.current = !projectState.hiddenProperties?.includes('hydrogenBondDonorCount');
    hBondAcceptorCountSelectionRef.current = !projectState.hiddenProperties?.includes('hydrogenBondAcceptorCount');
    rotatableBondCountSelectionRef.current = !projectState.hiddenProperties?.includes('rotatableBondCount');
    polarSurfaceAreaSelectionRef.current = !projectState.hiddenProperties?.includes('polarSurfaceArea');
    setUpdateFlag(!updateFlag);
  }, [projectState.hiddenProperties]);

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
    descriptionRef.current = projectState.description ?? t('projectPanel.WriteABriefDescriptionAboutThisProject', lang);
  }, [projectState.description]);

  const totalHeight = window.innerHeight;
  const canvasColumns = 3;
  const gridGutter = 8;
  const totalWidth = Math.round(window.innerWidth * relativeWidth);
  const canvasWidth = totalWidth / canvasColumns - gridGutter * (canvasColumns - 1);
  const canvasHeight = (canvasWidth * 2) / 3;

  const hover = (i: number) => {
    if (projectState.molecules) {
      usePrimitiveStore.getState().set((state) => {
        if (i >= 0 && i < projectState.molecules.length) {
          state.hoveredMolecule = projectState.molecules[i];
        } else {
          state.hoveredMolecule = null;
        }
      });
    }
  };

  const closeProject = () => {
    setCommonStore((state) => {
      state.projectView = false;
    });
  };

  const createProjectSettingsContent = useMemo(() => {
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
            <span>{t('molecularViewer.Material', lang)}: </span>
          </Col>
          <Col span={12}>
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
  }, [lang, viewerStyle, viewerMaterial, viewerBackground]);

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
            {projectState.selectedProperty && (
              <Button
                style={{ border: 'none', padding: '4px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCommonStore((state) => {
                    state.projectState.sortDescending = !state.projectState.sortDescending;
                  });
                }}
              >
                {projectState.sortDescending ? (
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
                    state.projectState.loadedMolecule = selectedMolecule;
                  });
                  setChanged(true);
                }}
              >
                <LoginOutlined
                  style={{ fontSize: '24px', color: 'gray' }}
                  title={t('projectPanel.AddSelectedMoleculeToExperiment', lang)}
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
      if (user.uid && projectState.title) {
        updateHiddenProperties(user.uid, projectState.title, property, !selected).then(() => {
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
      if (user.uid && projectState.title) {
        updateDataColoring(user.uid, projectState.title, dataColoringSelectionRef.current).then(() => {
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
          value={projectState.dataColoring ?? DataColoring.ALL}
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
    if (projectState.molecules) {
      for (const m of projectState.molecules) {
        const d = {} as DatumEntry;
        const p = molecularPropertiesMap.get(m.name);
        if (p) {
          if (!projectState.hiddenProperties?.includes('atomCount')) d['atomCount'] = p.atomCount;
          if (!projectState.hiddenProperties?.includes('bondCount')) d['bondCount'] = p.bondCount;
          if (!projectState.hiddenProperties?.includes('molecularMass')) d['molecularMass'] = p.molecularMass;
          if (!projectState.hiddenProperties?.includes('logP')) d['logP'] = p.logP;
          if (!projectState.hiddenProperties?.includes('hydrogenBondDonorCount'))
            d['hydrogenBondDonorCount'] = p.hydrogenBondDonorCount;
          if (!projectState.hiddenProperties?.includes('hydrogenBondAcceptorCount'))
            d['hydrogenBondAcceptorCount'] = p.hydrogenBondAcceptorCount;
          if (!projectState.hiddenProperties?.includes('rotatableBondCount'))
            d['rotatableBondCount'] = p.rotatableBondCount;
          if (!projectState.hiddenProperties?.includes('polarSurfaceArea')) d['polarSurfaceArea'] = p.polarSurfaceArea;
          d['group'] = projectState.dataColoring === DataColoring.INDIVIDUALS ? m.name : 'default';
          d['selected'] = selectedMolecule === m;
          d['hovered'] = hoveredMolecule === m;
          d['excluded'] = projectState.filters ? ProjectUtil.isExcluded(projectState.filters, p) : false;
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
    projectState.molecules,
    projectState.dataColoring,
    projectState.filters,
    projectState.hiddenProperties,
    updateHiddenFlag,
  ]);

  const [variables, titles, units, digits, tickIntegers, types] = useMemo(
    () => [
      ProjectUtil.getVariables(projectState.hiddenProperties ?? []),
      ProjectUtil.getTitles(projectState.hiddenProperties ?? [], lang),
      ProjectUtil.getUnits(projectState.hiddenProperties ?? [], lang),
      ProjectUtil.getDigits(projectState.hiddenProperties ?? []),
      ProjectUtil.getTickIntegers(projectState.hiddenProperties ?? []),
      ProjectUtil.getTypes(projectState.hiddenProperties ?? []),
    ],
    [updateHiddenFlag, lang, projectState.hiddenProperties],
  );

  const getMin = (variable: string, defaultValue: number) => {
    let min = defaultValue;
    if (projectState.ranges) {
      for (const r of projectState.ranges) {
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
    if (projectState.ranges) {
      for (const r of projectState.ranges) {
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
    if (!projectState.hiddenProperties?.includes('atomCount')) array.push(getMin('atomCount', 0));
    if (!projectState.hiddenProperties?.includes('bondCount')) array.push(getMin('bondCount', 0));
    if (!projectState.hiddenProperties?.includes('molecularMass')) array.push(getMin('molecularMass', 0));
    if (!projectState.hiddenProperties?.includes('logP')) array.push(getMin('logP', -10));
    if (!projectState.hiddenProperties?.includes('hydrogenBondDonorCount'))
      array.push(getMin('hydrogenBondDonorCount', 0));
    if (!projectState.hiddenProperties?.includes('hydrogenBondAcceptorCount'))
      array.push(getMin('hydrogenBondAcceptorCount', 0));
    if (!projectState.hiddenProperties?.includes('rotatableBondCount')) array.push(getMin('rotatableBondCount', 0));
    if (!projectState.hiddenProperties?.includes('polarSurfaceArea')) array.push(getMin('polarSurfaceArea', 0));
    return array;
  }, [updateHiddenFlag, projectState.ranges, projectState.hiddenProperties]);

  const maxima: number[] = useMemo(() => {
    const array: number[] = [];
    if (!projectState.hiddenProperties?.includes('atomCount')) array.push(getMax('atomCount', 200));
    if (!projectState.hiddenProperties?.includes('bondCount')) array.push(getMax('bondCount', 200));
    if (!projectState.hiddenProperties?.includes('molecularMass')) array.push(getMax('molecularMass', 1000));
    if (!projectState.hiddenProperties?.includes('logP')) array.push(getMax('logP', 10));
    if (!projectState.hiddenProperties?.includes('hydrogenBondDonorCount'))
      array.push(getMax('hydrogenBondDonorCount', 20));
    if (!projectState.hiddenProperties?.includes('hydrogenBondAcceptorCount'))
      array.push(getMax('hydrogenBondAcceptorCount', 20));
    if (!projectState.hiddenProperties?.includes('rotatableBondCount')) array.push(getMax('rotatableBondCount', 20));
    if (!projectState.hiddenProperties?.includes('polarSurfaceArea')) array.push(getMax('polarSurfaceArea', 200));
    return array;
  }, [updateHiddenFlag, projectState.ranges, projectState.hiddenProperties]);

  const steps: number[] = useMemo(() => {
    const array: number[] = [];
    if (!projectState.hiddenProperties?.includes('atomCount')) array.push(1);
    if (!projectState.hiddenProperties?.includes('bondCount')) array.push(1);
    if (!projectState.hiddenProperties?.includes('molecularMass')) array.push(0.1);
    if (!projectState.hiddenProperties?.includes('logP')) array.push(0.1);
    if (!projectState.hiddenProperties?.includes('hydrogenBondDonorCount')) array.push(1);
    if (!projectState.hiddenProperties?.includes('hydrogenBondAcceptorCount')) array.push(1);
    if (!projectState.hiddenProperties?.includes('rotatableBondCount')) array.push(1);
    if (!projectState.hiddenProperties?.includes('polarSurfaceArea')) array.push(1);
    return array;
  }, [updateHiddenFlag, projectState.hiddenProperties]);

  const getFilterLowerBound = (variable: string, defaultValue: number) => {
    let lowerBound = defaultValue;
    if (projectState.filters) {
      for (const f of projectState.filters) {
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
    if (projectState.filters) {
      for (const f of projectState.filters) {
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
    if (!projectState.hiddenProperties?.includes('atomCount'))
      array.push({ variable: 'atomCount', type: FilterType.None } as Filter);
    if (!projectState.hiddenProperties?.includes('bondCount'))
      array.push({ variable: 'bondCount', type: FilterType.None } as Filter);
    if (!projectState.hiddenProperties?.includes('molecularMass')) array.push(createFilter('molecularMass', 500, 0));
    if (!projectState.hiddenProperties?.includes('logP')) array.push(createFilter('logP', 5, -5));
    if (!projectState.hiddenProperties?.includes('hydrogenBondDonorCount'))
      array.push(createFilter('hydrogenBondDonorCount', 5, 0));
    if (!projectState.hiddenProperties?.includes('hydrogenBondAcceptorCount'))
      array.push(createFilter('hydrogenBondAcceptorCount', 10, 0));
    if (!projectState.hiddenProperties?.includes('rotatableBondCount'))
      array.push(createFilter('rotatableBondCount', 10, 0));
    if (!projectState.hiddenProperties?.includes('polarSurfaceArea'))
      array.push(createFilter('polarSurfaceArea', 140, 0));
    return array;
  }, [updateHiddenFlag, projectState.filters, projectState.hiddenProperties]);

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
            {t('projectPanel.Project', lang)} : {t('term.DrugDiscovery', lang)}
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
          <List
            style={{
              width: '100%',
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
                    selected={selectedMolecule === data}
                  />
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
                title={
                  <div onClick={(e) => e.stopPropagation()}>
                    <CarryOutOutlined /> {t('projectPanel.ChooseProperties', lang)}
                  </div>
                }
                onOpenChange={(visible) => {}}
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
              hoveredIndex={
                projectState.molecules && hoveredMolecule ? projectState.molecules.indexOf(hoveredMolecule) : -1
              }
              selectedIndex={
                projectState.molecules && selectedMolecule ? projectState.molecules.indexOf(selectedMolecule) : -1
              }
            />
          )}
        </CanvasContainer>
        <ImportMoleculeModal
          importByName={() => {
            const m = getSampleMolecule(moleculeName);
            if (m) {
              const added = addMolecule(m);
              if (added) {
                setUpdateFlag(!updateFlag);
                setChanged(true);
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
});

export default ProjectGallery;
