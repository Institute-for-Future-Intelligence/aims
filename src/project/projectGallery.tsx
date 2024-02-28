/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DataColoring, GraphType, ProjectType } from '../constants.ts';
import styled from 'styled-components';
import { Button, Collapse, CollapseProps, Empty, Popover, Radio, Spin } from 'antd';
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
  LoadingOutlined,
  LoginOutlined,
  SettingOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { DatumEntry, MoleculeData } from '../types.ts';
import TextArea from 'antd/lib/input/TextArea';
import ImportMoleculeModal from './ImportMoleculeModal.tsx';
import { saveSvg, showError, showInfo } from '../helpers.ts';
import ParallelCoordinates from '../components/parallelCoordinates.tsx';
import { ProjectUtil } from './ProjectUtil.ts';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { updateDataColoring } from '../cloudProjectUtil.ts';
import { Filter, FilterType } from '../Filter.ts';
import { commonMolecules, drugMolecules, getMolecule } from '../internalDatabase.ts';
import { CartesianGrid, Dot, Label, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { MolecularProperties } from '../models/MolecularProperties.ts';
import { View } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import MolecularContainer from './molecularContainer.tsx';
import ProjectSettingsContent from './projectSettingsContent.tsx';
import PropertiesSelectionContent from './propertiesSelectionContent.tsx';
import CoordinateSystemSettingsContent from './coordinateSystemSettingsContent.tsx';
import GraphSettingsContent from './graphSettingsContent.tsx';

export interface ProjectGalleryProps {
  relativeWidth: number; // (0, 1)
}

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
  const projectDataColoring = useStore(Selector.projectDataColoring) ?? DataColoring.ALL;
  const projectFilters = useStore(Selector.projectFilters);
  const projectRanges = useStore(Selector.projectRanges);
  const projectMolecules = useStore(Selector.molecules);
  const selectedProperty = useStore(Selector.selectedProperty);
  const hiddenProperties = useStore(Selector.hiddenProperties);
  const xAxisNameScatterPlot = useStore(Selector.xAxisNameScatterPlot) ?? 'atomCount';
  const yAxisNameScatterPlot = useStore(Selector.yAxisNameScatterPlot) ?? 'bondCount';
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

  const [loading, setLoading] = useState<boolean>(false);
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
  const containerRef = useRef(null);

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
                // @ts-expect-error: ignore
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
  const viewWidth = totalWidth / canvasColumns - gridGutter * (canvasColumns - 1);
  const viewHeight = (viewWidth * 2) / 3;

  const closeProject = () => {
    setCommonStore((state) => {
      state.projectView = false;
    });
  };

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
              content={
                <ProjectSettingsContent
                  viewerStyle={viewerStyle}
                  viewerMaterial={viewerMaterial}
                  viewerBackground={viewerBackground}
                  labelType={labelType}
                  graphType={graphType}
                />
              }
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

  const localSelectDataColoring = (value: DataColoring) => {
    setCommonStore((state) => {
      state.projectState.dataColoring = value;
    });
    usePrimitiveStore.getState().set((state) => {
      state.updateProjectsFlag = true;
    });
    setUpdateFlag(!updateFlag);
  };

  const selectDataColoring = (value: DataColoring) => {
    if (isOwner) {
      if (user.uid && projectTitle) {
        updateDataColoring(user.uid, projectTitle, value).then(() => {
          localSelectDataColoring(value);
        });
      }
    } else {
      localSelectDataColoring(value);
    }
    setChanged(true);
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
    [lang, hiddenProperties],
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
  }, [projectRanges, hiddenProperties]);

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
  }, [hiddenProperties]);

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

  const scatterData = useMemo(() => {
    const data: { x: number; y: number }[] = [];
    if (projectMolecules) {
      for (const m of projectMolecules) {
        const prop = molecularPropertiesMap.get(m.name);
        if (prop) {
          const x = prop[xAxisNameScatterPlot as keyof MolecularProperties];
          const y = prop[yAxisNameScatterPlot as keyof MolecularProperties];
          if (typeof x === 'number' && typeof y === 'number') {
            data.push({ x, y });
          }
        }
      }
    }
    return data;
  }, [xAxisNameScatterPlot, yAxisNameScatterPlot, projectMolecules, molecularPropertiesMap]);

  const selectedData = useMemo(() => {
    const data: { x: number; y: number }[] = [];
    if (projectMolecules) {
      for (const m of projectMolecules) {
        if (m === selectedMolecule) {
          const prop = molecularPropertiesMap.get(m.name);
          if (prop) {
            const x = prop[xAxisNameScatterPlot as keyof MolecularProperties];
            const y = prop[yAxisNameScatterPlot as keyof MolecularProperties];
            if (typeof x === 'number' && typeof y === 'number') {
              data.push({ x, y });
            }
          }
        }
      }
    }
    return data;
  }, [xAxisNameScatterPlot, yAxisNameScatterPlot, projectMolecules, molecularPropertiesMap, selectedMolecule]);

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
        <div style={{ background: 'white', height: '100%' }}>
          {sortedMoleculesRef.current.length === 0 && <Empty description={t('projectPanel.NoMolecule', lang)} />}
          <div
            style={{
              width: '100%',
              height: totalHeight / 2 - (descriptionExpandedRef.current ? 160 : 80),
              paddingTop: '8px',
              paddingLeft: '8px',
              overflowX: 'auto',
              overflowY: 'auto',
              position: 'relative',
              background: 'white',
              display: 'grid',
              columnGap: '5px',
              rowGap: '5px',
              gridTemplateColumns: viewWidth + 'px ' + viewWidth + 'px ' + viewWidth + 'px',
            }}
            ref={containerRef}
            onMouseDown={() => {
              setCommonStore((state) => {
                state.projectState.selectedMolecule = null;
              });
              setChanged(true);
            }}
          >
            {sortedMoleculesRef.current.map((mol, index) => {
              const prop = getProvidedMolecularProperties(mol.name);
              const hovered = hoveredMolecule?.name === mol.name;
              const selected = selectedMolecule?.name === mol.name;
              return (
                <View
                  key={index}
                  // @ts-expect-error: track is deprecated
                  track={null}
                  index={1}
                  visible={true}
                  style={{
                    position: 'relative',
                    height: viewHeight + 'px',
                    width: viewWidth + 'px',
                    backgroundColor: viewerBackground,
                    borderRadius: '10px',
                    border: selected
                      ? hovered
                        ? '2px dashed red'
                        : '2px solid red'
                      : hovered
                        ? '1px dashed gray'
                        : '1px solid gray',
                    opacity: mol?.excluded ? 0.25 : 1,
                  }}
                >
                  <MolecularContainer
                    viewWidth={viewWidth}
                    viewHeight={viewHeight}
                    selected={selected}
                    moleculeData={mol}
                    formula={prop?.formula}
                    style={viewerStyle}
                    material={viewerMaterial}
                    setLoading={setLoading}
                    updateFlag={() => setUpdateFlag(!updateFlag)}
                  />
                </View>
              );
            })}

            {containerRef.current && (
              <Canvas
                eventSource={containerRef.current}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: (10 + viewHeight) * Math.ceil(sortedMoleculesRef.current.length / canvasColumns) + 'px',
                }}
              >
                <View.Port />
              </Canvas>
            )}
            {/*FIXME: This doesn't work properly yet */}
            {loading && (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{
                      position: 'absolute',
                      fontSize: 100,
                      right: totalWidth / 2 - 50,
                      bottom: (totalHeight / 2 - (descriptionExpandedRef.current ? 160 : 80)) / 2 - 50,
                    }}
                  />
                }
              />
            )}
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
                  content={
                    <PropertiesSelectionContent updateHiddenFlag={() => setUpdateHiddenFlag(!updateHiddenFlag)} />
                  }
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
                  content={
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
                  }
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
                  content={
                    <CoordinateSystemSettingsContent
                      xMinScatterPlot={xMinScatterPlot}
                      xMaxScatterPlot={xMaxScatterPlot}
                      yMinScatterPlot={yMinScatterPlot}
                      yMaxScatterPlot={yMaxScatterPlot}
                    />
                  }
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
                  content={<GraphSettingsContent />}
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
                horizontal={xLinesScatterPlot}
                vertical={yLinesScatterPlot}
              />
              <XAxis
                dataKey="x"
                fontSize={10}
                type="number"
                domain={[xMinScatterPlot, xMaxScatterPlot]}
                label={
                  <Label
                    value={
                      ProjectUtil.getPropertyName(xAxisNameScatterPlot, lang) +
                      (ProjectUtil.getUnit(xAxisNameScatterPlot) === ''
                        ? ''
                        : ' (' + ProjectUtil.getUnit(xAxisNameScatterPlot) + ')')
                    }
                    dy={10}
                    fontSize={11}
                  />
                }
                name={ProjectUtil.getPropertyName(xAxisNameScatterPlot, lang)}
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
                      ProjectUtil.getPropertyName(yAxisNameScatterPlot, lang) +
                      (ProjectUtil.getUnit(yAxisNameScatterPlot) === ''
                        ? ''
                        : ' (' + ProjectUtil.getUnit(yAxisNameScatterPlot) + ')')
                    }
                    dx={-10}
                    fontSize={11}
                    angle={-90}
                  />
                }
                name={ProjectUtil.getPropertyName(yAxisNameScatterPlot, lang)}
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
                strokeWidth={lineWidthScatterPlot}
                shape={<Dot fill="#8884d8" r={dotSizeScatterPlot} />}
              />
              {selectedMolecule && (
                <Scatter
                  name="Selected"
                  data={selectedData}
                  shape={
                    <Dot
                      fillOpacity={0}
                      r={dotSizeScatterPlot * 1.5}
                      stroke={'black'}
                      strokeWidth={'1px'}
                      strokeDasharray={'2 1'}
                    />
                  }
                />
              )}
            </ScatterChart>
          )}
        </div>
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
