/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { MyPDBLoader } from './js/MyPDBLoader.js';
import { Atom } from './models/Atom';
import { BufferGeometry, Color, NormalBufferAttributes, Vector3 } from 'three';
import { Bond } from './models/Bond';
import { Molecule } from './models/Molecule';
import { Cylinder, Sphere } from '@react-three/drei';
import { CPK_COLORS, HALF_PI } from './constants';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { Util } from './Util';

export interface MolecularViewerProps {
  inputMoleculeUrl: string;
}

type PDB = {
  geometryAtoms: BufferGeometry<NormalBufferAttributes>;
  geometryBonds: BufferGeometry<NormalBufferAttributes>;
  elementsBonds: never[];
  json: {
    atoms: any[];
  };
};

const MolecularViewer = ({ inputMoleculeUrl }: MolecularViewerProps) => {
  const chemicalElements = useStore(Selector.chemicalElements);
  const getChemicalElement = useStore(Selector.getChemicalElement);

  const pdbLoader = useMemo(() => new MyPDBLoader(), []);

  const [molecule, setMolecule] = useState<Molecule>();

  useEffect(() => {
    pdbLoader.load(inputMoleculeUrl, (pdb: PDB) => {
      const geometryAtoms = pdb.geometryAtoms;
      const geometryBonds = pdb.geometryBonds;
      const elementsBonds: string[] = pdb.elementsBonds;
      const json = pdb.json;
      let positions = geometryAtoms.getAttribute('position');
      const atoms: Atom[] = [];
      for (let i = 0; i < positions.count; i++) {
        const atom = json.atoms[i];
        const c = CPK_COLORS[atom[3]];
        const elementName = atom[4] as string;
        atoms.push({
          elementName,
          position: new Vector3(positions.getX(i), positions.getY(i), positions.getZ(i)),
          color: new Color(c[0] / 255, c[1] / 255, c[2] / 255).convertSRGBToLinear(),
          radius: getChemicalElement(elementName)?.sigma / 5,
        } as Atom);
      }
      positions = geometryBonds.getAttribute('position');
      const bonds: Bond[] = [];
      for (let i = 0; i < positions.count; i += 2) {
        const j = i + 1;
        let elementNameI = elementsBonds[i];
        let elementNameJ = elementsBonds[j];
        // cpk element names are all lower case
        const ci = CPK_COLORS[elementNameI];
        const cj = CPK_COLORS[elementNameJ];
        // other element names have capital initial
        elementNameI = Util.capitalize(elementNameI);
        elementNameJ = Util.capitalize(elementNameJ);
        const colorI = new Color(ci[0] / 255, ci[1] / 255, ci[2] / 255).convertSRGBToLinear();
        const colorJ = new Color(cj[0] / 255, cj[1] / 255, cj[2] / 255).convertSRGBToLinear();
        const positionI = new Vector3(positions.getX(i), positions.getY(i), positions.getZ(i));
        const positionJ = new Vector3(positions.getX(j), positions.getY(j), positions.getZ(j));
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
  }, [inputMoleculeUrl, chemicalElements]);

  const showAtoms = () => {
    if (!molecule) return null;
    return (
      <group name={'Atoms'}>
        {molecule.atoms.map((e, index) => {
          return (
            <Sphere
              position={e.position}
              args={[e.radius ?? 0.5, 16, 16]}
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
              <meshStandardMaterial attach="material" color={e.color} />
            </Sphere>
          );
        })}
      </group>
    );
  };

  const showBonds = () => {
    if (!molecule) return null;
    return (
      <group name={'Bonds'}>
        {molecule.bonds.map((e, index) => {
          const fullLength = e.getLength();
          const halfVisibleLength = (fullLength - e.startAtom.radius - e.endAtom.radius) / 2;
          const alpha = (e.startAtom.radius + halfVisibleLength) / fullLength;
          const midPosition = e.startAtom.position.clone().lerp(e.endAtom.position, alpha);
          const startLength = e.startAtom.position.distanceTo(midPosition);
          const endLength = e.endAtom.position.distanceTo(midPosition);
          return (
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
                  args={[0.1, 0.1, startLength, 16, 1]}
                  rotation={[HALF_PI, 0, 0]}
                >
                  <meshStandardMaterial attach="material" color={e.startAtom.color} />
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
                  args={[0.1, 0.1, endLength, 16, 1]}
                  rotation={[HALF_PI, 0, 0]}
                >
                  <meshStandardMaterial attach="material" color={e.endAtom.color} />
                </Cylinder>
              </group>
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
