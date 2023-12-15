/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom';
import { BondType } from '../types';

export class Bond {
  startAtom: Atom;
  endAtom: Atom;
  type: BondType;

  constructor(startAtom: Atom, endAtom: Atom) {
    this.startAtom = startAtom;
    this.endAtom = endAtom;
    this.type = BondType.SINGLE_BOND;
  }

  getLength(): number {
    return this.startAtom.position.distanceTo(this.endAtom.position);
  }
}
