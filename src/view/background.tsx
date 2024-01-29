/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import { Plane } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';

const Background = React.memo(() => {
  const { camera } = useThree();
  const planeRef = useRef<Mesh>(null);

  useFrame(() => {
    if (planeRef.current) {
      const v = new Vector3();
      camera.getWorldDirection(v);
      planeRef.current.position.copy(camera.position);
      planeRef.current.position.addScaledVector(v, 500);
      planeRef.current.up.copy(camera.up);
      planeRef.current.rotation.copy(camera.rotation);
    }
  });

  return (
    <Plane
      ref={planeRef}
      visible={false}
      name={'Background Plane'}
      args={[100000, 100000]}
      onContextMenu={(e) => {
        e.stopPropagation();
        usePrimitiveStore.getState().set((state) => {
          state.contextMenuObjectType = null;
        });
      }}
    />
  );
});

export default Background;
