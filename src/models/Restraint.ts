/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Vector3 } from 'three';

export class Restraint {
  strength: number;
  position: Vector3;

  constructor(strength: number, position: Vector3) {
    this.strength = strength;
    this.position = position;
  }

  clone(): Restraint {
    // just in case: don't use Vector3.clone() as the object from Firestore is not actually a Vector3
    return new Restraint(this.strength, new Vector3(this.position.x, this.position.y, this.position.z));
  }
}
