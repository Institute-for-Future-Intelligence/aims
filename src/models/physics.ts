/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 * The interaction between the spaceship and the interaction centers are given by the following energy function:
 *
 * v(r) = (core / r)^12 + q * Q / r + (p dot r) * Q / r^3
 *
 * The first term models the Pauli repulsion. The second term is the Coulombic interaction. The third term is the
 * charge-dipole interaction.
 *
 */

import { Atom } from './Atom.ts';
import { ChemicalElement } from './ChemicalElement.ts';
import { Vector3 } from 'three';

const CUTOFF_RATIO_SQUARED = 200;
/*
 * Assumptions:
 *   1. The target protein is fixed
 *   2. The test molecule can move
 *   3. The translation vector stores the current translation of the test molecule
 *   4. delta is the steplength for translation
 */

export const computeAcceleration = (
  target: Atom[],
  test: Atom[],
  elements: { [key: string]: ChemicalElement },
  translation: number[],
  velocity: number[],
  steeringForce: Vector3,
  friction: number,
): Vector3 => {
  let fij, dx, dy, dz, rij, rsq, rsq6, core12;
  let fx = 0;
  let fy = 0;
  let fz = 0;
  let mass = 0;
  const strength = 0.01;
  const pi = new Vector3();

  // compute the interatomic force on each individual atom of the test molecule from the target protein
  for (let i = 0; i < test.length; i++) {
    const atom = test[i];
    const ei = elements[atom.elementSymbol];
    mass += ei.atomicMass;
    pi.copy(atom.position);
    pi.x += translation[0];
    pi.y += translation[1];
    pi.z += translation[2];
    console.log('***', pi);
    for (let j = 0; j < target.length; j++) {
      const ej = elements[target[j].elementSymbol];
      rij = 10 * ei.atomicRadius * ej.atomicRadius;
      dx = pi.x - target[j].position.x;
      dy = pi.y - target[j].position.y;
      dz = pi.z - target[j].position.z;
      rsq = dx * dx + dy * dy + dz * dz;
      if (rsq < rij * rij * CUTOFF_RATIO_SQUARED) {
        if (rsq < 1) {
          console.log(j, dx, dy, dz, rsq);
          rsq = 1;
        }
        rsq6 = rsq * rsq * rsq;
        rsq6 *= rsq6;
        core12 = rij * rij * rij;
        core12 *= core12;
        fij = (-12 * strength * core12) / (rsq6 * rsq);
        fx += fij * dx;
        fy += fij * dy;
        fz += fij * dz;
      }
    }
  }

  // compute the steering force and friction force
  // fx += steeringForce.x - velocity[0] * friction;
  // fy += steeringForce.y - velocity[1] * friction;
  // fz += steeringForce.z - velocity[2] * friction;

  // const max = 1;
  // if (fx > max) fx = max;
  // else if (fx < -max) fx = -max;
  // if (fy > max) fy = max;
  // else if (fy < -max) fy = -max;
  // if (fz > max) fz = max;
  // else if (fz < -max) fz = -max;

  console.log(JSON.stringify(translation), steeringForce, fx, fy, fz);

  // return the acceleration vector
  // return new Vector3(fx / mass*Math.sign(steeringForce.x), fy / mass*Math.sign(steeringForce.y), fz / mass*Math.sign(steeringForce.z));
  return new Vector3(fx / mass, fy / mass, fz / mass);
};
