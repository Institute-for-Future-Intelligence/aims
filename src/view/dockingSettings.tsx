/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Col, Descriptions, DescriptionsProps, FloatButton, Input, InputNumber, Popover, Row, Select } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { UndoableChange } from '../undo/UndoableChange';
import { targetProteins } from '../internalDatabase';
import { AimOutlined, ExperimentOutlined, InfoCircleOutlined, RightOutlined } from '@ant-design/icons';
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { Util } from '../Util.ts';
import { Undoable } from '../undo/Undoable.ts';

const { Option } = Select;
const { TextArea } = Input;

const DockingSettings = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
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

  const createContent = useMemo(() => {
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
              value={parseFloat(molecularContainer.lx.toFixed(1))}
              step={1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.molecularContainer.lx = value;
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
              value={parseFloat(molecularContainer.ly.toFixed(1))}
              step={1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.molecularContainer.ly = value;
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
              value={parseFloat(molecularContainer.lz.toFixed(1))}
              step={1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.molecularContainer.lz = value;
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
    molecularContainer.lx,
    molecularContainer.ly,
    molecularContainer.lz,
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
          contentStyle={{ fontSize: '12px' }}
          labelStyle={{ fontSize: '12px' }}
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
            <AimOutlined /> {t('experiment.ExperimentSettings', lang)}
          </div>
        }
        content={createContent}
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
              left: leftIndent + 50 + 'px',
              zIndex: 13,
              fontSize: '20px',
              userSelect: 'none',
              color: 'lightgray',
            }}
          >
            {protein.name}
          </span>
        </Popover>
      ) : (
        <span
          style={{
            position: 'absolute',
            top: '14px',
            left: '56px',
            zIndex: 13,
            fontSize: '20px',
            userSelect: 'none',
            color: 'lightgray',
          }}
        >
          {t('word.Unknown', lang)}
        </span>
      )}
    </>
  );
});

export default DockingSettings;
