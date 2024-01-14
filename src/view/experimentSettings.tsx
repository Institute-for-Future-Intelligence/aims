/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { Col, FloatButton, Popover, Row, Select } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { UndoableChange } from '../undo/UndoableChange';
import { testProteins } from '../internalDatabase';

const { Option } = Select;

const ExperimentSettings = () => {
  const language = useStore(Selector.language);
  const targetProtein = useStore(Selector.targetProtein);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const createContent = useMemo(() => {
    const setTargetProtein = (targetName: string) => {
      useStore.getState().set((state) => {
        for (const t of testProteins) {
          if (t.name === targetName) {
            state.targetProtein = t;
            break;
          }
        }
      });
    };

    return (
      <div style={{ width: '300px', paddingTop: '10px' }} onClick={(e) => e.stopPropagation()}>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={6} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.Target', lang)}: </span>
          </Col>
          <Col span={18}>
            <Select
              style={{ width: '100%' }}
              value={targetProtein?.name ?? testProteins[0].name}
              onChange={(value: string) => {
                const oldValue = targetProtein?.name;
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
                useStore.getState().addUndoable(undoableChange);
                setTargetProtein(newValue);
              }}
            >
              {testProteins.map((d, i) => (
                <Option key={`${i}-${d.name}`} value={d.name}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
    );
  }, [lang, targetProtein]);

  return (
    <>
      <Popover
        title={<div onClick={(e) => e.stopPropagation()}>{t('experiment.ExperimentSettings', lang)}</div>}
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
        {targetProtein?.name ?? t('word.Unknown', lang)}
      </label>
    </>
  );
};

export default React.memo(ExperimentSettings);
