/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import { Undoable } from './Undoable';

export interface UndoableImportMolecule extends Undoable {
  moleculeNames: string[];
}
