/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 * See: https://en.wikipedia.org/wiki/Molecular_dynamics
 *
 * Avogadro's constant = 6 x 10^23 per mole
 * An electron volt (eV) = 1.6 x 10^-19 joules
 * Boltzmann's constant = 1.38 x 10^-23 joules/kelvin
 * Planck's constant (h-bar) = 6.583 x 10^-16 eV*s
 * Coulomb's constant * electron charge ^2 = 14.4 eV*angstrom
 * Unit of mass = g/mol (atomic mass unit)
 * Unit of length = angstrom
 * Unit of time = femtosecond (10^-15 second)
 * Unit of temperature = kelvin
 *
 */

import { Atom } from './Atom.ts';
import { RadialBond } from './RadialBond.ts';
import { AngularBond } from './AngularBond.ts';
import { TorsionalBond } from './TorsionalBond.ts';
import { MolecularContainer } from '../types.ts';
import { NonBondedInteractions } from './NonBondedInteractions.ts';
import { Molecule } from './Molecule.ts';
import { UNIT_EV_OVER_KB, VT_CONVERSION_CONSTANT } from './physicalConstants.ts';
import { ZERO_TOLERANCE } from '../constants.ts';
import { ModelUtil } from './ModelUtil.ts';
import { HeatBath } from './HeatBath.ts';
import { Damper } from './Damper.ts';

export class MolecularDynamics {
  atoms: Atom[];
  nonBondedInteractions: NonBondedInteractions;
  radialBonds: RadialBond[];
  angularBonds: AngularBond[];
  torsionalBonds: TorsionalBond[];
  dampers: Damper[];
  container: MolecularContainer;
  potentialEnergy: number; // total potential energy, not average
  kineticEnergy: number; // total kinetic energy, not average
  totalEnergy: number; // not average
  movableCount: number;
  moleculeCount: number;

  timeStep: number = 0.5;
  indexOfStep: number = 0;
  heatBath: HeatBath;

  constructor(molecules: Molecule[], container: MolecularContainer) {
    this.moleculeCount = molecules.length;
    this.atoms = [];
    this.radialBonds = [];
    this.angularBonds = [];
    this.torsionalBonds = [];
    this.dampers = [];
    for (const m of molecules) {
      this.atoms.push(...m.atoms);
      this.radialBonds.push(...m.radialBonds);
      this.angularBonds.push(...m.angularBonds);
      this.torsionalBonds.push(...m.torsionalBonds);
    }
    this.nonBondedInteractions = new NonBondedInteractions(this.atoms, this.radialBonds);
    this.container = { ...container };
    this.potentialEnergy = 0;
    this.kineticEnergy = 0;
    this.totalEnergy = 0;
    this.movableCount = 0;
    this.heatBath = new HeatBath(300);
  }

  countMovables(): number {
    this.movableCount = 0;
    for (const a of this.atoms) {
      if (!a.fixed) this.movableCount++;
    }
    return this.movableCount;
  }

  reset(): void {
    this.indexOfStep = 0;
    for (const a of this.atoms) {
      a.reset();
    }
  }

  init(): void {
    for (const a of this.atoms) {
      a.setRandomVelocity(0.1);
    }
  }

  // assign velocities to atoms according to the Boltzmann-Maxwell distribution
  assignTemperature(temperature: number) {
    const n = this.atoms.length;
    if (n === 0) return;
    if (this.movableCount === 0) return;
    if (temperature < 0) temperature = 0; // no negative temperature
    const tmp = Math.sqrt(temperature) * VT_CONVERSION_CONSTANT;
    let sumVx = 0;
    let sumVy = 0;
    let sumVz = 0;
    let sumMass = 0;
    for (const a of this.atoms) {
      if (a.fixed) continue;
      a.velocity.x = tmp * ModelUtil.nextGaussian();
      a.velocity.y = tmp * ModelUtil.nextGaussian();
      a.velocity.z = tmp * ModelUtil.nextGaussian();
      sumVx += a.velocity.x * a.mass;
      sumVy += a.velocity.y * a.mass;
      sumVz += a.velocity.z * a.mass;
      sumMass += a.mass;
    }
    // if more than one atom, ensure that the average velocity is zero
    if (sumMass > ZERO_TOLERANCE && this.movableCount > 1) {
      sumVx /= sumMass;
      sumVy /= sumMass;
      sumVz /= sumMass;
      for (const a of this.atoms) {
        if (a.fixed) continue;
        a.velocity.x -= sumVx;
        a.velocity.y -= sumVy;
        a.velocity.z -= sumVz;
      }
    }
    this.setTemperature(temperature);
  }

