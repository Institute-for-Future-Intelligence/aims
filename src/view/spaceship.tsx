/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Euler, Group, Mesh, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
// @ts-expect-error: ignore
import shipUrl from '../assets/ship.gltf';

export interface SpaceshipProps {
  scale?: number;
}

const Spaceship = React.memo(({ scale = 0.2 }: SpaceshipProps) => {
  const { camera } = useThree();
  const groupRef = useRef<any>();

  useFrame(() => {
    if (groupRef.current) {
      const v = new Vector3();
      camera.getWorldDirection(v);
      groupRef.current.position.copy(camera.position);
      groupRef.current.position.addScaledVector(v, 5);
      groupRef.current.up.copy(camera.up);
      groupRef.current.rotation.copy(camera.rotation);
    }
  });

  const model = useGLTF(shipUrl);

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <primitive object={model.scene} scale={scale} />
      </mesh>
    </group>
  );
});

export default Spaceship;
