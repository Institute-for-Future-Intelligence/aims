/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useRef } from 'react';
import { DirectionalLight } from 'three';
import { DEFAULT_SHADOW_CAMERA_FAR, DEFAULT_SHADOW_MAP_SIZE } from './programmaticConstants';

const Lights = () => {
  const directLightIntensity = 5;
  const ambientLightIntensity = 1;
  const shadowCameraFar = DEFAULT_SHADOW_CAMERA_FAR;
  const shadowMapSize = DEFAULT_SHADOW_MAP_SIZE;
  const cameraExtent = 10;

  const ref = useRef<DirectionalLight>(null);

  if (ref.current) {
    ref.current.shadow.camera.left = -cameraExtent;
    ref.current.shadow.camera.bottom = -cameraExtent;
    ref.current.shadow.camera.right = cameraExtent;
    ref.current.shadow.camera.top = cameraExtent;
    ref.current.shadow.camera.updateProjectionMatrix();
  }

  return (
    <>
      <ambientLight intensity={ambientLightIntensity} name={'Ambient Light'} />
      <directionalLight
        ref={ref}
        name={'Directional Light'}
        color="white"
        position={[1, 1, 1]}
        intensity={directLightIntensity}
        castShadow={true}
        shadow-bias={0} // may be used to reduce shadow artifacts
        shadow-mapSize-height={shadowMapSize}
        shadow-mapSize-width={shadowMapSize}
        shadow-camera-near={1}
        shadow-camera-far={shadowCameraFar}
      />
    </>
  );
};

export default React.memo(Lights);
