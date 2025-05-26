/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

export interface ExternalField {
  type: ExternalFieldType;
  intensity: number;
}

export enum ExternalFieldType {
  Gravitational = 'Gravitational',
  Electrical = 'Electrical',
  Magnetic = 'Magnetic',
}
