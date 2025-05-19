/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import {
  RightOutlined,
  PauseOutlined,
  RollbackOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LineChartOutlined,
  BarChartOutlined,
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
import { DataQueue } from '../models/DataQueue.ts';
import { PositionData } from '../models/PositionData.ts';
import { DATA_QUEUE_LENGTH, SPEED_CONVERTER } from '../models/physicalConstants.ts';

const Container = styled.div`
  position: absolute;
  left: calc(50% - 110px);
  width: 250px;
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
  z-index: 10; // must be larger than that of the spinner so that this can be clicked
`;

const SimulationControls = React.memo(() => {
  const language = useStore(Selector.language);
  const setCommonStore = useStore(Selector.set);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const startSimulation = usePrimitiveStore(Selector.startSimulation);
  const resetSimulation = usePrimitiveStore(Selector.resetSimulation);
  const energyTimeSeries = useDataStore(Selector.energyTimeSeries);
  const speedArrayMap = useDataStore(Selector.speedArrayMap);
  const positionTimeSeriesMap = useDataStore(Selector.positionTimeSeriesMap);
  const energyGraphVisible = useStore(Selector.energyGraphVisible);
  const speedGraphVisible = useStore(Selector.speedGraphVisible);
  const temperature = useStore(Selector.temperature);
  const constantTemperature = useStore(Selector.constantTemperature);
  const refreshInterval = useStore(Selector.refreshInterval) ?? 20;
  const collectInterval = useStore(Selector.collectInterval) ?? 100;
  const navigationView = useStore(Selector.navigationView);

  const mdRef = useRefStore.getState().molecularDynamicsRef;
  const requestRef = useRef<number>(0);
  const askForResetRef = useRef<boolean>(false);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

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
  }, [startSimulation, temperature, constantTemperature]);

  useEffect(() => {
    if (mdRef?.current && resetSimulation) {
      const md = mdRef.current;
      md.reset();
      energyTimeSeries.clear();
      speedArrayMap.clear();
      positionTimeSeriesMap.forEach((series) => {
        series.clear();
      });
      // reset temperature settings and display
      md.updateKineticEnergy();
      const currentTemperature = md.getCurrentTemperature();
      // if (md.heatBath.enabled) {
      //   md.heatBath.temperature = currentTemperature;
      //   setCommonStore((state) => {
      //     state.projectState.temperature = currentTemperature;
      //   });
      // }
      usePrimitiveStore.getState().set((state) => {
        state.currentTemperature = currentTemperature;
        state.updateViewerFlag = !state.updateViewerFlag;
      });
    }
  }, [resetSimulation, mdRef]);

  const updateSpeedArrayMap = () => {
    const md = mdRef?.current;
    if (md) {
      for (const [index, atom] of md.atoms.entries()) {
        let speedArray = speedArrayMap.get(index);
        if (!speedArray) {
          speedArray = new DataQueue<number>(DATA_QUEUE_LENGTH);
          speedArrayMap.set(index, speedArray);
        }
        speedArray.add(atom.velocity.length() * SPEED_CONVERTER);
      }
    }
  };

  const simulate = () => {
    if (startSimulation) {
      if (askForResetRef.current) {
        askForResetRef.current = false;
        usePrimitiveStore.getState().set((state) => {
          state.startSimulation = false;
          state.resetSimulation = true;
        });
      } else {
        const md = mdRef?.current;
        if (md) {
          const movables = md.countMovables();
          if (movables > 0) {
            for (let i = 0; i < refreshInterval; i++) {
              md.move();
            }
            if (md.indexOfStep % collectInterval === 0) {
              const time = md.timeStep * md.indexOfStep;
              const energyData = {
                time,
                k: md.kineticEnergy,
                p: md.potentialEnergy,
                t: md.totalEnergy,
              } as EnergyData;
              energyTimeSeries.add(energyData);
              // do not use speedGraphVisible defined above in this component
              // as it will not get updated immediately after the graph button is clicked
              if (useStore.getState().projectState.speedGraphVisible) {
                updateSpeedArrayMap();
              }
              for (const [index, atom] of md.atoms.entries()) {
                if (atom.trajectory) {
                  const positionData = {
                    time,
                    x: atom.position.x,
                    y: atom.position.y,
                    z: atom.position.z,
                  };
                  let positionTimeSeries = positionTimeSeriesMap.get(index);
                  if (!positionTimeSeries) {
                    positionTimeSeries = new DataQueue<PositionData>(DATA_QUEUE_LENGTH);
                    positionTimeSeriesMap.set(index, positionTimeSeries);
                  }
                  positionTimeSeries.add(positionData);
                }
              }
              console.log(energyData);
            }
            usePrimitiveStore.getState().set((state) => {
              state.currentTemperature = md.getCurrentTemperature();
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
      askForResetRef.current = true;
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
      style={{ bottom: navigationView ? '108px' : '6px' }}
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
          icon={<LineChartOutlined />}
          onClick={() => {
            setCommonStore((state) => {
              state.projectState.energyGraphVisible = !state.projectState.energyGraphVisible;
            });
            setChanged(true);
          }}
          title={t('molecularViewer.EnergyGraph', lang)}
        />
        <Button
          style={{ background: speedGraphVisible ? 'darkgray' : undefined }}
          icon={<BarChartOutlined />}
          onClick={() => {
            setCommonStore((state) => {
              state.projectState.speedGraphVisible = !state.projectState.speedGraphVisible;
              if (state.projectState.speedGraphVisible) updateSpeedArrayMap();
            });
            setChanged(true);
          }}
          title={t('molecularViewer.SpeedGraph', lang)}
        />
        <Button
          icon={<RollbackOutlined />}
          onClick={resetSim}
          disabled={startSimulation}
          title={t('experiment.ResetSimulation', lang)}
        />
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
