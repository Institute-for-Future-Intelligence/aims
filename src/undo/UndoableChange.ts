/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { Undoable } from './Undoable';
import { Vector3 } from 'three';
import { MolecularViewerStyle } from '../types';

export interface UndoableChange extends Undoable {
  oldValue: boolean | string | number | string[] | number[] | Vector3 | MolecularViewerStyle;
  newValue: boolean | string | number | string[] | number[] | Vector3 | MolecularViewerStyle;
}
