/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
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
import { useRefStore } from '../stores/commonRef.ts';

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
  const startSimulation = usePrimitiveStore(Selector.startSimulation);
  const resetSimulation = usePrimitiveStore(Selector.resetSimulation);

  const mdRef = useRefStore.getState().molecularDynamicsRef;
  const requestRef = useRef<number>(0);
  const requestResetRef = useRef<boolean>(false);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const interval = 20;

  useEffect(() => {
    if (startSimulation) {
      requestRef.current = requestAnimationFrame(simulate);
      return () => {
        // this is called when the recursive call of requestAnimationFrame exits
        cancelAnimationFrame(requestRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSimulation]);

  useEffect(() => {
    if (mdRef?.current) {
      const md = mdRef.current;
      md.reset();
      usePrimitiveStore.getState().set((state) => {
        state.updateViewerFlag = !state.updateViewerFlag;
      });
    }
  }, [resetSimulation]);

  const init = () => {
    if (mdRef?.current) {
      const md = mdRef.current;
      md.init();
    }
  };

  const simulate = () => {
    if (startSimulation) {
      if (requestResetRef.current) {
        requestResetRef.current = false;
        usePrimitiveStore.getState().set((state) => {
          state.resetSimulation = true;
          state.startSimulation = false;
        });
      } else {
        const md = mdRef?.current;
        if (md) {
          const movables = md.countMovables();
          if (movables > 0) {
            for (let i = 0; i < interval; i++) {
              md.move();
            }
            usePrimitiveStore.getState().set((state) => {
              state.updateViewerFlag = !state.updateViewerFlag;
            });
            // recursive call to the next step of the simulation
            requestRef.current = requestAnimationFrame(simulate);
          }
        }
      }
    }
  };

  const toggleSim = () => {
    usePrimitiveStore.getState().set((state) => {
      state.startSimulation = !state.startSimulation;
      state.resetSimulation = false;
    });
  };

  const resetSim = () => {
    if (startSimulation) {
      requestResetRef.current = true;
    } else {
      usePrimitiveStore.getState().set((state) => {
        state.resetSimulation = true;
      });
    }
  };

  const changeTemperature = (percent: number) => {
    if (mdRef?.current) {
      mdRef.current.changeTemperature(percent);
    }
  };

  return (
    <Container>
      <Space direction={'horizontal'} style={{ color: 'antiquewhite', fontSize: '10px' }}>
        <span>{t('experiment.MolecularDynamics', lang)}</span>
        <Button
          icon={<VerticalRightOutlined />}
          onClick={resetSim}
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
          icon={startSimulation ? <PauseOutlined /> : <RightOutlined />}
          onClick={toggleSim}
          title={t(startSimulation ? 'experiment.PauseSimulation' : 'experiment.StartSimulation', lang)}
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
          onClick={() => changeTemperature(-20)}
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
          onClick={() => changeTemperature(20)}
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