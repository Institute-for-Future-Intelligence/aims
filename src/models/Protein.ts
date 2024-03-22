/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import Residue from '../lib/chem/Residue';
import Chain from '../lib/chem/Chain';
import MoleculeJS from '../lib/chem/Molecule';
import StructuralElement from '../lib/chem/StructuralElement';
import { Vector3 } from 'three';
import { Molecule } from './Molecule.ts';
import { Atom } from './Atom.ts';
import { RadialBond } from './RadialBond.ts';

export class Protein extends Molecule {
  residues: Residue[];
  chains: Chain[];
  structures: StructuralElement[];
  molecules: MoleculeJS[];
  centerOffset: Vector3;

  constructor(name: string, atoms: Atom[], bonds: RadialBond[]) {
    super(name, atoms, bonds);
    this.residues = [];
    this.chains = [];
    this.structures = [];
    this.molecules = [];
    this.centerOffset = new Vector3();
  }
}
