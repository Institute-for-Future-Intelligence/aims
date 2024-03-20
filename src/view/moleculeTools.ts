/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { getData } from '../internalDatabase.ts';
import SDFParser from '../lib/io/parsers/SDFParser';
import CIFParser from '../lib/io/parsers/CIFParser';
import PDBParser from '../lib/io/parsers/PDBParser';
import PubChemParser from '../lib/io/parsers/PubChemParser';
import XYZParser from '../lib/io/parsers/XYZParser';
import MOL2Parser from '../lib/io/parsers/MOL2Parser';
import { MoleculeData, MoleculeTransform } from '../types.ts';
import { useStore } from '../stores/common.ts';
import { MolecularProperties } from '../models/MolecularProperties.ts';
import { MoleculeTS } from '../models/MoleculeTS.ts';
import Complex from '../lib/chem/Complex';
import Element from '../lib/chem/Element';
import Molecule from '../lib/chem/Molecule';
import BondJS from '../lib/chem/Bond';
import { AtomTS } from '../models/AtomTS.ts';
import AtomJS from '../lib/chem/Atom';
import { ModelUtil } from '../models/ModelUtil.ts';
import { BondTS } from '../models/BondTS.ts';
import { VdwBond } from '../models/VdwBond.ts';

export const generateVdwLines = (molecules: MoleculeTS[], maximumRelativeDistanceSquared: number) => {
  const bonds: VdwBond[] = [];
  const n = molecules.length;
  for (let i = 0; i < n; i++) {
    const mi = molecules[i];
    for (const ai of mi.atoms) {
      const ei = Element.getByName(ai.elementSymbol);
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const mj = molecules[j];
        for (const aj of mj.atoms) {
          const ej = Element.getByName(aj.elementSymbol);
          const dij = ei.radius + ej.radius;
          if (computeDistanceSquared(ai, aj) < maximumRelativeDistanceSquared * dij * dij) {
            bonds.push({ startAtom: ai, endAtom: aj } as VdwBond);
          }
        }
      }
    }
  }
  return bonds;
};

export const computeDistanceSquared = (a: AtomTS, b: AtomTS) => {
  return a.position.distanceToSquared(b.position);
};

export const generateComplex = (molecules: MoleculeTS[]) => {
  const complex = new Complex();
  for (const [idx, mol] of molecules.entries()) {
    const chain = complex.addChain('MOL' + idx);
    const residue = chain.addResidue(mol.name, idx, ' ');
    for (const [i, a] of mol.atoms.entries()) {
      residue.addAtom(
        a.elementSymbol,
        Element.getByName(a.elementSymbol),
        a.position, // this links to the current atom position vector
        undefined,
        true,
        i + 1,
        ' ',
        1,
        1,
        0,
      );
    }
    const molecule = new Molecule(complex, mol.name, idx + 1);
    molecule.residues = [residue];
    complex._molecules.push(molecule);
  }
  complex.finalize({
    needAutoBonding: true,
    detectAromaticLoops: false,
    enableEditing: false,
    serialAtomMap: false,
  });
  const bonds = complex.getBonds() as BondJS[];
  const atoms: AtomTS[] = [];
  for (const m of molecules) {
    atoms.push(...m.atoms);
  }
  for (const b of bonds) {
    const startAtomIndex = (b._left as AtomJS).index;
    const endAtomIndex = (b._right as AtomJS).index;
    const m = ModelUtil.getMolecule(atoms[startAtomIndex], molecules);
    if (m) {
      m.bonds.push({ startAtom: atoms[startAtomIndex], endAtom: atoms[endAtomIndex] } as BondTS);
    }
  }
  return complex;
};

export const loadMolecule = (
  moleculeData: MoleculeData,
  processResult: (result: any, moleculeData?: MoleculeData, transform?: MoleculeTransform) => void,
  transform?: MoleculeTransform,
) => {
  const mol = getData(moleculeData.name);
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
          const options = {};
          if (url.endsWith('.sdf')) parser = new SDFParser(text, options);
          else if (url.endsWith('.cif')) parser = new CIFParser(text, options);
          else if (url.endsWith('.pdb')) parser = new PDBParser(text, options);
          else if (url.endsWith('.pcj')) parser = new PubChemParser(text, options);
          else if (url.endsWith('.xyz')) parser = new XYZParser(text, options);
          else if (url.endsWith('.mol2')) parser = new MOL2Parser(text, options);
          if (parser) {
            parser.parse().then((result) => {
              processResult(result, moleculeData, transform);
            });
          }
        }
      });
    });
  }
};

export const setProperties = (moleculeData: MoleculeData, atomCount: number, bondCount: number) => {
  const properties = useStore.getState().getProvidedMolecularProperties(moleculeData.name);
  if (properties) {
    useStore.getState().setMolecularProperties(moleculeData.name, {
      atomCount,
      bondCount,
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
    } as MolecularProperties);
  }
};
