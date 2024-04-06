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
  FundOutlined,
} from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import styled from 'styled-components';
import { useRefStore } from '../stores/commonRef.ts';
import { useDataStore } from '../stores/commonData.ts';
import { EnergyData } from '../models/EnergyData.ts';
import { HeatBath } from '../models/HeatBath.ts';

const Container = styled.div`
  position: absolute;
  left: calc(50% - 150px);
  width: 220px;
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
  const language = useStore(Selector.language);
  const setCommonStore = useStore(Selector.set);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const startSimulation = usePrimitiveStore(Selector.startSimulation);
  const resetSimulation = usePrimitiveStore(Selector.resetSimulation);
  const energyTimeSeries = useDataStore(Selector.energyTimeSeries);
  const energyGraphVisible = useStore(Selector.energyGraphVisible);
  const temperature = useStore(Selector.temperature);
  const constantTemperature = useStore(Selector.constantTemperature);

  const mdRef = useRefStore.getState().molecularDynamicsRef;
  const requestRef = useRef<number>(0);
  const requestResetRef = useRef<boolean>(false);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const interval = 20;

  useEffect(() => {
    if (mdRef?.current) {
      const md = mdRef.current;
      md.heatBath.enabled = constantTemperature;
      if (constantTemperature) {
        md.heatBath.temperature = temperature;
      }
    }
  }, [constantTemperature, mdRef, temperature]);

  useEffect(() => {
    if (startSimulation) {
      if (mdRef?.current) {
        mdRef.current.heatBath.enabled = constantTemperature;
        mdRef.current.heatBath.temperature = temperature;
      }
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
      energyTimeSeries.clear();
      usePrimitiveStore.getState().set((state) => {
        state.updateViewerFlag = !state.updateViewerFlag;
      });
    }
  }, [resetSimulation, mdRef, energyTimeSeries]);

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
            const energyData = {
              time: md.indexOfStep * md.timeStep,
              k: md.kineticEnergy,
              p: md.potentialEnergy,
              t: md.totalEnergy,
            } as EnergyData;
            energyTimeSeries.add(energyData);
            if (md.indexOfStep % 100 === 0) console.log(energyData);
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
    if (constantTemperature) {
      setCommonStore((state) => {
        state.projectState.temperature *= 1 + percent * 0.01;
        if (state.projectState.temperature > HeatBath.MAXIMUM_TEMPERATURE) {
          state.projectState.temperature = HeatBath.MAXIMUM_TEMPERATURE;
        }
      });
    }
  };

  return (
    <Container
      // the following disables keyboard focus
      onMouseDown={(e) => e.preventDefault()}
      // the following disables the context menu
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Space direction={'horizontal'}>
        <Button
          style={{ background: energyGraphVisible ? 'darkgray' : undefined }}
          icon={<FundOutlined />}
          onClick={() => {
            setCommonStore((state) => {
              state.projectState.energyGraphVisible = !state.projectState.energyGraphVisible;
            });
            setChanged(true);
          }}
          title={t('molecularViewer.EnergyGraph', lang)}
        />
        <Button icon={<VerticalRightOutlined />} onClick={resetSim} title={t('experiment.ResetSimulation', lang)} />
        <Button
          icon={startSimulation ? <PauseOutlined /> : <RightOutlined />}
          onClick={toggleSim}
          title={t(startSimulation ? 'experiment.PauseSimulation' : 'experiment.StartSimulation', lang)}
        />
        <Button
          style={{ background: 'lightsteelblue' }}
          icon={<ArrowDownOutlined />}
          onClick={() => changeTemperature(-20)}
          title={t('word.Cool', lang)}
        />
        <Button
          style={{ background: 'lightcoral' }}
          icon={<ArrowUpOutlined />}
          onClick={() => changeTemperature(20)}
          title={t('word.Heat', lang)}
        />
      </Space>
    </Container>
  );
});

export default SimulationControls;
