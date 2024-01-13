/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { FloatButton, Popover } from 'antd';
import { DeploymentUnitOutlined } from '@ant-design/icons';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';

const ExperimentSettings = () => {
  const language = useStore(Selector.language);
  const targetProtein = useStore(Selector.targetProtein);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  return (
    <>
      <Popover
        title={<div onClick={(e) => e.stopPropagation()}>{t('experiment.Chamber', lang)}</div>}
        content={<div></div>}
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
          description={<DeploymentUnitOutlined style={{ fontSize: '24px' }} />}
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
