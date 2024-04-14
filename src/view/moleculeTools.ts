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
import { MoleculeInterface } from '../types.ts';
import { useStore } from '../stores/common.ts';
import { MolecularProperties, MolecularStructure } from '../models/MolecularProperties.ts';
import { Molecule } from '../models/Molecule.ts';
import Complex from '../lib/chem/Complex';
import Element from '../lib/chem/Element';
import MoleculeJS from '../lib/chem/Molecule';
import { Atom } from '../models/Atom.ts';
import { ModelUtil } from '../models/ModelUtil.ts';
import { RadialBond } from '../models/RadialBond.ts';
import { VdwBond } from '../models/VdwBond.ts';
import Bond from '../lib/chem/Bond';

export const isCrystal = (name: string) => {
  return name === 'Gold' || name === 'NaCl';
};

export const generateVdwLines = (molecules: Molecule[], maximumRelativeDistanceSquared: number) => {
  const bonds: VdwBond[] = [];
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
  return bonds;
};

export const generateComplex = (molecules: Molecule[]) => {
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
        ModelUtil.convertToTemperatureFactor(a.getKineticEnergy()),
        0,
      );
    }
    const molecule = new MoleculeJS(complex, mol.name, idx + 1);
    molecule.residues = [residue];
    complex._molecules.push(molecule);
    for (const b of mol.radialBonds) {
      complex.addBond(residue._atoms[b.atom1.index], residue._atoms[b.atom2.index], 1, Bond.BondType.COVALENT, true);
    }
  }
  complex.finalize({
    needAutoBonding: false,
    detectAromaticLoops: false,
    enableEditing: false,
    serialAtomMap: false,
  });
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
    } as MolecularProperties);
  }
  useStore.getState().setMolecularStructure(molecule.name, { atoms, radialBonds } as MolecularStructure);
};

export const loadMolecule = (
  molecule: MoleculeInterface,
  processResult: (result: any, molecule?: Molecule) => void,
) => {
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
};
