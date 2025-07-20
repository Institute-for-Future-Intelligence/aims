/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import { getData } from '../internalDatabase.ts';
import SDFParser from '../lib/io/parsers/SDFParser';
import CIFParser from '../lib/io/parsers/CIFParser';
import PDBParser from '../lib/io/parsers/PDBParser';
import PubChemParser from '../lib/io/parsers/PubChemParser';
import XYZParser from '../lib/io/parsers/XYZParser';
import MOL2Parser from '../lib/io/parsers/MOL2Parser';
import { MoleculeInterface } from '../types.ts';
import { useStore } from '../stores/common.ts';
import { MolecularProperties, MolecularStructure } from '../models/MolecularProperties.ts';
import { Molecule } from '../models/Molecule.ts';
import Complex from '../lib/chem/Complex';
import MoleculeJS from '../lib/chem/Molecule';
import Element from '../lib/chem/Element';
import AtomJS from '../lib/chem/Atom';
import { Atom } from '../models/Atom.ts';
import { ModelUtil } from '../models/ModelUtil.ts';
import { RadialBond } from '../models/RadialBond.ts';
import { VdwBond } from '../models/VdwBond.ts';
import { MolecularViewerStyle } from './displayOptions.ts';
import { Util } from '../Util.ts';
import { setMessage } from '../helpers.tsx';
import i18n from '../i18n/i18n.ts';

export const isCrystal = (name: string) => {
  return name === 'Gold' || name === 'Silver' || name === 'Iron' || name === 'NaCl' || name === 'CsCl';
};

export const isSkinny = (style: MolecularViewerStyle) => {
  return (
    style === MolecularViewerStyle.BallAndStick ||
    style === MolecularViewerStyle.Stick ||
    style === MolecularViewerStyle.Wireframe ||
    style === MolecularViewerStyle.Cartoon ||
    style === MolecularViewerStyle.Trace ||
    style === MolecularViewerStyle.Tube ||
    style === MolecularViewerStyle.AtomIndex
  );
};

export const isCartoon = (style: MolecularViewerStyle) => {
  return (
    style === MolecularViewerStyle.Cartoon ||
    style === MolecularViewerStyle.Trace ||
    style === MolecularViewerStyle.Tube
  );
};

export const generateVdwLines = (molecules: Molecule[], maximumRelativeDistanceSquared: number) => {
  const bonds: VdwBond[] = [];
  // intermolecular
  const n = molecules.length;
  for (let i = 0; i < n - 1; i++) {
    const mi = molecules[i];
    for (const ai of mi.atoms) {
      const ei = Element.getByName(ai.elementSymbol);
      for (let j = i + 1; j < n; j++) {
        if (j === i) continue;
        const mj = molecules[j];
        for (const aj of mj.atoms) {
          const ej = Element.getByName(aj.elementSymbol);
          const dij = ei.radius + ej.radius;
          if (ai.distanceToSquared(aj) < maximumRelativeDistanceSquared * dij * dij) {
            bonds.push(new VdwBond(ai, aj));
          }
        }
      }
    }
  }
  // intramolecular
  // for (const m of molecules) {
  //   const atoms = m.atoms;
  //   const n=atoms.length;
  //   for(let i=0;i<n-1;i++){
  //     const ei = Element.getByName(atoms[i].elementSymbol);
  //     for(let j=i+1;j<n;j++){
  //       const ej = Element.getByName(atoms[j].elementSymbol);
  //       const dij = ei.radius + ej.radius;
  //       if (atoms[i].distanceToSquared(atoms[j]) < maximumRelativeDistanceSquared * dij * dij) {
  //         bonds.push(new VdwBond(atoms[i], atoms[j]));
  //       }
  //     }
  //   }
  // }
  return bonds;
};

export const joinComplexes = (molecules: Molecule[], complexes: Complex[]) => {
  let complex;
  if (complexes.length === 1) {
    complex = complexes[0];
  } else {
    complex = new Complex();
    complex.joinComplexes(complexes);
  }
  let i = 0;
  for (const [idx, mol] of molecules.entries()) {
    for (const a of mol.atoms) {
      const at = complex._atoms[i++];
      at.position = a.position;
      at.temperature = ModelUtil.convertToTemperatureFactor(a.getKineticEnergy());
    }
    const c = complexes[idx];
    if (c) {
      for (const chain of c._chains) {
        chain._name = 'MOL' + idx;
      }
    }
    const molecule = new MoleculeJS(complex, mol.name, idx + 1);
    molecule.residues = complexes[idx].getResidues();
    complex._molecules.push(molecule);
  }
  complex.finalize({ needAutoBonding: false, detectAromaticLoops: false, enableEditing: false });
  return complex;
};

