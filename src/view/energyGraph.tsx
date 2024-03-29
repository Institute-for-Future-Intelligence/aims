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
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
  border: 2px solid antiquewhite;
  border-radius: 20px;
  user-select: none;
  z-index: 10; // must be larger than that of the spinner so that this can be clicked
`;

const data = [
  {
    name: '1',
    k: 4000,
    p: 2400,
    t: 2400,
  },
  {
    name: '2',
    k: 3000,
    p: 1398,
    t: 2210,
  },
  {
    name: '3',
    k: 2000,
    p: 9800,
    t: 2290,
  },
  {
    name: '4',
    k: 2780,
    p: 3908,
    t: 2000,
  },
  {
    name: '5',
    k: 1890,
    p: 4800,
    t: 2181,
  },
  {
    name: '6',
    k: 2390,
    p: 3800,
    t: 2500,
  },
  {
    name: '7',
    k: 3490,
    p: 4300,
    t: 2100,
  },
];

const EnergyGraph = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);

  const mdRef = useRefStore.getState().molecularDynamicsRef;

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  return (
    <Container>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeWidth={0.2} color={'white'} />
          <XAxis
            dataKey="name"
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
          <Tooltip />
          <Legend layout="horizontal" verticalAlign="top" align="center" />
          <Line
            name={t('word.KineticEnergy', lang)}
            type="linear"
            dataKey="k"
            stroke="#FFA07A"
            strokeWidth={2}
            activeDot={{ r: 5 }}
          />
          <Line
            name={t('word.PotentialEnergy', lang)}
            type="linear"
            dataKey="p"
            stroke="#00BFFF"
            strokeWidth={2}
            activeDot={{ r: 5 }}
          />
          <Line
            name={t('word.TotalEnergy', lang)}
            type="linear"
            dataKey="t"
            stroke="#00FF7F"
            strokeWidth={2}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
});

export default EnergyGraph;
