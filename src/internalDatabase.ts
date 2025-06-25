/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
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
import crystalUrl201 from './molecules/xyz/ice.xyz';

import commonMoleculeUrl001 from './molecules/sdf/dihydrogen.sdf';
import commonMoleculeUrl002 from './molecules/sdf/dioxygen.sdf';
import commonMoleculeUrl003 from './molecules/sdf/dinitrogen.sdf';
import commonMoleculeUrl004 from './molecules/sdf/water.sdf';
import commonMoleculeUrl005 from './molecules/sdf/carbon_dioxide.sdf';
import commonMoleculeUrl006 from './molecules/sdf/carbon_monoxide.sdf';
import commonMoleculeUrl007 from './molecules/sdf/ozone.sdf';
import commonMoleculeUrl008 from './molecules/sdf/ammonia.sdf';
import commonMoleculeUrl009 from './molecules/sdf/hydrogen_peroxide.sdf';
import commonMoleculeUrl010 from './molecules/sdf/acetic_acid.sdf';
import commonMoleculeUrl011 from './molecules/sdf/1-octanol.sdf';
import commonMoleculeUrl012 from './molecules/sdf/2-octanol.sdf';
import commonMoleculeUrl013 from './molecules/sdf/2-ethylhexanol.sdf';
import commonMoleculeUrl014 from './molecules/sdf/3-octanol.sdf';
import commonMoleculeUrl015 from './molecules/sdf/dibutyl_ether.sdf';
import commonMoleculeUrl016 from './molecules/sdf/di-tert-butyl_ether.sdf';
import commonMoleculeUrl017 from './molecules/sdf/r-mecoprop.sdf';
import commonMoleculeUrl018 from './molecules/sdf/s-mecoprop.sdf';
import commonMoleculeUrl101 from './molecules/sdf/buckyball.sdf';
import commonMoleculeUrl102 from './molecules/xyz/nanotube.xyz';
import commonMoleculeUrl103 from './molecules/xyz/graphen.xyz';
import commonMoleculeUrl201 from './molecules/sdf/d_glucose.sdf';
import commonMoleculeUrl202 from './molecules/sdf/ethanol.sdf';
import commonMoleculeUrl203 from './molecules/sdf/urea.sdf';
import commonMoleculeUrl301 from './molecules/sdf/ethylamine.sdf';
import commonMoleculeUrl302 from './molecules/sdf/ethanal.sdf';
import commonMoleculeUrl303 from './molecules/sdf/ethanoic_acid.sdf';
import commonMoleculeUrl304 from './molecules/sdf/ethyl_acetate.sdf';
import commonMoleculeUrl305 from './molecules/sdf/acetamide.sdf';
import commonMoleculeUrl307 from './molecules/sdf/propanol.sdf';
import commonMoleculeUrl308 from './molecules/sdf/propylamine.sdf';
import commonMoleculeUrl309 from './molecules/sdf/propanal.sdf';
import commonMoleculeUrl310 from './molecules/sdf/propanone.sdf';
import commonMoleculeUrl311 from './molecules/sdf/propanoic_acid.sdf';
import commonMoleculeUrl312 from './molecules/sdf/methyl_propanoate.sdf';
import commonMoleculeUrl313 from './molecules/sdf/propanamide.sdf';
import commonMoleculeUrl314 from './molecules/sdf/butanol.sdf';
import commonMoleculeUrl315 from './molecules/sdf/butanamine.sdf';
import commonMoleculeUrl316 from './molecules/sdf/butanal.sdf';
import commonMoleculeUrl317 from './molecules/sdf/butanone.sdf';
import commonMoleculeUrl318 from './molecules/sdf/butanoic_acid.sdf';
import commonMoleculeUrl319 from './molecules/sdf/methy_butanoate.sdf';
import commonMoleculeUrl320 from './molecules/sdf/butanamide.sdf';
import commonMoleculeUrl321 from './molecules/sdf/ethanamine.sdf';
import commonMoleculeUrl322 from './molecules/sdf/methoxymethane.sdf';

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
import hydrocarbonMoleculeUrl103 from './molecules/sdf/cyclopropane.sdf';
import hydrocarbonMoleculeUrl104 from './molecules/sdf/cyclobutane.sdf';
import hydrocarbonMoleculeUrl105 from './molecules/sdf/cyclopentane.sdf';
import hydrocarbonMoleculeUrl106 from './molecules/sdf/cyclohexane.sdf';
import hydrocarbonMoleculeUrl107 from './molecules/sdf/cycloheptane.sdf';
import hydrocarbonMoleculeUrl108 from './molecules/sdf/cyclooctane.sdf';
import hydrocarbonMoleculeUrl109 from './molecules/sdf/cyclononane.sdf';
import hydrocarbonMoleculeUrl110 from './molecules/sdf/cyclodecane.sdf';
import hydrocarbonMoleculeUrl111 from './molecules/sdf/cycloundecane.sdf';
import hydrocarbonMoleculeUrl112 from './molecules/sdf/cyclododecane.sdf';
import hydrocarbonMoleculeUrl113 from './molecules/sdf/cyclotridecane.sdf';
import hydrocarbonMoleculeUrl114 from './molecules/sdf/cyclotetradecane.sdf';
import hydrocarbonMoleculeUrl115 from './molecules/sdf/cyclopentadecane.sdf';
import hydrocarbonMoleculeUrl201 from './molecules/sdf/ethylene.sdf';
import hydrocarbonMoleculeUrl202 from './molecules/sdf/propylene.sdf';
import hydrocarbonMoleculeUrl203 from './molecules/sdf/cis-2-butene.sdf';
import hydrocarbonMoleculeUrl204 from './molecules/sdf/trans-2-butene.sdf';
import hydrocarbonMoleculeUrl205 from './molecules/sdf/propyne.sdf';
import hydrocarbonMoleculeUrl251 from './molecules/sdf/acetylene.sdf';
import hydrocarbonMoleculeUrl301 from './molecules/sdf/benzene.sdf';
import hydrocarbonMoleculeUrl302 from './molecules/sdf/biphenyl.sdf';
import hydrocarbonMoleculeUrl303 from './molecules/sdf/toluene.sdf';
import hydrocarbonMoleculeUrl304 from './molecules/sdf/durene.sdf';
import hydrocarbonMoleculeUrl309 from './molecules/sdf/coronene.sdf';
import hydrocarbonMoleculeUrl310 from './molecules/sdf/hexabenzocoronene.sdf';
import hydrocarbonMoleculeUrl351 from './molecules/sdf/anthracene.sdf';
import hydrocarbonMoleculeUrl352 from './molecules/sdf/tetracene.sdf';
import hydrocarbonMoleculeUrl353 from './molecules/sdf/pentacene.sdf';
import hydrocarbonMoleculeUrl354 from './molecules/sdf/hexacene.sdf';
import hydrocarbonMoleculeUrl355 from './molecules/sdf/heptacene.sdf';
import hydrocarbonMoleculeUrl356 from './molecules/sdf/octacene.sdf';
import hydrocarbonMoleculeUrl357 from './molecules/sdf/nonacene.sdf';
import hydrocarbonMoleculeUrl358 from './molecules/sdf/naphthalene.sdf';

