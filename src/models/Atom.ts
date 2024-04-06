/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Vector3 } from 'three';
import { Restraint } from './Restraint.ts';
import { TWO_PI } from '../constants.ts';
import { EV_CONVERTER, GF_CONVERSION_CONSTANT } from './physicalConstants.ts';

export class Atom {
  index: number;
  elementSymbol: string;
  position: Vector3;

  mass: number = 10;
  sigma: number = 1; // van der Waals radius
  epsilon: number = 0.05; // van der Waals energy
  charge: number = 0;
  damp: number = 0;
  restraint?: Restraint;

  displacement?: Vector3;
  velocity: Vector3;
  acceleration?: Vector3;
  force: Vector3;

  fixed: boolean = false;

  initialPosition?: Vector3;
  initialVelocity?: Vector3;

  constructor(index: number, elementSymbol: string, position: Vector3, init?: boolean) {
    this.index = index;
    this.elementSymbol = elementSymbol;
    this.position = position;
    this.velocity = new Vector3();
    this.force = new Vector3();
    if (init) {
      this.displacement = new Vector3();
      this.acceleration = new Vector3();
      this.initialPosition = new Vector3();
      this.initialVelocity = new Vector3();
    }
  }

  // for atom serialized from Firestore
  static clone(atom: Atom): Atom {
    const newAtom = new Atom(
      atom.index,
      atom.elementSymbol,
      new Vector3(atom.position.x, atom.position.y, atom.position.z),
    );
    newAtom.velocity.copy(atom.velocity);
    newAtom.force.copy(atom.force);
    if (atom.displacement) {
      newAtom.displacement = new Vector3();
      newAtom.acceleration = new Vector3();
      newAtom.initialPosition = new Vector3();
      newAtom.initialVelocity = new Vector3();
    }
    return newAtom;
  }

  reset() {
    if (this.initialPosition) {
      this.position.copy(this.initialPosition);
    }
    if (this.initialVelocity) {
      this.velocity.copy(this.initialVelocity);
    }
  }

  distanceTo(target: Atom): number {
    return this.position.distanceTo(target.position);
  }

  distanceToSquared(target: Atom): number {
    return this.position.distanceToSquared(target.position);
  }

  /* given the speed scalar, assign a velocity vector in a random direction */
  setRandomVelocity(speed: number) {
    if (!this.velocity) return;
    const theta = TWO_PI * Math.random();
    const phi = TWO_PI * Math.random();
    this.velocity.x = speed * Math.cos(phi) * Math.sin(theta);
    this.velocity.y = speed * Math.sin(phi) * Math.sin(theta);
    this.velocity.z = speed * Math.cos(theta);
  }

  getKineticEnergy() {
    if (!this.velocity || !this.mass) return 0;
    return 0.5 * this.mass * this.velocity.lengthSq() * EV_CONVERTER;
  }

  /* predict new position using 2nd order Taylor expansion: dt2 = dt*dt/2 */
  predict(dt: number, dt2: number) {
    if (this.fixed) return;
    if (!this.displacement || !this.velocity || !this.acceleration) return;
    this.displacement.x = this.velocity.x * dt + this.acceleration.x * dt2;
    this.displacement.y = this.velocity.y * dt + this.acceleration.y * dt2;
    this.displacement.z = this.velocity.z * dt + this.acceleration.z * dt2;
    this.position.x += this.displacement.x;
    this.position.y += this.displacement.y;
    this.position.z += this.displacement.z;
    this.velocity.x += this.acceleration.x * dt;
    this.velocity.y += this.acceleration.y * dt;
    this.velocity.z += this.acceleration.z * dt;
  }

  /*
   * correct the predicted position. Note that the force was used in the force calculation routine
   * to store the new acceleration data. The acceleration was used to hold the old acceleration
   * before calculating the force. After that, new acceleration will be assigned. Be aware that the
   * acceleration and force are correct ONLY after this correction method has been called.
   *
   * h = half of the time increment
   */
  correct(h: number) {
    if (this.fixed) return;
    if (!this.force || !this.velocity || !this.acceleration || !this.mass) return;
    this.velocity.x += h * (this.force.x - this.acceleration.x);
    this.velocity.y += h * (this.force.y - this.acceleration.y);
    this.velocity.z += h * (this.force.z - this.acceleration.z);
    this.acceleration.copy(this.force);
    this.force.multiplyScalar(this.mass);
  }

  // Check if this atom is bonded with the target via a radial bond
  isRBonded(a: Atom): boolean {
    return false;
  }

  // Check if this atom is bonded with the target via an angular bond
  isABonded(a: Atom): boolean {
    return false;
  }

  // Check if this atom is bonded with the target via a torsional bond
  isTBonded(a: Atom): boolean {
    return false;
  }

  applyDamping() {
    if (this.damp > 0 && this.force && this.velocity) {
      const d = GF_CONVERSION_CONSTANT * this.damp;
      this.force.x -= d * this.velocity.x;
      this.force.y -= d * this.velocity.y;
      this.force.z -= d * this.velocity.z;
    }
  }

  // calculate force and return potential energy: v(r)=k*(ri-ri_0)^2/2
  applyRestraint(): number {
    let energy = 0;
    if (this.restraint && this.force) {
      const k = (this.restraint.strength * GF_CONVERSION_CONSTANT) / this.mass;
      const dx = this.position.x - this.restraint.position.x;
      const dy = this.position.y - this.restraint.position.y;
      const dz = this.position.z - this.restraint.position.z;
      this.force.x -= k * dx;
      this.force.y -= k * dy;
      this.force.z -= k * dz;
      energy = 0.5 * this.restraint.strength * (dx * dx + dy * dy + dz * dz);
    }
    return energy;
  }
}
