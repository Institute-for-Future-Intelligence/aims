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
  static DEFAULT_STRENGTH = 4.5;

  atom1: Atom;
  atom2: Atom;
  type: BondType;

  constructor(atom1: Atom, atom2: Atom) {
    this.atom1 = atom1;
    this.atom2 = atom2;
    this.type = BondType.SINGLE_BOND;
  }

  getLength(): number {
    return this.atom1.position.distanceTo(this.atom2.position);
  }
}
