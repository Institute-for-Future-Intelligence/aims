/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

// @ts-expect-error: ignore
import shipUrl from '../assets/ship.gltf';

import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MeshBasicMaterial, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import { HALF_PI } from '../constants.ts';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';

const Spaceship = React.memo(() => {
  const spaceshipSize = useStore(Selector.spaceshipSize);
  const spaceshipRoll = useStore(Selector.spaceshipRoll) ?? 0;
  const spaceshipPitch = useStore(Selector.spaceshipPitch) ?? 0;
  const spaceshipYaw = useStore(Selector.spaceshipYaw) ?? 0;
  const spaceshipZ = useStore(Selector.spaceshipZ) ?? 0;
  const showThrustFlame = usePrimitiveStore(Selector.showThrustFlame);

  const { camera, gl } = useThree();

  const [selected, setSelected] = useState<boolean>(false);
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const v = new Vector3();
      camera.getWorldDirection(v);
      groupRef.current.position.copy(camera.position);
      groupRef.current.position.addScaledVector(v, 50 + spaceshipZ);
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
      scale={spaceshipSize * 1.5}
      onPointerOver={(e) => {}}
      onPointerOut={(e) => {}}
      onPointerDown={(e) => {
        if (e.button === 2) return;
        setSelected(!selected);
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
        rotation={[HALF_PI * 1.2 + spaceshipPitch, Math.PI + spaceshipRoll, spaceshipYaw]}
        onPointerOver={() => {
          gl.domElement.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          gl.domElement.style.cursor = 'default';
        }}
      >
        <mesh name="Renault_(S,_T1)_0" geometry={model.nodes['Renault_(S,_T1)_0'].geometry}>
          <meshStandardMaterial color="#a7a7a7" depthTest={false} transparent={true} opacity={selected ? 0.75 : 1} />
        </mesh>
        <mesh name="Renault_(S,_T1)_1" geometry={model.nodes['Renault_(S,_T1)_1'].geometry}>
          <meshStandardMaterial color={'silver'} depthTest={false} transparent={true} opacity={selected ? 0.75 : 1} />
        </mesh>
        <mesh name="Renault_(S,_T1)_2" geometry={model.nodes['Renault_(S,_T1)_2'].geometry}>
          <meshStandardMaterial color="#a7a7a7" depthTest={false} transparent={true} opacity={selected ? 0.75 : 1} />
        </mesh>
        <mesh name="Renault_(S,_T1)_3" geometry={model.nodes['Renault_(S,_T1)_3'].geometry}>
          <meshStandardMaterial color="lightblue" depthTest={false} transparent={true} opacity={selected ? 0.75 : 1} />
        </mesh>
        {/* nozzle */}
        <mesh name="Renault_(S,_T1)_4" geometry={model.nodes['Renault_(S,_T1)_4'].geometry}>
          <meshStandardMaterial
            color={showThrustFlame ? 'yellow' : 'black'}
            depthTest={false}
            transparent={true}
            opacity={selected ? 0.75 : 1}
          />
        </mesh>
        <mesh name="Renault_(S,_T1)_5" geometry={model.nodes['Renault_(S,_T1)_5'].geometry}>
          <meshStandardMaterial color={'teal'} depthTest={false} transparent={true} opacity={selected ? 0.75 : 1} />
        </mesh>
      </group>
    </group>
  );
});

export default Spaceship;
