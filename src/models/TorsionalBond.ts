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
    return TorsionalBond.getDihedralFromPositions(a1.position, a2.position, a3.position, a4.position);
  }

  /* return the dihedral angle between p2-p1 vector and p3-p4 vector (p2 and p3 are in the middle) */
  static getDihedralFromPositions(p1: Vector3, p2: Vector3, p3: Vector3, p4: Vector3) {
    const x21 = p2.x - p1.x;
    const y21 = p2.y - p1.y;
    const z21 = p2.z - p1.z;
    const x34 = p3.x - p4.x;
    const y34 = p3.y - p4.y;
    const z34 = p3.z - p4.z;
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

  constructor(atom1: Atom, atom2: Atom, atom3: Atom, atom4: Atom, dihedral?: number) {
    this.atom1 = atom1;
    this.atom2 = atom2;
    this.atom3 = atom3;
    this.atom4 = atom4;
    this.periodicity = 1;
    this.strength = TorsionalBond.DEFAULT_STRENGTH;
    // dihedral angle may be zero, so we have to check against the case of zero angle
    this.dihedral = dihedral !== undefined ? dihedral : TorsionalBond.getDihedral(atom1, atom2, atom3, atom4);
  }

  containsAtom(atom: Atom): boolean {
    return this.atom1 === atom || this.atom2 === atom || this.atom3 === atom || this.atom4 === atom;
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
