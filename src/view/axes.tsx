/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Line } from '@react-three/drei';

export interface AxesProps {
  lineWidth?: number;
  endPoint?: number;
  showTickMarks?: boolean;
  showTickLabels?: boolean;
}

const Axes = React.memo(
  ({ lineWidth = 1, endPoint = 1000, showTickMarks = true, showTickLabels = true }: AxesProps) => {
    const sceneRadius = 50;

    const [updateFlag, setUpdateFlag] = useState<boolean>(false);

    const nTicks = 50;
    const tickIntervalRef = useRef<number>(1);
    const labelIntervalRef = useRef<number>(tickIntervalRef.current * 10);
    const arrayRef = useRef<number[]>(new Array(nTicks).fill(1));

    const cameraZ: number = 0;

    useEffect(() => {
      if (sceneRadius < 50) {
        tickIntervalRef.current = 1;
      } else if (sceneRadius < 100) {
        tickIntervalRef.current = 2;
      } else {
        tickIntervalRef.current = 5;
      }
      labelIntervalRef.current = 10 * tickIntervalRef.current;
      arrayRef.current = new Array(nTicks).fill(1);
      setUpdateFlag(!updateFlag);
    }, [sceneRadius]);

    return (
      <>
        {/* x axis */}
        <Line
          userData={{ unintersectable: true }}
          name={'x axis line'}
          points={[
            [-endPoint, 0, cameraZ],
            [endPoint, 0, cameraZ],
          ]}
          color={'red'}
          lineWidth={lineWidth}
        />

        {/* y axis */}
        <Line
          name={'y axis line'}
          userData={{ unintersectable: true }}
          points={[
            [0, -endPoint, cameraZ],
            [0, endPoint, cameraZ],
          ]}
          color={'green'}
          lineWidth={lineWidth}
        />

        {/* z axis */}
        <Line
          userData={{ unintersectable: true }}
          name={'z axis line'}
          points={[
            [0, 0, 0],
            [0, 0, endPoint],
          ]}
          color={'blue'}
          lineWidth={lineWidth}
        />
      </>
    );
  },
);

export default Axes;
