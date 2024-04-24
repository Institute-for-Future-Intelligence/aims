/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Vector3 } from 'three';

export class Restraint {
  indexOfAtom: number = -1;
  strength: number = 0;
  position: Vector3;

  constructor(indexOfAtom: number, strength: number, position: Vector3) {
    this.indexOfAtom = indexOfAtom;
    this.strength = strength;
    this.position = position;
  }
}
