/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { Undoable } from './Undoable';

export interface UndoablePaste extends Undoable {
  pasted: [];
}
