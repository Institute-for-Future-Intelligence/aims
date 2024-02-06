/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Input, Col, Descriptions, DescriptionsProps, FloatButton, Popover, Row, Select } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { UndoableChange } from '../undo/UndoableChange';
import { sampleProteins } from '../internalDatabase';
import { AimOutlined, InfoCircleOutlined, ExperimentOutlined } from '@ant-design/icons';
import { usePrimitiveStore } from '../stores/commonPrimitive';

const { Option } = Select;
const { TextArea } = Input;

const ExperimentSettings = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const addUndoable = useStore(Selector.addUndoable);
  const projectState = useStore(Selector.projectState);
  const targetProteinData = useStore(Selector.targetProteinData);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const updateTestMoleculeData = useStore(Selector.updateTestMoleculeData);

  const [selector, setSelector] = useState<string | undefined>();

  useEffect(() => {
    setSelector(projectState.chamberViewerSelector);
  }, [projectState.chamberViewerSelector]);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const createContent = useMemo(() => {
    const setTargetProtein = (targetName: string) => {
      setCommonStore((state) => {
        if (targetName === 'None') {
          state.projectState.targetProtein = null;
        } else {
          for (const t of sampleProteins) {
            if (t.name === targetName) {
              state.projectState.targetProtein = t;
              break;
            }
          }
        }
      });
      setChanged(true);
    };

    const setTestMolecule = (testMoleculeName: string) => {
      setCommonStore((state) => {
        if (testMoleculeName === 'None') {
          state.projectState.testMolecule = null;
        } else {
          for (const t of projectState.molecules) {
            if (t.name === testMoleculeName) {
              state.projectState.testMolecule = t;
              break;
            }
          }
        }
      });
      updateTestMoleculeData();
      setChanged(true);
    };

    return (
      <div style={{ width: '420px', paddingTop: '10px' }} onClick={(e) => e.stopPropagation()}>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.TestMolecule', lang)}: </span>
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '100%' }}
              value={projectState.testMolecule?.name ?? t('word.None', lang)}
              showSearch
              onChange={(value: string) => {
                const oldValue = projectState.testMolecule?.name;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Test Molecule',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setTestMolecule(undoableChange.oldValue as string);
                  },
                  redo: () => {
                    setTestMolecule(undoableChange.newValue as string);
                  },
                } as UndoableChange;
                addUndoable(undoableChange);
                setTestMolecule(newValue);
              }}
            >
              <Option key={`None`} value={'None'}>
                {t('word.None', lang)}
              </Option>
              {projectState.molecules.map((d, i) => (
                <Option key={`${i}-${d.name}`} value={d.name}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.Target', lang)}: </span>
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '100%' }}
              value={projectState.targetProtein?.name ?? t('word.None', lang)}
              showSearch
              onChange={(value: string) => {
                const oldValue = projectState.targetProtein?.name;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Target Protein',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setTargetProtein(undoableChange.oldValue as string);
                  },
                  redo: () => {
                    setTargetProtein(undoableChange.newValue as string);
                  },
                } as UndoableChange;
                addUndoable(undoableChange);
                setTargetProtein(newValue);
              }}
            >
              <Option key={`None`} value={'None'}>
                {t('word.None', lang)}
              </Option>
              {sampleProteins.map((d, i) => (
                <Option key={`${i}-${d.name}`} value={d.name}>
                  {d.name}
                </Option>
              ))}
            </Select>
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
    projectState.targetProtein,
    projectState.testMolecule,
    projectState.molecules,
    projectState.chamberViewerSelector,
    selector,
  ]);

  const createInfo = useMemo(() => {
    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: t('word.Codename', lang),
        children: targetProteinData?.name,
      },
      {
        key: '2',
        label: t('projectPanel.AtomCount', lang),
        children: targetProteinData?.atoms.length,
      },
      {
        key: '3',
        label: t('projectPanel.BondCount', lang),
        children: targetProteinData?.bonds.length,
      },
      {
        key: '4',
        label: t('projectPanel.ResidueCount', lang),
        children: targetProteinData?.residues.length,
      },
      {
        key: '5',
        label: t('projectPanel.ChainCount', lang),
        children: targetProteinData?.chains.length,
      },
      {
        key: '6',
        label: t('projectPanel.StructureCount', lang),
        children: targetProteinData?.structures.length,
      },
      {
        key: '7',
        label: t('projectPanel.MoleculeCount', lang),
        children: targetProteinData?.molecules.length,
      },
    ];
    return (
      <div style={{ width: '300px' }}>
        {targetProteinData && (
          <span style={{ paddingTop: '10px', fontSize: '10px' }}>
            {targetProteinData?.metadata['classification']}
            <br /> {targetProteinData?.metadata['title']}
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
  }, [lang, targetProteinData]);

  return (
    <>
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
            left: '6px',
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
      {projectState.targetProtein?.name ? (
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
              left: '56px',
              zIndex: 13,
              fontSize: '20px',
              userSelect: 'none',
              color: 'lightgray',
            }}
          >
            {projectState.targetProtein.name}
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

export default ExperimentSettings;
