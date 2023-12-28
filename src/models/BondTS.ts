/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { AtomTS } from './AtomTS';
import { BondType } from '../types';

export class BondTS {
  startAtom: AtomTS;
  endAtom: AtomTS;
  type: BondType;

  constructor(startAtom: AtomTS, endAtom: AtomTS) {
    this.startAtom = startAtom;
    this.endAtom = endAtom;
    this.type = BondType.SINGLE_BOND;
  }

  getLength(): number {
    return this.startAtom.position.distanceTo(this.endAtom.position);
  }
}
