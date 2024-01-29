/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

// @ts-expect-error: ignore
import shipUrl from '../assets/ship.gltf';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MeshBasicMaterial, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import { HALF_PI, ObjectType } from '../constants.ts';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';

export interface SpaceshipProps {
  scale?: number;
}

const Spaceship = React.memo(({ scale = 1 }: SpaceshipProps) => {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const v = new Vector3();
      camera.getWorldDirection(v);
      groupRef.current.position.copy(camera.position);
      groupRef.current.position.addScaledVector(v, 50);
      groupRef.current.up.copy(camera.up);
      groupRef.current.rotation.copy(camera.rotation);
    }
  });

  const model = useGLTF(shipUrl);
  const crossMaterial = new MeshBasicMaterial({ color: 'hotpink', fog: false });
  const thickness = 0.1;
  const drawTarget = false;

  return (
    <group
      ref={groupRef}
      scale={scale}
      onPointerOver={(e) => {}}
      onPointerOut={(e) => {}}
      onPointerDown={(e) => {
        if (e.button === 2) return;
      }}
    >
      {drawTarget && (
        <group position={[0, 0, -50]} name="cross" rotation={[HALF_PI * 0.25, 0, 0]}>
          <mesh renderOrder={1000} material={crossMaterial}>
            <boxGeometry args={[6, thickness, thickness]} />
          </mesh>
          <mesh renderOrder={1000} material={crossMaterial}>
            <boxGeometry args={[thickness, 6, thickness]} />
          </mesh>
        </group>
      )}
      {drawTarget && (
        <group position={[0, 0, -50]} name="target" rotation={[HALF_PI * 0.25, 0, 0]}>
          <mesh position={[0, 6, 0]} renderOrder={1000} material={crossMaterial}>
            <boxGeometry args={[12, thickness, thickness]} />
          </mesh>
          <mesh position={[0, -6, 0]} renderOrder={1000} material={crossMaterial}>
            <boxGeometry args={[12, thickness, thickness]} />
          </mesh>
          <mesh position={[6, 0, 0]} renderOrder={1000} material={crossMaterial}>
            <boxGeometry args={[thickness, 12, thickness]} />
          </mesh>
          <mesh position={[-6, 0, 0]} renderOrder={1000} material={crossMaterial}>
            <boxGeometry args={[thickness, 12, thickness]} />
          </mesh>
        </group>
      )}
      <group
        rotation={[HALF_PI * 1.25, Math.PI, 0]}
        onContextMenu={(e) => {
          e.stopPropagation();
          usePrimitiveStore.getState().set((state) => {
            state.contextMenuObjectType = ObjectType.Spaceship;
          });
        }}
      >
        <mesh name="Renault_(S,_T1)_0" geometry={model.nodes['Renault_(S,_T1)_0'].geometry}>
          <meshStandardMaterial color="#a7a7a7" />
        </mesh>
        <mesh name="Renault_(S,_T1)_1" geometry={model.nodes['Renault_(S,_T1)_1'].geometry}>
          <meshStandardMaterial color="silver" />
        </mesh>
        <mesh name="Renault_(S,_T1)_2" geometry={model.nodes['Renault_(S,_T1)_2'].geometry}>
          <meshStandardMaterial color="#a7a7a7" />
        </mesh>
        <mesh name="Renault_(S,_T1)_3" geometry={model.nodes['Renault_(S,_T1)_3'].geometry}>
          <meshStandardMaterial color="lightblue" />
        </mesh>
        {/* nozzle */}
        <mesh name="Renault_(S,_T1)_4" geometry={model.nodes['Renault_(S,_T1)_4'].geometry}>
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh name="Renault_(S,_T1)_5" geometry={model.nodes['Renault_(S,_T1)_5'].geometry}>
          <meshStandardMaterial color="teal" />
        </mesh>
      </group>
    </group>
  );
});

export default Spaceship;
