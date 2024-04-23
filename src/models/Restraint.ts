/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { Vector3 } from 'three';
import { GF_CONVERSION_CONSTANT } from './physicalConstants.ts';

export class Restraint {
  static DEFAULT_STRENGTH = 1;

  atom: Atom;
  strength: number;
  position: Vector3;

  constructor(atom: Atom, strength: number, position: Vector3) {
    this.atom = atom;
    this.strength = strength;
    this.position = position;
  }

  // calculate force and return potential energy: v(r)=k*(ri-ri_0)^2/2
  compute(): number {
    const k = (this.strength * GF_CONVERSION_CONSTANT) / this.atom.mass;
    const dx = this.atom.position.x - this.position.x;
    const dy = this.atom.position.y - this.position.y;
    const dz = this.atom.position.z - this.position.z;
    this.atom.force.x -= k * dx;
    this.atom.force.y -= k * dy;
    this.atom.force.z -= k * dz;
    return 0.5 * this.strength * (dx * dx + dy * dy + dz * dz);
  }
}
