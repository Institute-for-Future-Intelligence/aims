/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { RadialBond } from './RadialBond.ts';

export class Molecule {
  name: string;
  atoms: Atom[];
  bonds: RadialBond[];
  metadata?: any;

  constructor(name: string, atoms: Atom[], bonds: RadialBond[]) {
    this.name = name;
    this.atoms = atoms;
    this.bonds = bonds;
  }
}
