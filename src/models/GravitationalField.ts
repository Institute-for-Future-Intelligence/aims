/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { ExternalField, ExternalFieldType } from './ExternalField.ts';

export class GravitationalField implements ExternalField {
  static VIEWER_COORDINATE_SYSTEM = 1;
  static MODEL_COORDINATE_SYSTEM = 2;

  type: ExternalFieldType;
  intensity: number; // gravitational acceleration m/s^2
  direction: number;

  constructor(intensity: number) {
    this.type = ExternalFieldType.Gravitational;
    this.intensity = intensity;
    this.direction = GravitationalField.VIEWER_COORDINATE_SYSTEM;
  }
}
