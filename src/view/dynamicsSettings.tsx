/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { Descriptions, DescriptionsProps, FloatButton, Popover } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { AimOutlined, ExperimentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { MoleculeTS } from '../models/MoleculeTS.ts';

const DynamicsSettings = React.memo(({ molecules }: { molecules: MoleculeTS[] | undefined | null }) => {
  const language = useStore(Selector.language);
  const testMolecules = useStore(Selector.testMolecules);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const createInfo = useMemo(() => {
    let atomCount = 0;
    let bondCount = 0;
    if (molecules) {
      for (const m of molecules) {
        atomCount += m.atoms.length;
      }
      for (const m of molecules) {
        bondCount += m.bonds.length;
      }
    }
    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: t('projectPanel.MoleculeCount', lang),
        children: testMolecules.length,
      },
      {
        key: '2',
        label: t('projectPanel.AtomCount', lang),
        children: atomCount,
      },
      {
        key: '3',
        label: t('projectPanel.BondCount', lang),
        children: 'NA',
      },
    ];
    return (
      <div style={{ width: '200px' }}>
        <Descriptions
          style={{ paddingTop: '30px' }}
          contentStyle={{ fontSize: '12px' }}
          labelStyle={{ fontSize: '12px' }}
          column={1}
          items={items}
          size={'default'}
        />
      </div>
    );
  }, [lang, testMolecules, molecules]);

  return (
    <>
      <Popover
        title={
          <div onClick={(e) => e.stopPropagation()}>
            <AimOutlined /> {t('experiment.ExperimentSettings', lang)}
          </div>
        }
        content={<div>Under construction...</div>}
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
          {t('experiment.Molecules', lang)}
        </span>
      </Popover>
    </>
  );
});

export default DynamicsSettings;
