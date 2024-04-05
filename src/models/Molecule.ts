/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { RadialBond } from './RadialBond.ts';
import { MoleculeInterface } from '../types.ts';
import { Vector3 } from 'three';
import { AngularBond } from './AngularBond.ts';
import { TorsionalBond } from './TorsionalBond.ts';

export class Molecule implements MoleculeInterface {
  name: string;
  atoms: Atom[];
  radialBonds: RadialBond[];
  angularBonds: AngularBond[];
  torsionalBonds: TorsionalBond[];
  center: Vector3;

  url?: string;
  internal?: boolean;
  invisible?: boolean;
  excluded?: boolean;
  metadata?: any;

  constructor(name: string, atoms: Atom[]) {
    this.name = name;
    this.atoms = atoms;
    this.radialBonds = [];
    this.angularBonds = [];
    this.torsionalBonds = [];
    this.center = new Vector3();
  }

  // for molecule serialized from Firestore
  static clone(molecule: Molecule): Molecule {
    const map = new Map<number, Atom>();
    const newAtoms: Atom[] = [];
    for (const [i, a] of molecule.atoms.entries()) {
      const clone = Atom.clone(a);
      map.set(i, clone);
      newAtoms.push(clone);
    }
    const newRadialBonds: RadialBond[] = [];
    if (molecule.radialBonds && molecule.radialBonds.length > 0) {
      for (const b of molecule.radialBonds) {
        const a1 = map.get(b.atom1.index);
        const a2 = map.get(b.atom2.index);
        if (a1 && a2) newRadialBonds.push(new RadialBond(a1, a2));
      }
    }
    const newAngularBonds: AngularBond[] = [];
    if (molecule.angularBonds && molecule.angularBonds.length > 0) {
      for (const b of molecule.angularBonds) {
        const a1 = map.get(b.atom1.index);
        const a2 = map.get(b.atom2.index);
        const a3 = map.get(b.atom3.index);
        if (a1 && a2 && a3) newAngularBonds.push(new AngularBond(a1, a2, a3));
      }
    }
    const newTorsionalBonds: TorsionalBond[] = [];
    if (molecule.torsionalBonds && molecule.torsionalBonds.length > 0) {
      for (const b of molecule.torsionalBonds) {
        const a1 = map.get(b.atom1.index);
        const a2 = map.get(b.atom2.index);
        const a3 = map.get(b.atom3.index);
        const a4 = map.get(b.atom4.index);
        if (a1 && a2 && a3 && a4) newTorsionalBonds.push(new TorsionalBond(a1, a2, a3, a4));
      }
    }
    const mol = new Molecule(molecule.name, newAtoms);
    mol.radialBonds = newRadialBonds;
    mol.angularBonds = newAngularBonds;
    mol.torsionalBonds = newTorsionalBonds;
    return mol;
  }

  updateCenter() {
    if (this.atoms.length === 0) return;
    this.center.set(0, 0, 0);
    for (const a of this.atoms) {
      this.center.add(a.position);
    }
    this.center.multiplyScalar(1 / this.atoms.length);
  }

  setCenter(point: Vector3) {
    this.updateCenter();
    const diff = new Vector3().subVectors(point, this.center);
    for (const a of this.atoms) {
      a.position.add(diff);
    }
    this.center.copy(point);
  }
}
