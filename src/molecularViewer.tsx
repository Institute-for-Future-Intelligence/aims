/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { MyPDBLoader } from './js/MyPDBLoader';
import { Atom } from './models/Atom';
import { Color, Vector3 } from 'three';
import { Bond } from './models/Bond';
import { Molecule } from './models/Molecule';
import { Cylinder, Sphere } from '@react-three/drei';
import { CPK_COLORS, HALF_PI } from './constants';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';

export interface MolecularViewerProps {
  inputMolecule: string;
}

const MolecularViewer = ({ inputMolecule }: MolecularViewerProps) => {
  const chemicalElements = useStore(Selector.chemicalElements);
  const getChemicalElement = useStore(Selector.getChemicalElement);

  const molecule = useMemo(() => {
    const pdbLoader = new MyPDBLoader();
    const pdb = pdbLoader.parse(inputMolecule);
    const geometryAtoms = pdb.geometryAtoms;
    const geometryBonds = pdb.geometryBonds;
    const elementsBonds: string[] = pdb.elementsBonds;
    const json = pdb.json;
    let positions = geometryAtoms.getAttribute('position');
    const atoms: Atom[] = [];
    for (let i = 0; i < positions.count; i++) {
      const atom = json.atoms[i];
      const c = CPK_COLORS[atom[3]];
      atoms.push({
        name: atom[4] as string,
        position: new Vector3(positions.getX(i), positions.getY(i), positions.getZ(i)),
        color: new Color(c[0] / 255, c[1] / 255, c[2] / 255).convertSRGBToLinear(),
        radius: getChemicalElement(atom[4] as string)?.sigma / 5,
      } as Atom);
    }
    positions = geometryBonds.getAttribute('position');
    const bonds: Bond[] = [];
    for (let i = 0; i < positions.count; i += 2) {
      const j = i + 1;
      const ci = CPK_COLORS[elementsBonds[i]];
      const cj = CPK_COLORS[elementsBonds[j]];
      bonds.push({
        start: new Vector3(positions.getX(i), positions.getY(i), positions.getZ(i)),
        end: new Vector3(positions.getX(j), positions.getY(j), positions.getZ(j)),
        startColor: new Color(ci[0] / 255, ci[1] / 255, ci[2] / 255).convertSRGBToLinear(),
        endColor: new Color(cj[0] / 255, cj[1] / 255, cj[2] / 255).convertSRGBToLinear(),
      } as Bond);
    }
    return { atoms, bonds } as Molecule;
  }, [inputMolecule, chemicalElements]);

  const showAtoms = () => {
    return (
      <group name={'Atoms'}>
        {molecule.atoms.map((e, index) => {
          return (
            <Sphere
              position={e.position}
              args={[e.radius ?? 0.5, 16, 16]}
              key={'Atom' + index}
              name={e.name}
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
    return (
      <group name={'Bonds'}>
        {molecule.bonds.map((e, index) => {
          const mid = e.start.clone().lerp(e.end, 0.5);
          const fullLength = e.end.distanceTo(e.start);
          const visibleLength = fullLength;
          return (
            <React.Fragment key={'Bond' + index}>
              <group
                position={e.start.clone().lerp(mid, 0.5)}
                onUpdate={(self) => {
                  self.lookAt(e.end);
                }}
              >
                <Cylinder
                  userData={{ unintersectable: true }}
                  name={'Bond1' + index}
                  castShadow={false}
                  receiveShadow={false}
                  args={[0.1, 0.1, fullLength * 0.5, 16, 1]}
                  rotation={[HALF_PI, 0, 0]}
                >
                  <meshStandardMaterial attach="material" color={e.startColor} />
                </Cylinder>
              </group>
              <group
                position={mid.clone().lerp(e.end, 0.5)}
                onUpdate={(self) => {
                  self.lookAt(e.end);
                }}
              >
                <Cylinder
                  userData={{ unintersectable: true }}
                  name={'Bond2' + index}
                  castShadow={false}
                  receiveShadow={false}
                  args={[0.1, 0.1, fullLength * 0.5, 16, 1]}
                  rotation={[HALF_PI, 0, 0]}
                >
                  <meshStandardMaterial attach="material" color={e.endColor} />
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
