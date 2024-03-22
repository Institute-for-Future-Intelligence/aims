/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Vector3 } from 'three';

export class Atom {
  index: number;
  elementSymbol: string;
  position: Vector3;

  velocity?: Vector3;
  acceleration?: Vector3;
  fixed?: boolean;

  constructor(index: number, elementSymbol: string, position: Vector3) {
    this.index = index;
    this.elementSymbol = elementSymbol;
    this.position = position;
  }

  distanceToSquared = (target: Atom) => {
    return this.position.distanceToSquared(target.position);
  };
}
