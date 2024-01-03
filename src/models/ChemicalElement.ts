/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export interface ChemicalElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMmass: number;
  cpkHexColor: string;
  electronConfiguration: string;
  electronegativity: number; // NaN if not defined
  atomicRadius: number;
  ionizationEnergy: number;
  electronAffinity: number;
}
