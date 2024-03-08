/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Vector3 } from 'three';

export interface AtomTS {
  elementSymbol: string;
  index: number;
  position: Vector3;
  velocity: Vector3;
  acceleration: Vector3;
  movable: boolean;
}
