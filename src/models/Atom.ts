/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Vector3 } from 'three';
import { Restraint } from './Restraint.ts';
import { TWO_PI } from '../constants.ts';

export class Atom {
  index: number;
  elementSymbol: string;
  position: Vector3;

  mass?: number;
  sigma?: number; // van der Waals radius
  epsilon?: number; // van der Waals energy
  charge?: number;
  damp?: number;
  restraint?: Restraint;

  displacement?: Vector3;
  velocity?: Vector3;
  acceleration?: Vector3;
  force?: Vector3;

  fixed?: boolean;

  constructor(index: number, elementSymbol: string, position: Vector3, init?: boolean) {
    this.index = index;
    this.elementSymbol = elementSymbol;
    this.position = position;
    if (init) {
      this.displacement = new Vector3();
      this.velocity = new Vector3();
      this.acceleration = new Vector3();
      this.force = new Vector3();
    }
  }

  distanceToSquared = (target: Atom) => {
    return this.position.distanceToSquared(target.position);
  };

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
    return 0.5 * this.mass * this.velocity.lengthSq();
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
    this.acceleration.x = this.force.x;
    this.acceleration.y = this.force.y;
    this.acceleration.z = this.force.z;
    this.force.x *= this.mass;
    this.force.y *= this.mass;
    this.force.z *= this.mass;
  }
}
