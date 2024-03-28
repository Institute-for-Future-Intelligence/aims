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
import { EV_CONVERTER, VT_CONVERSION_CONSTANT } from './physicalConstants.ts';
import { ZERO_TOLERANCE } from '../constants.ts';
import { ModelUtil } from './ModelUtil.ts';

export class MolecularDynamics {
  atoms: Atom[];
  nonBondedInteractions: NonBondedInteractions;
  radialBonds: RadialBond[];
  angularBonds: AngularBond[];
  torsionalBonds: TorsionalBond[];
  container: MolecularContainer;
  potentialEnergy: number;
  kineticEnergy: number;
  totalEnergy: number;
  movableCount: number;

  timeStep: number = 0.5;
  indexOfStep: number = 0;

  constructor(molecules: Molecule[], container: MolecularContainer) {
    this.atoms = [];
    for (const m of molecules) {
      this.atoms.push(...m.atoms);
    }
    this.nonBondedInteractions = new NonBondedInteractions(this.atoms);
    this.radialBonds = [];
    this.angularBonds = [];
    this.torsionalBonds = [];
    this.container = { ...container };
    this.potentialEnergy = 0;
    this.kineticEnergy = 0;
    this.totalEnergy = 0;
    this.movableCount = 0;
  }

  countMovables(): number {
    this.movableCount = 0;
    for (const a of this.atoms) {
      if (!a.fixed) this.movableCount++;
    }
    return this.movableCount;
  }

  init(): void {
    for (const a of this.atoms) {
      a.setRandomVelocity(0.1);
    }
  }

  // assign velocities to atoms according to the Boltzman-Maxwell distribution
  assignTemperature(temperature: number) {
    if (temperature < ZERO_TOLERANCE) temperature = 0;
    const rtemp = Math.sqrt(temperature) * VT_CONVERSION_CONSTANT;
    let sumVx = 0;
    let sumVy = 0;
    let sumVz = 0;
    let sumMass = 0;
    const n = this.atoms.length;
    if (n > 0) {
      for (let i = 0; i < n; i++) {
        if (this.atoms[i].fixed) continue;
        this.atoms[i].velocity.x = rtemp * ModelUtil.nextGaussian();
        this.atoms[i].velocity.y = rtemp * ModelUtil.nextGaussian();
        this.atoms[i].velocity.z = rtemp * ModelUtil.nextGaussian();
        sumVx += this.atoms[i].velocity.x * this.atoms[i].mass;
        sumVy += this.atoms[i].velocity.y * this.atoms[i].mass;
        sumVz += this.atoms[i].velocity.z * this.atoms[i].mass;
        sumMass += this.atoms[i].mass;
      }
    }
    if (sumMass > ZERO_TOLERANCE) {
      sumVx /= sumMass;
      sumVy /= sumMass;
      sumVz /= sumMass;
      if (n > 1) {
        for (let i = 0; i < n; i++) {
          if (this.atoms[i].fixed) continue;
          this.atoms[i].velocity.x -= sumVx;
          this.atoms[i].velocity.y -= sumVy;
          this.atoms[i].velocity.z -= sumVz;
        }
      }
      // setTemperature(temperature);
    }
  }

  move() {
    if (this.movableCount === 0) return;
    if (this.indexOfStep % 10 === 0) this.nonBondedInteractions.checkNeighborList();
    this.kineticEnergy = 0;
    this.potentialEnergy = 0;
    const dt2 = (this.timeStep * this.timeStep) / 2;
    const h = this.timeStep / 2;
    for (const a of this.atoms) {
      a.predict(this.timeStep, dt2);
    }
    this.calculateForce();
    for (const a of this.atoms) {
      a.correct(h);
      this.kineticEnergy += a.getKineticEnergy();
    }
    this.applyBoundary();
    this.kineticEnergy *= EV_CONVERTER;
    this.totalEnergy = this.kineticEnergy + this.potentialEnergy;
    this.indexOfStep++;
    if (this.indexOfStep % 10 == 0) {
      console.log(this.indexOfStep, this.kineticEnergy, this.potentialEnergy, this.totalEnergy);
    }
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
