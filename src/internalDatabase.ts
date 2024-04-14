/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MoleculeInterface } from './types';

import monatomicUrl001 from './molecules/pdb/helium.pdb';
import monatomicUrl002 from './molecules/pdb/neon.pdb';
import monatomicUrl003 from './molecules/pdb/argon.pdb';
import monatomicUrl004 from './molecules/pdb/krypton.pdb';
import monatomicUrl005 from './molecules/pdb/xenon.pdb';

import crystalUrl001 from './molecules/pdb/nacl.pdb';
import crystalUrl002 from './molecules/xyz/cscl.xyz';
import crystalUrl003 from './molecules/xyz/gold.xyz';
import crystalUrl004 from './molecules/xyz/silver.xyz';
import crystalUrl005 from './molecules/xyz/iron.xyz';
import crystalUrl101 from './molecules/pdb/zeolite.pdb';
import crystalUrl102 from './molecules/xyz/diamond.xyz';
import crystalUrl103 from './molecules/xyz/graphite.xyz';

import commonMoleculeUrl001 from './molecules/sdf/dihydrogen.sdf';
import commonMoleculeUrl002 from './molecules/sdf/dioxygen.sdf';
import commonMoleculeUrl003 from './molecules/sdf/dinitrogen.sdf';
import commonMoleculeUrl004 from './molecules/sdf/water.sdf';
import commonMoleculeUrl005 from './molecules/sdf/carbon_dioxide.sdf';
import commonMoleculeUrl006 from './molecules/sdf/ozone.sdf';
import commonMoleculeUrl101 from './molecules/pdb/buckyball.pdb';
import commonMoleculeUrl102 from './molecules/xyz/nanotube.xyz';
import commonMoleculeUrl103 from './molecules/xyz/graphen.xyz';
import commonMoleculeUrl201 from './molecules/xyz/d_glucose.xyz';
import commonMoleculeUrl202 from './molecules/sdf/ethanol.sdf';
import commonMoleculeUrl203 from './molecules/sdf/urea.sdf';

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

import biomoleculeUrl001 from './molecules/sdf/atp.sdf';
import biomoleculeUrl002 from './molecules/sdf/vitamin_a.sdf';
import biomoleculeUrl003 from './molecules/sdf/vitamin_c.sdf';
import biomoleculeUrl004 from './molecules/sdf/vitamin_d.sdf';
import biomoleculeUrl101 from './molecules/pdb/cholesterol.pdb';
import biomoleculeUrl102 from './molecules/sdf/oleic_acid.sdf';
import biomoleculeUrl103 from './molecules/sdf/stearic_acid.sdf';
import biomoleculeUrl104 from './molecules/sdf/elaidic_acid.sdf';
import biomoleculeUrl201 from './molecules/pdb/dna.pdb';
import biomoleculeUrl301 from './molecules/pdb/alphahelix.pdb';

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
  { url: monatomicUrl001, internal: true, name: 'Helium' } as MoleculeInterface,
  { url: monatomicUrl002, internal: true, name: 'Neon' } as MoleculeInterface,
  { url: monatomicUrl003, internal: true, name: 'Argon' } as MoleculeInterface,
  { url: monatomicUrl004, internal: true, name: 'Krypton' } as MoleculeInterface,
  { url: monatomicUrl005, internal: true, name: 'Xenon' } as MoleculeInterface,
];

export const crystals = [
  { url: crystalUrl001, internal: true, name: 'NaCl' } as MoleculeInterface,
  { url: crystalUrl002, internal: true, name: 'CsCl' } as MoleculeInterface,
  { url: crystalUrl003, internal: true, name: 'Gold' } as MoleculeInterface,
  { url: crystalUrl004, internal: true, name: 'Silver' } as MoleculeInterface,
  { url: crystalUrl005, internal: true, name: 'Iron' } as MoleculeInterface,
  { url: crystalUrl101, internal: true, name: 'Zeolite' } as MoleculeInterface,
  { url: crystalUrl102, internal: true, name: 'Diamond' } as MoleculeInterface,
  { url: crystalUrl103, internal: true, name: 'Graphite' } as MoleculeInterface,
];

export const commonMolecules = [
  { url: commonMoleculeUrl001, internal: true, name: 'Dihydrogen' } as MoleculeInterface,
  { url: commonMoleculeUrl002, internal: true, name: 'Dioxygen' } as MoleculeInterface,
  { url: commonMoleculeUrl003, internal: true, name: 'Dinitrogen' } as MoleculeInterface,
  { url: commonMoleculeUrl004, internal: true, name: 'Water' } as MoleculeInterface,
  { url: commonMoleculeUrl005, internal: true, name: 'Carbon Dioxide' } as MoleculeInterface,
  { url: commonMoleculeUrl006, internal: true, name: 'Ozone' } as MoleculeInterface,
  { url: commonMoleculeUrl101, internal: true, name: 'Buckminsterfullerene' } as MoleculeInterface,
  { url: commonMoleculeUrl102, internal: true, name: 'Carbon Nanotube' } as MoleculeInterface,
  { url: commonMoleculeUrl103, internal: true, name: 'Graphene' } as MoleculeInterface,
  { url: commonMoleculeUrl201, internal: true, name: 'D-Glucose' } as MoleculeInterface,
  { url: commonMoleculeUrl202, internal: true, name: 'Ethanol' } as MoleculeInterface,
  { url: commonMoleculeUrl203, internal: true, name: 'Urea' } as MoleculeInterface,
];

