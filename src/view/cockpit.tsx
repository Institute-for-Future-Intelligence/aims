/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useMemo, useRef } from 'react';
import { Group, Shape, Vector3 } from 'three';
import { Plane } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

const Cockpit = React.memo(() => {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);

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

  const shape = useMemo(() => {
    const w = 10;
    const s = new Shape();
    s.moveTo(0, 0);
    s.lineTo(0.4 * w, 0.25);
    s.lineTo(0.6 * w, 0.25);
    s.lineTo(w, 0);
    s.closePath();
    return s;
  }, []);

  return (
    <group ref={groupRef}>
      <Plane name={'Cockpit Plane'} args={[10, 0.05]} position={[0, 1.32, 0]}>
        <meshStandardMaterial attach="material" opacity={0.8} transparent color={'dimgray'} />
      </Plane>
      <mesh position={[-5, -1.35, 0]}>
        <shapeGeometry attach="geometry" args={[shape]} />
        <meshStandardMaterial attach="material" color={'dimgray'} transparent opacity={0.8} />
      </mesh>
    </group>
  );
});

export default Cockpit;
