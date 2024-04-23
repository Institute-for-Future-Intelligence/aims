/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { GF_CONVERSION_CONSTANT } from './physicalConstants.ts';

export class Damper {
  static DEFAULT_FRICTION = 1;

  indexOfAtom: number = -1;
  friction: number = 0;

  constructor(indexOfAtom: number, strength: number) {
    this.indexOfAtom = indexOfAtom;
    this.friction = strength;
  }

  compute(atoms: Atom[]) {
    if (this.friction > 0 && this.indexOfAtom >= 0 && this.indexOfAtom < atoms.length) {
      const d = GF_CONVERSION_CONSTANT * this.friction;
      const a = atoms[this.indexOfAtom];
      a.force.x -= d * a.velocity.x;
      a.force.y -= d * a.velocity.y;
      a.force.z -= d * a.velocity.z;
    }
  }
}
