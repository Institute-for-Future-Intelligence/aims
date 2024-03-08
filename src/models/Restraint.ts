/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { AtomTS } from './AtomTS.ts';

export interface Restraint {
  strength: number;
  position: number;
  atom: AtomTS;
}
