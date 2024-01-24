/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { Undoable } from './Undoable';

export interface UndoableResetView extends Undoable {
  oldCameraPosition: number[];
  oldCameraRotation: number[];
  oldCameraUp: number[];
  oldPanCenter: number[];
}