export const storeMoleculeData = (molecule: MoleculeInterface, atoms: Atom[], radialBonds: RadialBond[]) => {
  const properties = useStore.getState().getProvidedMolecularProperties(molecule.name);
  if (properties) {
    useStore.getState().setMolecularProperties(molecule.name, {
      atomCount: atoms.length,
      bondCount: radialBonds.length,
      molecularMass: properties.molecularMass,
      logP: properties.logP,
      hydrogenBondDonorCount: properties.hydrogenBondDonorCount,
      hydrogenBondAcceptorCount: properties.hydrogenBondAcceptorCount,
      rotatableBondCount: properties.rotatableBondCount,
      polarSurfaceArea: properties.polarSurfaceArea,
      heavyAtomCount: properties.heavyAtomCount,
      complexity: properties.complexity,
      density: properties.density,
      boilingPoint: properties.boilingPoint,
      meltingPoint: properties.meltingPoint,
      formula: properties.formula,
    } as MolecularProperties);
  } else {
    // handle generated molecules that have missing properties
    let p = useStore.getState().projectState.generatedMolecularProperties[molecule.name];
    if (p) {
      useStore.getState().setMolecularProperties(molecule.name, {
        atomCount: atoms.length,
        bondCount: radialBonds.length,
        molecularMass: p.molecularMass,
        heavyAtomCount: p.heavyAtomCount,
        formula: generateFormula(atoms),
      } as MolecularProperties);
    } else {
      // backward compatibility (to be removed in 2026)
      if (molecule.name.startsWith('AI: ')) {
        p = useStore.getState().projectState.generatedMolecularProperties[molecule.name.substring(5)];
        if (p) {
          useStore.getState().setMolecularProperties(molecule.name, {
            atomCount: atoms.length,
            bondCount: radialBonds.length,
            molecularMass: p.molecularMass,
            heavyAtomCount: p.heavyAtomCount,
            formula: generateFormula(atoms),
          } as MolecularProperties);
        }
      }
    }
  }
  useStore.getState().setMolecularStructure(molecule.name, { atoms, radialBonds } as MolecularStructure);
};

export const generateFormula = (atoms: Atom[]): string => {
  const symbols: Map<string, number> = new Map();
  for (const a of atoms) {
    const s = Util.capitalizeFirstLetter(a.elementSymbol);
    const n = symbols.get(s);
    symbols.set(s, (n ?? 0) + 1);
  }
  let formula: string = '';
  for (const a of symbols.keys()) {
    formula += a;
    const n = symbols.get(a);
    if (n && n > 1) formula += n;
  }
  return Util.getSubscriptNumber(formula);
};

export const generateFormulaFromAtomJS = (atoms: AtomJS[]): string => {
  const symbols: Map<string, number> = new Map();
  for (const a of atoms) {
    const s = Util.capitalizeFirstLetter(a.element.name);
    const n = symbols.get(s);
    symbols.set(s, (n ?? 0) + 1);
  }
  let formula: string = '';
  for (const a of symbols.keys()) {
    formula += a;
    const n = symbols.get(a);
    if (n && n > 1) formula += n;
  }
  return Util.getSubscriptNumber(formula);
};

export const loadMolecule = (
  molecule: MoleculeInterface,
  processResult: (result: any, molecule?: Molecule) => void,
  removeMoleculeByName?: (name: string) => void,
) => {
  if (molecule.data) {
    new SDFParser(Util.ensureSdf(molecule.data))
      .parse()
      .then((result) => {
        processResult(result, molecule as Molecule);
      })
      .catch((err) => {
        console.error(err);
        console.error(molecule.data);
        setMessage('error', i18n.t('message.GeneratedResultNotAccepted', { lng: useStore.getState().language }), 30);
        if (removeMoleculeByName) {
          removeMoleculeByName(molecule.name);
        }
      });
  } else {
    const mol = getData(molecule.name);
    if (mol?.url) {
      fetch(mol.url).then((response) => {
        response.text().then((text) => {
          let url = mol.url;
          if (url) {
            if (url.includes('?')) {
              // sometimes the url has an appendix (not sure who adds it)
              url = url.substring(0, url.indexOf('?'));
            }
            let parser = null;
            const options = { autoBond: !isCrystal(molecule.name) };
            if (url.endsWith('.sdf')) parser = new SDFParser(text, options);
            else if (url.endsWith('.cif')) parser = new CIFParser(text, options);
            else if (url.endsWith('.pdb')) parser = new PDBParser(text, options);
            else if (url.endsWith('.pcj')) parser = new PubChemParser(text, options);
            else if (url.endsWith('.xyz')) parser = new XYZParser(text, options);
            else if (url.endsWith('.mol2')) parser = new MOL2Parser(text, options);
            if (parser) {
              parser.parse().then((result) => {
                if (molecule) {
                  processResult(result, molecule as Molecule);
                } else {
                  processResult(result);
                }
              });
            }
          }
        });
      });
    }
  }
};
