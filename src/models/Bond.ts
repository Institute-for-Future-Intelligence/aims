/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom';

export class Bond {
  startAtom: Atom;
  endAtom: Atom;

  constructor(startAtom: Atom, endAtom: Atom) {
    this.startAtom = startAtom;
    this.endAtom = endAtom;
  }

  getLength(): number {
    return this.startAtom.position.distanceTo(this.endAtom.position);
  }
}
