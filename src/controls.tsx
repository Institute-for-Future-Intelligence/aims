/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import { invalidate, useFrame, useThree } from '@react-three/fiber';
import { DirectionalLight, Euler, Vector3 } from 'three';
import { useStore } from './stores/common';
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_ROTATION,
  DEFAULT_CAMERA_UP,
  DEFAULT_FOV,
  DEFAULT_PAN_CENTER,
} from './constants';
import { useEffect, useMemo, useRef } from 'react';
import { usePrimitiveStore } from './stores/commonPrimitive';
import * as Selector from './stores/selector';
import React from 'react';
import { MyTrackballControls } from './js/MyTrackballControls';
import { Object3DNode, extend } from '@react-three/fiber';
import { UndoableCameraChange } from './undo/UndoableCameraChange';
import { UndoableResetView } from './undo/UndoableResetView';
import { PerspectiveCamera, TrackballControls } from '@react-three/drei';
import capabilities from './lib/gfx/capabilities';
import { useRefStore } from './stores/commonRef.ts';
import { useMultipleKeys } from './hooks.ts';

extend({ MyTrackballControls });

declare module '@react-three/fiber' {
  interface ThreeElements {
    myTrackballControls: Object3DNode<MyTrackballControls, typeof MyTrackballControls>;
  }
}

interface ControlsProps {
  disabled?: boolean;
  lightRef: React.RefObject<DirectionalLight>;
}

const useFirstRender = () => {
  const isFirstRenderRef = useRef(true);
  useEffect(() => {
    isFirstRenderRef.current = false;
  }, []);
  return isFirstRenderRef.current;
};

