/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 * The bond-stretching potential is 0.5*strength*(r-length)^2
 *
 * See AMBER force field: http://en.wikipedia.org/wiki/AMBER
 */

import { Atom } from './Atom.ts';
import { BondType } from '../constants';
import { GF_CONVERSION_CONSTANT } from './physicalConstants.ts';

export class RadialBond {
  static readonly DEFAULT_STRENGTH = 5;

  atom1: Atom;
  atom2: Atom;
  strength: number;
  length: number; // equilibrium length when the radial force is zero
  type: BondType;

  constructor(atom1: Atom, atom2: Atom) {
    this.atom1 = atom1;
    this.atom2 = atom2;
    this.strength = RadialBond.DEFAULT_STRENGTH;
    // this.length = atom1.distanceTo(atom2);
    this.length = Math.hypot(
      atom1.position.x - atom2.position.x,
      atom1.position.y - atom2.position.y,
      atom1.position.z - atom2.position.z,
    );
    this.type = BondType.SINGLE_BOND;
  }

  containsAtom(atom: Atom): boolean {
    return this.atom1 === atom || this.atom2 === atom;
  }

  containsAtomIndex(index: number): boolean {
    return this.atom1.index === index || this.atom2.index === index;
  }

  getCurrentLength(): number {
    return this.atom1.position.distanceTo(this.atom2.position);
  }

  getCurrentLengthSquared(): number {
    return this.atom1.position.distanceToSquared(this.atom2.position);
  }

  // v(r)=k*(rij-rij_0)^2/2
  compute(): number {
    if (this.atom1.fixed && this.atom2.fixed) return 0;
    if (!this.atom1.force || !this.atom2.force) return 0;
    const dx = this.atom2.position.x - this.atom1.position.x;
    const dy = this.atom2.position.y - this.atom1.position.y;
    const dz = this.atom2.position.z - this.atom1.position.z;
    let r = Math.hypot(dx, dy, dz);
    const s = (this.strength * GF_CONVERSION_CONSTANT * (r - length)) / r;
    const inverseMass1 = s / this.atom1.mass;
    const inverseMass2 = s / this.atom2.mass;
    this.atom1.force.x += dx * inverseMass1;
    this.atom1.force.y += dy * inverseMass1;
    this.atom1.force.z += dz * inverseMass1;
    this.atom2.force.x -= dx * inverseMass2;
    this.atom2.force.y -= dy * inverseMass2;
    this.atom2.force.z -= dz * inverseMass2;
    r -= length;
    return 0.5 * this.strength * r * r;
  }
}
