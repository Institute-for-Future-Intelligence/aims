/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MoleculeData } from './types';

import moleculeUrl001 from './molecules/pdb/aspirin.pdb';
import moleculeUrl002 from './molecules/sdf/ibuprofen.sdf';
import moleculeUrl003 from './molecules/sdf/paxlovid.sdf';
import moleculeUrl004 from './molecules/pcj/caffeine.pcj';
import moleculeUrl005 from './molecules/xyz/glucose.xyz';
import moleculeUrl006 from './molecules/pdb/cholesterol.pdb';
import moleculeUrl007 from './molecules/sdf/claritin.sdf';
import moleculeUrl008 from './molecules/sdf/zyrtec.sdf';
import moleculeUrl009 from './molecules/mol2/benzene.mol2';
import moleculeUrl010 from './molecules/sdf/penicillin g.sdf';
import moleculeUrl011 from './molecules/sdf/voxelotor.sdf';
import moleculeUrl012 from './molecules/sdf/morphine.sdf';
import moleculeUrl013 from './molecules/sdf/ether.sdf';
import moleculeUrl014 from './molecules/sdf/darunavir.sdf';
import moleculeUrl015 from './molecules/sdf/viagra.sdf';
import moleculeUrl016 from './molecules/sdf/nitroglycerin.sdf';
import moleculeUrl017 from './molecules/sdf/thorazine.sdf';
import moleculeUrl018 from './molecules/sdf/zidovudine.sdf';
import moleculeUrl019 from './molecules/sdf/lipitor.sdf';
import moleculeUrl020 from './molecules/sdf/metformin.sdf';

import proteinUrl001 from './proteins/1a3n.pdb';
import proteinUrl002 from './proteins/1crn.pdb';
import proteinUrl003 from './proteins/7qo7.pdb';

export const sampleMolecules = [
  { url: moleculeUrl001, internal: true, name: 'Aspirin' } as MoleculeData,
  { url: moleculeUrl002, internal: true, name: 'Ibuprofen' } as MoleculeData,
  { url: moleculeUrl003, internal: true, name: 'Paxlovid' } as MoleculeData,
  { url: moleculeUrl004, internal: true, name: 'Caffeine' } as MoleculeData,
  { url: moleculeUrl005, internal: true, name: 'Glucose' } as MoleculeData,
  { url: moleculeUrl006, internal: true, name: 'Cholesterol' } as MoleculeData,
  { url: moleculeUrl007, internal: true, name: 'Claritin' } as MoleculeData,
  { url: moleculeUrl008, internal: true, name: 'Zyrtec' } as MoleculeData,
  { url: moleculeUrl009, internal: true, name: 'Benzene' } as MoleculeData,
  { url: moleculeUrl010, internal: true, name: 'Penicillin G' } as MoleculeData,
  { url: moleculeUrl011, internal: true, name: 'Voxelotor' } as MoleculeData,
  { url: moleculeUrl012, internal: true, name: 'Morphine' } as MoleculeData,
  { url: moleculeUrl013, internal: true, name: 'Ether' } as MoleculeData,
  { url: moleculeUrl014, internal: true, name: 'Darunavir' } as MoleculeData,
  { url: moleculeUrl015, internal: true, name: 'Viagra' } as MoleculeData,
  { url: moleculeUrl016, internal: true, name: 'Nitroglycerin' } as MoleculeData,
  { url: moleculeUrl017, internal: true, name: 'Thorazine' } as MoleculeData,
  { url: moleculeUrl018, internal: true, name: 'Zidovudine' } as MoleculeData,
  { url: moleculeUrl019, internal: true, name: 'Lipitor' } as MoleculeData,
  { url: moleculeUrl020, internal: true, name: 'Metformin' } as MoleculeData,
].sort((a, b) => a.name.localeCompare(b.name));

export const sampleProteins = [
  { url: proteinUrl002, internal: true, name: 'Crambin' } as MoleculeData,
  { url: proteinUrl001, internal: true, name: 'Hemoglobin' } as MoleculeData,
  { url: proteinUrl003, internal: true, name: 'SARS-CoV-2 Omicron Spike' } as MoleculeData,
].sort((a, b) => a.name.localeCompare(b.name));

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
