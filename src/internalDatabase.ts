/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MoleculeData } from './types';

import monatomicUrl001 from './molecules/pdb/helium.pdb';
import monatomicUrl002 from './molecules/pdb/neon.pdb';
import monatomicUrl003 from './molecules/pdb/argon.pdb';
import monatomicUrl004 from './molecules/pdb/krypton.pdb';
import monatomicUrl005 from './molecules/pdb/xenon.pdb';

import commonMoleculeUrl001 from './molecules/sdf/dihydrogen.sdf';
import commonMoleculeUrl002 from './molecules/sdf/dioxygen.sdf';
import commonMoleculeUrl003 from './molecules/sdf/dinitrogen.sdf';
import commonMoleculeUrl004 from './molecules/pdb/water.pdb';
import commonMoleculeUrl005 from './molecules/sdf/carbon_dioxide.sdf';
import commonMoleculeUrl101 from './molecules/pdb/buckyball.pdb';
import commonMoleculeUrl102 from './molecules/xyz/nanotube.xyz';
import commonMoleculeUrl201 from './molecules/xyz/d_glucose.xyz';
import commonMoleculeUrl202 from './molecules/pdb/cholesterol.pdb';
import commonMoleculeUrl203 from './molecules/sdf/atp.sdf';
import commonMoleculeUrl204 from './molecules/sdf/ethanol.sdf';

import hydrocarbonMoleculeUrl001 from './molecules/pdb/methane.pdb';
import hydrocarbonMoleculeUrl002 from './molecules/sdf/ethane.sdf';
import hydrocarbonMoleculeUrl003 from './molecules/sdf/propane.sdf';
import hydrocarbonMoleculeUrl004 from './molecules/sdf/butane.sdf';
import hydrocarbonMoleculeUrl005 from './molecules/sdf/pentane.sdf';
import hydrocarbonMoleculeUrl006 from './molecules/sdf/hexane.sdf';
import hydrocarbonMoleculeUrl007 from './molecules/sdf/heptane.sdf';
import hydrocarbonMoleculeUrl008 from './molecules/sdf/octane.sdf';
import hydrocarbonMoleculeUrl009 from './molecules/sdf/nonane.sdf';
import hydrocarbonMoleculeUrl010 from './molecules/sdf/decane.sdf';
import hydrocarbonMoleculeUrl011 from './molecules/sdf/undecane.sdf';
import hydrocarbonMoleculeUrl012 from './molecules/sdf/dodecane.sdf';
import hydrocarbonMoleculeUrl013 from './molecules/sdf/tridecane.sdf';
import hydrocarbonMoleculeUrl014 from './molecules/sdf/tetradecane.sdf';
import hydrocarbonMoleculeUrl015 from './molecules/sdf/pentadecane.sdf';
import hydrocarbonMoleculeUrl016 from './molecules/sdf/hexadecane.sdf';
import hydrocarbonMoleculeUrl017 from './molecules/sdf/heptadecane.sdf';
import hydrocarbonMoleculeUrl018 from './molecules/sdf/octadecane.sdf';
import hydrocarbonMoleculeUrl019 from './molecules/sdf/nonadecane.sdf';
import hydrocarbonMoleculeUrl020 from './molecules/sdf/icosane.sdf';
import hydrocarbonMoleculeUrl021 from './molecules/sdf/heneicosane.sdf';
import hydrocarbonMoleculeUrl022 from './molecules/sdf/docosane.sdf';
import hydrocarbonMoleculeUrl023 from './molecules/sdf/tricosane.sdf';
import hydrocarbonMoleculeUrl024 from './molecules/sdf/tetracosane.sdf';
import hydrocarbonMoleculeUrl101 from './molecules/xyz/benzene.xyz';

import drugMoleculeUrl001 from './molecules/pdb/aspirin.pdb';
import drugMoleculeUrl002 from './molecules/sdf/ibuprofen.sdf';
import drugMoleculeUrl003 from './molecules/sdf/paxlovid.sdf';
import drugMoleculeUrl004 from './molecules/pcj/caffeine.pcj';
import drugMoleculeUrl005 from './molecules/sdf/thioketal_haloperidol.sdf';
import drugMoleculeUrl006 from './molecules/sdf/vanillin.sdf';
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

import proteinUrl001 from './proteins/1crn.pdb';
import proteinUrl002 from './proteins/1a3n.pdb';
import proteinUrl003 from './proteins/1aid.pdb';
import proteinUrl004 from './proteins/7qo7.pdb';
import proteinUrl005 from './proteins/2fom.pdb';