import biomoleculeUrl001 from './molecules/sdf/atp.sdf';
import biomoleculeUrl002 from './molecules/sdf/vitamin_a.sdf';
import biomoleculeUrl003 from './molecules/sdf/vitamin_c.sdf';
import biomoleculeUrl004 from './molecules/sdf/vitamin_d.sdf';
import biomoleculeUrl005 from './molecules/sdf/citric_acid.sdf';
import biomoleculeUrl006 from './molecules/sdf/ethinylestradiol.sdf';
import biomoleculeUrl007 from './molecules/sdf/estradiol.sdf';
import biomoleculeUrl008 from './molecules/sdf/estriol.sdf';
import biomoleculeUrl009 from './molecules/sdf/estrone.sdf';
import biomoleculeUrl010 from './molecules/sdf/progesterone.sdf';
import biomoleculeUrl011 from './molecules/sdf/testosterone.sdf';
import biomoleculeUrl101 from './molecules/pdb/cholesterol.pdb';
import biomoleculeUrl102 from './molecules/sdf/oleic_acid.sdf';
import biomoleculeUrl103 from './molecules/sdf/stearic_acid.sdf';
import biomoleculeUrl104 from './molecules/sdf/elaidic_acid.sdf';
import biomoleculeUrl105 from './molecules/sdf/fumaric_acid.sdf';
import biomoleculeUrl106 from './molecules/sdf/maleic_acid.sdf';
import biomoleculeUrl201 from './molecules/sdf/adenine.sdf';
import biomoleculeUrl202 from './molecules/sdf/cytosine.sdf';
import biomoleculeUrl203 from './molecules/sdf/guanine.sdf';
import biomoleculeUrl204 from './molecules/sdf/thymine.sdf';
import biomoleculeUrl205 from './molecules/sdf/uracil.sdf';
import biomoleculeUrl211 from './molecules/pdb/dna.pdb';
import biomoleculeUrl301 from './molecules/sdf/alanine.sdf';
import biomoleculeUrl302 from './molecules/sdf/arginine.sdf';
import biomoleculeUrl303 from './molecules/sdf/asparagine.sdf';
import biomoleculeUrl304 from './molecules/sdf/aspartic_acid.sdf';
import biomoleculeUrl305 from './molecules/sdf/cysteine.sdf';
import biomoleculeUrl306 from './molecules/sdf/glutamic_acid.sdf';
import biomoleculeUrl307 from './molecules/sdf/glutamine.sdf';
import biomoleculeUrl308 from './molecules/sdf/glycine.sdf';
import biomoleculeUrl309 from './molecules/sdf/histidine.sdf';
import biomoleculeUrl310 from './molecules/sdf/isoleucine.sdf';
import biomoleculeUrl311 from './molecules/sdf/leucine.sdf';
import biomoleculeUrl312 from './molecules/sdf/lysine.sdf';
import biomoleculeUrl313 from './molecules/sdf/methionine.sdf';
import biomoleculeUrl314 from './molecules/sdf/phenylalanine.sdf';
import biomoleculeUrl315 from './molecules/sdf/proline.sdf';
import biomoleculeUrl316 from './molecules/sdf/pyrrolysine.sdf';
import biomoleculeUrl317 from './molecules/sdf/selenocysteine.sdf';
import biomoleculeUrl318 from './molecules/sdf/serine.sdf';
import biomoleculeUrl319 from './molecules/sdf/threonine.sdf';
import biomoleculeUrl320 from './molecules/sdf/tryptophan.sdf';
import biomoleculeUrl321 from './molecules/sdf/tyrosine.sdf';
import biomoleculeUrl322 from './molecules/sdf/valine.sdf';
import biomoleculeUrl331 from './molecules/pdb/alphahelix.pdb';
import biomoleculeUrl332 from './molecules/pdb/betasheet.pdb';
import biomoleculeUrl341 from './molecules/sdf/acesulfame_potassium.sdf';
import biomoleculeUrl342 from './molecules/sdf/aspartame.sdf';
import biomoleculeUrl343 from './molecules/sdf/erythritol.sdf';
import biomoleculeUrl344 from './molecules/sdf/lactose.sdf';
import biomoleculeUrl345 from './molecules/sdf/maltose.sdf';
import biomoleculeUrl346 from './molecules/sdf/mannitol.sdf';
import biomoleculeUrl347 from './molecules/sdf/saccharin.sdf';
import biomoleculeUrl348 from './molecules/sdf/sorbitol.sdf';
import biomoleculeUrl349 from './molecules/sdf/sucralose.sdf';
import biomoleculeUrl350 from './molecules/sdf/xylitol.sdf';
import biomoleculeUrl351 from './molecules/sdf/neotame.sdf';
import biomoleculeUrl352 from './molecules/sdf/fructose.sdf';

