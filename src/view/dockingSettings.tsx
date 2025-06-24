/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Col,
  Descriptions,
  DescriptionsProps,
  FloatButton,
  Input,
  InputNumber,
  Popover,
  Row,
  Select,
  Tabs,
  TabsProps,
} from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { UndoableChange } from '../undo/UndoableChange';
import { targetProteins } from '../internalDatabase';
import { CameraOutlined, ExperimentOutlined, EyeOutlined, InfoCircleOutlined, RightOutlined } from '@ant-design/icons';
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { Util } from '../Util.ts';
import { Undoable } from '../undo/Undoable.ts';
import ScreenshotPanel from './screenshotPanel.tsx';
import { SpaceshipDisplayMode } from '../constants.ts';
import { CHAMBER_STYLE_LABELS, GALLERY_STYLE_LABELS, MolecularViewerStyle } from './displayOptions.ts';

const { Option } = Select;
const { TextArea } = Input;

const DockingSettings = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const loggable = useStore.getState().loggable;
  const logAction = useStore.getState().logAction;
  const addUndoable = useStore(Selector.addUndoable);
  const molecules = useStore(Selector.molecules);
  const ligand = useStore(Selector.ligand);
  const protein = useStore(Selector.protein);
  const proteinData = useStore(Selector.proteinData);
  const translationStep = useStore(Selector.translationStep);
  const rotationStep = useStore(Selector.rotationStep);
  const chamberViewerSelector = useStore(Selector.chamberViewerSelector);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const molecularContainer = useStore(Selector.molecularContainer);
  const hideGallery = useStore(Selector.hideGallery);
  const chamberViewerStyle = useStore(Selector.chamberViewerStyle);
  const projectViewerStyle = useStore(Selector.projectViewerStyle);
  const spaceshipDisplayMode = useStore(Selector.spaceshipDisplayMode) ?? SpaceshipDisplayMode.NONE;

  // onChange of a text area changes at every key typing, triggering the viewer to re-render each time.
  // So we store the intermediate result here
  const [selector, setSelector] = useState<string | undefined>();

  useEffect(() => {
    setSelector(chamberViewerSelector);
  }, [chamberViewerSelector]);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const showGallery = (show: boolean) => {
    setCommonStore((state) => {
      state.projectState.hideGallery = !show;
      state.projectState.chamberViewerPercentWidth = show ? 50 : 100;
    });
  };

  const openGallery = () => {
    const undoable = {
      name: 'Show Gallery',
      timestamp: Date.now(),
      undo: () => showGallery(false),
      redo: () => showGallery(true),
    } as Undoable;
    useStore.getState().addUndoable(undoable);
    showGallery(true);
  };

  const setSpaceshipDisplayMode = (mode: SpaceshipDisplayMode) => {
    useStore.getState().set((state) => {
      state.projectState.spaceshipDisplayMode = mode;
      if (mode === SpaceshipDisplayMode.INSIDE_VIEW) state.projectState.showInstructionPanel = false;
    });
    setChanged(true);
  };

  const setProteinStyle = (style: MolecularViewerStyle) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerStyle = style;
    });
    setChanged(true);
  };

  const setLigandStyle = (style: MolecularViewerStyle) => {
    useStore.getState().set((state) => {
      state.projectState.projectViewerStyle = style;
    });
    setChanged(true);
  };

  const displayItems: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: t('experiment.Protein', lang),
        children: (
          <div style={{ width: '360px' }} onClick={(e) => e.stopPropagation()}>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('molecularViewer.ProteinStyle', lang)}: </span>
              </Col>
              <Col span={12}>
                <Select
                  style={{ width: '90%' }}
                  value={chamberViewerStyle}
                  onChange={(value) => {
                    const undoableChange = {
                      name: 'Set Protein Style',
                      timestamp: Date.now(),
                      oldValue: chamberViewerStyle,
                      newValue: value,
                      undo: () => {
                        setProteinStyle(undoableChange.oldValue as MolecularViewerStyle);
                      },
                      redo: () => {
                        setProteinStyle(undoableChange.newValue as MolecularViewerStyle);
                      },
                    } as UndoableChange;
                    useStore.getState().addUndoable(undoableChange);
                    setProteinStyle(value);
                  }}
                >
                  {CHAMBER_STYLE_LABELS.map((radio, idx) => (
                    <Option key={`${idx}-${radio.value}`} value={radio.value}>
                      {t(radio.label, lang)}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
        ),
      },
      {
        key: '2',
        label: t('experiment.Ligand', lang),
        children: (
          <div style={{ width: '360px' }} onClick={(e) => e.stopPropagation()}>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('molecularViewer.LigandStyle', lang)}: </span>
              </Col>
              <Col span={12}>
                <Select
                  style={{ width: '90%' }}
                  value={projectViewerStyle}
                  onChange={(value) => {
                    const undoableChange = {
                      name: 'Set Ligand Style',
                      timestamp: Date.now(),
                      oldValue: projectViewerStyle,
                      newValue: value,
                      undo: () => {
                        setLigandStyle(undoableChange.oldValue as MolecularViewerStyle);
                      },
                      redo: () => {
                        setLigandStyle(undoableChange.newValue as MolecularViewerStyle);
                      },
                    } as UndoableChange;
                    useStore.getState().addUndoable(undoableChange);
                    setLigandStyle(value);
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
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('spaceship.SpaceshipDisplay', lang)}: </span>
              </Col>
              <Col span={12}>
                <Select
                  style={{ width: '90%' }}
                  value={spaceshipDisplayMode}
                  onChange={(value) => {
                    const undoableChange = {
                      name: 'Select Spaceship Mode',
                      timestamp: Date.now(),
                      oldValue: spaceshipDisplayMode,
                      newValue: value,
                      undo: () => {
                        setSpaceshipDisplayMode(undoableChange.oldValue as SpaceshipDisplayMode);
                      },
                      redo: () => {
                        setSpaceshipDisplayMode(undoableChange.newValue as SpaceshipDisplayMode);
                      },
                    } as UndoableChange;
                    useStore.getState().addUndoable(undoableChange);
                    setSpaceshipDisplayMode(value);
                  }}
                >
                  <Option key={SpaceshipDisplayMode.NONE} value={SpaceshipDisplayMode.NONE}>
                    {t('word.None', lang)}
                  </Option>
                  <Option key={SpaceshipDisplayMode.OUTSIDE_VIEW} value={SpaceshipDisplayMode.OUTSIDE_VIEW}>
                    {t('spaceship.OutsideView', lang)}
                  </Option>
                  <Option key={SpaceshipDisplayMode.INSIDE_VIEW} value={SpaceshipDisplayMode.INSIDE_VIEW}>
                    {t('spaceship.InsideView', lang)}
                  </Option>
                </Select>
              </Col>
            </Row>
          </div>
        ),
      },
    ],
    [lang, spaceshipDisplayMode, chamberViewerStyle, projectViewerStyle],
  );

  const createDisplaySettings = useMemo(() => {
    return <Tabs defaultActiveKey="1" items={displayItems} />;
  }, [displayItems]);

  const createExperimentSettings = useMemo(() => {
    const setProtein = (targetName: string) => {
      setCommonStore((state) => {
        if (targetName === 'None') {
          state.projectState.protein = null;
        } else {
          for (const t of targetProteins) {
            if (t.name === targetName) {
              state.projectState.protein = t;
              break;
            }
          }
        }
      });
      setChanged(true);
    };

    const setLigand = (ligandName: string) => {
      setCommonStore((state) => {
        if (ligandName === 'None') {
          state.projectState.ligand = null;
        } else {
          for (const t of molecules) {
            if (t.name === ligandName) {
              state.projectState.ligand = t;
              break;
            }
          }
        }
      });
      setChanged(true);
    };

    return (
      <div style={{ width: '420px', paddingTop: '10px' }} onClick={(e) => e.stopPropagation()}>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.Ligand', lang)}: </span>
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '100%' }}
              value={ligand?.name ?? t('word.None', lang)}
              showSearch
              onChange={(value: string) => {
                const oldValue = ligand?.name;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Test Molecule',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setLigand(undoableChange.oldValue as string);
                  },
                  redo: () => {
                    setLigand(undoableChange.newValue as string);
                  },
                } as UndoableChange;
                addUndoable(undoableChange);
                setLigand(newValue);
                if (loggable) logAction('Select Ligand ' + newValue);
              }}
            >
              <Option key={`None`} value={'None'}>
                {t('word.None', lang)}
              </Option>
              {molecules.map((d, i) => (
                <Option key={`${i}-${d.name}`} value={d.name}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.Protein', lang)}: </span>
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '100%' }}
              value={protein?.name ?? t('word.None', lang)}
              showSearch
              onChange={(value: string) => {
                const oldValue = protein?.name;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Target Protein',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setProtein(undoableChange.oldValue as string);
                  },
                  redo: () => {
                    setProtein(undoableChange.newValue as string);
                  },
                } as UndoableChange;
                addUndoable(undoableChange);
                setProtein(newValue);
                if (loggable) logAction('Select Protein ' + newValue);
              }}
            >
              <Option key={`None`} value={'None'}>
                {t('word.None', lang)}
              </Option>
              {targetProteins.map((d, i) => (
                <Option key={`${i}-${d.name}`} value={d.name}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.ContainerLx', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              addonAfter={'Å'}
              min={10}
              max={100}
              style={{ width: '100%' }}
              precision={1}
              // make sure that we round up the number as toDegrees may cause things like .999999999
              value={parseFloat(molecularContainer?.lx.toFixed(1))}
              step={1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.molecularContainer.lx = value;
                  if (loggable) state.logAction('Set Container Lx to ' + value.toFixed(1));
                });
                setChanged(true);
              }}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.ContainerLy', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              addonAfter={'Å'}
              min={10}
              max={100}
              style={{ width: '100%' }}
              precision={1}
              // make sure that we round up the number as toDegrees may cause things like .999999999
              value={parseFloat(molecularContainer?.ly.toFixed(1))}
              step={1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.molecularContainer.ly = value;
                  if (loggable) state.logAction('Set Container Ly to ' + value.toFixed(1));
                });
                setChanged(true);
              }}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.ContainerLz', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              addonAfter={'Å'}
              min={10}
              max={100}
              style={{ width: '100%' }}
              precision={1}
              // make sure that we round up the number as toDegrees may cause things like .999999999
              value={parseFloat(molecularContainer?.lz.toFixed(1))}
              step={1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.molecularContainer.lz = value;
                  if (loggable) state.logAction('Set Container Lz to ' + value.toFixed(1));
                });
                setChanged(true);
              }}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.MovingStep', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              addonAfter={'Å'}
              min={0.1}
              max={1}
              style={{ width: '100%' }}
              precision={2}
              // make sure that we round up the number as toDegrees may cause things like .999999999
              value={parseFloat(translationStep.toFixed(2))}
              step={0.1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.translationStep = value;
                });
              }}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.RotationStep', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              min={1}
              max={10}
              formatter={(value) => `${value}°`}
              style={{ width: '100%' }}
              precision={2}
              // make sure that we round up the number as toDegrees may cause things like .999999999
              value={parseFloat(Util.toDegrees(rotationStep).toFixed(2))}
              step={1}
              onChange={(value) => {
                if (value === null) return;
                const step = Util.toRadians(value);
                setCommonStore((state) => {
                  state.projectState.rotationStep = step;
                });
              }}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.SelectorCommands', lang)}: </span>
          </Col>
          <Col span={16}>
            <TextArea
              rows={4}
              value={selector}
              onChange={(e) => {
                setSelector(e.target.value);
              }}
              onBlur={() => {
                setCommonStore((state) => {
                  state.projectState.chamberViewerSelector = selector ?? 'all';
                });
              }}
              onPointerOut={() => {
                setCommonStore((state) => {
                  state.projectState.chamberViewerSelector = selector ?? 'all';
                });
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }, [
    lang,
    protein,
    ligand,
    molecules,
    chamberViewerSelector,
    translationStep,
    rotationStep,
    selector,
    molecularContainer?.lx,
    molecularContainer?.ly,
    molecularContainer?.lz,
  ]);

  const createInfo = useMemo(() => {
    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: t('word.Codename', lang),
        children: proteinData?.name,
      },
      {
        key: '2',
        label: t('projectPanel.AtomCount', lang),
        children: proteinData?.atoms.length,
      },
      {
        key: '3',
        label: t('projectPanel.BondCount', lang),
        children: proteinData?.radialBonds.length,
      },
      {
        key: '4',
        label: t('projectPanel.ResidueCount', lang),
        children: proteinData?.residues.length,
      },
      {
        key: '5',
        label: t('projectPanel.ChainCount', lang),
        children: proteinData?.chains.length,
      },
      {
        key: '6',
        label: t('projectPanel.StructureCount', lang),
        children: proteinData?.structures.length,
      },
      {
        key: '7',
        label: t('projectPanel.MoleculeCount', lang),
        children: proteinData?.molecules.length,
      },
    ];
    return (
      <div style={{ width: '340px' }}>
        {proteinData && (
          <span style={{ paddingTop: '10px', fontSize: '10px' }}>
            {proteinData?.metadata['classification']}
            <br /> {proteinData?.metadata['title']}
          </span>
        )}
        <Descriptions
          style={{ paddingTop: '30px' }}
          styles={{ label: { fontSize: '12px' }, content: { fontSize: '12px' } }}
          column={2}
          items={items}
          size={'default'}
        />
      </div>
    );
  }, [lang, proteinData]);

  const leftIndent = hideGallery ? 50 : 8;

  return (
    <>
      {hideGallery && (
        <FloatButton
          shape="square"
          style={{
            position: 'absolute',
            top: '8px',
            left: '6px',
            height: '20px',
            zIndex: 13,
          }}
          tooltip={t('menu.view.ShowGallery', lang)}
          onClick={() => openGallery()}
          description={
            <span style={{ fontSize: '20px' }}>
              <RightOutlined />
            </span>
          }
        />
      )}
      <Popover
        title={
          <div onClick={(e) => e.stopPropagation()}>
            <ExperimentOutlined /> {t('experiment.ExperimentSettings', lang)}
          </div>
        }
        content={createExperimentSettings}
      >
        <FloatButton
          shape="square"
          type="primary"
          style={{
            position: 'absolute',
            top: '8px',
            left: leftIndent + 'px',
            height: '20px',
            zIndex: 13,
          }}
          description={
            <span style={{ fontSize: '20px' }}>
              <ExperimentOutlined />
            </span>
          }
        />
      </Popover>
      <Popover
        title={
          <div onClick={(e) => e.stopPropagation()}>
            <EyeOutlined /> {t('experiment.DisplaySettings', lang)}
          </div>
        }
        content={createDisplaySettings}
      >
        <FloatButton
          shape="square"
          type="primary"
          style={{
            position: 'absolute',
            top: '8px',
            left: leftIndent + 44 + 'px',
            height: '20px',
            zIndex: 13,
          }}
          description={
            <span style={{ fontSize: '20px' }}>
              <EyeOutlined />
            </span>
          }
        />
      </Popover>
      <Popover
        title={
          <div onClick={(e) => e.stopPropagation()}>
            <CameraOutlined /> {t('molecularViewer.TakeScreenshot', lang)}
          </div>
        }
        content={<ScreenshotPanel />}
      >
        <FloatButton
          shape="square"
          type="primary"
          style={{
            position: 'absolute',
            top: '8px',
            left: leftIndent + 88 + 'px',
            height: '20px',
            zIndex: 13,
          }}
          description={
            <span style={{ fontSize: '20px' }}>
              <CameraOutlined />
            </span>
          }
        />
      </Popover>
      {protein?.name ? (
        <Popover
          title={
            <div onClick={(e) => e.stopPropagation()}>
              <InfoCircleOutlined /> {t('experiment.Information', lang)}
            </div>
          }
          content={createInfo}
        >
          <span
            style={{
              position: 'absolute',
              top: '14px',
              left: leftIndent + 140 + 'px',
              zIndex: 13,
              fontSize: '20px',
              userSelect: 'none',
              color: 'lightgray',
            }}
          >
            {protein.name}
          </span>
        </Popover>
      ) : null}
    </>
  );
});

export default DockingSettings;
