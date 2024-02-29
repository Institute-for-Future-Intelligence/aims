/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MoleculeData } from './types';

import commonMoleculeUrl001 from './molecules/pdb/xenon.pdb';
import commonMoleculeUrl002 from './molecules/pdb/water.pdb';
import commonMoleculeUrl003 from './molecules/xyz/benzene.xyz';
import commonMoleculeUrl004 from './molecules/pdb/buckyball.pdb';
import commonMoleculeUrl005 from './molecules/pdb/methane.pdb';
import commonMoleculeUrl006 from './molecules/sdf/ethane.sdf';
import commonMoleculeUrl007 from './molecules/sdf/propane.sdf';
import commonMoleculeUrl008 from './molecules/sdf/butane.sdf';
import commonMoleculeUrl009 from './molecules/sdf/pentane.sdf';
import commonMoleculeUrl010 from './molecules/sdf/hexane.sdf';
import commonMoleculeUrl011 from './molecules/sdf/heptane.sdf';
import commonMoleculeUrl012 from './molecules/sdf/octane.sdf';
import commonMoleculeUrl013 from './molecules/sdf/nonane.sdf';
import commonMoleculeUrl014 from './molecules/sdf/decane.sdf';
import commonMoleculeUrl015 from './molecules/sdf/undecane.sdf';
import commonMoleculeUrl016 from './molecules/sdf/dodecane.sdf';
import commonMoleculeUrl017 from './molecules/sdf/tridecane.sdf';
import commonMoleculeUrl018 from './molecules/sdf/tetradecane.sdf';
import commonMoleculeUrl019 from './molecules/sdf/pentadecane.sdf';
import commonMoleculeUrl020 from './molecules/sdf/hexadecane.sdf';
import commonMoleculeUrl021 from './molecules/sdf/heptadecane.sdf';
import commonMoleculeUrl022 from './molecules/sdf/octadecane.sdf';
import commonMoleculeUrl023 from './molecules/sdf/nonadecane.sdf';
import commonMoleculeUrl024 from './molecules/sdf/icosane.sdf';

import drugMoleculeUrl001 from './molecules/pdb/aspirin.pdb';
import drugMoleculeUrl002 from './molecules/sdf/ibuprofen.sdf';
import drugMoleculeUrl003 from './molecules/sdf/paxlovid.sdf';
import drugMoleculeUrl004 from './molecules/pcj/caffeine.pcj';
import drugMoleculeUrl005 from './molecules/xyz/d_glucose.xyz';
import drugMoleculeUrl006 from './molecules/pdb/cholesterol.pdb';
import drugMoleculeUrl007 from './molecules/sdf/claritin.sdf';
import drugMoleculeUrl008 from './molecules/sdf/zyrtec.sdf';
import drugMoleculeUrl009 from './molecules/sdf/efaproxiral.sdf';
import drugMoleculeUrl010 from './molecules/sdf/penicillin_g.sdf';
import drugMoleculeUrl011 from './molecules/sdf/voxelotor.sdf';
import drugMoleculeUrl012 from './molecules/sdf/morphine.sdf';
import drugMoleculeUrl013 from './molecules/sdf/ether.sdf';
import drugMoleculeUrl014 from './molecules/sdf/darunavir.sdf';
import drugMoleculeUrl015 from './molecules/sdf/viagra.sdf';
import drugMoleculeUrl016 from './molecules/sdf/nitroglycerin.sdf';
import drugMoleculeUrl017 from './molecules/sdf/thorazine.sdf';
import drugMoleculeUrl018 from './molecules/sdf/zidovudine.sdf';
import drugMoleculeUrl019 from './molecules/sdf/lipitor.sdf';
import drugMoleculeUrl020 from './molecules/sdf/metformin.sdf';
import drugMoleculeUrl021 from './molecules/sdf/thioketal_haloperidol.sdf';
import drugMoleculeUrl022 from './molecules/sdf/atp.sdf';
import drugMoleculeUrl023 from './molecules/sdf/vanillin.sdf';

import proteinUrl001 from './proteins/1crn.pdb';
import proteinUrl002 from './proteins/1a3n.pdb';
import proteinUrl003 from './proteins/1aid.pdb';
import proteinUrl004 from './proteins/7qo7.pdb';
import proteinUrl005 from './proteins/2fom.pdb';

