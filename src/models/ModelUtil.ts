/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { AtomTS } from './AtomTS.ts';
import { MoleculeTS } from './MoleculeTS.ts';
import { Vector3 } from 'three';

export class ModelUtil {
  static getMolecule(atom: AtomTS, molecules: MoleculeTS[]): MoleculeTS | null {
    for (const m of molecules) {
      if (m.atoms.includes(atom)) return m;
    }
    return null;
  }

  static getMoleculeCenter(molecule: MoleculeTS): Vector3 {
    const c = new Vector3();
    for (const a of molecule.atoms) {
      c.add(a.position);
    }
    return c.multiplyScalar(1 / molecule.atoms.length);
  }

  static getMoleculeLengths(molecule: MoleculeTS): number[] {
    let minX = Number.MAX_VALUE;
    let maxX = -Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxY = -Number.MAX_VALUE;
    let minZ = Number.MAX_VALUE;
    let maxZ = -Number.MAX_VALUE;
    for (const a of molecule.atoms) {
      if (minX > a.position.x) {
        minX = a.position.x;
      } else if (maxX < a.position.x) {
        maxX = a.position.x;
      }
      if (minY > a.position.y) {
        minY = a.position.y;
      } else if (maxY < a.position.y) {
        maxY = a.position.y;
      }
      if (minZ > a.position.z) {
        minZ = a.position.z;
      } else if (maxZ < a.position.z) {
        maxZ = a.position.z;
      }
    }
    return [Math.max(1, maxX - minX), Math.max(1, maxY - minY), Math.max(1, maxZ - minZ)];
  }
}
