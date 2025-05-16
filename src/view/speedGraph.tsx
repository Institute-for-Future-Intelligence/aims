/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import styled from 'styled-components';
import { Bar, BarChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useDataStore } from '../stores/commonData.ts';
import { SpeedData } from '../models/SpeedData.ts';

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

const SpeedGraph = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const language = useStore(Selector.language);
  const resetSimulation = usePrimitiveStore(Selector.resetSimulation);
  const updateViewerFlag = usePrimitiveStore(Selector.updateViewerFlag);
  const speedArray = useDataStore(Selector.speedArray);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const dataRef = useRef<Array<SpeedData>>([]);

  useEffect(() => {
    let max = 0;
    for (const s of speedArray) {
      if (s > max) max = s;
    }
    if (max < 500) max = 500;
    else if (max < 1000) max = 1000;
    else if (max < 5000) max = 5000;
    else max = 10000;
    dataRef.current = new Array<SpeedData>(50);
    for (let i = 0; i < dataRef.current.length; i++) {
      dataRef.current[i] = { speed: i, weight: 0 } as SpeedData;
    }
    const delta = max / dataRef.current.length;
    for (const s of speedArray) {
      const n = Math.floor(s / delta);
      dataRef.current[n].weight++;
    }
    let sum = 0;
    for (let i = 0; i < dataRef.current.length; i++) {
      sum += dataRef.current[i].weight;
    }
    for (let i = 0; i < dataRef.current.length; i++) {
      dataRef.current[i].weight /= sum * 0.01;
      dataRef.current[i].speed = Math.round(dataRef.current[i].speed * delta);
    }
  }, [updateViewerFlag, speedArray, resetSimulation]);

  return (
    <Container>
      <CloseOutlined
        title={t('word.Close', lang)}
        style={{ color: 'antiquewhite', position: 'absolute', top: '8px', right: '8px', cursor: 'pointer' }}
        onClick={() => {
          setCommonStore((state) => {
            state.projectState.speedGraphVisible = false;
          });
          setChanged(true);
        }}
      />
      {dataRef.current.length > 0 && (
        <ResponsiveContainer width="100%" height="100%" style={{ padding: '20px 20px 20px 20px' }}>
          <BarChart
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
              dataKey="speed"
              stroke={'white'}
              strokeWidth={2}
              fontSize={10}
              label={<Label value={t('word.Speed', lang) + ' (m/s)'} fill={'white'} dy={16} fontSize={12} />}
            />
            <YAxis
              stroke={'white'}
              strokeWidth={2}
              fontSize={10}
              label={
                <Label
                  value={t('word.StatisticalWeight', lang) + ' (%)'}
                  fill={'white'}
                  dx={-16}
                  fontSize={12}
                  angle={-90}
                />
              }
            />
            <Tooltip
              contentStyle={{ background: '#505050' }}
              labelStyle={{ color: 'whitesmoke' }}
              formatter={(value: number) => value.toFixed(3) + ' %'}
            />
            <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ top: '4px' }} />
            <Bar name={t('word.Speed', lang)} type="linear" dataKey="weight" fill={'antiquewhite'} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Container>
  );
});

export default SpeedGraph;
