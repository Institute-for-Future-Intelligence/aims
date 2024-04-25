/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { Molecule } from './Molecule.ts';
import { UNIT_EV_OVER_KB } from './physicalConstants.ts';
import { RadialBond } from './RadialBond.ts';
import { Triple } from './Triple.ts';
import { Quadruple } from './Quadruple.ts';
import { Damper } from './Damper.ts';

export class ModelUtil {
  static generateAngularBonds(atoms: Atom[], radialBonds: RadialBond[]): Triple[] {
    const angularBonds: Triple[] = [];
    for (const a of atoms) {
      const bondedAtoms: Atom[] = [];
      for (const r of radialBonds) {
        if (r.atom1 === a) {
          bondedAtoms.push(r.atom2);
        } else if (r.atom2 === a) {
          bondedAtoms.push(r.atom1);
        }
      }
      const n = bondedAtoms.length;
      if (n > 1) {
        for (let p = 0; p < n - 1; p++) {
          for (let q = p + 1; q < n; q++) {
            angularBonds.push({ i: bondedAtoms[p].index, j: a.index, k: bondedAtoms[q].index });
          }
        }
      }
    }
    return angularBonds;
  }

  static generateTorsionalBonds(atoms: Atom[], radialBonds: RadialBond[], aBonds: Triple[]): Quadruple[] {
    const torsionalBonds: Quadruple[] = [];
    for (const rBond of radialBonds) {
      const bondedAtomsLeft: Atom[] = [];
      const bondedAtomsRight: Atom[] = [];
      for (const b of aBonds) {
        if (rBond.atom1 === atoms[b.i] && rBond.atom2 === atoms[b.j]) {
          bondedAtomsRight.push(atoms[b.k]);
        } else if (rBond.atom1 === atoms[b.j] && rBond.atom2 === atoms[b.k]) {
          bondedAtomsLeft.push(atoms[b.i]);
        }
      }
      for (const b of aBonds) {
        if (rBond.atom2 === atoms[b.i] && rBond.atom1 === atoms[b.j]) {
          bondedAtomsLeft.push(atoms[b.k]);
        } else if (rBond.atom2 === atoms[b.j] && rBond.atom1 === atoms[b.k]) {
          bondedAtomsRight.push(atoms[b.i]);
        }
      }
      for (const a of bondedAtomsLeft) {
        for (const b of bondedAtomsRight) {
          torsionalBonds.push({
            i: a.index,
            j: rBond.atom1.index,
            k: rBond.atom2.index,
            l: b.index,
          });
        }
      }
    }
    return torsionalBonds;
  }

  static reconstructMoleculesFromFirestore(m: any) {
    if (!m && !Array.isArray(m)) return [];
    const array: Molecule[] = [];
    for (const x of m) {
      array.push(Molecule.clone(x, true));
    }
    return array;
  }

  static getDamp(index: number, dampers: Damper[]) {
    for (const d of dampers) {
      if (d.indexOfAtom === index) return d.friction;
    }
    return 0;
  }

  static getAtomByIndex(index: number, molecules: Molecule[]): Atom | null {
    let i = 0;
    for (const m of molecules) {
      for (const a of m.atoms) {
        if (index === i) return a;
        i++;
      }
    }
    return null;
  }

  static convertToTemperatureFactor(ke: number, scale?: number): number {
    return ke * UNIT_EV_OVER_KB * 0.01 * (scale ?? 1);
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
