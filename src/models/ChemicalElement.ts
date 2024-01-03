/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export interface ChemicalElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number; // atomic mass unit (u)
  cpkHexColor: string;
  electronConfiguration: string;
  electronegativity: number; // NaN if not defined
  atomicRadius: number;
  ionizationEnergy: number; // eV
  electronAffinity: number; // eV
}
