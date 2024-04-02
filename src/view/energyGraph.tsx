/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import styled from 'styled-components';
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDataStore } from '../stores/commonData.ts';
import { EnergyData } from '../models/EnergyData.ts';
import { KINETIC_ENERGY_COLOR, POTENTIAL_ENERGY_COLOR, TOTAL_ENERGY_COLOR } from '../models/physicalConstants.ts';

const Container = styled.div`
  position: absolute;
  left: 120px;
  top: 80px;
  width: calc(100% - 240px);
  height: calc(100% - 160px);
  margin: 0;
  display: flex;
  justify-content: center;
  align-self: center;
  align-content: center;
  align-items: center;
  padding: 6px 6px 6px 6px;
  opacity: 80%;
  background: dimgray;
  border: 2px solid dimgray;
  border-radius: 10px;
  user-select: none;
  z-index: 10; // must be larger than that of the spinner so that this can be clicked
`;

const EnergyGraph = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const language = useStore(Selector.language);
  const resetSimulation = usePrimitiveStore(Selector.resetSimulation);
  const updateViewerFlag = usePrimitiveStore(Selector.updateViewerFlag);
  const energyTimeSeries = useDataStore(Selector.energyTimeSeries);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const dataRef = useRef<Array<EnergyData>>([]);

  useEffect(() => {
    dataRef.current = [...energyTimeSeries.array];
  }, [updateViewerFlag, energyTimeSeries, resetSimulation]);

  return (
    <Container>
      <CloseOutlined
        title={t('word.Close', lang)}
        style={{ color: 'antiquewhite', position: 'absolute', top: '8px', right: '8px', cursor: 'pointer' }}
        onClick={() => {
          setCommonStore((state) => {
            state.projectState.energyGraphVisible = false;
          });
          setChanged(true);
        }}
      />
      <ResponsiveContainer width="100%" height="100%" style={{ padding: '20px 20px 20px 20px' }}>
        <LineChart
          data={dataRef.current}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeWidth={0.2} color={'white'} />
          <XAxis
            dataKey="time"
            stroke={'white'}
            strokeWidth={2}
            fontSize={10}
            label={<Label value={t('word.Time', lang) + ' (fs)'} fill={'white'} dy={16} fontSize={12} />}
          />
          <YAxis
            stroke={'white'}
            strokeWidth={2}
            fontSize={10}
            label={<Label value={t('word.Energy', lang) + ' (eV)'} fill={'white'} dx={-16} fontSize={12} angle={-90} />}
          />
          <Tooltip
            contentStyle={{ background: '#505050' }}
            labelStyle={{ color: 'whitesmoke' }}
            formatter={(value: number) => value.toFixed(3) + ' eV'}
          />
          <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ top: '4px' }} />
          <Line
            name={t('word.KineticEnergy', lang)}
            type="linear"
            dataKey="k"
            stroke={KINETIC_ENERGY_COLOR}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            name={t('word.PotentialEnergy', lang)}
            type="linear"
            dataKey="p"
            stroke={POTENTIAL_ENERGY_COLOR}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            name={t('word.TotalEnergy', lang)}
            type="linear"
            dataKey="t"
            stroke={TOTAL_ENERGY_COLOR}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
});

export default EnergyGraph;