export const commonMolecules = [
  { url: commonMoleculeUrl001, internal: true, name: 'Xenon' } as MoleculeData,
  { url: commonMoleculeUrl002, internal: true, name: 'Water' } as MoleculeData,
  { url: commonMoleculeUrl003, internal: true, name: 'Benzene' } as MoleculeData,
  { url: commonMoleculeUrl004, internal: true, name: 'Buckminsterfullerene' } as MoleculeData,
  { url: commonMoleculeUrl005, internal: true, name: 'Methane' } as MoleculeData,
  { url: commonMoleculeUrl006, internal: true, name: 'Ethane' } as MoleculeData,
  { url: commonMoleculeUrl007, internal: true, name: 'Propane' } as MoleculeData,
  { url: commonMoleculeUrl008, internal: true, name: 'Butane' } as MoleculeData,
  { url: commonMoleculeUrl009, internal: true, name: 'Pentane' } as MoleculeData,
  { url: commonMoleculeUrl010, internal: true, name: 'Hexane' } as MoleculeData,
  { url: commonMoleculeUrl011, internal: true, name: 'Heptane' } as MoleculeData,
  { url: commonMoleculeUrl012, internal: true, name: 'Octane' } as MoleculeData,
  { url: commonMoleculeUrl013, internal: true, name: 'Nonane' } as MoleculeData,
  { url: commonMoleculeUrl014, internal: true, name: 'Decane' } as MoleculeData,
  { url: commonMoleculeUrl015, internal: true, name: 'Undecane' } as MoleculeData,
  { url: commonMoleculeUrl016, internal: true, name: 'Dodecane' } as MoleculeData,
  { url: commonMoleculeUrl017, internal: true, name: 'Tridecane' } as MoleculeData,
  { url: commonMoleculeUrl018, internal: true, name: 'Tetradecane' } as MoleculeData,
  { url: commonMoleculeUrl019, internal: true, name: 'Pentadecane' } as MoleculeData,
  { url: commonMoleculeUrl020, internal: true, name: 'Hexadecane' } as MoleculeData,
  { url: commonMoleculeUrl021, internal: true, name: 'Heptadecane' } as MoleculeData,
  { url: commonMoleculeUrl022, internal: true, name: 'Octadecane' } as MoleculeData,
  { url: commonMoleculeUrl023, internal: true, name: 'Nonadecane' } as MoleculeData,
  { url: commonMoleculeUrl024, internal: true, name: 'Icosane' } as MoleculeData,
].sort((a, b) => a.name.localeCompare(b.name));

export const drugMolecules = [
  { url: drugMoleculeUrl001, internal: true, name: 'Aspirin' } as MoleculeData,
  { url: drugMoleculeUrl002, internal: true, name: 'Ibuprofen' } as MoleculeData,
  { url: drugMoleculeUrl003, internal: true, name: 'Paxlovid' } as MoleculeData,
  { url: drugMoleculeUrl004, internal: true, name: 'Caffeine' } as MoleculeData,
  { url: drugMoleculeUrl005, internal: true, name: 'D-Glucose' } as MoleculeData,
  { url: drugMoleculeUrl006, internal: true, name: 'Cholesterol' } as MoleculeData,
  { url: drugMoleculeUrl007, internal: true, name: 'Claritin' } as MoleculeData,
  { url: drugMoleculeUrl008, internal: true, name: 'Zyrtec' } as MoleculeData,
  { url: drugMoleculeUrl009, internal: true, name: 'Efaproxiral' } as MoleculeData,
  { url: drugMoleculeUrl010, internal: true, name: 'Penicillin G' } as MoleculeData,
  { url: drugMoleculeUrl011, internal: true, name: 'Voxelotor' } as MoleculeData,
  { url: drugMoleculeUrl012, internal: true, name: 'Morphine' } as MoleculeData,
  { url: drugMoleculeUrl013, internal: true, name: 'Ether' } as MoleculeData,
  { url: drugMoleculeUrl014, internal: true, name: 'Darunavir' } as MoleculeData,
  { url: drugMoleculeUrl015, internal: true, name: 'Viagra' } as MoleculeData,
  { url: drugMoleculeUrl016, internal: true, name: 'Nitroglycerin' } as MoleculeData,
  { url: drugMoleculeUrl017, internal: true, name: 'Thorazine' } as MoleculeData,
  { url: drugMoleculeUrl018, internal: true, name: 'Zidovudine' } as MoleculeData,
  { url: drugMoleculeUrl019, internal: true, name: 'Lipitor' } as MoleculeData,
  { url: drugMoleculeUrl020, internal: true, name: 'Metformin' } as MoleculeData,
  { url: drugMoleculeUrl021, internal: true, name: 'Thioketal Haloperidol' } as MoleculeData,
  { url: drugMoleculeUrl022, internal: true, name: 'ATP' } as MoleculeData,
  { url: drugMoleculeUrl023, internal: true, name: 'Vanillin' } as MoleculeData,
].sort((a, b) => a.name.localeCompare(b.name));

export const targetProteins = [
  { url: proteinUrl001, internal: true, name: 'Crambin' } as MoleculeData,
  { url: proteinUrl002, internal: true, name: 'Hemoglobin' } as MoleculeData,
  { url: proteinUrl003, internal: true, name: 'HIV-1 Protease' } as MoleculeData,
  { url: proteinUrl004, internal: true, name: 'SARS-CoV-2 Omicron Spike' } as MoleculeData,
  { url: proteinUrl005, internal: true, name: 'Dengue Virus NS2B/NS3 Protease' } as MoleculeData,
].sort((a, b) => a.name.localeCompare(b.name));

export const getMolecule = (name: string) => {
  for (const m of commonMolecules) {
    if (name === m.name) return m;
  }
  for (const m of drugMolecules) {
    if (name === m.name) return m;
  }
  return null;
};

export const getProtein = (name: string) => {
  for (const m of targetProteins) {
    if (name === m.name) return m;
  }
  return null;
};

export const getData = (name: string) => {
  const mol = getMolecule(name);
  if (mol) return mol;
  return getProtein(name);
};
