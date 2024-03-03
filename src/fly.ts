/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import {
  FlightControl,
  SpaceshipDisplayMode,
  UNIT_VECTOR_NEG_X,
  UNIT_VECTOR_NEG_Y,
  UNIT_VECTOR_NEG_Z,
  UNIT_VECTOR_POS_X,
  UNIT_VECTOR_POS_Y,
  UNIT_VECTOR_POS_Z,
} from './constants.ts';
import { Euler, Quaternion, Vector3 } from 'three';
import { useStore } from './stores/common.ts';
import { computeAcceleration } from './models/physics.ts';
import { useRefStore } from './stores/commonRef.ts';
import { invalidate } from '@react-three/fiber';

const timeStep = 1;
const timeStepSqHalf = timeStep * timeStep * 0.5;
const friction = 2;

let flyTimeout = -1;

export const startFlying = (control: FlightControl) => {
  if (flyTimeout === -1) {
    loop(control);
  }
};

export const stopFlying = () => {
  clearTimeout(flyTimeout);
  flyTimeout = -1;
};

const saveEuler = (rotation: number[], euler: Euler) => {
  rotation[0] = euler.x;
  rotation[1] = euler.y;
  rotation[2] = euler.z;
};

const loop = (control: FlightControl) => {
  const rotationStep = useStore.getState().projectState.rotationStep;
  const translationStep = useStore.getState().projectState.translationStep;
  if (useStore.getState().projectState.spaceshipDisplayMode === SpaceshipDisplayMode.OUTSIDE_VIEW) {
    useStore.getState().set((state) => {
      if (state.projectState.spaceshipRoll === undefined) state.projectState.spaceshipRoll = 0;
      if (state.projectState.spaceshipPitch === undefined) state.projectState.spaceshipPitch = 0;
      if (state.projectState.spaceshipYaw === undefined) state.projectState.spaceshipYaw = 0;
      if (state.projectState.spaceshipZ === undefined) state.projectState.spaceshipZ = 0;
      switch (control) {
        case FlightControl.RollLeft:
          state.projectState.spaceshipRoll += rotationStep;
          break;
        case FlightControl.RollRight:
          state.projectState.spaceshipRoll -= rotationStep;
          break;
        case FlightControl.PitchUp:
          state.projectState.spaceshipPitch += rotationStep;
          break;
        case FlightControl.PitchDown:
          state.projectState.spaceshipPitch -= rotationStep;
          break;
        case FlightControl.YawLeft:
          state.projectState.spaceshipYaw += rotationStep;
          break;
        case FlightControl.YawRight:
          state.projectState.spaceshipYaw -= rotationStep;
          break;
        case FlightControl.MoveForward:
          state.projectState.spaceshipZ -= translationStep;
          break;
        case FlightControl.MoveBackward:
          state.projectState.spaceshipZ += translationStep;
          break;
      }
    });
  } else {
    useStore.getState().set((state) => {
      if (state.proteinData && state.ligandData) {
        // make sure that these are initialized
        if (!state.projectState.ligandTranslation) state.projectState.ligandTranslation = [0, 0, 0];
        if (!state.projectState.ligandVelocity) state.projectState.ligandVelocity = [0, 0, 0];
        if (!state.projectState.ligandRotation) state.projectState.ligandRotation = [0, 0, 0];

        // translation
        const steer = new Vector3();
        const pos = state.projectState.ligandTranslation;
        const vel = state.projectState.ligandVelocity;
        switch (control) {
          case FlightControl.TranslateInPositiveX:
            steer.x = translationStep;
            break;
          case FlightControl.TranslateInNegativeX:
            steer.x = -translationStep;
            break;
          case FlightControl.TranslateInPositiveY:
            steer.y = translationStep;
            break;
          case FlightControl.TranslateInNegativeY:
            steer.y = -translationStep;
            break;
          case FlightControl.TranslateInPositiveZ:
            steer.z = translationStep;
            break;
          case FlightControl.TranslateInNegativeZ:
            steer.z = -translationStep;
            break;
        }
        const a = computeAcceleration(
          state.proteinData.atoms,
          state.ligandData,
          state.chemicalElements,
          pos,
          vel,
          steer,
          friction,
        );
        a.multiplyScalar(1);
        console.log(a);
        // update velocity
        // vel[0] += a.x * timeStep;
        // vel[1] += a.y * timeStep;
        // vel[2] += a.z * timeStep;
        // update position
        // const dx = vel[0] * timeStep + a.x * timeStepSqHalf;
        // const dy = vel[1] * timeStep + a.y * timeStepSqHalf;
        // const dz = vel[2] * timeStep + a.z * timeStepSqHalf;
        const dx = a.x * timeStep;
        const dy = a.y * timeStep;
        const dz = a.z * timeStep;
        pos[0] += dx;
        pos[1] += dy;
        pos[2] += dz;
        const ref = useRefStore.getState().ligandRef;
        if (ref && ref.current) {
          ref.current.position.x += dx;
          ref.current.position.y += dy;
          ref.current.position.z += dz;
          invalidate();
        }

        // rotation
        switch (control) {
          case FlightControl.RotateAroundXClockwise: {
            const ref = useRefStore.getState().ligandRef;
            if (ref && ref.current) {
              ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_POS_X, rotationStep));
              invalidate();
              saveEuler(state.projectState.ligandRotation, ref.current.rotation);
            }
            break;
          }
          case FlightControl.RotateAroundXCounterclockwise: {
            state.projectState.ligandRotation[0] -= rotationStep;
            const ref = useRefStore.getState().ligandRef;
            if (ref && ref.current) {
              ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_NEG_X, rotationStep));
              invalidate();
              saveEuler(state.projectState.ligandRotation, ref.current.rotation);
            }
            break;
          }
          case FlightControl.RotateAroundYClockwise: {
            state.projectState.ligandRotation[1] += rotationStep;
            const ref = useRefStore.getState().ligandRef;
            if (ref && ref.current) {
              ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_POS_Y, rotationStep));
              invalidate();
              saveEuler(state.projectState.ligandRotation, ref.current.rotation);
            }
            break;
          }
          case FlightControl.RotateAroundYCounterclockwise: {
            state.projectState.ligandRotation[1] -= rotationStep;
            const ref = useRefStore.getState().ligandRef;
            if (ref && ref.current) {
              ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_NEG_Y, rotationStep));
              invalidate();
              saveEuler(state.projectState.ligandRotation, ref.current.rotation);
            }
            break;
          }
          case FlightControl.RotateAroundZClockwise: {
            state.projectState.ligandRotation[2] += rotationStep;
            const ref = useRefStore.getState().ligandRef;
            if (ref && ref.current) {
              ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_POS_Z, rotationStep));
              invalidate();
              saveEuler(state.projectState.ligandRotation, ref.current.rotation);
            }
            break;
          }
          case FlightControl.RotateAroundZCounterclockwise: {
            state.projectState.ligandRotation[2] -= rotationStep;
            const ref = useRefStore.getState().ligandRef;
            if (ref && ref.current) {
              ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_NEG_Z, rotationStep));
              invalidate();
              saveEuler(state.projectState.ligandRotation, ref.current.rotation);
            }
            break;
          }
        }
      }
    });
  }
  flyTimeout = window.setTimeout(loop, 100, control);
};
