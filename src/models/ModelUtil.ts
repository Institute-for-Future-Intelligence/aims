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

  static getMoleculeCenter(index: number, molecule: MoleculeTS): Vector3 {
    const c = new Vector3();
    for (const a of molecule.atoms) {
      c.add(a.position);
    }
    return c.multiplyScalar(1 / molecule.atoms.length);
  }
}
