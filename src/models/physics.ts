/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { AtomTS } from './AtomTS.ts';
import { ChemicalElement } from './ChemicalElement.ts';

/*
 * The interaction between the spaceship and the interaction centers are given by the following energy function:
 *
 * v(r) = (core / r)^12 + q * Q / r + (p dot r) * Q / r^3
 *
 * The first term models the Pauli repulsion. The second term is the Coulombic interaction. The third term is the
 * charge-dipole interaction.
 *
 * @author Charles Xie
 *
 */

export const collide = (
  target: AtomTS[],
  test: AtomTS[],
  elements: { [key: string]: ChemicalElement },
  translation: number[],
) => {
  for (let i = 0; i < test.length; i++) {
    const ei = elements[test[i].elementSymbol];
    const pi = test[i].position.clone();
    pi.x += translation[0];
    pi.y += translation[1];
    pi.z += translation[2];
    for (let j = i + 1; j < target.length; j++) {
      const ej = elements[target[j].elementSymbol];
      if (ei.atomicRadius + ej.atomicRadius > pi.distanceTo(target[j].position)) {
        return true;
      }
    }
  }
  return false;
};
