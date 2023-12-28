/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { MyPDBLoader } from '../js/MyPDBLoader.js';
import { Atom } from '../models/Atom';
import { BufferGeometry, Color, NormalBufferAttributes, Vector3 } from 'three';
import { Bond } from '../models/Bond';
import { Molecule } from '../models/Molecule';
import { Cylinder, Line, Sphere } from '@react-three/drei';
import { HALF_PI } from '../programmaticConstants';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { CPK_COLORS } from '../scientificConstants';
import { MolecularViewerStyle, MoleculeData } from '../types';
import PDBParser from "../lib/io/parsers/PDBParser";

export interface MolecularViewerProps {
  moleculeData: MoleculeData;
  style: MolecularViewerStyle;
  shininess?: number;
  highQuality?: boolean;
}

type PDB = {
  geometryAtoms: BufferGeometry<NormalBufferAttributes>;
  geometryBonds: BufferGeometry<NormalBufferAttributes>;
  elementsBonds: any[];
  json: {
    atoms: any[];
  };
};

const MolecularViewer = ({ moleculeData, style, shininess, highQuality }: MolecularViewerProps) => {
  const chemicalElements = useStore(Selector.chemicalElements);
  const getChemicalElement = useStore(Selector.getChemicalElement);

  const pdbLoader = useMemo(() => new MyPDBLoader(), []);

  const [molecule, setMolecule] = useState<Molecule>();

  useEffect(() => {
    if (moleculeData.content) {
      // const records = new SDFParser(moleculeData.content, null);
      // console.log(records);
    } else if (moleculeData.url?.endsWith('.pdb')) {
      const p = new PDBParser(moleculeData.url, {});
      pdbLoader.load(moleculeData.url, (pdb: PDB) => {
        const geometryAtoms = pdb.geometryAtoms;
        const geometryBonds = pdb.geometryBonds;
        const elementsBonds: string[] = pdb.elementsBonds;
        const json = pdb.json;
        let positions = geometryAtoms.getAttribute('position');
        const atoms: Atom[] = [];
        let cx = 0;
        let cy = 0;
        let cz = 0;
        for (let i = 0; i < positions.count; i++) {
          const atom = json.atoms[i];
          const elementName = atom[3] as string;
          const c = CPK_COLORS[elementName];
          const v = new Vector3(positions.getX(i), positions.getY(i), positions.getZ(i));
          cx += v.x;
          cy += v.y;
          cz += v.z;
          atoms.push({
            elementName,
            position: v,
            color: new Color(c[0] / 255, c[1] / 255, c[2] / 255).convertSRGBToLinear(),
            radius: getChemicalElement(elementName)?.sigma / 5,
          } as Atom);
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
        positions = geometryBonds.getAttribute('position');
        const bonds: Bond[] = [];
        for (let i = 0; i < positions.count; i += 2) {
          const j = i + 1;
          const elementNameI = elementsBonds[i];
          const elementNameJ = elementsBonds[j];
          const ci = CPK_COLORS[elementNameI];
          const cj = CPK_COLORS[elementNameJ];
          const colorI = new Color(ci[0] / 255, ci[1] / 255, ci[2] / 255).convertSRGBToLinear();
          const colorJ = new Color(cj[0] / 255, cj[1] / 255, cj[2] / 255).convertSRGBToLinear();
          const positionI = new Vector3(positions.getX(i) - cx, positions.getY(i) - cy, positions.getZ(i) - cz);
          const positionJ = new Vector3(positions.getX(j) - cx, positions.getY(j) - cy, positions.getZ(j) - cz);
          bonds.push(
            new Bond(
              {
                elementName: elementNameI,
                position: positionI,
                color: colorI,
                radius: getChemicalElement(elementNameI)?.sigma / 5,
              } as Atom,
              {
                elementName: elementNameJ,
                position: positionJ,
                color: colorJ,
                radius: getChemicalElement(elementNameJ)?.sigma / 5,
              } as Atom,
            ),
          );
        }
        setMolecule({ atoms, bonds } as Molecule);
      });
    }
  }, [moleculeData, chemicalElements]);

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