import drugMoleculeUrl001 from './molecules/pdb/aspirin.pdb';
import drugMoleculeUrl002 from './molecules/sdf/ibuprofen.sdf';
import drugMoleculeUrl003 from './molecules/sdf/paxlovid.sdf';
import drugMoleculeUrl004 from './molecules/sdf/caffeine.sdf';
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
import drugMoleculeUrl021 from './molecules/sdf/molnupiravir.sdf';
import drugMoleculeUrl022 from './molecules/sdf/oseltamivir.sdf';
import drugMoleculeUrl023 from './molecules/sdf/artemisinin.sdf';
import drugMoleculeUrl024 from './molecules/sdf/umifenovir.sdf';
import drugMoleculeUrl025 from './molecules/sdf/paracetamol.sdf';
import drugMoleculeUrl026 from './molecules/sdf/chlorpheniramine.sdf';
import drugMoleculeUrl027 from './molecules/sdf/geldanamycin.sdf';
import drugMoleculeUrl028 from './molecules/sdf/herbimycin.sdf';
import drugMoleculeUrl029 from './molecules/sdf/rifaximin.sdf';
import drugMoleculeUrl030 from './molecules/sdf/rifampicin.sdf';
import drugMoleculeUrl031 from './molecules/sdf/rifamycin_sv.sdf';
import drugMoleculeUrl032 from './molecules/sdf/rifamycin_b.sdf';
import drugMoleculeUrl033 from './molecules/sdf/rifamycin_s.sdf';
import drugMoleculeUrl034 from './molecules/sdf/rifamide.sdf';
import drugMoleculeUrl035 from './molecules/sdf/rifapentine.sdf';
import drugMoleculeUrl036 from './molecules/sdf/rifabutin.sdf';
import drugMoleculeUrl037 from './molecules/sdf/progeldanamycin.sdf';
import drugMoleculeUrl038 from './molecules/sdf/erythromycin.sdf';
import drugMoleculeUrl039 from './molecules/sdf/clarithromycin.sdf';
import drugMoleculeUrl040 from './molecules/sdf/roxithromycin.sdf';
import drugMoleculeUrl041 from './molecules/sdf/sirolimus.sdf';
import drugMoleculeUrl042 from './molecules/sdf/azithromycin.sdf';
import drugMoleculeUrl043 from './molecules/sdf/spiramycin.sdf';
import drugMoleculeUrl044 from './molecules/sdf/carbomycin.sdf';
import drugMoleculeUrl045 from './molecules/sdf/fidaxomicin.sdf';
import drugMoleculeUrl046 from './molecules/sdf/telithromycin.sdf';
import drugMoleculeUrl047 from './molecules/sdf/doxycycline.sdf';
import drugMoleculeUrl048 from './molecules/sdf/ceftazidime.sdf';
import drugMoleculeUrl049 from './molecules/sdf/cefotaxime.sdf';
import drugMoleculeUrl050 from './molecules/sdf/ciprofloxacin.sdf';
import drugMoleculeUrl051 from './molecules/sdf/oxytetracycline.sdf';
import drugMoleculeUrl052 from './molecules/sdf/carbamazepine.sdf';
import drugMoleculeUrl053 from './molecules/sdf/citalopram.sdf';
import drugMoleculeUrl054 from './molecules/sdf/diclofenac.sdf';
import drugMoleculeUrl055 from './molecules/sdf/diphenhydramine.sdf';
import drugMoleculeUrl056 from './molecules/sdf/fluoxetine.sdf';
import drugMoleculeUrl057 from './molecules/sdf/sulfamethoxazole.sdf';
import drugMoleculeUrl058 from './molecules/sdf/trimethoprim.sdf';

