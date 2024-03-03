/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { FloatButton } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';

const DynamicsButtons = React.memo(() => {
  const language = useStore(Selector.language);
  const xyPlaneVisible = usePrimitiveStore(Selector.xyPlaneVisible);
  const yzPlaneVisible = usePrimitiveStore(Selector.yzPlaneVisible);
  const xzPlaneVisible = usePrimitiveStore(Selector.xzPlaneVisible);

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
        style={{ background: xyPlaneVisible ? 'lightgray' : 'white' }}
        onClick={() => {
          usePrimitiveStore.getState().set((state) => {
            state.xyPlaneVisible = !state.xyPlaneVisible;
          });
        }}
      />
      <FloatButton
        description={'Y-Z'}
        tooltip={t('experiment.ShowYZPlane', lang)}
        style={{ background: yzPlaneVisible ? 'lightgray' : 'white' }}
        onClick={() => {
          usePrimitiveStore.getState().set((state) => {
            state.yzPlaneVisible = !state.yzPlaneVisible;
          });
        }}
      />
      <FloatButton
        description={'X-Z'}
        tooltip={t('experiment.ShowXZPlane', lang)}
        style={{ background: xzPlaneVisible ? 'lightgray' : 'white' }}
        onClick={() => {
          usePrimitiveStore.getState().set((state) => {
            state.xzPlaneVisible = !state.xzPlaneVisible;
          });
        }}
      />
    </FloatButton.Group>
  );
});

export default DynamicsButtons;
