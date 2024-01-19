/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MoleculeData } from './types';

import moleculeUrl1 from './molecules/pdb/aspirin.pdb';
import moleculeUrl2 from './molecules/sdf/ibuprofen.sdf';
import moleculeUrl3 from './molecules/sdf/paxlovid.sdf';
import moleculeUrl4 from './molecules/pcj/caffeine.pcj';
import moleculeUrl5 from './molecules/xyz/glucose.xyz';
import moleculeUrl6 from './molecules/pdb/cholesterol.pdb';

import proteinUrl1 from './proteins/1a3n.pdb';
import proteinUrl2 from './proteins/1crn.pdb';
import proteinUrl3 from './proteins/7qo7.pdb';

const sampleMolecules = [
  { name: 'Aspirin', url: moleculeUrl1, internal: true } as MoleculeData,
  { name: 'Ibuprofen', url: moleculeUrl2, internal: true } as MoleculeData,
  { name: 'Paxlovid', url: moleculeUrl3, internal: true } as MoleculeData,
  { name: 'Caffeine', url: moleculeUrl4, internal: true } as MoleculeData,
  { name: 'Glucose', url: moleculeUrl5, internal: true } as MoleculeData,
  { name: 'Cholesterol', url: moleculeUrl6, internal: true } as MoleculeData,
];

export const sampleProteins = [
  { name: 'Crambin', url: proteinUrl2, internal: true } as MoleculeData,
  { name: 'Hemoglobin', url: proteinUrl1, internal: true } as MoleculeData,
  { name: 'SARS-CoV-2 Omicron Spike', url: proteinUrl3, internal: true } as MoleculeData,
];

export const getSampleMolecule = (name: string) => {
  for (const m of sampleMolecules) {
    if (name === m.name) return m;
  }
  return null;
};

export const getSampleProtein = (name: string) => {
  for (const m of sampleProteins) {
    if (name === m.name) return m;
  }
  return null;
};

export const getSample = (name: string) => {
  const mol = getSampleMolecule(name);
  if (mol) return mol;
  return getSampleProtein(name);
};