/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import {
  RightOutlined,
  PauseOutlined,
  VerticalRightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  left: calc(50% - 120px);
  width: 240px;
  bottom: 6px;
  margin: 0;
  display: flex;
  justify-content: center;
  align-self: center;
  align-content: center;
  align-items: center;
  padding: 6px 6px 6px 6px;
  opacity: 100%;
  background: dimgray;
  border: 2px solid gray;
  border-radius: 10px;
  user-select: none;
  z-index: 10000; // must be larger than that of the spinner so that this can be clicked
`;

const SimulationControls = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const start = usePrimitiveStore(Selector.startSimulation);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const toggleSimulation = () => {
    usePrimitiveStore.getState().set((state) => {
      state.startSimulation = !state.startSimulation;
    });
  };

  const resetSimulation = () => {};

  const changeTemperature = (increment: number) => {};

  return (
    <Container>
      <Space direction={'horizontal'} style={{ color: 'antiquewhite', fontSize: '10px' }}>
        <span>{t('experiment.MolecularDynamics', lang)}</span>
        <Button
          icon={<VerticalRightOutlined />}
          onClick={resetSimulation}
          title={t('experiment.ResetSimulation', lang)}
          // the following disables keyboard focus
          onMouseDown={(e) => e.preventDefault()}
          // the following disables the context menu
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
        <Button
          icon={start ? <PauseOutlined /> : <RightOutlined />}
          onClick={toggleSimulation}
          title={t(start ? 'experiment.PauseSimulation' : 'experiment.StartSimulation', lang)}
          // the following disables keyboard focus
          onMouseDown={(e) => e.preventDefault()}
          // the following disables the context menu
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
        <Button
          style={{ background: 'lightsteelblue' }}
          icon={<ArrowDownOutlined />}
          onClick={() => changeTemperature(-10)}
          title={t('word.Cool', lang)}
          // the following disables keyboard focus
          onMouseDown={(e) => e.preventDefault()}
          // the following disables the context menu
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
        <Button
          style={{ background: 'lightcoral' }}
          icon={<ArrowUpOutlined />}
          onClick={() => changeTemperature(-10)}
          title={t('word.Heat', lang)}
          // the following disables keyboard focus
          onMouseDown={(e) => e.preventDefault()}
          // the following disables the context menu
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      </Space>
    </Container>
  );
});

export default SimulationControls;
