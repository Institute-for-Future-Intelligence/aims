/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { AtomTS } from './AtomTS';
import { BondTS } from './BondTS';

export interface MoleculeTS {
  atoms: AtomTS[];
  bonds: BondTS[];
}