import proteinUrl001 from './proteins/1crn.pdb';
import proteinUrl002 from './proteins/1a3n.pdb';
import proteinUrl003 from './proteins/1aid.pdb';
import proteinUrl004 from './proteins/7qo7.pdb';
import proteinUrl005 from './proteins/2fom.pdb';

import { MolecularProperties } from './models/MolecularProperties.ts';
import { distance } from 'fastest-levenshtein';
import { ChemicalNotation } from './constants.ts';

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
  { url: crystalUrl201, internal: true, name: 'Ice' } as MoleculeInterface,
];

export const commonMolecules = [
  { url: commonMoleculeUrl001, internal: true, name: 'Dihydrogen' } as MoleculeInterface,
  { url: commonMoleculeUrl002, internal: true, name: 'Dioxygen' } as MoleculeInterface,
  { url: commonMoleculeUrl003, internal: true, name: 'Dinitrogen' } as MoleculeInterface,
  { url: commonMoleculeUrl004, internal: true, name: 'Water' } as MoleculeInterface,
  { url: commonMoleculeUrl005, internal: true, name: 'Carbon Dioxide' } as MoleculeInterface,
  { url: commonMoleculeUrl006, internal: true, name: 'Carbon Monoxide' } as MoleculeInterface,
  { url: commonMoleculeUrl007, internal: true, name: 'Ozone' } as MoleculeInterface,
  { url: commonMoleculeUrl008, internal: true, name: 'Ammonia' } as MoleculeInterface,
  { url: commonMoleculeUrl009, internal: true, name: 'Hydrogen Peroxide' } as MoleculeInterface,
  { url: commonMoleculeUrl010, internal: true, name: 'Acetic Acid' } as MoleculeInterface,
  { url: commonMoleculeUrl011, internal: true, name: '1-Octanol' } as MoleculeInterface,
  { url: commonMoleculeUrl012, internal: true, name: '2-Octanol' } as MoleculeInterface,
  { url: commonMoleculeUrl013, internal: true, name: '2-Ethylhexanol' } as MoleculeInterface,
  { url: commonMoleculeUrl014, internal: true, name: '3-Octanol' } as MoleculeInterface,
  { url: commonMoleculeUrl015, internal: true, name: 'Dibutyl Ether' } as MoleculeInterface,
  { url: commonMoleculeUrl016, internal: true, name: 'Di-tert-butyl Ether' } as MoleculeInterface,
  { url: commonMoleculeUrl017, internal: true, name: '(R)-Mecoprop' } as MoleculeInterface,
  { url: commonMoleculeUrl018, internal: true, name: '(S)-Mecoprop' } as MoleculeInterface,
  { url: commonMoleculeUrl101, internal: true, name: 'Buckminsterfullerene' } as MoleculeInterface,
  { url: commonMoleculeUrl102, internal: true, name: 'Carbon Nanotube' } as MoleculeInterface,
  { url: commonMoleculeUrl103, internal: true, name: 'Graphene' } as MoleculeInterface,
  { url: commonMoleculeUrl201, internal: true, name: 'D-Glucose' } as MoleculeInterface,
  { url: commonMoleculeUrl202, internal: true, name: 'Ethanol' } as MoleculeInterface,
  { url: commonMoleculeUrl203, internal: true, name: 'Urea' } as MoleculeInterface,
  { url: commonMoleculeUrl301, internal: true, name: 'Ethylamine' } as MoleculeInterface,
  { url: commonMoleculeUrl302, internal: true, name: 'Ethanal' } as MoleculeInterface,
  { url: commonMoleculeUrl303, internal: true, name: 'Ethanoic Acid' } as MoleculeInterface,
  { url: commonMoleculeUrl304, internal: true, name: 'Ethyl Acetate' } as MoleculeInterface,
  { url: commonMoleculeUrl305, internal: true, name: 'Acetamide' } as MoleculeInterface,
  { url: commonMoleculeUrl307, internal: true, name: 'Propanol' } as MoleculeInterface,
  { url: commonMoleculeUrl308, internal: true, name: 'Propylamine' } as MoleculeInterface,
  { url: commonMoleculeUrl309, internal: true, name: 'Propanal' } as MoleculeInterface,
  { url: commonMoleculeUrl310, internal: true, name: 'Propanone' } as MoleculeInterface,
  { url: commonMoleculeUrl311, internal: true, name: 'Propanoic Acid' } as MoleculeInterface,
  { url: commonMoleculeUrl312, internal: true, name: 'Methyl Propanoate' } as MoleculeInterface,
  { url: commonMoleculeUrl313, internal: true, name: 'Propanamide' } as MoleculeInterface,
  { url: commonMoleculeUrl314, internal: true, name: 'Butanol' } as MoleculeInterface,
  { url: commonMoleculeUrl315, internal: true, name: 'Butanamine' } as MoleculeInterface,
  { url: commonMoleculeUrl316, internal: true, name: 'Butanal' } as MoleculeInterface,
  { url: commonMoleculeUrl317, internal: true, name: 'Butanone' } as MoleculeInterface,
  { url: commonMoleculeUrl318, internal: true, name: 'Butanoic Acid' } as MoleculeInterface,
  { url: commonMoleculeUrl319, internal: true, name: 'Methyl Butanoate' } as MoleculeInterface,
  { url: commonMoleculeUrl320, internal: true, name: 'Butanamide' } as MoleculeInterface,
  { url: commonMoleculeUrl321, internal: true, name: 'Ethanamine' } as MoleculeInterface,
  { url: commonMoleculeUrl322, internal: true, name: 'Methoxymethane' } as MoleculeInterface,
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
  { url: hydrocarbonMoleculeUrl103, internal: true, name: 'Cyclopropane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl104, internal: true, name: 'Cyclobutane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl105, internal: true, name: 'Cyclopentane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl106, internal: true, name: 'Cyclohexane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl107, internal: true, name: 'Cycloheptane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl108, internal: true, name: 'Cyclooctane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl109, internal: true, name: 'Cyclononane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl110, internal: true, name: 'Cyclodecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl111, internal: true, name: 'Cycloundecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl112, internal: true, name: 'Cyclododecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl113, internal: true, name: 'Cyclotridecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl114, internal: true, name: 'Cyclotetradecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl115, internal: true, name: 'Cyclopentadecane' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl201, internal: true, name: 'Ethylene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl202, internal: true, name: 'Propylene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl203, internal: true, name: 'cis-2-Butene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl204, internal: true, name: 'trans-2-Butene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl205, internal: true, name: 'Propyne' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl251, internal: true, name: 'Acetylene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl301, internal: true, name: 'Benzene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl358, internal: true, name: 'Naphthalene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl302, internal: true, name: 'Biphenyl' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl303, internal: true, name: 'Toluene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl304, internal: true, name: 'Durene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl309, internal: true, name: 'Coronene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl310, internal: true, name: 'Hexabenzocoronene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl351, internal: true, name: 'Anthracene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl352, internal: true, name: 'Tetracene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl353, internal: true, name: 'Pentacene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl354, internal: true, name: 'Hexacene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl355, internal: true, name: 'Heptacene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl356, internal: true, name: 'Octacene' } as MoleculeInterface,
  { url: hydrocarbonMoleculeUrl357, internal: true, name: 'Nonacene' } as MoleculeInterface,
];