export const hydrocarbonMolecules = [
  { url: hydrocarbonMoleculeUrl001, internal: true, name: 'Methane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl002, internal: true, name: 'Ethane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl003, internal: true, name: 'Propane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl004, internal: true, name: 'Butane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl005, internal: true, name: 'Pentane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl006, internal: true, name: 'Hexane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl007, internal: true, name: 'Heptane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl008, internal: true, name: 'Octane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl009, internal: true, name: 'Nonane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl010, internal: true, name: 'Decane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl011, internal: true, name: 'Undecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl012, internal: true, name: 'Dodecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl013, internal: true, name: 'Tridecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl014, internal: true, name: 'Tetradecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl015, internal: true, name: 'Pentadecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl016, internal: true, name: 'Hexadecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl017, internal: true, name: 'Heptadecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl018, internal: true, name: 'Octadecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl019, internal: true, name: 'Nonadecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl020, internal: true, name: 'Icosane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl021, internal: true, name: 'Heneicosane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl022, internal: true, name: 'Docosane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl023, internal: true, name: 'Tricosane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl024, internal: true, name: 'Tetracosane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl101, internal: true, name: 'Benzene' } as MoleculeInterface,
];

export const biomolecules = [
  { url: biomoleculeUrl001, internal: true, name: 'ATP' } as MoleculeInterface,
  { url: biomoleculeUrl002, internal: true, name: 'Vitamin A' } as MoleculeInterface,
  { url: biomoleculeUrl003, internal: true, name: 'Vitamin C' } as MoleculeInterface,
  { url: biomoleculeUrl004, internal: true, name: 'Vitamin D' } as MoleculeInterface,
  { url: biomoleculeUrl101, internal: true, name: 'Cholesterol' } as MoleculeInterface,
  { url: biomoleculeUrl102, internal: true, name: 'Oleic Acid' } as MoleculeInterface,
  { url: biomoleculeUrl103, internal: true, name: 'Stearic Acid' } as MoleculeInterface,
  { url: biomoleculeUrl104, internal: true, name: 'Elaidic Acid' } as MoleculeInterface,
  { url: biomoleculeUrl201, internal: true, name: 'DNA' } as MoleculeInterface,
  { url: biomoleculeUrl301, internal: true, name: 'Alpha Helix' } as MoleculeInterface,
];

export const drugMolecules = [
  { url: drugMoleculeUrl001, internal: true, name: 'Aspirin' } as MoleculeInterface,
  { url: drugMoleculeUrl002, internal: true, name: 'Ibuprofen' } as MoleculeInterface,
  { url: drugMoleculeUrl003, internal: true, name: 'Paxlovid' } as MoleculeInterface,
  { url: drugMoleculeUrl004, internal: true, name: 'Caffeine' } as MoleculeInterface,
  { url: drugMoleculeUrl005, internal: true, name: 'Thioketal Haloperidol' } as MoleculeInterface,
  { url: drugMoleculeUrl006, internal: true, name: 'Vanillin' } as MoleculeInterface,
  { url: drugMoleculeUrl007, internal: true, name: 'Claritin' } as MoleculeInterface,
  { url: drugMoleculeUrl008, internal: true, name: 'Zyrtec' } as MoleculeInterface,
  { url: drugMoleculeUrl009, internal: true, name: 'Efaproxiral' } as MoleculeInterface,
  { url: drugMoleculeUrl010, internal: true, name: 'Penicillin G' } as MoleculeInterface,
  { url: drugMoleculeUrl011, internal: true, name: 'Voxelotor' } as MoleculeInterface,
  { url: drugMoleculeUrl012, internal: true, name: 'Morphine' } as MoleculeInterface,
  { url: drugMoleculeUrl013, internal: true, name: 'Ether' } as MoleculeInterface,
  { url: drugMoleculeUrl014, internal: true, name: 'Darunavir' } as MoleculeInterface,
  { url: drugMoleculeUrl015, internal: true, name: 'Viagra' } as MoleculeInterface,
  { url: drugMoleculeUrl016, internal: true, name: 'Nitroglycerin' } as MoleculeInterface,
  { url: drugMoleculeUrl017, internal: true, name: 'Thorazine' } as MoleculeInterface,
  { url: drugMoleculeUrl018, internal: true, name: 'Zidovudine' } as MoleculeInterface,
  { url: drugMoleculeUrl019, internal: true, name: 'Lipitor' } as MoleculeInterface,
  { url: drugMoleculeUrl020, internal: true, name: 'Metformin' } as MoleculeInterface,
].sort((a, b) => a.name.localeCompare(b.name));

export const targetProteins = [
  { url: proteinUrl001, internal: true, name: 'Crambin' } as MoleculeInterface,
  { url: proteinUrl002, internal: true, name: 'Hemoglobin' } as MoleculeInterface,
  { url: proteinUrl003, internal: true, name: 'HIV-1 Protease' } as MoleculeInterface,
  { url: proteinUrl004, internal: true, name: 'SARS-CoV-2 Omicron Spike' } as MoleculeInterface,
  { url: proteinUrl005, internal: true, name: 'Dengue Virus NS2B/NS3 Protease' } as MoleculeInterface,
].sort((a, b) => a.name.localeCompare(b.name));

export const getMolecule = (name: string) => {
  for (const m of monatomicMolecules) {
    if (name === m.name) return m;
  }
  for (const m of crystals) {
    if (name === m.name) return m;
  }
  for (const m of commonMolecules) {
    if (name === m.name) return m;
  }
  for (const m of hydrocarbonMolecules) {
    if (name === m.name) return m;
  }
  for (const m of biomolecules) {
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
