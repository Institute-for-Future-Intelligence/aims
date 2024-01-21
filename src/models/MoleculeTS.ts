/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { AtomTS } from './AtomTS';
import { BondTS } from './BondTS';
import Residue from '../lib/chem/Residue';
import Chain from '../lib/chem/Chain';
import Molecule from '../lib/chem/Molecule';
import StructuralElement from '../lib/chem/StructuralElement';

export interface MoleculeTS {
  name: string;
  metadata: any;
  atoms: AtomTS[];
  bonds: BondTS[];
  residues: Residue[];
  chains: Chain[];
  structures: StructuralElement[];
  molecules: Molecule[];
}
