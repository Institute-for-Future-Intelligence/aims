/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { DirectionalLight, Euler, Vector3 } from 'three';
import { useStore } from './stores/common';
import { DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_ROTATION, DEFAULT_PAN_CENTER } from './constants';
import { useEffect, useMemo, useRef } from 'react';
import { usePrimitiveStore } from './stores/commonPrimitive';
import * as Selector from './stores/selector';
import React from 'react';
import { MyTrackballControls } from './js/MyTrackballControls';
import { Object3DNode, extend } from '@react-three/fiber';
import { UndoableCameraChange } from './undo/UndoableCameraChange';
import { UndoableResetView } from './undo/UndoableResetView';

extend({ MyTrackballControls });

declare module '@react-three/fiber' {
  interface ThreeElements {
    myTrackballControls: Object3DNode<MyTrackballControls, typeof MyTrackballControls>;
  }
}

interface ControlsProps {
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
        state.cameraPosition = [r, r, r];
        state.cameraRotation = [camera.rotation.x, camera.rotation.y, camera.rotation.z];
        state.cameraUp = [0, 0, 1];
        state.panCenter = [0, 0, 0];
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
              state.cameraPosition = [...undoableResetView.oldCameraPosition];
              state.cameraRotation = [...undoableResetView.oldCameraRotation];
              state.cameraUp = [...undoableResetView.oldCameraUp];
              state.panCenter = [...undoableResetView.oldPanCenter];
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
          state.cameraPosition = [oldX, oldY, oldZ];
        });
      },
      redo: () => {
        const newX = undoableCameraChange.newCameraPosition[0];
        const newY = undoableCameraChange.newCameraPosition[1];
        const newZ = undoableCameraChange.newCameraPosition[2];
        camera.position.set(newX, newY, newZ);
        useStore.getState().set((state) => {
          state.cameraPosition = [newX, newY, newZ];
        });
      },
    } as UndoableCameraChange;
    useStore.getState().addUndoable(undoableCameraChange);
    camera.position.set(x, y, z);
    useStore.getState().set((state) => {
      state.cameraPosition = [x, y, z];
    });
  };

  const saveCameraState = () => {
    useStore.getState().set((state) => {
      if (!state.cameraPosition) state.cameraPosition = DEFAULT_CAMERA_POSITION;
      if (!state.cameraRotation) state.cameraRotation = DEFAULT_CAMERA_ROTATION;
      if (!state.panCenter) state.panCenter = DEFAULT_PAN_CENTER;
      state.cameraPosition[0] = camera.position.x;
      state.cameraPosition[1] = camera.position.y;
      state.cameraPosition[2] = camera.position.z;
      state.cameraRotation[0] = camera.rotation.x;
      state.cameraRotation[1] = camera.rotation.y;
      state.cameraRotation[2] = camera.rotation.z;
      state.cameraUp[0] = camera.up.x;
      state.cameraUp[1] = camera.up.y;
      state.cameraUp[2] = camera.up.z;
      if (controlsRef.current) {
        const t = controlsRef.current.target;
        state.panCenter[0] = t.x;
        state.panCenter[1] = t.y;
        state.panCenter[2] = t.z;
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
    saveCameraState();
  };

  useEffect(() => {
    if (isFirstRender) return;
    camera.position.fromArray(cameraPosition);
    camera.up.fromArray(cameraUp);
    camera.rotation.set(cameraRotation[0], cameraRotation[1], cameraRotation[2], Euler.DEFAULT_ORDER);
  }, [cameraPosition, cameraRotation, cameraUp]);

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
      zoomSpeed={2}
      target={target}
      autoRotate={autoRotate}
      onStart={onControlStart}
      onChange={onControlChange}
      onEnd={onControlEnd}
    />
  );
});

export const ProjectGalleryControls = React.memo(({ lightRef }: ControlsProps) => {
  const { gl, camera, get, scene } = useThree();
  const controlsRef = useRef<MyTrackballControls>(null);

  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const animatingRef = useRef(false);

  const clearTimer = () => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
  };

  const start = () => {
    animatingRef.current = true;
    render();
  };

  const end = () => {
    animatingRef.current = false;
  };

  const render = () => {
    controlsRef.current?.update();
    gl.render(scene, camera);

    if (animatingRef.current) {
      requestAnimationFrame(render);
    }
  };

  const onControlStart = () => {
    if (timerIdRef.current) {
      clearTimer();
    } else {
      start();
    }
  };

  const onControlChange = () => {
    if (lightRef.current) {
      // sets the point light to a location above the camera
      lightRef.current.position.set(0, 1, 0);
      lightRef.current.position.add(camera.position);
    }
  };

  const onControlEnd = () => {
    // for damping
    timerIdRef.current = setTimeout(() => {
      end();
      timerIdRef.current = null;
    }, 1500);
  };

  return (
    <myTrackballControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      rotateSpeed={6}
      zoomSpeed={1}
      panSpeed={0.1}
      dynamicDampingFactor={0.1}
      onStart={onControlStart}
      onChange={onControlChange}
      onEnd={onControlEnd}
    />
  );
});
