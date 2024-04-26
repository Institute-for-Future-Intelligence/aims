/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { DirectionalLight, Euler, Vector3, WebGLCapabilities } from 'three';
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
  const panCenter = useStore(Selector.panCenter);
  const enableRotate = usePrimitiveStore(Selector.enableRotate);
  const autoRotate = usePrimitiveStore(Selector.autoRotate);
  const resetViewFlag = usePrimitiveStore(Selector.resetViewFlag);
  const zoomViewFlag = usePrimitiveStore(Selector.zoomViewFlag);
  const cameraPosition = useStore(Selector.cameraPosition);
  const cameraRotation = useStore(Selector.cameraRotation);
  const cameraUp = useStore(Selector.cameraUp);

  const { gl, camera, set } = useThree();

  const controlsRef = useRef<MyTrackballControls>(null);
  const isFirstRender = useFirstRender();
  const controlEndCalledRef = useRef<boolean>(false);

  const target = useMemo(() => new Vector3().fromArray(panCenter), [panCenter]);

  const setFrameLoop = (mode: 'demand' | 'always') => {
    set({ frameloop: mode });
  };

  const setDefaultViewPosition = () => {
    if (controlsRef.current) {
      const r = 2 * usePrimitiveStore.getState().boundingSphereRadius;
      camera.position.set(r, r, r);
      camera.rotation.set(0, 0, 0, Euler.DEFAULT_ORDER);
      camera.up.set(0, 0, 1);
      controlsRef.current.target.fromArray([0, 0, 0]);
      useStore.getState().set((state) => {
        state.projectState.cameraPosition = [r, r, r];
        state.projectState.cameraRotation = [camera.rotation.x, camera.rotation.y, camera.rotation.z];
        state.projectState.cameraUp = [0, 0, 1];
        state.projectState.panCenter = [0, 0, 0];
      });
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

  const onControlStart = () => {
    setFrameLoop('always');
  };

  const onControlChange = () => {
    if (lightRef.current) {
      // sets the point light to a location above the camera
      lightRef.current.position.set(0, 1, 0);
      lightRef.current.position.add(camera.position);
    }
  };

  const onControlEnd = () => {
    if (usePrimitiveStore.getState().autoRotate) return;
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
    if (controlEndCalledRef.current) {
      controlEndCalledRef.current = false;
      return;
    }
    camera.position.fromArray(cameraPosition);
  }, [cameraPosition]);

  useEffect(() => {
    if (isFirstRender) return;
    camera.up.fromArray(cameraUp);
  }, [cameraUp]);

  useEffect(() => {
    if (isFirstRender) return;
    camera.rotation.set(cameraRotation[0], cameraRotation[1], cameraRotation[2], Euler.DEFAULT_ORDER);
  }, [cameraRotation]);

  useEffect(() => {
    if (isFirstRender) return;
    resetView();
  }, [resetViewFlag]);

  useEffect(() => {
    if (isFirstRender) return;
    zoomView();
  }, [zoomViewFlag]);

  useEffect(() => {
    if (autoRotate) {
      setFrameLoop('always');
    } else {
      setFrameLoop('demand');
      saveCameraState();
    }
  }, [autoRotate]);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return (
    <myTrackballControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      staticMoving={true}
      enabled={enableRotate}
      rotateSpeed={10}
      zoomSpeed={3}
      target={target}
      autoRotate={autoRotate}
      onStart={onControlStart}
      onChange={onControlChange}
      onEnd={onControlEnd}
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
