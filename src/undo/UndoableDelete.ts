/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { Undoable } from './Undoable';

export interface UndoableDelete extends Undoable {
  selectedId: string;
}

export interface UndoableDeleteMultiple extends UndoableDelete {
  selectedIdSet: Set<string>;
}
