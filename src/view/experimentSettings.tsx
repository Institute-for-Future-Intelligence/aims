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
import { AimOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const ExperimentSettings = () => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const addUndoable = useStore(Selector.addUndoable);
  const projectState = useStore(Selector.projectState);
  const targetData = useStore(Selector.targetData);

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
        for (const t of sampleProteins) {
          if (t.name === targetName) {
            state.projectState.targetProtein = t;
            break;
          }
        }
      });
    };

    return (
      <div style={{ width: '420px', paddingTop: '10px' }} onClick={(e) => e.stopPropagation()}>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.Target', lang)}: </span>
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '100%' }}
              value={projectState.targetProtein?.name}
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
  }, [lang, projectState.targetProtein, projectState.chamberViewerSelector, selector]);

  const createInfo = useMemo(() => {
    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: t('word.Codename', lang),
        children: targetData?.name,
      },
      {
        key: '2',
        label: t('projectPanel.AtomCount', lang),
        children: targetData?.atoms.length,
      },
      {
        key: '3',
        label: t('projectPanel.BondCount', lang),
        children: targetData?.bonds.length,
      },
      {
        key: '4',
        label: t('projectPanel.ResidueCount', lang),
        children: targetData?.residues.length,
      },
      {
        key: '5',
        label: t('projectPanel.ChainCount', lang),
        children: targetData?.chains.length,
      },
      {
        key: '6',
        label: t('projectPanel.StructureCount', lang),
        children: targetData?.structures.length,
      },
      {
        key: '7',
        label: t('projectPanel.MoleculeCount', lang),
        children: targetData?.molecules.length,
      },
    ];
    return (
      <div style={{ width: '300px' }}>
        {targetData && (
          <label style={{ paddingTop: '10px', fontSize: '10px' }}>
            {targetData?.metadata['classification']}
            <br /> {targetData?.metadata['title']}
          </label>
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
  }, [lang, targetData]);

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
          }}
          description={<label style={{ fontSize: '20px' }}>🧪</label>}
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
          <label
            style={{
              position: 'absolute',
              top: '14px',
              left: '56px',
              zIndex: 999,
              fontSize: '20px',
              userSelect: 'none',
              color: 'lightgray',
            }}
          >
            {projectState.targetProtein.name}
          </label>
        </Popover>
      ) : (
        <label
          style={{
            position: 'absolute',
            top: '14px',
            left: '56px',
            zIndex: 999,
            fontSize: '20px',
            userSelect: 'none',
            color: 'lightgray',
          }}
        >
          {t('word.Unknown', lang)}
        </label>
      )}
    </>
  );
};

export default React.memo(ExperimentSettings);
