/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { RadialBond } from './RadialBond.ts';
import { MoleculeInterface } from '../types.ts';

export class Molecule implements MoleculeInterface {
  name: string;
  atoms: Atom[];
  bonds: RadialBond[];
  url?: string;
  internal?: boolean;
  invisible?: boolean;
  excluded?: boolean;
  metadata?: any;

  constructor(name: string, atoms: Atom[], bonds: RadialBond[]) {
    this.name = name;
    this.atoms = atoms;
    this.bonds = bonds;
  }
}
