/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Atom } from './Atom.ts';
import { RadialBond } from './RadialBond.ts';
import { MoleculeInterface } from '../types.ts';
import { Vector3 } from 'three';

export class Molecule implements MoleculeInterface {
  name: string;
  atoms: Atom[];
  bonds: RadialBond[];
  center: Vector3;

  url?: string;
  internal?: boolean;
  invisible?: boolean;
  excluded?: boolean;
  metadata?: any;

  constructor(name: string, atoms: Atom[], bonds: RadialBond[]) {
    this.name = name;
    this.atoms = atoms;
    this.bonds = bonds;
    this.center = new Vector3();
  }

  // for molecule serialized from Firestore
  static clone(molecule: Molecule): Molecule {
    const newAtoms: Atom[] = [];
    for (const a of molecule.atoms) {
      newAtoms.push(Atom.clone(a));
    }
    const newRadialBonds: RadialBond[] = [];
    return new Molecule(molecule.name, newAtoms, newRadialBonds);
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