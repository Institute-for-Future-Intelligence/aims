/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { Molecule } from './Molecule.ts';

export class ModelUtil {
  static reconstructMoleculesFromFirestore(m: any) {
    if (!m && !Array.isArray(m)) return [];
    const array: Molecule[] = [];
    for (const x of m) {
      array.push(Molecule.clone(x));
    }
    return array;
  }

  static getMolecule(atom: Atom, molecules: Molecule[]): Molecule | null {
    for (const m of molecules) {
      if (m.atoms.includes(atom)) return m;
    }
    return null;
  }

  static getMoleculeLengths(molecule: Molecule): number[] {
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

  // the Box–Muller transform to generate a normal distribution between 0 and 1 inclusive.
  static nextGaussian(): number {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return ModelUtil.nextGaussian(); // resample between 0 and 1
    return num;
  }
}
