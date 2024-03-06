/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { DoubleSide } from 'three';
import { useThree } from '@react-three/fiber';
import * as Selector from '../stores/selector';
import { Box, Grid, Line, Plane } from '@react-three/drei';
import { HALF_PI, HIGHLIGHT_HANDLE_COLOR } from '../constants.ts';
import { useStore } from '../stores/common.ts';
import { useRefStore } from '../stores/commonRef.ts';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';

const DropPlanes = React.memo(() => {
  const xyPlaneVisible = useStore(Selector.xyPlaneVisible);
  const yzPlaneVisible = useStore(Selector.yzPlaneVisible);
  const xzPlaneVisible = useStore(Selector.xzPlaneVisible);
  const xyPlanePosition = useStore(Selector.xyPlanePosition) ?? 0;
  const yzPlanePosition = useStore(Selector.yzPlanePosition) ?? 0;
  const xzPlanePosition = useStore(Selector.xzPlanePosition) ?? 0;

  const [hoveredPlaneIndex, setHoveredPlaneIndex] = useState<number>(-1);
  const [hoveredHandleIndex, setHoveredHandleIndex] = useState<number>(-1);

  const planeXYRef = useRef<any>();
  const planeYZRef = useRef<any>();
  const planeXZRef = useRef<any>();

  const { gl } = useThree();

  const halfPlaneSize = 10;
  const planeSize = 2 * halfPlaneSize;
  const planeOpacity = 0.5;

  useEffect(() => {
    useRefStore.setState({
      planeXYRef: planeXYRef,
      planeYZRef: planeYZRef,
      planeXZRef: planeXZRef,
    });
  }, [planeXYRef, planeYZRef, planeXZRef]);

  const createBorder = (
    planeIndex: number,
    box: number[],
    points: [number, number, number][],
    name: string,
    color: string,
  ) => {
    return (
      <>
        <Line name={name} points={points} color={color} lineWidth={2} />
        {points.map((p, handleIndex) => {
          if (handleIndex === points.length - 1) return null;
          return (
            <Box
              name={name + ' Handle ' + handleIndex}
              args={[box[0], box[1], box[2]]}
              position={p}
              onPointerEnter={() => {
                setHoveredPlaneIndex(planeIndex);
                setHoveredHandleIndex(handleIndex);
                gl.domElement.style.cursor = 'pointer';
              }}
              onPointerLeave={() => {
                setHoveredPlaneIndex(-1);
                setHoveredHandleIndex(-1);
                gl.domElement.style.cursor = 'default';
              }}
              onPointerDown={() => {
                usePrimitiveStore.getState().set((state) => {
                  state.enableRotate = false;
                });
              }}
              onPointerUp={() => {
                usePrimitiveStore.getState().set((state) => {
                  state.enableRotate = true;
                });
              }}
            >
              <meshBasicMaterial
                attach="material"
                color={
                  hoveredHandleIndex === handleIndex && hoveredPlaneIndex === planeIndex
                    ? HIGHLIGHT_HANDLE_COLOR
                    : color
                }
              />
            </Box>
          );
        })}
      </>
    );
  };

  return (
    <group>
      {xyPlaneVisible && (
        <group position={[0, 0, xyPlanePosition]}>
          <Plane
            ref={planeXYRef}
            visible={false}
            name={'X-Y Plane'}
            args={[planeSize, planeSize]}
            rotation={[0, 0, 0]}
            onClick={(e) => {
              // console.log('a');
            }}
          >
            <meshStandardMaterial
              attach="material"
              opacity={planeOpacity}
              side={DoubleSide}
              transparent
              color={'blue'}
            />
          </Plane>
          <Grid
            name={'X-Y Grid'}
            args={[planeSize, planeSize]}
            rotation={[HALF_PI, 0, 0]}
            sectionColor={'blue'}
            sectionThickness={1}
            side={DoubleSide}
          />
          {createBorder(
            0,
            [0.5, 0.5, 0.2],
            [
              [-halfPlaneSize, -halfPlaneSize, 0],
              [halfPlaneSize, -halfPlaneSize, 0],
              [halfPlaneSize, halfPlaneSize, 0],
              [-halfPlaneSize, halfPlaneSize, 0],
              [-halfPlaneSize, -halfPlaneSize, 0],
            ],
            'X-Y Plane Border',
            'blue',
          )}
        </group>
      )}
      {yzPlaneVisible && (
        <group position={[yzPlanePosition, 0, 0]}>
          <Plane
            ref={planeYZRef}
            visible={false}
            name={'Y-Z Plane'}
            args={[planeSize, planeSize]}
            rotation={[0, HALF_PI, 0]}
          >
            <meshStandardMaterial
              attach="material"
              opacity={planeOpacity}
              side={DoubleSide}
              transparent
              color={'red'}
            />
          </Plane>
          <Grid
            name={'Y-Z Grid'}
            args={[planeSize, planeSize]}
            rotation={[0, 0, HALF_PI]}
            sectionColor={'red'}
            sectionThickness={1}
            side={DoubleSide}
            onClick={(e) => {}}
          />
          {createBorder(
            1,
            [0.2, 0.5, 0.5],
            [
              [0, -halfPlaneSize, -halfPlaneSize],
              [0, halfPlaneSize, -halfPlaneSize],
              [0, halfPlaneSize, halfPlaneSize],
              [0, -halfPlaneSize, halfPlaneSize],
              [0, -halfPlaneSize, -halfPlaneSize],
            ],
            'Y-Z Plane Border',
            'red',
          )}
        </group>
      )}
      {xzPlaneVisible && (
        <group position={[0, xzPlanePosition, 0]}>
          <Plane
            ref={planeXZRef}
            visible={false}
            name={'X-Z Plane'}
            args={[planeSize, planeSize]}
            rotation={[HALF_PI, 0, 0]}
          >
            <meshStandardMaterial
              attach="material"
              opacity={planeOpacity}
              side={DoubleSide}
              transparent
              color={'green'}
            />
          </Plane>
          <Grid
            name={'X-Z Grid'}
            args={[planeSize, planeSize]}
            rotation={[0, HALF_PI, 0]}
            sectionColor={'green'}
            sectionThickness={1}
            side={DoubleSide}
            onClick={(e) => {}}
          />
          {createBorder(
            2,
            [0.5, 0.2, 0.5],
            [
              [-halfPlaneSize, 0, -halfPlaneSize],
              [halfPlaneSize, 0, -halfPlaneSize],
              [halfPlaneSize, 0, halfPlaneSize],
              [-halfPlaneSize, 0, halfPlaneSize],
              [-halfPlaneSize, 0, -halfPlaneSize],
            ],
            'X-Z Plane Border',
            'green',
          )}
        </group>
      )}
    </group>
  );
});

export default DropPlanes;