export const ReactionChamberControls = React.memo(({ lightRef }: ControlsProps) => {
  const enableRotate = usePrimitiveStore(Selector.enableRotate);
  const autoRotate = usePrimitiveStore(Selector.autoRotate);
  const resetViewFlag = usePrimitiveStore(Selector.resetViewFlag);
  const zoomViewFlag = usePrimitiveStore(Selector.zoomViewFlag);

  const cameraPosition = useStore(Selector.cameraPosition);
  const cameraRotation = useStore(Selector.cameraRotation);
  const cameraUp = useStore(Selector.cameraUp);
  const panCenter = useStore(Selector.panCenter);
  const navigationView = useStore(Selector.navigationView);
  const navPosition = useStore(Selector.navPosition);
  const navRotation = useStore(Selector.navRotation);
  const navUp = useStore(Selector.navUp);
  const navTarget = useStore(Selector.navTarget);
  const thrust = useStore(Selector.spaceshipThrust);

  const { gl, camera, set, get } = useThree();

  const controlsRef = useRef<MyTrackballControls>(null);
  const isFirstRender = useFirstRender();
  const controlEndCalledRef = useRef<boolean>(false);

  const _cameraPosition = useMemo(() => {
    if (navigationView) return navPosition ?? cameraPosition;
    else return cameraPosition;
  }, [cameraPosition, navPosition, navigationView]);

  const _cameraRotation = useMemo(() => {
    if (navigationView) return navRotation ?? cameraPosition;
    else return cameraRotation;
  }, [cameraRotation, navRotation, navigationView]);

  const _cameraUp = useMemo(() => {
    if (navigationView) return navUp ?? cameraUp;
    else return cameraUp;
  }, [cameraUp, navUp, navigationView]);

  const _target = useMemo(() => {
    if (navigationView) return new Vector3().fromArray(navTarget ?? panCenter);
    else return new Vector3().fromArray(panCenter);
  }, [panCenter, navTarget, navigationView]);

  const updateLight = () => {
    if (lightRef.current) {
      // sets the point light to a location above the camera
      lightRef.current.position.set(0, 1, 0);
      lightRef.current.position.add(camera.position);
    }
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.moveSpeed = 5 * thrust;
      controlsRef.current.turnSpeed = thrust;
    }
    useRefStore.setState({
      controlsRef: controlsRef,
    });
  }, [controlsRef]);

  // init/update camera due to common store change(which comes from local/cloud data)
  useEffect(() => {
    if (controlEndCalledRef.current) {
      controlEndCalledRef.current = false;
      return;
    }
    camera.position.fromArray(_cameraPosition);
    camera.rotation.set(_cameraRotation[0], _cameraRotation[1], _cameraRotation[2], Euler.DEFAULT_ORDER);
    camera.up.fromArray(_cameraUp);
    if (controlsRef.current) {
      controlsRef.current.target.copy(_target);
      camera.lookAt(_target);
    }
    updateLight();
  }, [_cameraPosition, _cameraRotation, _cameraUp, _target]);

  const setFrameLoop = (mode: 'demand' | 'always') => {
    set({ frameloop: mode });
  };

  const setDefaultViewPosition = () => {
    if (controlsRef.current) {
      const r = 2 * usePrimitiveStore.getState().boundingSphereRadius;
      camera.position.set(r, r, r);
      camera.up.set(0, 0, 1);
      controlsRef.current.target.fromArray([0, 0, 0]);
      camera.lookAt(controlsRef.current.target);
      useStore.getState().set((state) => {
        state.projectState.cameraPosition = [r, r, r];
        state.projectState.cameraRotation = [camera.rotation.x, camera.rotation.y, camera.rotation.z];
        state.projectState.cameraUp = [0, 0, 1];
        state.projectState.panCenter = [0, 0, 0];
        state.projectState.navPosition = [r, r, r];
        state.projectState.navRotation = [camera.rotation.x, camera.rotation.y, camera.rotation.z];
        state.projectState.navUp = [0, 0, 1];
        state.projectState.navTarget = [0, 0, 0];
      });
      updateLight();
    }
  };

  const resetView = () => {
    if (!controlsRef.current) return;
    const cameraPosition = camera.position.toArray();
    const panCenter = controlsRef.current.target.toArray();
    if (
      cameraPosition[0] !== cameraPosition[1] ||
      cameraPosition[1] !== cameraPosition[2] ||
      cameraPosition[0] !== cameraPosition[2] ||
      cameraRotation[0] !== 0 ||
      cameraRotation[1] !== 0 ||
      cameraRotation[2] !== 0 ||
      cameraUp[0] !== 0 ||
      cameraUp[1] !== 0 ||
      cameraUp[2] !== 1 ||
      panCenter[0] !== 0 ||
      panCenter[1] !== 0 ||
      panCenter[2] !== 0
    ) {
      const undoableResetView = {
        name: 'Reset View',
        timestamp: Date.now(),
        oldCameraPosition: [...cameraPosition],
        oldCameraRotation: [...cameraRotation],
        oldCameraUp: [...cameraUp],
        oldPanCenter: [...panCenter],
        undo: () => {
          if (controlsRef.current) {
            camera.position.fromArray(undoableResetView.oldCameraPosition);
            camera.rotation.fromArray([
              undoableResetView.oldCameraRotation[0],
              undoableResetView.oldCameraRotation[1],
              undoableResetView.oldCameraRotation[2],
              Euler.DEFAULT_ORDER,
            ]);
            camera.up.fromArray(undoableResetView.oldCameraUp);
            controlsRef.current.target.fromArray(undoableResetView.oldPanCenter);
            useStore.getState().set((state) => {
              state.projectState.cameraPosition = [...undoableResetView.oldCameraPosition];
              state.projectState.cameraRotation = [...undoableResetView.oldCameraRotation];
              state.projectState.cameraUp = [...undoableResetView.oldCameraUp];
              state.projectState.panCenter = [...undoableResetView.oldPanCenter];
            });
          }
        },
        redo: () => {
          setDefaultViewPosition();
        },
      } as UndoableResetView;
      useStore.getState().addUndoable(undoableResetView);
      setDefaultViewPosition();
    }
  };

  const zoomView = () => {
    const scale = usePrimitiveStore.getState().zoomScale;
    const p = camera.position;
    const x = p.x * scale;
    const y = p.y * scale;
    const z = p.z * scale;
    const undoableCameraChange = {
      name: 'Zoom',
      timestamp: Date.now(),
      oldCameraPosition: [p.x, p.y, p.z],
      newCameraPosition: [x, y, z],
      undo: () => {
        const oldX = undoableCameraChange.oldCameraPosition[0];
        const oldY = undoableCameraChange.oldCameraPosition[1];
        const oldZ = undoableCameraChange.oldCameraPosition[2];
        camera.position.set(oldX, oldY, oldZ);
        useStore.getState().set((state) => {
          state.projectState.cameraPosition = [oldX, oldY, oldZ];
        });
      },
      redo: () => {
        const newX = undoableCameraChange.newCameraPosition[0];
        const newY = undoableCameraChange.newCameraPosition[1];
        const newZ = undoableCameraChange.newCameraPosition[2];
        camera.position.set(newX, newY, newZ);
        useStore.getState().set((state) => {
          state.projectState.cameraPosition = [newX, newY, newZ];
        });
      },
    } as UndoableCameraChange;
    useStore.getState().addUndoable(undoableCameraChange);
    camera.position.set(x, y, z);
    useStore.getState().set((state) => {
      state.projectState.cameraPosition = [x, y, z];
    });
  };

  const saveCameraState = () => {
    useStore.getState().set((state) => {
      if (!state.projectState.cameraPosition) state.projectState.cameraPosition = DEFAULT_CAMERA_POSITION;
      if (!state.projectState.cameraRotation) state.projectState.cameraRotation = DEFAULT_CAMERA_ROTATION;
      if (!state.projectState.cameraUp) state.projectState.cameraUp = DEFAULT_CAMERA_UP;
      if (!state.projectState.panCenter) state.projectState.panCenter = DEFAULT_PAN_CENTER;
      state.projectState.cameraPosition[0] = camera.position.x;
      state.projectState.cameraPosition[1] = camera.position.y;
      state.projectState.cameraPosition[2] = camera.position.z;
      state.projectState.cameraRotation[0] = camera.rotation.x;
      state.projectState.cameraRotation[1] = camera.rotation.y;
      state.projectState.cameraRotation[2] = camera.rotation.z;
      state.projectState.cameraUp[0] = camera.up.x;
      state.projectState.cameraUp[1] = camera.up.y;
      state.projectState.cameraUp[2] = camera.up.z;
      if (controlsRef.current) {
        const t = controlsRef.current.target;
        state.projectState.panCenter[0] = t.x;
        state.projectState.panCenter[1] = t.y;
        state.projectState.panCenter[2] = t.z;
      }
    });
  };

  const saveNavState = () => {
    useStore.getState().set((state) => {
      state.projectState.navPosition = camera.position.toArray();
      state.projectState.navRotation = [camera.rotation.x, camera.rotation.y, camera.rotation.z];
      state.projectState.navUp = camera.up.toArray();
      if (controlsRef.current) {
        const t = controlsRef.current.target;
        state.projectState.navTarget = t.toArray();
      }
    });
  };

  const onNavChange = () => {
    updateLight();
  };

  const onNavEnd = () => {
    const positionSame =
      navPosition &&
      navPosition[0] === camera.position.x &&
      navPosition[1] === camera.position.y &&
      navPosition[2] === camera.position.z;
    const rotationSame =
      navRotation &&
      navRotation[0] === camera.rotation.x &&
      navRotation[1] === camera.rotation.y &&
      navRotation[2] === camera.rotation.z;
    if (!positionSame || !rotationSame) {
      saveNavState();
    }
  };

  const onControlStart = () => {
    if (navigationView) return;
    setFrameLoop('always');
  };

  const onControlChange = () => {
    updateLight();
    invalidate();
  };

  const onControlEnd = () => {
    if (usePrimitiveStore.getState().autoRotate || navigationView) return;
    setFrameLoop('demand');
    const cameraPositionSame =
      cameraPosition &&
      cameraPosition[0] === camera.position.x &&
      cameraPosition[1] === camera.position.y &&
      cameraPosition[2] === camera.position.z;
    const cameraRotationSame =
      cameraRotation &&
      cameraRotation[0] === camera.rotation.x &&
      cameraRotation[1] === camera.rotation.y &&
      cameraRotation[2] === camera.rotation.z;
    if (!cameraPositionSame || !cameraRotationSame) {
      saveCameraState();
      controlEndCalledRef.current = true;
    }
  };

  useEffect(() => {
    capabilities.init(gl);
  }, []);

  useEffect(() => {
    if (isFirstRender) return;
    resetView();
  }, [resetViewFlag]);

  useEffect(() => {
    if (isFirstRender || !controlsRef.current) return;
    if (navigationView) {
      controlsRef.current.noZoom = true;
    } else {
      zoomView();
      controlsRef.current.noZoom = false;
    }
  }, [zoomViewFlag, navigationView]);

  useEffect(() => {
    if (isFirstRender || !controlsRef.current) return;
    controlsRef.current.noPan = navigationView;
  }, [zoomViewFlag, navigationView]);

  useEffect(() => {
    if (navigationView) return;
    if (autoRotate) {
      setFrameLoop('always');
    } else {
      setFrameLoop('demand');
      if (!isFirstRender) {
        saveCameraState();
      }
    }
  }, [autoRotate, navigationView]);

  const onKeyDown = () => {
    if (!useStore.getState().projectState.navigationView) return;
    setFrameLoop('always');
  };

  const onKeyUp = () => {
    if (!useStore.getState().projectState.navigationView) return;
    if (pressedKeys.length === 0) {
      setFrameLoop('demand');
      onNavEnd();
    }
  };

  const pressedKeys = useMultipleKeys(onKeyDown, onKeyUp);

  useFrame(() => {
    if (!navigationView) {
      controlsRef.current?.update();
    } else {
      const controls = controlsRef.current;
      if (!controls) return;
      for (const key of pressedKeys) {
        switch (key) {
          case controls.keys.MOVE_FORWARD:
            controls.moveForward(controls.moveSpeed);
            break;
          case controls.keys.MOVE_BACKWARD:
            controls.moveForward(-controls.moveSpeed);
            break;
          case controls.keys.MOVE_RIGHT:
            controls.moveRight(controls.moveSpeed);
            break;
          case controls.keys.MOVE_LEFT:
            controls.moveRight(-controls.moveSpeed);
            break;
          case controls.keys.MOVE_UP:
            controls.moveUp(controls.moveSpeed);
            break;
          case controls.keys.MOVE_DOWN:
            controls.moveUp(-controls.moveSpeed);
            break;
          case controls.keys.ROLL_LEFT:
            controls.rollRight(controls.turnSpeed);
            break;
          case controls.keys.ROLL_RIGHT:
            controls.rollRight(-controls.turnSpeed);
            break;
          case controls.keys.ROTATE_UP:
            controls.spinUp(controls.turnSpeed);
            break;
          case controls.keys.ROTATE_DOWN:
            controls.spinUp(-controls.turnSpeed);
            break;
          case controls.keys.ROTATE_LEFT:
            controls.spinRight(-controls.turnSpeed);
            break;
          case controls.keys.ROTATE_RIGHT:
            controls.spinRight(controls.turnSpeed);
            break;
        }
      }
      onNavChange();
    }
  });

  return (
    <myTrackballControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      staticMoving={true}
      enabled={enableRotate || navigationView}
      rotateSpeed={10}
      zoomSpeed={3}
      target={_target}
      autoRotate={autoRotate}
      onStart={onControlStart}
      onChange={onControlChange}
      onEnd={onControlEnd}
      onNavEnd={onNavEnd}
    />
  );
});

export const ProjectGalleryControls = ({ disabled, lightRef }: ControlsProps) => {
  const onControlChange = () => {
    if (lightRef.current) {
      // sets the point light to a location above the camera
      lightRef.current.position.set(0, 1, 0);
      lightRef.current.position.add(cameraRef.current.position);
    }
  };

  const cameraRef = useRef<any>(null);
  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[1, 1, 1]} fov={DEFAULT_FOV} />
      <TrackballControls
        enabled={!disabled}
        rotateSpeed={6}
        zoomSpeed={1}
        panSpeed={0.1}
        dynamicDampingFactor={0.1}
        onChange={onControlChange}
      />
    </>
  );
};
