/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useState } from 'react';
import { Euler, Vector3 } from 'three';
import { Box } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

const Cockpit = React.memo(() => {
  const { camera } = useThree();
  const [position, setPosition] = useState<Vector3>(new Vector3());
  const [up, setUp] = useState<Vector3>(new Vector3());
  const [rotation, setRotation] = useState<Euler>(new Euler());

  useFrame(() => {
    const v = new Vector3();
    camera.getWorldDirection(v);
    setPosition(camera.position.clone().addScaledVector(v, 4));
    setUp(camera.up.clone());
    setRotation(camera.rotation.clone());
  });

  return (
    <group position={position} rotation={rotation} up={up}>
      <Box
        args={[10, 5, 5]}
        position={[-51, 0, 0]}
        key={'Box1'}
        name={'Box1'}
        onPointerOver={(e) => {}}
        onPointerOut={(e) => {}}
        onPointerDown={(e) => {
          if (e.button === 2) return;
        }}
      >
        <meshStandardMaterial attach="material" color={'gray'} />
      </Box>
      <Box
        args={[50, 5, 5]}
        position={[25, 0, 0]}
        key={'Box2'}
        name={'Box2'}
        onPointerOver={(e) => {}}
        onPointerOut={(e) => {}}
        onPointerDown={(e) => {
          if (e.button === 2) return;
        }}
      >
        <meshStandardMaterial attach="material" color={'red'} transparent={true} opacity={0.5} />
      </Box>
    </group>
  );
});

export default Cockpit;
