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
import { Vector3 } from 'three';
import { GF_CONVERSION_CONSTANT, MIN_SIN_THETA } from './physicalConstants.ts';

export class TorsionalBond {
  static readonly DEFAULT_STRENGTH = 1;

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
    this.dihedral = TorsionalBond.getDihedral(atom1, atom2, atom3, atom4);
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

  /*
   * Important note: To save computation, we don't actually compute the dihedral angle. Instead, we compute the
   * direct angle between 1-2 bond and 3-4 bond, which is much faster. The result of this simplification is that one
   * will have to be careful in setting the equilibrium angle to be that between 1-2 and 3-4. If this is taken care of
   * correctly, there should not be any adverse effect caused by this simplification.
   */
  compute(): number {
    if (this.atom1.fixed && this.atom2.fixed && this.atom3.fixed && this.atom4.fixed) return 0;
    if (!this.atom1.force || !this.atom2.force || !this.atom3.force || !this.atom4.force) return 0;
    const v12 = new Vector3().subVectors(this.atom1.position, this.atom2.position);
    const v43 = new Vector3().subVectors(this.atom4.position, this.atom3.position);
    const r12sq = v12.lengthSq();
    const r43sq = v43.lengthSq();
    const r12 = Math.sqrt(r12sq);
    const r43 = Math.sqrt(r43sq);
    const theta = v12.angleTo(v43);
    let sin = Math.sin(theta);
    if (Math.abs(sin) < MIN_SIN_THETA) {
      // avoid 0 or 180 degree disaster (don't use Math.sign as it still may get zero)
      sin = sin > 0 ? MIN_SIN_THETA : -MIN_SIN_THETA;
    }
    const delta = this.periodicity * theta - this.dihedral;
    const a = v12.x * v43.x + v12.y * v43.y + v12.z * v43.z;
    const b = (0.5 * this.periodicity * this.strength * Math.sin(delta)) / (r12 * r43 * sin);

    const fx1 = b * (v43.x - (a * v12.x) / r12sq);
    const fy1 = b * (v43.y - (a * v12.y) / r12sq);
    const fz1 = b * (v43.z - (a * v12.z) / r12sq);
    const fx4 = b * (v12.x - (a * v43.x) / r43sq);
    const fy4 = b * (v12.y - (a * v43.y) / r43sq);
    const fz4 = b * (v12.z - (a * v43.z) / r43sq);

    const inverseMass1 = GF_CONVERSION_CONSTANT / this.atom1.mass;
    const inverseMass2 = GF_CONVERSION_CONSTANT / this.atom2.mass;
    const inverseMass3 = GF_CONVERSION_CONSTANT / this.atom3.mass;
    const inverseMass4 = GF_CONVERSION_CONSTANT / this.atom4.mass;
    this.atom1.force.x += fx1 * inverseMass1;
    this.atom1.force.y += fy1 * inverseMass1;
    this.atom1.force.z += fz1 * inverseMass1;
    this.atom4.force.x += fx4 * inverseMass4;
    this.atom4.force.y += fy4 * inverseMass4;
    this.atom4.force.z += fz4 * inverseMass4;
    this.atom2.force.x -= fx1 * inverseMass2;
    this.atom2.force.y -= fy1 * inverseMass2;
    this.atom2.force.z -= fz1 * inverseMass2;
    this.atom3.force.x -= fx4 * inverseMass3;
    this.atom3.force.y -= fy4 * inverseMass3;
    this.atom3.force.z -= fz4 * inverseMass3;

    // note that we use 1-cos(...) instead of 1+cos(...) as used on the following page:
    // http://en.wikipedia.org/wiki/AMBER
    // This reduced the equilibrium energy to zero, as in the case of radial and angular bonds
    return 0.5 * this.strength * (1 - Math.cos(delta));
  }
}
