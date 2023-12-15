/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom';
import { Bond } from './Bond';

export interface Molecule {
  atoms: Atom[];
  bonds: Bond[];
}
