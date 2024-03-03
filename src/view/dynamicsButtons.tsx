/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { FloatButton } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';

const DynamicsButtons = React.memo(() => {
  const language = useStore(Selector.language);
  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  return (
    <FloatButton.Group
      shape="square"
      style={{
        position: 'absolute',
        top: '56px',
        left: '6px',
        userSelect: 'none',
        zIndex: 13,
      }}
    >
      <FloatButton
        description={'X-Y'}
        tooltip={t('experiment.ShowXYPlane', lang)}
        onMouseDown={() => {}}
        onMouseUp={() => {}}
      />
      <FloatButton
        description={'Y-Z'}
        tooltip={t('experiment.ShowYZPlane', lang)}
        onMouseDown={() => {}}
        onMouseUp={() => {}}
      />
      <FloatButton
        description={'X-Z'}
        tooltip={t('experiment.ShowXZPlane', lang)}
        onMouseDown={() => {}}
        onMouseUp={() => {}}
      />
    </FloatButton.Group>
  );
});

export default DynamicsButtons;
