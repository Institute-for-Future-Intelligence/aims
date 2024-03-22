/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { Vector3 } from 'three';

export class Restraint {
  static DEFAULT_STRENGTH = 1;

  atom: Atom;
  strength: number;
  position: Vector3;

  constructor(atom: Atom, strength: number, position: Vector3) {
    this.atom = atom;
    this.strength = strength;
    this.position = position;
  }
}
