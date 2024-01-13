/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Undoable } from './Undoable';

export interface UndoableCameraChange extends Undoable {
  oldCameraPosition: number[];
  oldPanCenter: number[];
  newCameraPosition: number[];
  newPanCenter: number[];
}
