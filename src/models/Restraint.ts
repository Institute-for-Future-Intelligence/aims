/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { Vector3 } from 'three';
import { GF_CONVERSION_CONSTANT } from './physicalConstants.ts';

export class Restraint {
  static DEFAULT_STRENGTH = 1;

  indexOfAtom: number = -1;
  strength: number = 0;
  position: Vector3;

  constructor(indexOfAtom: number, strength: number, position: Vector3) {
    this.indexOfAtom = indexOfAtom;
    this.strength = strength;
    this.position = position;
  }

  // calculate force and return potential energy: v(r)=k*(ri-ri_0)^2/2
  compute(atoms: Atom[]): number {
    if (this.strength > 0 && this.indexOfAtom >= 0 && this.indexOfAtom < atoms.length) {
      const a = atoms[this.indexOfAtom];
      const k = (this.strength * GF_CONVERSION_CONSTANT) / a.mass;
      const dx = a.position.x - this.position.x;
      const dy = a.position.y - this.position.y;
      const dz = a.position.z - this.position.z;
      a.force.x -= k * dx;
      a.force.y -= k * dy;
      a.force.z -= k * dz;
      return 0.5 * this.strength * (dx * dx + dy * dy + dz * dz);
    }
    return 0;
  }
}
