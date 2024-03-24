/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 * The bond-stretching potential is 0.5*strength*(r-length)^2
 *
 * See AMBER force field: http://en.wikipedia.org/wiki/AMBER
 */

import { Atom } from './Atom.ts';
import { BondType } from '../constants';

export class RadialBond {
  static readonly DEFAULT_STRENGTH = 4.5;

  atom1: Atom;
  atom2: Atom;
  strength: number;
  length: number; // equilibrium length when the radial force is zero
  type: BondType;

  constructor(atom1: Atom, atom2: Atom) {
    this.atom1 = atom1;
    this.atom2 = atom2;
    this.strength = RadialBond.DEFAULT_STRENGTH;
    this.length = 2;
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
}
