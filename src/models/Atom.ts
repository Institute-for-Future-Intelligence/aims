/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Vector3 } from 'three';
import { TWO_PI } from '../constants.ts';
import { EV_CONVERTER, GF_CONVERSION_CONSTANT } from './physicalConstants.ts';
import Element from '../lib/chem/Element';
import { Restraint } from './Restraint.ts';

export class Atom {
  // essential variables that should be persisted
  index: number;
  elementSymbol: string;
  position: Vector3;
  velocity: Vector3;

  // variables that can be created
  mass: number = 10;
  sigma: number = 1; // van der Waals radius
  epsilon: number = 0.05; // van der Waals energy
  charge: number = 0;

  displacement?: Vector3;
  acceleration?: Vector3;
  force?: Vector3;

  restraint?: Restraint;
  fixed?: boolean;

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
    const elem = Element.getByName(elementSymbol);
    this.mass = elem.weight;
    this.sigma = elem.radius;
  }

  // for atom serialized from Firestore, set full to be true
  static clone(atom: Atom, full?: boolean): Atom {
    const newAtom = new Atom(
      atom.index,
      atom.elementSymbol,
      new Vector3(atom.position.x, atom.position.y, atom.position.z),
    );
    newAtom.velocity.copy(atom.velocity);
    newAtom.force = new Vector3();
    if (atom.displacement) {
      newAtom.displacement = new Vector3();
    }
    if (atom.acceleration) {
      newAtom.acceleration = new Vector3();
    }
    if (atom.initialPosition) {
      newAtom.initialPosition = new Vector3();
    }
    if (atom.initialVelocity) {
      newAtom.initialVelocity = new Vector3();
      newAtom.initialVelocity.copy(atom.initialVelocity);
    }
    newAtom.fixed = atom.fixed;
    newAtom.charge = atom.charge;
    if (full) {
      if (atom.restraint) {
        // cannot use Vector3.clone() as the object from Firestore is not actually a Vector3
        const p = new Vector3(atom.restraint.position.x, atom.restraint.position.y, atom.restraint.position.z);
        newAtom.restraint = new Restraint(atom.restraint.strength, p);
      }
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

  // calculate force and return potential energy: v(r)=k*(ri-ri_0)^2/2
  computeRestraint(): number {
    if (this.restraint && this.restraint.strength > 0) {
      const k = (this.restraint.strength * GF_CONVERSION_CONSTANT) / this.mass;
      const dx = this.position.x - this.restraint.position.x;
      const dy = this.position.y - this.restraint.position.y;
      const dz = this.position.z - this.restraint.position.z;
      if (this.force) {
        this.force.x -= k * dx;
        this.force.y -= k * dy;
        this.force.z -= k * dz;
      }
      return 0.5 * this.restraint.strength * (dx * dx + dy * dy + dz * dz);
    }
    return 0;
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
}
