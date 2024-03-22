/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 * The torsional potential is 0.5*strength*[1+cos(n*omega-gamma)]
 *
 * Is omega just the angle between the a1-a2 vector and the a3-a4 vector, or the dihedral angle between the a1-a2-a3
 * plane and a2-a3-a4 plane? The former case is faster to compute.
 *
 * See AMBER force field: http://en.wikipedia.org/wiki/AMBER
 */

import { Atom } from './Atom.ts';

export class TorsionalBond {
  static DEFAULT_STRENGTH = 1;

  /* return the dihedral angle between a2-a1 vector and a3-a4 vector (a2 and a3 are in the middle) */
  static getDihedral(a1: Atom, a2: Atom, a3: Atom, a4: Atom) {
    const x21 = a2.position.x - a1.position.x;
    const y21 = a2.position.y - a1.position.y;
    const z21 = a2.position.z - a1.position.z;
    const x34 = a3.position.x - a4.position.x;
    const y34 = a3.position.y - a4.position.y;
    const z34 = a3.position.z - a4.position.z;
    const xx = y21 * z34 - z21 * y34;
    const yy = z21 * x34 - x21 * z34;
    const zz = x21 * y34 - y21 * x34;
    return Math.abs(Math.atan2(Math.sqrt(xx * xx + yy * yy + zz * zz), x21 * x34 + y21 * y34 + z21 * z34));
  }

  atom1: Atom; // end atom
  atom2: Atom; // middle atom
  atom3: Atom; // middle atom
  atom4: Atom; // end atom
  periodicity: number;
  strength: number;
  dihedral: number; // equilibrium dihedral angle when the torsional force is zero

  constructor(atom1: Atom, atom2: Atom, atom3: Atom, atom4: Atom) {
    this.atom1 = atom1;
    this.atom2 = atom2;
    this.atom3 = atom3;
    this.atom4 = atom4;
    this.periodicity = 1;
    this.strength = TorsionalBond.DEFAULT_STRENGTH;
    this.dihedral = 0;
  }

  containsAtom(atom: Atom): boolean {
    return this.atom1 === atom || this.atom2 === atom || this.atom3 === atom || this.atom4 === atom;
  }

  containsAtomIndex(index: number): boolean {
    return (
      this.atom1.index === index ||
      this.atom2.index === index ||
      this.atom3.index === index ||
      this.atom4.index === index
    );
  }

  getCurrentDihedral(): number {
    return TorsionalBond.getDihedral(this.atom1, this.atom2, this.atom3, this.atom4);
  }
}
