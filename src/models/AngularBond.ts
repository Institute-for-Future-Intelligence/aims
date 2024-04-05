/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 * The angle-bending potential is 0.5*strength*(theta-angle)^2
 *
 * See AMBER force field: http://en.wikipedia.org/wiki/AMBER
 */

import { Atom } from './Atom.ts';
import { Vector3 } from 'three';
import { GF_CONVERSION_CONSTANT, MIN_SIN_THETA } from './physicalConstants.ts';

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
    this.angle = AngularBond.getAngle(atom1, atom2, atom3);
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

  compute(): number {
    if (this.atom1.fixed && this.atom2.fixed && this.atom3.fixed) return 0;
    if (!this.atom1.force || !this.atom2.force || !this.atom3.force) return 0;
    const v12 = new Vector3().subVectors(this.atom1.position, this.atom2.position);
    const v32 = new Vector3().subVectors(this.atom3.position, this.atom2.position);
    const d12sq = v12.lengthSq();
    const d32sq = v32.lengthSq();
    const d12 = Math.sqrt(d12sq);
    const d32 = Math.sqrt(d32sq);
    const theta = v12.angleTo(v32);
    let sin = Math.sin(theta);
    if (Math.abs(sin) < MIN_SIN_THETA) {
      // avoid 0 or 180 degree disaster (don't use Math.sign as it still may get zero)
      sin = sin > 0 ? MIN_SIN_THETA : -MIN_SIN_THETA;
    }
    const delta = theta - this.angle;
    const a = (this.strength * delta) / (sin * d12 * d32);
    const b = v12.x * v32.x + v12.y * v32.y + v12.z * v32.z;

    const fx1 = a * (v32.x - (b * v12.x) / d12sq);
    const fy1 = a * (v32.y - (b * v12.y) / d12sq);
    const fz1 = a * (v32.z - (b * v12.z) / d12sq);
    const fx3 = a * (v12.x - (b * v32.x) / d32sq);
    const fy3 = a * (v12.y - (b * v32.y) / d32sq);
    const fz3 = a * (v12.z - (b * v32.z) / d32sq);

    const inverseMass1 = GF_CONVERSION_CONSTANT / this.atom1.mass;
    const inverseMass2 = GF_CONVERSION_CONSTANT / this.atom2.mass;
    const inverseMass3 = GF_CONVERSION_CONSTANT / this.atom3.mass;
    this.atom1.force.x += fx1 * inverseMass1;
    this.atom1.force.y += fy1 * inverseMass1;
    this.atom1.force.z += fz1 * inverseMass1;
    this.atom3.force.x += fx3 * inverseMass3;
    this.atom3.force.y += fy3 * inverseMass3;
    this.atom3.force.z += fz3 * inverseMass3;
    this.atom2.force.x -= (fx1 + fx3) * inverseMass2;
    this.atom2.force.y -= (fy1 + fy3) * inverseMass2;
    this.atom2.force.z -= (fz1 + fz3) * inverseMass2;

    return 0.5 * this.strength * delta * delta;
  }
}
