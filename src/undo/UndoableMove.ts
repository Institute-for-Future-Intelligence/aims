/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { Undoable } from './Undoable';
import { MoveDirection } from '../constants';

export interface UndoableMove extends Undoable {
  oldCx: number;
  oldCy: number;
  oldCz: number;
  newCx: number;
  newCy: number;
  newCz: number;
}

export interface UndoableMoveSelectedByKey extends Undoable {
  direction: MoveDirection;
  displacementMap: Map<string, number>;
}

export interface UndoableMoveAllByKey extends Undoable {
  direction: MoveDirection;
  displacement: number;
}
