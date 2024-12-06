/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { Undoable } from './Undoable';
import { MoleculeInterface } from '../types.ts';

export interface UndoableDeleteMolecule extends Undoable {
  selectedMolecule: MoleculeInterface;
  selectedIndex: number;
}

export interface UndoableDeleteMolecules extends Undoable {
  moleculeNames: string[];
}
