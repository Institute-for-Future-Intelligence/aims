/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export interface MolecularProperties {
  atomCount: number;
  bondCount: number;
  mass: number;
  logP: number; // how hydrophilic or hydrophobic a molecule is
  polarSurfaceArea: number; // the surface sum over all polar atoms
  hydrogenBondDonorCount: number;
  hydrogenBondAcceptorCount: number;
  rotatableBondCount: number;
}
