/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Color, Vector3 } from 'three';

export interface Bond {
  start: Vector3;
  end: Vector3;
  startColor: Color;
  endColor: Color;
}