export const monatomicMolecules = [
  { url: monatomicUrl001, internal: true, name: 'Helium' } as MoleculeData,
  { url: monatomicUrl002, internal: true, name: 'Neon' } as MoleculeData,
  { url: monatomicUrl003, internal: true, name: 'Argon' } as MoleculeData,
  { url: monatomicUrl004, internal: true, name: 'Krypton' } as MoleculeData,
  { url: monatomicUrl005, internal: true, name: 'Xenon' } as MoleculeData,
];

export const commonMolecules = [
  { url: commonMoleculeUrl001, internal: true, name: 'Dihydrogen' } as MoleculeData,
  { url: commonMoleculeUrl002, internal: true, name: 'Dioxygen' } as MoleculeData,
  { url: commonMoleculeUrl003, internal: true, name: 'Dinitrogen' } as MoleculeData,
  { url: commonMoleculeUrl004, internal: true, name: 'Water' } as MoleculeData,
  { url: commonMoleculeUrl005, internal: true, name: 'Carbon Dioxide' } as MoleculeData,
  { url: commonMoleculeUrl101, internal: true, name: 'Buckminsterfullerene' } as MoleculeData,
  { url: commonMoleculeUrl102, internal: true, name: 'Carbon Nanotube' } as MoleculeData,
  { url: commonMoleculeUrl201, internal: true, name: 'D-Glucose' } as MoleculeData,
  { url: commonMoleculeUrl202, internal: true, name: 'Cholesterol' } as MoleculeData,
  { url: commonMoleculeUrl203, internal: true, name: 'ATP' } as MoleculeData,
  { url: commonMoleculeUrl204, internal: true, name: 'Ethanol' } as MoleculeData,
];

export const hydrocarbonMolecules = [
  { url: hydrocarbonMoleculeUrl001, internal: true, name: 'Methane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl002, internal: true, name: 'Ethane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl003, internal: true, name: 'Propane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl004, internal: true, name: 'Butane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl005, internal: true, name: 'Pentane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl006, internal: true, name: 'Hexane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl007, internal: true, name: 'Heptane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl008, internal: true, name: 'Octane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl009, internal: true, name: 'Nonane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl010, internal: true, name: 'Decane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl011, internal: true, name: 'Undecane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl012, internal: true, name: 'Dodecane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl013, internal: true, name: 'Tridecane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl014, internal: true, name: 'Tetradecane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl015, internal: true, name: 'Pentadecane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl016, internal: true, name: 'Hexadecane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl017, internal: true, name: 'Heptadecane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl018, internal: true, name: 'Octadecane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl019, internal: true, name: 'Nonadecane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl020, internal: true, name: 'Icosane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl021, internal: true, name: 'Heneicosane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl022, internal: true, name: 'Docosane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl023, internal: true, name: 'Tricosane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl024, internal: true, name: 'Tetracosane' } as MoleculeData,
  { url: hydrocarbonMoleculeUrl101, internal: true, name: 'Benzene' } as MoleculeData,
];

export const drugMolecules = [
  { url: drugMoleculeUrl001, internal: true, name: 'Aspirin' } as MoleculeData,
  { url: drugMoleculeUrl002, internal: true, name: 'Ibuprofen' } as MoleculeData,
  { url: drugMoleculeUrl003, internal: true, name: 'Paxlovid' } as MoleculeData,
  { url: drugMoleculeUrl004, internal: true, name: 'Caffeine' } as MoleculeData,
  { url: drugMoleculeUrl005, internal: true, name: 'Thioketal Haloperidol' } as MoleculeData,
  { url: drugMoleculeUrl006, internal: true, name: 'Vanillin' } as MoleculeData,
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
].sort((a, b) => a.name.localeCompare(b.name));

export const targetProteins = [
  { url: proteinUrl001, internal: true, name: 'Crambin' } as MoleculeData,
  { url: proteinUrl002, internal: true, name: 'Hemoglobin' } as MoleculeData,
  { url: proteinUrl003, internal: true, name: 'HIV-1 Protease' } as MoleculeData,
  { url: proteinUrl004, internal: true, name: 'SARS-CoV-2 Omicron Spike' } as MoleculeData,
  { url: proteinUrl005, internal: true, name: 'Dengue Virus NS2B/NS3 Protease' } as MoleculeData,
].sort((a, b) => a.name.localeCompare(b.name));

export const getMolecule = (name: string) => {
  for (const m of monatomicMolecules) {
    if (name === m.name) return m;
  }
  for (const m of commonMolecules) {
    if (name === m.name) return m;
  }
  for (const m of hydrocarbonMolecules) {
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
