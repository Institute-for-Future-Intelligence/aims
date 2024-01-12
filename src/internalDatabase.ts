/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MoleculeData } from './types';

import testMoleculeUrl1 from './molecules/pdb/aspirin.pdb';
import testMoleculeUrl2 from './molecules/sdf/ibuprofen.sdf';
import testMoleculeUrl3 from './molecules/sdf/paxlovid.sdf';
import testMoleculeUrl4 from './molecules/pcj/caffeine.pcj';
import testMoleculeUrl5 from './molecules/xyz/glucose.xyz';
import testMoleculeUrl6 from './molecules/pdb/cholesterol.pdb';

import testProteinUrl1 from './molecules/pdb/1a3n.pdb';
import testProteinUrl2 from './molecules/pdb/1crn.pdb';

export const testMolecules = [
  { name: 'Aspirin', url: testMoleculeUrl1 } as MoleculeData,
  { name: 'Ibuprofen', url: testMoleculeUrl2 } as MoleculeData,
  { name: 'Paxlovid', url: testMoleculeUrl3 } as MoleculeData,
  { name: 'Caffeine', url: testMoleculeUrl4 } as MoleculeData,
  { name: 'Glucose', url: testMoleculeUrl5 } as MoleculeData,
  { name: 'Cholesterol', url: testMoleculeUrl6 } as MoleculeData,
];

export const testProteins = [
  { name: 'Hemoglobin', url: testProteinUrl1 } as MoleculeData,
  { name: 'Crambin', url: testProteinUrl2 } as MoleculeData,
];
