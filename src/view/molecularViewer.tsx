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
import { HALF_PI } from '../programmaticConstants';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { MolecularViewerStyle, MoleculeData } from '../types';
import AtomJS from '../lib/chem/Atom';
import BondJS from '../lib/chem/Bond';
import { AtomTS } from '../models/AtomTS';
import { BondTS } from '../models/BondTS';
import { Util } from '../Util';
import { MolecularProperties } from '../models/MolecularProperties';
import ComplexVisual from '../lib/ComplexVisual';
import { useThree } from '@react-three/fiber';

export interface MolecularViewerProps {
  moleculeData: MoleculeData;
  style: MolecularViewerStyle;
  shininess?: number;
  highQuality?: boolean;
}

const MolecularViewer = ({ moleculeData, style, shininess, highQuality }: MolecularViewerProps) => {
  const chemicalElements = useStore(Selector.chemicalElements);
  const getChemicalElement = useStore(Selector.getChemicalElement);
  const getProvidedMolecule = useStore(Selector.getProvidedMolecule);
  const setMolecularProperties = useStore(Selector.setMolecularProperties);

  const [molecule, setMolecule] = useState<MoleculeTS>();
  const [complex, setComplex] = useState<any>();

  const CSGroup = useRef<Group>(null);

  const { invalidate } = useThree();

  const mode = useMemo(() => {
    if (style === MolecularViewerStyle.Cartoon) return 'CA';
    if (style === MolecularViewerStyle.Trace) return 'TR';
    if (style === MolecularViewerStyle.Tube) return 'TU';
    if (style === MolecularViewerStyle.QuickSurface) return 'QS';
    if (style === MolecularViewerStyle.ContactSurface) return 'CS';
    if (style === MolecularViewerStyle.SolventAccessibleSurface) return 'SA';
    if (style === MolecularViewerStyle.SolventExcludedSurface) return 'SE';
    return undefined;
  }, [style]);

  const colorer = useMemo(() => {
    if (style === MolecularViewerStyle.Cartoon) return 'SS';
    if (style === MolecularViewerStyle.Trace) return 'SS';
    if (style === MolecularViewerStyle.Tube) return 'SS';
    return 'EL';
  }, [style]);

  useEffect(() => {
    if (moleculeData.url) {
      fetch(moleculeData.url).then((response) => {
        response.text().then((text) => {
          const url = moleculeData.url;
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
    const providedMolecule = getProvidedMolecule(moleculeData.name);
    setMolecularProperties(moleculeData.name, {
      atomCount: result._atoms.length,
      bondCount: result._bonds.length,
      mass: totalMass,
      logP: providedMolecule.logP,
      hydrogenBondDonorCount: providedMolecule.hydrogenBondDonorCount,
      hydrogenBondAcceptorCount: providedMolecule.hydrogenBondAcceptorCount,
      rotatableBondCount: providedMolecule.rotatableBondCount,
      polarSurfaceArea: providedMolecule.polarSurfaceArea,
    } as MolecularProperties);
  };

  const showAtoms = () => {
    if (!molecule) return null;
    if (
      style === MolecularViewerStyle.Stick ||
      style === MolecularViewerStyle.Wireframe ||
      style === MolecularViewerStyle.Cartoon ||
      style === MolecularViewerStyle.Trace ||
      style === MolecularViewerStyle.Tube ||
      style === MolecularViewerStyle.QuickSurface ||
      style === MolecularViewerStyle.ContactSurface ||
      style === MolecularViewerStyle.SolventAccessibleSurface ||
      style === MolecularViewerStyle.SolventExcludedSurface
    )
      return null;
    return (
      <group name={'Atoms'}>
        {molecule.atoms.map((e, index) => {
          const spaceFilling = style === MolecularViewerStyle.SpaceFilling;
          const segments = highQuality ? (spaceFilling ? 32 : 16) : 8;
          return (
            <Sphere
              position={e.position}
              args={[(spaceFilling ? 4 : 1) * (e.radius ?? 0.5), segments, segments]}
              key={'Atom' + index}
              name={e.elementSymbol}
              castShadow={false}
              receiveShadow={false}
              onPointerOver={(e) => {}}
              onPointerOut={(e) => {}}
              onPointerDown={(e) => {
                if (e.button === 2) return;
              }}
            >
              {shininess ? (
                <meshPhongMaterial attach="material" color={e.color} specular={'white'} shininess={shininess} />
              ) : (
                <meshStandardMaterial attach="material" color={e.color} />
              )}
            </Sphere>
          );
        })}
      </group>
    );
  };

  const showBonds = () => {
    if (!molecule) return null;
    if (
      style === MolecularViewerStyle.SpaceFilling ||
      style === MolecularViewerStyle.Cartoon ||
      style === MolecularViewerStyle.Trace ||
      style === MolecularViewerStyle.Tube ||
      style === MolecularViewerStyle.QuickSurface ||
      style === MolecularViewerStyle.ContactSurface ||
      style === MolecularViewerStyle.SolventAccessibleSurface ||
      style === MolecularViewerStyle.SolventExcludedSurface
    )
      return null;
    return (
      <group name={'Bonds'}>
        {molecule.bonds.map((e, index) => {
          const fullLength = e.getLength();
          const halfVisibleLength = (fullLength - e.startAtom.radius - e.endAtom.radius) / 2;
          const alpha = (e.startAtom.radius + halfVisibleLength) / fullLength;
          const midPosition = e.startAtom.position.clone().lerp(e.endAtom.position, alpha);
          const startLength = e.startAtom.position.distanceTo(midPosition);
          const endLength = e.endAtom.position.distanceTo(midPosition);
          const radius = 0.1;
          const segments = highQuality ? 16 : 4;
          return style === MolecularViewerStyle.BallAndStick || style === MolecularViewerStyle.Stick ? (
            <React.Fragment key={'Bond' + index}>
              <group
                position={e.startAtom.position.clone().lerp(midPosition, 0.5)}
                onUpdate={(self) => {
                  self.lookAt(e.endAtom.position);
                }}
              >
                <Cylinder
                  userData={{ unintersectable: true }}
                  name={'Bond1' + index}
                  castShadow={false}
                  receiveShadow={false}
                  args={[radius, radius, startLength, segments, 1]}
                  rotation={[HALF_PI, 0, 0]}
                >
                  {shininess ? (
                    <meshPhongMaterial
                      attach="material"
                      color={e.startAtom.color}
                      specular={'white'}
                      shininess={shininess}
                    />
                  ) : (
                    <meshStandardMaterial attach="material" color={e.startAtom.color} />
                  )}
                </Cylinder>
              </group>
              <group
                position={midPosition.clone().lerp(e.endAtom.position, 0.5)}
                onUpdate={(self) => {
                  self.lookAt(e.endAtom.position);
                }}
              >
                <Cylinder
                  userData={{ unintersectable: true }}
                  name={'Bond2' + index}
                  castShadow={false}
                  receiveShadow={false}
                  args={[radius, radius, endLength, segments, 1]}
                  rotation={[HALF_PI, 0, 0]}
                >
                  {shininess ? (
                    <meshPhongMaterial
                      attach="material"
                      color={e.endAtom.color}
                      specular={'white'}
                      shininess={shininess}
                    />
                  ) : (
                    <meshStandardMaterial attach="material" color={e.endAtom.color} />
                  )}
                </Cylinder>
              </group>
            </React.Fragment>
          ) : (
            <React.Fragment key={'Bond' + index}>
              <Line
                userData={{ unintersectable: true }}
                name={'Bond1' + index}
                castShadow={false}
                receiveShadow={false}
                points={[e.startAtom.position, midPosition]}
                color={e.startAtom.color}
                lineWidth={highQuality ? 2 : 1}
              />
              <Line
                userData={{ unintersectable: true }}
                name={'Bond2' + index}
                castShadow={false}
                receiveShadow={false}
                points={[midPosition, e.endAtom.position]}
                color={e.endAtom.color}
                lineWidth={highQuality ? 2 : 1}
              />
            </React.Fragment>
          );
        })}
      </group>
    );
  };

  const showStructure = () => {
    if (!molecule) return null;
    if (
      style === MolecularViewerStyle.BallAndStick ||
      style === MolecularViewerStyle.Stick ||
      style === MolecularViewerStyle.Wireframe ||
      style === MolecularViewerStyle.SpaceFilling
    )
      return null;
    return <group name={'Structure'} ref={CSGroup} />;
  };

  const getVisualCenter = (visual: ComplexVisual) => {
    return visual.getBoundaries().boundingSphere.center.clone() as Vector3;
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
      const offset = getVisualCenter(visual).multiplyScalar(-1);
      CSGroup.current.position.copy(offset);
      invalidate();
    });
  }, [complex, shininess, mode]);

  return (
    <>
      {showAtoms()}
      {showBonds()}
      {mode && showStructure()}
    </>
  );
};

export default React.memo(MolecularViewer);
