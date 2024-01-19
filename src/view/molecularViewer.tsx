/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import PDBParser from '../lib/io/parsers/PDBParser';
import SDFParser from '../lib/io/parsers/SDFParser';
import XYZParser from '../lib/io/parsers/XYZParser';
import MOL2Parser from '../lib/io/parsers/MOL2Parser';
import CIFParser from '../lib/io/parsers/CIFParser';
import PubChemParser from '../lib/io/parsers/PubChemParser';
import ElementColorer from '../lib/gfx/colorers/ElementColorer';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Color, Group, Vector3 } from 'three';
import { MoleculeTS } from '../models/MoleculeTS';
import { Cylinder, Line, Sphere } from '@react-three/drei';
import { HALF_PI } from '../constants';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { MoleculeData } from '../types';
import AtomJS from '../lib/chem/Atom';
import BondJS from '../lib/chem/Bond';
import { AtomTS } from '../models/AtomTS';
import { BondTS } from '../models/BondTS';
import { Util } from '../Util';
import { MolecularProperties } from '../models/MolecularProperties';
import ComplexVisual from '../lib/ComplexVisual';
import { useThree } from '@react-three/fiber';
import { STYLE_MAP, MolecularViewerStyle, COLORING_MAP, MolecularViewerColoring } from './displayOptions';
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { getSample } from '../internalDatabase';

export interface MolecularViewerProps {
  moleculeData: MoleculeData;
  style: MolecularViewerStyle;
  coloring: MolecularViewerColoring;
  shininess?: number;
  highQuality?: boolean;
}

const MolecularViewer = ({ moleculeData, style, coloring, shininess, highQuality }: MolecularViewerProps) => {
  const chemicalElements = useStore(Selector.chemicalElements);
  const getChemicalElement = useStore(Selector.getChemicalElement);
  const getProvidedMolecularProperties = useStore(Selector.getProvidedMolecularProperties);
  const setMolecularProperties = useStore(Selector.setMolecularProperties);

  const [molecule, setMolecule] = useState<MoleculeTS>();
  const [complex, setComplex] = useState<any>();

  const CSGroup = useRef<Group>(null);

  const { invalidate } = useThree();

  const mode = useMemo(() => {
    return STYLE_MAP.get(style);
  }, [style]);

  const colorer = useMemo(() => {
    return COLORING_MAP.get(coloring);
  }, [coloring]);

  useEffect(() => {
    const mol = getSample(moleculeData.name);
    if (mol?.url) {
      fetch(mol.url).then((response) => {
        response.text().then((text) => {
          const url = mol.url;
          if (url) {
            let parser = null;
            const options = {};
            if (url.endsWith('.sdf')) parser = new SDFParser(text, options);
            else if (url.endsWith('.cif')) parser = new CIFParser(text, options);
            else if (url.endsWith('.pdb')) parser = new PDBParser(text, options);
            else if (url.endsWith('.pcj')) parser = new PubChemParser(text, options);
            else if (url.endsWith('.xyz')) parser = new XYZParser(text, options);
            else if (url.endsWith('.mol2')) parser = new MOL2Parser(text, options);
            if (parser) parser.parse().then(processResult);
          }
        });
      });
    }
  }, [moleculeData, chemicalElements]);

  const processResult = (result: any) => {
    setComplex(result);
    const atoms: AtomTS[] = [];
    let cx = 0;
    let cy = 0;
    let cz = 0;
    let totalMass = 0;
    const white = { r: 255, g: 255, b: 255 };
    const elementColorer = new ElementColorer(); // default to Jmol colors (same as CPK from PubChem)
    for (let i = 0; i < result._atoms.length; i++) {
      const atom = result._atoms[i] as AtomJS;
      const elementSymbol = atom.element.name;
      const color = Util.decimalColorToRgb(elementColorer.getAtomColor(atom)) ?? white;
      cx += atom.position.x;
      cy += atom.position.y;
      cz += atom.position.z;
      const element = getChemicalElement(elementSymbol);
      totalMass += element?.atomicMass;
      atoms.push({
        elementSymbol,
        position: atom.position.clone(),
        color: new Color(color.r / 255, color.g / 255, color.b / 255).convertSRGBToLinear(),
        radius: (element?.atomicRadius ?? 1) / 5,
      } as AtomTS);
    }
    if (atoms.length > 0) {
      cx /= atoms.length;
      cy /= atoms.length;
      cz /= atoms.length;
      for (const a of atoms) {
        a.position.x -= cx;
        a.position.y -= cy;
        a.position.z -= cz;
      }
    }
    const bonds: BondTS[] = [];
    for (let i = 0; i < result._bonds.length; i++) {
      const bond = result._bonds[i] as BondJS;
      const atom1 = bond._left;
      const atom2 = bond._right;
      const elementSymbol1 = atom1.element.name;
      const elementSymbol2 = atom2.element.name;
      const c1 = Util.decimalColorToRgb(elementColorer.getAtomColor(atom1)) ?? white;
      const c2 = Util.decimalColorToRgb(elementColorer.getAtomColor(atom2)) ?? white;
      bonds.push(
        new BondTS(
          {
            elementSymbol: elementSymbol1,
            position: new Vector3(atom1.position.x - cx, atom1.position.y - cy, atom1.position.z - cz),
            color: new Color(c1.r / 255, c1.g / 255, c1.b / 255).convertSRGBToLinear(),
            radius: getChemicalElement(elementSymbol1)?.atomicRadius / 5,
          } as AtomTS,
          {
            elementSymbol: elementSymbol2,
            position: new Vector3(atom2.position.x - cx, atom2.position.y - cy, atom2.position.z - cz),
            color: new Color(c2.r / 255, c2.g / 255, c2.b / 255).convertSRGBToLinear(),
            radius: getChemicalElement(elementSymbol2)?.atomicRadius / 5,
          } as AtomTS,
        ),
      );
    }
    setMolecule({ atoms, bonds } as MoleculeTS);
    const properties = getProvidedMolecularProperties(moleculeData.name);
    if (properties) {
      setMolecularProperties(moleculeData.name, {
        atomCount: result._atoms.length,
        bondCount: result._bonds.length,
        mass: totalMass,
        logP: properties.logP,
        hydrogenBondDonorCount: properties.hydrogenBondDonorCount,
        hydrogenBondAcceptorCount: properties.hydrogenBondAcceptorCount,
        rotatableBondCount: properties.rotatableBondCount,
        polarSurfaceArea: properties.polarSurfaceArea,
      } as MolecularProperties);
    }
  };

  const showStructure = () => {
    if (!molecule || !mode) return null;
    return <group name={'Structure'} ref={CSGroup} />;
  };

  useEffect(() => {
    if (!CSGroup.current || !complex || !mode) return;

    CSGroup.current.children = [];
    CSGroup.current.position.set(0, 0, 0);

    const visual = new ComplexVisual(complex.name, complex);

    const reps = [
      {
        mode: mode,
        colorer: colorer,
        selector: 'all',
        material: 'SF',
      },
    ];

    visual.resetReps(reps);
    visual.setUberOptions({ shininess });

    visual.rebuild().then(() => {
      if (!CSGroup.current) return;
      CSGroup.current.add(visual);
      const boundingSphere = visual.getBoundaries().boundingSphere;
      const offset = boundingSphere.center.clone().multiplyScalar(-1);
      CSGroup.current.position.copy(offset);
      usePrimitiveStore.getState().set((state) => {
        state.boundingSphereRadius = boundingSphere.radius;
      });
      invalidate();
    });
  }, [complex, shininess, mode, colorer]);

  return showStructure();
};

export default React.memo(MolecularViewer);