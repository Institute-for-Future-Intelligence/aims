/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useState } from 'react';
import { Euler, Vector3 } from 'three';
import { Box } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

const Cockpit = React.memo(() => {
  const { camera } = useThree();
  const [up, setUp] = useState<Vector3>(new Vector3());
  const [rotation, setRotation] = useState<Euler>(new Euler());

  useFrame(() => {
    setUp(camera.up.clone());
    setRotation(camera.rotation.clone());
  });

  return (
    <Box
      position={[0, 0, 0]}
      rotation={rotation}
      up={up}
      args={[100, 5, 5]}
      key={'Box'}
      name={'Box'}
      onPointerOver={(e) => {}}
      onPointerOut={(e) => {}}
      onPointerDown={(e) => {
        if (e.button === 2) return;
      }}
    >
      <meshStandardMaterial attach="material" color={'red'} />
    </Box>
  );
});

export default Cockpit;
