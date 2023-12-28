/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useState } from 'react';
import { Color, Vector3 } from 'three';
import { MoleculeTS } from '../models/MoleculeTS';
import { Cylinder, Line, Sphere } from '@react-three/drei';
import { HALF_PI } from '../programmaticConstants';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { CPK_COLORS } from '../scientificConstants';
import { MolecularViewerStyle, MoleculeData } from '../types';
import AtomJS from '../lib/chem/Atom';
import BondJS from '../lib/chem/Bond';
import { AtomTS } from '../models/AtomTS';
import { BondTS } from '../models/BondTS';
import PDBParser from '../lib/io/parsers/PDBParser';
import SDFParser from '../lib/io/parsers/SDFParser';
import XYZParser from '../lib/io/parsers/XYZParser';
import MOL2Parser from '../lib/io/parsers/MOL2Parser';
import CIFParser from '../lib/io/parsers/CIFParser';
import PubChemParser from '../lib/io/parsers/PubChemParser';

export interface MolecularViewerProps {
  moleculeData: MoleculeData;
  style: MolecularViewerStyle;
  shininess?: number;
  highQuality?: boolean;
}

const MolecularViewer = ({ moleculeData, style, shininess, highQuality }: MolecularViewerProps) => {
  const chemicalElements = useStore(Selector.chemicalElements);
  const getChemicalElement = useStore(Selector.getChemicalElement);

  const [molecule, setMolecule] = useState<MoleculeTS>();

  useEffect(() => {
    if (moleculeData.url?.endsWith('.sdf')) {
      fetch(moleculeData.url).then((response) => {
        response.text().then((text) => {
          new SDFParser(text, {}).parse().then(processResult);
        });
      });
    } else if (moleculeData.url?.endsWith('.cif')) {
      fetch(moleculeData.url).then((response) => {
        response.text().then((text) => {
          new CIFParser(text, {}).parse().then(processResult);
        });
      });
    } else if (moleculeData.url?.endsWith('.pdb')) {
      fetch(moleculeData.url).then((response) => {
        response.text().then((text) => {
          new PDBParser(text, {}).parse().then(processResult);
        });
      });
    } else if (moleculeData.url?.endsWith('.pcj')) {
      fetch(moleculeData.url).then((response) => {
        response.text().then((text) => {
          new PubChemParser(text, {}).parse().then(processResult);
        });
      });
    } else if (moleculeData.url?.endsWith('.xyz')) {
      fetch(moleculeData.url).then((response) => {
        response.text().then((text) => {
          new XYZParser(text, {}).parse().then(processResult);
        });
      });
    } else if (moleculeData.url?.endsWith('.mol2')) {
      fetch(moleculeData.url).then((response) => {
        response.text().then((text) => {
          new MOL2Parser(text, {}).parse().then(processResult);
        });
      });
    }
  }, [moleculeData, chemicalElements]);

  const processResult = (result: any) => {
    const atoms: AtomTS[] = [];
    let cx = 0;
    let cy = 0;
    let cz = 0;
    for (let i = 0; i < result._atoms.length; i++) {
      const atom = result._atoms[i] as AtomJS;
      const elementName = atom.element.name;
      const c = CPK_COLORS[elementName];
      cx += atom.position.x;
      cy += atom.position.y;
      cz += atom.position.z;
      atoms.push({
        elementName,
        position: atom.position.clone(),
        color: new Color(c[0] / 255, c[1] / 255, c[2] / 255).convertSRGBToLinear(),
        radius: getChemicalElement(elementName)?.sigma / 5,
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
      const elementNameI = atom1.element.name;
      const elementNameJ = atom2.element.name;
      const ci = CPK_COLORS[elementNameI];
      const cj = CPK_COLORS[elementNameJ];
      const colorI = new Color(ci[0] / 255, ci[1] / 255, ci[2] / 255).convertSRGBToLinear();
      const colorJ = new Color(cj[0] / 255, cj[1] / 255, cj[2] / 255).convertSRGBToLinear();
      const positionI = new Vector3(atom1.position.x - cx, atom1.position.y - cy, atom1.position.z - cz);
      const positionJ = new Vector3(atom2.position.x - cx, atom2.position.y - cy, atom2.position.z - cz);
      bonds.push(
        new BondTS(
          {
            elementName: elementNameI,
            position: positionI,
            color: colorI,
            radius: getChemicalElement(elementNameI)?.sigma / 5,
          } as AtomTS,
          {
            elementName: elementNameJ,
            position: positionJ,
            color: colorJ,
            radius: getChemicalElement(elementNameJ)?.sigma / 5,
          } as AtomTS,
        ),
      );
    }
    setMolecule({ atoms, bonds } as MoleculeTS);
  };

  const showAtoms = () => {
    if (!molecule) return null;
    if (style === MolecularViewerStyle.Stick || style === MolecularViewerStyle.Wireframe) return null;
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
              name={e.elementName}
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
    if (style === MolecularViewerStyle.SpaceFilling) return null;
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
                lineWidth={2}
              />
              <Line
                userData={{ unintersectable: true }}
                name={'Bond2' + index}
                castShadow={false}
                receiveShadow={false}
                points={[midPosition, e.endAtom.position]}
                color={e.endAtom.color}
                lineWidth={2}
              />
            </React.Fragment>
          );
        })}
      </group>
    );
  };

  return (
    <>
      {showAtoms()}
      {showBonds()}
    </>
  );
};

export default React.memo(MolecularViewer);
