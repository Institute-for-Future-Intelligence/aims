/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MoleculeData } from './types';

import moleculeUrl1 from './molecules/pdb/aspirin.pdb?url';
import moleculeUrl2 from './molecules/sdf/ibuprofen.sdf?url';
import moleculeUrl3 from './molecules/sdf/paxlovid.sdf?url';
import moleculeUrl4 from './molecules/pcj/caffeine.pcj?url';
import moleculeUrl5 from './molecules/xyz/glucose.xyz?url';
import moleculeUrl6 from './molecules/pdb/cholesterol.pdb?url';

import proteinUrl1 from './proteins/1a3n.pdb?url';
import proteinUrl2 from './proteins/1crn.pdb?url';
import proteinUrl3 from './proteins/7qo7.pdb?url';

export const sampleMolecules = [
  { name: 'Aspirin', url: moleculeUrl1 } as MoleculeData,
  { name: 'Ibuprofen', url: moleculeUrl2 } as MoleculeData,
  { name: 'Paxlovid', url: moleculeUrl3 } as MoleculeData,
  { name: 'Caffeine', url: moleculeUrl4 } as MoleculeData,
  { name: 'Glucose', url: moleculeUrl5 } as MoleculeData,
  { name: 'Cholesterol', url: moleculeUrl6 } as MoleculeData,
];

export const sampleProteins = [
  { name: 'Crambin', url: proteinUrl2 } as MoleculeData,
  { name: 'Hemoglobin', url: proteinUrl1 } as MoleculeData,
  { name: 'SARS-CoV-2 Omicron Spike', url: proteinUrl3 } as MoleculeData,
];

console.log('sampleMolecules', sampleMolecules);

export const getSampleMolecule = (name: string) => {
  for (const m of sampleMolecules) {
    if (name === m.name) return m;
  }
  return null;
};

// export const getSampleProtein = (name: string) => {
//   for (const m of sampleProteins) {
//     if (name === m.name) return m;
//   }
//   return null;
// };

// export const getSample = (name: string) => {
//   const mol = getSampleMolecule(name);
//   if (mol) return mol;
//   return getSampleProtein(name);
// };
