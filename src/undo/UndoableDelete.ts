/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import { Undoable } from './Undoable';
import { MoleculeInterface } from '../types.ts';
import { Molecule } from '../models/Molecule.ts';
import { MolecularProperties } from '../models/MolecularProperties.ts';

export interface UndoableDeleteMoleculeInGallery extends Undoable {
  selectedMolecule: MoleculeInterface;
  selectedIndex: number;
  selectedMolecularProperties: MolecularProperties;
}

export interface UndoableDeleteMoleculesInGallery extends Undoable {
  moleculeNames: string[];
}

export interface UndoableDeleteAllMoleculesInChamber extends Undoable {
  molecules: Molecule[];
}

export interface UndoableDeleteMoleculeInChamber extends Undoable {
  index: number;
  molecule: Molecule;
}
