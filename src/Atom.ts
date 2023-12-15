/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Color, Vector3 } from 'three';

export interface Atom {
  name: string;
  position: Vector3;
  color: Color;
  radius: number;
}
