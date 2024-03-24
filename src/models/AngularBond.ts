/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 * The angle-bending potential is 0.5*strength*(theta-angle)^2
 *
 * See AMBER force field: http://en.wikipedia.org/wiki/AMBER
 */

import { Atom } from './Atom.ts';

export class AngularBond {
  static readonly DEFAULT_STRENGTH = 50;

  /* return the angle a1-a2-a3 (a2 is in the middle) */
  static getAngle(a1: Atom, a2: Atom, a3: Atom) {
    const x21 = a2.position.x - a1.position.x;
    const y21 = a2.position.y - a1.position.y;
    const z21 = a2.position.z - a1.position.z;
    const x23 = a2.position.x - a3.position.x;
    const y23 = a2.position.y - a3.position.y;
    const z23 = a2.position.z - a3.position.z;
    const xx = y21 * z23 - z21 * y23;
    const yy = z21 * x23 - x21 * z23;
    const zz = x21 * y23 - y21 * x23;
    return Math.abs(Math.atan2(Math.sqrt(xx * xx + yy * yy + zz * zz), x21 * x23 + y21 * y23 + z21 * z23));
  }

  atom1: Atom; // end atom
  atom2: Atom; // middle atom (shared by two flanking radial bonds)
  atom3: Atom; // end atom
  strength: number;
  angle: number; // equilibrium angle when the angular force is zero

  constructor(atom1: Atom, atom2: Atom, atom3: Atom) {
    this.atom1 = atom1;
    this.atom2 = atom2;
    this.atom3 = atom3;
    this.strength = AngularBond.DEFAULT_STRENGTH;
    this.angle = Math.PI;
  }

  containsAtom(atom: Atom): boolean {
    return this.atom1 === atom || this.atom2 === atom || this.atom3 === atom;
  }

  containsAtomIndex(index: number): boolean {
    return this.atom1.index === index || this.atom2.index === index || this.atom3.index === index;
  }

  getCurrentAngle(): number {
    return AngularBond.getAngle(this.atom1, this.atom2, this.atom3);
  }
}
