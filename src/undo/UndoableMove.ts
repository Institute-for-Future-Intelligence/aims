/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { Undoable } from './Undoable';
import { Vector3 } from 'three';

export interface UndoableMoleculeTranslation extends Undoable {
  displacement: Vector3;
}

export interface UndoableMoleculeRotation extends Undoable {
  axis: string;
  degrees: number;
}
