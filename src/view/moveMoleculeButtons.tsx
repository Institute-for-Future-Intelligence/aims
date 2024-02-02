/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import RotateZCW from '../assets/rotate-around-z-cw.png';
import RotateZCCW from '../assets/rotate-around-z-ccw.png';
import RotateYCW from '../assets/rotate-around-y-cw.png';
import RotateYCCW from '../assets/rotate-around-y-ccw.png';
import RotateXCW from '../assets/rotate-around-x-cw.png';
import RotateXCCW from '../assets/rotate-around-x-ccw.png';

import React, { useMemo, useState } from 'react';
import { FloatButton } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { FlightControl } from '../constants.ts';
import { useRefStore } from '../stores/commonRef.ts';
import { invalidate } from '@react-three/fiber';

const MoveMoleculeButtons = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const addUndoable = useStore(Selector.addUndoable);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const rotationStep = useStore(Selector.rotationStep) ?? 0.1;
  const translationStep = useStore(Selector.translationStep) ?? 1.0;

  const [selector, setSelector] = useState<string | undefined>();

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  let moveTimeout = -1;

  const start = (control: FlightControl) => {
    if (moveTimeout === -1) {
      loop(control);
    }
  };

  const stop = () => {
    clearTimeout(moveTimeout);
    moveTimeout = -1;
  };

  const loop = (control: FlightControl) => {
    setCommonStore((state) => {
      if (state.projectState.drugMoleculeEuler === undefined) state.projectState.drugMoleculeEuler = [0, 0, 0];
      if (state.projectState.drugMoleculePosition === undefined) state.projectState.drugMoleculePosition = [0, 0, 0];
      switch (control) {
        case FlightControl.PitchUp: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.rotation.x += rotationStep;
            invalidate();
          }
          state.projectState.drugMoleculeEuler[0] += rotationStep;
          break;
        }
        case FlightControl.PitchDown: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.rotation.x -= rotationStep;
            invalidate();
          }
          state.projectState.drugMoleculeEuler[0] -= rotationStep;
          break;
        }
        case FlightControl.RollLeft: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.rotation.y += rotationStep;
            invalidate();
          }
          state.projectState.drugMoleculeEuler[1] += rotationStep;
          break;
        }
        case FlightControl.RollRight: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.rotation.y -= rotationStep;
            invalidate();
          }
          state.projectState.drugMoleculeEuler[1] -= rotationStep;
          break;
        }
        case FlightControl.YawLeft: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.rotation.z += rotationStep;
            invalidate();
          }
          state.projectState.drugMoleculeEuler[2] += rotationStep;
          break;
        }
        case FlightControl.YawRight: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.rotation.z -= rotationStep;
            invalidate();
          }
          state.projectState.drugMoleculeEuler[2] -= rotationStep;
          break;
        }
        case FlightControl.MoveInPositiveX: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.x += translationStep;
            invalidate();
          }
          state.projectState.drugMoleculePosition[0] += translationStep;
          break;
        }
        case FlightControl.MoveInNegativeX: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.x -= translationStep;
            invalidate();
          }
          state.projectState.drugMoleculePosition[0] -= translationStep;
          break;
        }
        case FlightControl.MoveInPositiveY: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.y += translationStep;
            invalidate();
          }
          state.projectState.drugMoleculePosition[1] += translationStep;
          break;
        }
        case FlightControl.MoveInNegativeY: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.y -= translationStep;
            invalidate();
          }
          state.projectState.drugMoleculePosition[1] -= translationStep;
          break;
        }
        case FlightControl.MoveInPositiveZ: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.z += translationStep;
            invalidate();
          }
          state.projectState.drugMoleculePosition[2] += translationStep;
          break;
        }
        case FlightControl.MoveInNegativeZ: {
          const ref = useRefStore.getState().loadedMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.z -= translationStep;
            invalidate();
          }
          state.projectState.drugMoleculePosition[2] -= translationStep;
          break;
        }
      }
    });
    moveTimeout = window.setTimeout(loop, 100, control);
  };

  return (
    <FloatButton.Group
      shape="square"
      style={{
        position: 'absolute',
        bottom: '8px',
        left: '6px',
        userSelect: 'none',
      }}
    >
      <FloatButton
        icon={<img width="20px" alt={'rotate z cw'} src={RotateZCW} />}
        onMouseDown={() => start(FlightControl.YawLeft)}
        onMouseUp={() => stop()}
      />
      <FloatButton
        icon={<img width="20px" alt={'rotate z ccw'} src={RotateZCCW} />}
        onMouseDown={() => start(FlightControl.YawRight)}
        onMouseUp={() => stop()}
      />
      <FloatButton
        icon={<img width="20px" alt={'rotate y cw'} src={RotateYCW} />}
        onMouseDown={() => start(FlightControl.PitchDown)}
        onMouseUp={() => stop()}
      />
      <FloatButton
        icon={<img width="20px" alt={'rotate y ccw'} src={RotateYCCW} />}
        onMouseDown={() => start(FlightControl.PitchUp)}
        onMouseUp={() => stop()}
      />
      <FloatButton
        icon={<img width="20px" alt={'rotate x cw'} src={RotateXCW} />}
        onMouseDown={() => start(FlightControl.RollRight)}
        onMouseUp={() => stop()}
      />
      <FloatButton
        icon={<img width="20px" alt={'rotate x ccw'} src={RotateXCCW} />}
        onMouseDown={() => start(FlightControl.RollLeft)}
        onMouseUp={() => stop()}
      />
    </FloatButton.Group>
  );
});

export default MoveMoleculeButtons;
