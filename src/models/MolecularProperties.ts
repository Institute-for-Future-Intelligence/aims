/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';

export interface MolecularProperties {
  formula: string;
  atomCount: number;
  bondCount: number;
  molecularMass: number;
  logP: number; // how hydrophilic or hydrophobic a molecule is
  hydrogenBondDonorCount: number;
  hydrogenBondAcceptorCount: number;
  rotatableBondCount: number;
  polarSurfaceArea: number; // the surface sum over all polar atoms
  heavyAtomCount: number;
  complexity: number;
  density: number;
  boilingPoint: number;
  meltingPoint: number;
  atoms?: Atom[];
}
