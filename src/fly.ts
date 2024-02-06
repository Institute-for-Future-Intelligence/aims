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
import { Euler, Quaternion } from 'three';
import { useStore } from './stores/common.ts';
import { collide } from './models/physics.ts';
import { useRefStore } from './stores/commonRef.ts';
import { invalidate } from '@react-three/fiber';

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
      if (state.projectState.testMoleculeRotation === undefined) state.projectState.testMoleculeRotation = [0, 0, 0];
      if (state.projectState.testMoleculeTranslation === undefined)
        state.projectState.testMoleculeTranslation = [0, 0, 0];
      let collided = false;
      if (state.targetProteinData && state.testMoleculeData) {
        const translation = state.projectState.testMoleculeTranslation;
        collided = collide(state.targetProteinData.atoms, state.testMoleculeData, state.chemicalElements, translation);
      }
      if (collided) {
        stopFlying();
      }
      console.log(collided);
      switch (control) {
        // translation
        case FlightControl.TranslateInPositiveX: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.x += translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[0] += translationStep;
          break;
        }
        case FlightControl.TranslateInNegativeX: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.x -= translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[0] -= translationStep;
          break;
        }
        case FlightControl.TranslateInPositiveY: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.y += translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[1] += translationStep;
          break;
        }
        case FlightControl.TranslateInNegativeY: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.y -= translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[1] -= translationStep;
          break;
        }
        case FlightControl.TranslateInPositiveZ: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.z += translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[2] += translationStep;
          break;
        }
        case FlightControl.TranslateInNegativeZ: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.position.z -= translationStep;
            invalidate();
          }
          state.projectState.testMoleculeTranslation[2] -= translationStep;
          break;
        }
        // rotation
        case FlightControl.RotateAroundXClockwise: {
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_POS_X, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
        case FlightControl.RotateAroundXCounterclockwise: {
          state.projectState.testMoleculeRotation[0] -= rotationStep;
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_NEG_X, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
        case FlightControl.RotateAroundYClockwise: {
          state.projectState.testMoleculeRotation[1] += rotationStep;
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_POS_Y, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
        case FlightControl.RotateAroundYCounterclockwise: {
          state.projectState.testMoleculeRotation[1] -= rotationStep;
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_NEG_Y, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
        case FlightControl.RotateAroundZClockwise: {
          state.projectState.testMoleculeRotation[2] += rotationStep;
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_POS_Z, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
        case FlightControl.RotateAroundZCounterclockwise: {
          state.projectState.testMoleculeRotation[2] -= rotationStep;
          const ref = useRefStore.getState().testMoleculeRef;
          if (ref && ref.current) {
            ref.current.applyQuaternion(new Quaternion().setFromAxisAngle(UNIT_VECTOR_NEG_Z, rotationStep));
            invalidate();
            saveEuler(state.projectState.testMoleculeRotation, ref.current.rotation);
          }
          break;
        }
      }
    });
  }
  flyTimeout = window.setTimeout(loop, 100, control);
};