export const biomolecules = [
  { url: biomoleculeUrl001, internal: true, name: 'ATP' } as MoleculeInterface,
  { url: biomoleculeUrl002, internal: true, name: 'Vitamin A' } as MoleculeInterface,
  { url: biomoleculeUrl003, internal: true, name: 'Vitamin C' } as MoleculeInterface,
  { url: biomoleculeUrl004, internal: true, name: 'Vitamin D' } as MoleculeInterface,
  { url: biomoleculeUrl005, internal: true, name: 'Citric Acid' } as MoleculeInterface,
  { url: biomoleculeUrl006, internal: true, name: 'Ethinylestradiol' } as MoleculeInterface,
  { url: biomoleculeUrl007, internal: true, name: 'Estradiol' } as MoleculeInterface,
  { url: biomoleculeUrl008, internal: true, name: 'Estriol' } as MoleculeInterface,
  { url: biomoleculeUrl009, internal: true, name: 'Estrone' } as MoleculeInterface,
  { url: biomoleculeUrl010, internal: true, name: 'Progesterone' } as MoleculeInterface,
  { url: biomoleculeUrl011, internal: true, name: 'Testosterone' } as MoleculeInterface,
  { url: biomoleculeUrl101, internal: true, name: 'Cholesterol' } as MoleculeInterface,
  { url: biomoleculeUrl102, internal: true, name: 'Oleic Acid' } as MoleculeInterface,
  { url: biomoleculeUrl103, internal: true, name: 'Stearic Acid' } as MoleculeInterface,
  { url: biomoleculeUrl104, internal: true, name: 'Elaidic Acid' } as MoleculeInterface,
  { url: biomoleculeUrl105, internal: true, name: 'Fumaric Acid' } as MoleculeInterface,
  { url: biomoleculeUrl106, internal: true, name: 'Maleic Acid' } as MoleculeInterface,
  { url: biomoleculeUrl201, internal: true, name: 'Adenine' } as MoleculeInterface,
  { url: biomoleculeUrl202, internal: true, name: 'Cytosine' } as MoleculeInterface,
  { url: biomoleculeUrl203, internal: true, name: 'Guanine' } as MoleculeInterface,
  { url: biomoleculeUrl204, internal: true, name: 'Thymine' } as MoleculeInterface,
  { url: biomoleculeUrl205, internal: true, name: 'Uracil' } as MoleculeInterface,
  { url: biomoleculeUrl211, internal: true, name: 'DNA' } as MoleculeInterface,
  { url: biomoleculeUrl301, internal: true, name: 'Alanine' } as MoleculeInterface,
  { url: biomoleculeUrl302, internal: true, name: 'Arginine' } as MoleculeInterface,
  { url: biomoleculeUrl303, internal: true, name: 'Asparagine' } as MoleculeInterface,
  { url: biomoleculeUrl304, internal: true, name: 'Aspartic Acid' } as MoleculeInterface,
  { url: biomoleculeUrl305, internal: true, name: 'Cysteine' } as MoleculeInterface,
  { url: biomoleculeUrl306, internal: true, name: 'Glutamic Acid' } as MoleculeInterface,
  { url: biomoleculeUrl307, internal: true, name: 'Glutamine' } as MoleculeInterface,
  { url: biomoleculeUrl308, internal: true, name: 'Glycine' } as MoleculeInterface,
  { url: biomoleculeUrl309, internal: true, name: 'Histidine' } as MoleculeInterface,
  { url: biomoleculeUrl310, internal: true, name: 'Isoleucine' } as MoleculeInterface,
  { url: biomoleculeUrl311, internal: true, name: 'Leucine' } as MoleculeInterface,
  { url: biomoleculeUrl312, internal: true, name: 'Lysine' } as MoleculeInterface,
  { url: biomoleculeUrl313, internal: true, name: 'Methionine' } as MoleculeInterface,
  { url: biomoleculeUrl314, internal: true, name: 'Phenylalanine' } as MoleculeInterface,
  { url: biomoleculeUrl315, internal: true, name: 'Proline' } as MoleculeInterface,
  { url: biomoleculeUrl316, internal: true, name: 'Pyrrolysine' } as MoleculeInterface,
  { url: biomoleculeUrl317, internal: true, name: 'Selenocysteine' } as MoleculeInterface,
  { url: biomoleculeUrl318, internal: true, name: 'Serine' } as MoleculeInterface,
  { url: biomoleculeUrl319, internal: true, name: 'Threonine' } as MoleculeInterface,
  { url: biomoleculeUrl320, internal: true, name: 'Tryptophan' } as MoleculeInterface,
  { url: biomoleculeUrl321, internal: true, name: 'Tyrosine' } as MoleculeInterface,
  { url: biomoleculeUrl322, internal: true, name: 'Valine' } as MoleculeInterface,
  { url: biomoleculeUrl331, internal: true, name: 'Alpha Helix' } as MoleculeInterface,
  { url: biomoleculeUrl332, internal: true, name: 'Beta Sheet' } as MoleculeInterface,
  { url: biomoleculeUrl341, internal: true, name: 'Acesulfame Potassium' } as MoleculeInterface,
  { url: biomoleculeUrl342, internal: true, name: 'Aspartame' } as MoleculeInterface,
  { url: biomoleculeUrl343, internal: true, name: 'Erythritol' } as MoleculeInterface,
  { url: biomoleculeUrl344, internal: true, name: 'Lactose' } as MoleculeInterface,
  { url: biomoleculeUrl345, internal: true, name: 'Maltose' } as MoleculeInterface,
  { url: biomoleculeUrl346, internal: true, name: 'Mannitol' } as MoleculeInterface,
  { url: biomoleculeUrl347, internal: true, name: 'Saccharin' } as MoleculeInterface,
  { url: biomoleculeUrl348, internal: true, name: 'Sorbitol' } as MoleculeInterface,
  { url: biomoleculeUrl349, internal: true, name: 'Sucralose' } as MoleculeInterface,
  { url: biomoleculeUrl350, internal: true, name: 'Xylitol' } as MoleculeInterface,
  { url: biomoleculeUrl351, internal: true, name: 'Neotame' } as MoleculeInterface,
  { url: biomoleculeUrl352, internal: true, name: 'Fructose' } as MoleculeInterface,
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
  { url: drugMoleculeUrl021, internal: true, name: 'Molnupiravir' } as MoleculeInterface,
  { url: drugMoleculeUrl022, internal: true, name: 'Oseltamivir' } as MoleculeInterface,
  { url: drugMoleculeUrl023, internal: true, name: 'Artemisinin' } as MoleculeInterface,
  { url: drugMoleculeUrl024, internal: true, name: 'Umifenovir' } as MoleculeInterface,
  { url: drugMoleculeUrl025, internal: true, name: 'Paracetamol' } as MoleculeInterface,
  { url: drugMoleculeUrl026, internal: true, name: 'Chlorpheniramine' } as MoleculeInterface,
  { url: drugMoleculeUrl027, internal: true, name: 'Geldanamycin' } as MoleculeInterface,
  { url: drugMoleculeUrl028, internal: true, name: 'Herbimycin' } as MoleculeInterface,
  { url: drugMoleculeUrl029, internal: true, name: 'Rifaximin' } as MoleculeInterface,
  { url: drugMoleculeUrl030, internal: true, name: 'Rifampicin' } as MoleculeInterface,
  { url: drugMoleculeUrl031, internal: true, name: 'Rifamycin SV' } as MoleculeInterface,
  { url: drugMoleculeUrl032, internal: true, name: 'Rifamycin B' } as MoleculeInterface,
  { url: drugMoleculeUrl033, internal: true, name: 'Rifamycin S' } as MoleculeInterface,
  { url: drugMoleculeUrl034, internal: true, name: 'Rifamide' } as MoleculeInterface,
  { url: drugMoleculeUrl035, internal: true, name: 'Rifapentine' } as MoleculeInterface,
  { url: drugMoleculeUrl036, internal: true, name: 'Rifabutin' } as MoleculeInterface,
  { url: drugMoleculeUrl037, internal: true, name: 'Progeldanamycin' } as MoleculeInterface,
  { url: drugMoleculeUrl038, internal: true, name: 'Erythromycin' } as MoleculeInterface,
  { url: drugMoleculeUrl039, internal: true, name: 'Clarithromycin' } as MoleculeInterface,
  { url: drugMoleculeUrl040, internal: true, name: 'Roxithromycin' } as MoleculeInterface,
  { url: drugMoleculeUrl041, internal: true, name: 'Sirolimus' } as MoleculeInterface,
  { url: drugMoleculeUrl042, internal: true, name: 'Azithromycin' } as MoleculeInterface,
  { url: drugMoleculeUrl043, internal: true, name: 'Spiramycin' } as MoleculeInterface,
  { url: drugMoleculeUrl044, internal: true, name: 'Carbomycin' } as MoleculeInterface,
  { url: drugMoleculeUrl045, internal: true, name: 'Fidaxomicin' } as MoleculeInterface,
  { url: drugMoleculeUrl046, internal: true, name: 'Telithromycin' } as MoleculeInterface,
  { url: drugMoleculeUrl047, internal: true, name: 'Doxycycline' } as MoleculeInterface,
  { url: drugMoleculeUrl048, internal: true, name: 'Ceftazidime' } as MoleculeInterface,
  { url: drugMoleculeUrl049, internal: true, name: 'Cefotaxime' } as MoleculeInterface,
  { url: drugMoleculeUrl050, internal: true, name: 'Ciprofloxacin' } as MoleculeInterface,
  { url: drugMoleculeUrl051, internal: true, name: 'Oxytetracycline' } as MoleculeInterface,
  { url: drugMoleculeUrl052, internal: true, name: 'Carbamazepine' } as MoleculeInterface,
  { url: drugMoleculeUrl053, internal: true, name: 'Citalopram' } as MoleculeInterface,
  { url: drugMoleculeUrl054, internal: true, name: 'Diclofenac' } as MoleculeInterface,
  { url: drugMoleculeUrl055, internal: true, name: 'Diphenhydramine' } as MoleculeInterface,
  { url: drugMoleculeUrl056, internal: true, name: 'Fluoxetine' } as MoleculeInterface,
  { url: drugMoleculeUrl057, internal: true, name: 'Sulfamethoxazole' } as MoleculeInterface,
  { url: drugMoleculeUrl058, internal: true, name: 'Trimethoprim' } as MoleculeInterface,
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

export const findSimilarMolecules = (
  type: ChemicalNotation,
  numberOfMostSimilarMolecules: number,
  molecule: MoleculeInterface,
  excludedMolecules: MoleculeInterface[],
  molecularProperties: { [key: string]: MolecularProperties },
): { name: string; formula: string; distance: number }[] => {
  const prop = molecularProperties[molecule.name];
  const selectedNames: { name: string; formula: string; distance: number }[] = [];
  switch (type) {
    case ChemicalNotation.SMILES: {
      const threshold = prop.heavyAtomCount * 2;
      for (const [key, value] of Object.entries(molecularProperties)) {
        if (key === molecule.name || !value.smiles) continue;
        let excluded = false;
        for (const m of excludedMolecules) {
          if (m.name === key) excluded = true;
        }
        if (excluded) continue;
        const d = distance(value.smiles, prop.smiles);
        if (d <= threshold) {
          selectedNames.push({ name: key, formula: value.formula, distance: d });
        }
      }
      break;
    }
    case ChemicalNotation.INCHI: {
      const threshold = prop.heavyAtomCount * 5;
      for (const [key, value] of Object.entries(molecularProperties)) {
        if (key === molecule.name || !value.inChI) continue;
        let excluded = false;
        for (const m of excludedMolecules) {
          if (m.name === key) excluded = true;
        }
        if (excluded) continue;
        const d = distance(value.inChI, prop.inChI);
        if (d <= threshold) {
          selectedNames.push({ name: key, formula: value.formula, distance: d });
        }
      }
      break;
    }
  }
  selectedNames.sort((a, b) => a.distance - b.distance);
  return selectedNames.length > numberOfMostSimilarMolecules
    ? selectedNames.slice(0, numberOfMostSimilarMolecules)
    : selectedNames;
};
