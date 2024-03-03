/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import { Line } from '@react-three/drei';

export interface AxesProps {
  lineWidth?: number;
  endPoint?: number;
}

const Axes = React.memo(({ lineWidth = 1, endPoint = 1000 }: AxesProps) => {
  return (
    <>
      {/* x axis */}
      <Line
        name={'x axis line'}
        points={[
          [-endPoint, 0, 0],
          [endPoint, 0, 0],
        ]}
        color={'red'}
        lineWidth={lineWidth}
      />

      {/* y axis */}
      <Line
        name={'y axis line'}
        points={[
          [0, -endPoint, 0],
          [0, endPoint, 0],
        ]}
        color={'green'}
        lineWidth={lineWidth}
      />

      {/* z axis */}
      <Line
        name={'z axis line'}
        points={[
          [0, 0, -endPoint],
          [0, 0, endPoint],
        ]}
        color={'blue'}
        lineWidth={lineWidth}
      />
    </>
  );
});

export default Axes;
