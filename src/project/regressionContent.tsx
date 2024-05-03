/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { InputNumber, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const RegressionContent = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const setChanged = usePrimitiveStore(Selector.setChanged);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  return (
    <div>
      <Space style={{ fontSize: '12px' }}>
        <InputNumber
          addonBefore={t('projectPanel.PolynomialRegressionDegree', lang) + ':'}
          style={{ width: '300px' }}
          min={1}
          max={10}
          step={1}
          value={1}
          onChange={(value) => {
            if (value === null) return;
          }}
        />
      </Space>
    </div>
  );
});

export default RegressionContent;
