/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { GF_CONVERSION_CONSTANT } from './physicalConstants.ts';

export class Damper {
  static DEFAULT_FRICTION = 1;

  atom: Atom;
  friction: number;

  constructor(atom: Atom, strength: number) {
    this.atom = atom;
    this.friction = strength;
  }

  compute() {
    if (this.friction > 0) {
      const d = GF_CONVERSION_CONSTANT * this.friction;
      this.atom.force.x -= d * this.atom.velocity.x;
      this.atom.force.y -= d * this.atom.velocity.y;
      this.atom.force.z -= d * this.atom.velocity.z;
    }
  }
}
