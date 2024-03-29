/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';

export class VdwBond {
  atom1: Atom;
  atom2: Atom;

  constructor(atom1: Atom, atom2: Atom) {
    this.atom1 = atom1;
    this.atom2 = atom2;
  }

  getLength(): number {
    return this.atom1.position.distanceTo(this.atom2.position);
  }
}
