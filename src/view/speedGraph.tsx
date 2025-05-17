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
import { Checkbox, Space } from 'antd';

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
  const speedArrayMap = useDataStore(Selector.speedArrayMap);
  const speedGraphMaxX = useStore(Selector.speedGraphMaxX);
  const speedGraphMaxY = useStore(Selector.speedGraphMaxY);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const dataRef = useRef<Array<SpeedData>>([]);
  const maxXRef = useRef<number>(0);
  const maxYRef = useRef<number>(0);

  const findMaxX = () => {
    let max = 0;
    for (const q of speedArrayMap.values()) {
      for (const s of q.array) {
        if (s > max) max = s;
      }
    }
    if (max < 500) max = 500;
    else if (max < 1000) max = 1000;
    else if (max < 5000) max = 5000;
    else max = 10000;
    return max;
  };

  useEffect(() => {
    maxXRef.current = speedGraphMaxX ? speedGraphMaxX : findMaxX();
    dataRef.current = new Array<SpeedData>(50);
    for (let i = 0; i < dataRef.current.length; i++) {
      dataRef.current[i] = { speed: i, probability: 0 } as SpeedData;
    }
    const dx = maxXRef.current / dataRef.current.length;
    for (const q of speedArrayMap.values()) {
      for (const s of q.array) {
        const n = Math.floor(s / dx);
        if (dataRef.current[n]) dataRef.current[n].probability++;
      }
    }
    let sum = 0;
    for (let i = 0; i < dataRef.current.length; i++) {
      sum += dataRef.current[i].probability;
    }
    maxYRef.current = 0;
    for (let i = 0; i < dataRef.current.length; i++) {
      dataRef.current[i].probability /= sum * 0.01;
      if (maxYRef.current < dataRef.current[i].probability) maxYRef.current = dataRef.current[i].probability;
      dataRef.current[i].speed = Math.round(dataRef.current[i].speed * dx);
    }
  }, [updateViewerFlag, speedArrayMap, resetSimulation]);

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
      <Space style={{ position: 'absolute', bottom: '6px' }}>
        <Checkbox
          title={t('molecularViewer.FixXAxis', lang)}
          checked={speedGraphMaxX > 0}
          style={{ color: 'antiquewhite', cursor: 'pointer' }}
          onChange={(e) => {
            setCommonStore((state) => {
              state.projectState.speedGraphMaxX = e.target.checked ? maxXRef.current : 0;
            });
          }}
        >
          {t('molecularViewer.FixXAxis', lang)}
        </Checkbox>
        <Checkbox
          title={t('molecularViewer.FixYAxis', lang)}
          checked={speedGraphMaxY > 0}
          style={{ color: 'antiquewhite', cursor: 'pointer' }}
          onChange={(e) => {
            setCommonStore((state) => {
              state.projectState.speedGraphMaxY = e.target.checked ? maxYRef.current : 0;
            });
          }}
        >
          {t('molecularViewer.FixYAxis', lang)}
        </Checkbox>
      </Space>
      {dataRef.current.length > 0 && (
        <ResponsiveContainer width="100%" height="100%" style={{ padding: '20px 20px 30px 20px' }}>
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
              domain={[0, speedGraphMaxY ? Math.round(speedGraphMaxY) + 1 : 'auto']}
              stroke={'white'}
              strokeWidth={2}
              fontSize={10}
              label={
                <Label value={t('word.Probability', lang) + ' (%)'} fill={'white'} dx={-16} fontSize={12} angle={-90} />
              }
            />
            <Tooltip
              contentStyle={{ background: '#505050' }}
              labelStyle={{ color: 'whitesmoke' }}
              cursor={{ fill: 'transparent' }}
              formatter={(value: number) => value.toFixed(1) + ' %'}
            />
            <Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{ top: '4px' }} />
            <Bar name={t('word.Probability', lang)} type="linear" dataKey="probability" fill={'antiquewhite'} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Container>
  );
});

export default SpeedGraph;
