/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 * See: https://en.wikipedia.org/wiki/Molecular_dynamics
 *
 */

import { Atom } from './Atom.ts';
import { RadialBond } from './RadialBond.ts';
import { AngularBond } from './AngularBond.ts';
import { TorsionalBond } from './TorsionalBond.ts';
import { MolecularContainer } from '../types.ts';
import { NonBondedInteractions } from './NonBondedInteractions.ts';
import { Molecule } from './Molecule.ts';
import { EV_CONVERTER } from './physicalConstants.ts';

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
    this.container = container;
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
    this.potentialEnergy /= this.atoms.length;
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
