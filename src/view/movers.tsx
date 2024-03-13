/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useState } from 'react';
import { Box, Edges, Line } from '@react-three/drei';
import { HIGHLIGHT_HANDLE_COLOR } from '../constants.ts';

export interface MoversProps {
  center: number[];
  length: number[];
  lineWidth?: number;
}

const Movers = React.memo(({ lineWidth = 2, center = [0, 0, 0], length = [10, 10, 10] }: MoversProps) => {
  const [hoveredHandleIndex, setHoveredHandleIndex] = useState<number>(-1);
  const extra = 5;
  const shift = 2;

  return (
    <group position={[center[0], center[1], center[2]]}>
      <Line
        name={'x axis line'}
        points={[
          [-length[0] / 2 - extra, 0, 0],
          [length[0] / 2 + extra, 0, 0],
        ]}
        color={'red'}
        lineWidth={lineWidth}
      />
      <Box args={[0.4, 0.2, 0.2]} position={[length[0] / 2 + shift, 0, 0]}>
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0.75}
          color={hoveredHandleIndex === 0 ? HIGHLIGHT_HANDLE_COLOR : 'red'}
        />
        <Edges threshold={15} color="gray" />
      </Box>
      <Box args={[0.4, 0.2, 0.2]} position={[-length[0] / 2 - shift, 0, 0]}>
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0.75}
          color={hoveredHandleIndex === 0 ? HIGHLIGHT_HANDLE_COLOR : 'red'}
        />
        <Edges threshold={15} color="gray" />
      </Box>

      <Line
        name={'y axis line'}
        points={[
          [0, -length[1] / 2 - extra, 0],
          [0, length[1] / 2 + extra, 0],
        ]}
        color={'green'}
        lineWidth={lineWidth}
      />
      <Box args={[0.2, 0.4, 0.2]} position={[0, length[1] / 2 + shift, 0]}>
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0.75}
          color={hoveredHandleIndex === 0 ? HIGHLIGHT_HANDLE_COLOR : 'green'}
        />
        <Edges threshold={15} color="gray" />
      </Box>
      <Box args={[0.2, 0.4, 0.2]} position={[0, -length[1] / 2 - shift, 0]}>
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0.75}
          color={hoveredHandleIndex === 0 ? HIGHLIGHT_HANDLE_COLOR : 'green'}
        />
        <Edges threshold={15} color="gray" />
      </Box>

      <Line
        name={'z axis line'}
        points={[
          [0, 0, -length[2] / 2 - extra],
          [0, 0, length[2] / 2 + extra],
        ]}
        color={'blue'}
        lineWidth={lineWidth}
      />
      <Box args={[0.2, 0.2, 0.4]} position={[0, 0, length[2] / 2 + shift]}>
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0.75}
          color={hoveredHandleIndex === 0 ? HIGHLIGHT_HANDLE_COLOR : 'blue'}
        />
        <Edges threshold={15} color="gray" />
      </Box>
      <Box args={[0.2, 0.2, 0.4]} position={[0, 0, -length[2] / 2 - shift]}>
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0.75}
          color={hoveredHandleIndex === 0 ? HIGHLIGHT_HANDLE_COLOR : 'blue'}
        />
        <Edges threshold={15} color="gray" />
      </Box>
    </group>
  );
});

export default Movers;
