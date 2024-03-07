/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { AtomTS } from './AtomTS.ts';
import { MoleculeTS } from './MoleculeTS.ts';

export class ModelUtil {
  static getMolecule(atom: AtomTS, molecules: MoleculeTS[]): MoleculeTS | null {
    for (const m of molecules) {
      if (m.atoms.includes(atom)) return m;
    }
    return null;
  }
}