  setTemperature(temperature: number) {
    if (this.atoms.length === 0) return;
    if (this.movableCount === 0) return;
    if (temperature < ZERO_TOLERANCE) temperature = 0;
    this.updateKineticEnergy(); // ensure that we get the latest kinetic energy
    const kin = this.kineticEnergy / this.atoms.length;
    let tmp = kin * UNIT_EV_OVER_KB;
    if (tmp < ZERO_TOLERANCE && temperature > ZERO_TOLERANCE) {
      this.assignTemperature(temperature);
      tmp = kin * UNIT_EV_OVER_KB;
    }
    if (tmp > ZERO_TOLERANCE) this.rescaleVelocities(Math.sqrt(temperature / tmp));
  }

  rescaleVelocities(ratio: number) {
    for (const a of this.atoms) {
      if (a.fixed) continue;
      a.velocity.multiplyScalar(ratio);
    }
  }

  // change the temperature by percentage
  changeTemperature(percent: number) {
    if (this.atoms.length === 0) return;
    percent *= 0.01;
    const currentTemperature = this.heatBath.temperature;
    this.heatBath.increaseByPercentage(percent);
    if (this.heatBath.temperature > HeatBath.MAXIMUM_TEMPERATURE) {
      this.heatBath.temperature = currentTemperature;
      return;
    }
    this.updateKineticEnergy(); // ensure that we get the latest kinetic energy
    if (this.kineticEnergy < ZERO_TOLERANCE) {
      this.assignTemperature(100);
    }
    const ratio = Math.max(0, 1 + percent);
    this.rescaleVelocities(Math.sqrt(ratio));
  }

  updateKineticEnergy() {
    this.kineticEnergy = 0;
    for (const a of this.atoms) {
      this.kineticEnergy += a.getKineticEnergy();
    }
  }

  getCurrentTemperature(): number {
    if (this.atoms.length === 0) return 0;
    return (this.kineticEnergy * UNIT_EV_OVER_KB) / this.atoms.length;
  }

  move() {
    if (this.movableCount === 0) return;
    if (this.indexOfStep % 10 === 0) this.nonBondedInteractions.checkNeighborList();
    this.potentialEnergy = 0;
    const dt2 = (this.timeStep * this.timeStep) / 2;
    const h = this.timeStep / 2;
    for (const a of this.atoms) {
      a.predict(this.timeStep, dt2);
    }
    this.calculateForce();
    for (const a of this.atoms) {
      a.correct(h);
    }
    if (this.heatBath.enabled) {
      this.setTemperature(this.heatBath.temperature);
    }
    this.applyBoundary();
    this.updateKineticEnergy();
    this.totalEnergy = this.kineticEnergy + this.potentialEnergy;
    this.indexOfStep++;
  }

  calculateForce() {
    if (this.atoms.length === 0) return;
    this.potentialEnergy += this.nonBondedInteractions.compute();
    if (this.radialBonds.length > 0) {
      for (const rb of this.radialBonds) {
        this.potentialEnergy += rb.compute();
      }
    }
    if (this.angularBonds.length > 0) {
      for (const ab of this.angularBonds) {
        this.potentialEnergy += ab.compute();
      }
    }
    if (this.torsionalBonds.length > 0) {
      for (const tb of this.torsionalBonds) {
        this.potentialEnergy += tb.compute();
      }
    }
    for (const a of this.atoms) {
      if (a.restraint) {
        this.potentialEnergy += a.computeRestraint();
      }
    }
    if (this.dampers.length > 0) {
      for (const d of this.dampers) {
        d.compute(this.atoms);
      }
    }
  }

  applyBoundary() {
    let radius = 0;
    const hx = this.container.lx / 2;
    const hy = this.container.ly / 2;
    const hz = this.container.lz / 2;
    for (const a of this.atoms) {
      if (a.fixed || !a.velocity) continue;
      radius = 0.5 * a.sigma;
      if (a.position.x > hx - radius) {
        a.velocity.x = -Math.abs(a.velocity.x);
      } else if (a.position.x < radius - hx) {
        a.velocity.x = Math.abs(a.velocity.x);
      }
      if (a.position.y > hy - radius) {
        a.velocity.y = -Math.abs(a.velocity.y);
      } else if (a.position.y < radius - hy) {
        a.velocity.y = Math.abs(a.velocity.y);
      }
      if (a.position.z > hz - radius) {
        a.velocity.z = -Math.abs(a.velocity.z);
      } else if (a.position.z < radius - hz) {
        a.velocity.z = Math.abs(a.velocity.z);
      }
    }
  }
}
