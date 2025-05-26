/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { ExternalField, ExternalFieldType } from './ExternalField.ts';

export class GravitationalField implements ExternalField {
  type: ExternalFieldType;
  intensity: number; // gravitational acceleration m/s^2

  constructor(intensity: number) {
    this.type = ExternalFieldType.Gravitational;
    this.intensity = intensity;
  }
}
