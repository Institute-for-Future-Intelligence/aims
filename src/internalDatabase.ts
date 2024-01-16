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
