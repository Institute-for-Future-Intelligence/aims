/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import Residue from '../lib/chem/Residue';
import Chain from '../lib/chem/Chain';
import Molecule from '../lib/chem/Molecule';
import StructuralElement from '../lib/chem/StructuralElement';
import { Vector3 } from 'three';
import { MoleculeTS } from './MoleculeTS.ts';

export interface ProteinTS extends MoleculeTS {
  residues: Residue[];
  chains: Chain[];
  structures: StructuralElement[];
  molecules: Molecule[];
  centerOffset: Vector3;
}
