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
import { MoleculeData } from '../types.ts';
import { useStore } from '../stores/common.ts';
import { MolecularProperties } from '../models/MolecularProperties.ts';

export const loadMolecule = (
  moleculeData: MoleculeData,
  processResult: (result: any, moleculeData?: MoleculeData) => void,
  store?: boolean,
) => {
  const setParsedResult = useStore.getState().setParsedResult;
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
            if (store) {
              // have to parse twice to create a distinct copy for common store
              // because deep copy using JSON does not work (circular references)
              parser.parse().then((result) => {
                setParsedResult(moleculeData.name, result);
              });
            }
            parser.parse().then((result) => {
              processResult(result, moleculeData);
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
