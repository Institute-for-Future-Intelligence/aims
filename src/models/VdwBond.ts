/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { AtomTS } from './AtomTS';

export class VdwBond {
  startAtom: AtomTS;
  endAtom: AtomTS;

  constructor(startAtom: AtomTS, endAtom: AtomTS) {
    this.startAtom = startAtom;
    this.endAtom = endAtom;
  }

  getLength(): number {
    return this.startAtom.position.distanceTo(this.endAtom.position);
  }
}
