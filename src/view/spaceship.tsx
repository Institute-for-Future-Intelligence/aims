/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Euler, Group, Mesh, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
// @ts-expect-error: What
import shipUrl from '../assets/ship.gltf';

export interface SpaceshipProps {
  scale?: number;
}

const Spaceship = React.memo(({ scale = 4 }: SpaceshipProps) => {
  const { camera } = useThree();
  const [up, setUp] = useState<Vector3>(new Vector3());
  const [rotation, setRotation] = useState<Euler>(new Euler());

  useFrame(() => {
    setUp(camera.up.clone());
    setRotation(camera.rotation.clone());
  });

  const model = useGLTF(shipUrl);

  return (
    <group rotation={rotation} up={up}>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <primitive object={model.scene} scale={scale} />
      </mesh>
    </group>
  );
});

export default Spaceship;
