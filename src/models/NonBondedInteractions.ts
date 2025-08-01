/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 *
 * Non-bonded interactions act between atoms which are not linked by covalent bonds, which
 * include van der Waals (Lennard-Jones) and electrostatic (Coulomb) forces.
 *
 * See: https://www.cryst.bbk.ac.uk/PPS2/course/section7/os_non.html
 *
 */

import { Atom } from './Atom.ts';
import { Vector3 } from 'three';
import { Pair } from './Pair.ts';
import { ZERO_TOLERANCE } from '../constants.ts';
import { COULOMB_CONSTANT, GF_CONVERSION_CONSTANT, SIX_TIMES_UNIT_FORCE } from './physicalConstants.ts';
import { RadialBond } from './RadialBond.ts';
import { ModelUtil } from './ModelUtil.ts';

export class NonBondedInteractions {
  atoms: Atom[] = [];
  rCutoff: number = 2.5;
  vdwLineCutoff: number = 0.5; // visual vdw line cutoff
  pairs: Pair[] = []; // export to draw vdw pairs (it is faster as it uses the neighbor list)
  virialLJ: number = 0;
  virialEL: number = 0;

  radialBonds: RadialBond[] = [];

  private updateList: boolean = true;
  private neighborList: number[] = [];
  private pointer: number[] = [];
  private lastPositions: Vector3[] = [];
  private rList: number = this.rCutoff + 1; // radius to list neighbors

  constructor(atoms: Atom[], radialBonds: RadialBond[]) {
    this.atoms = atoms;
    this.radialBonds = radialBonds;
    const n = atoms.length;
    this.lastPositions = new Array<Vector3>(n);
    for (let i = 0; i < n; i++) {
      this.lastPositions[i] = new Vector3();
    }
    this.neighborList = new Array<number>(Math.round((n * n) / 2));
    this.pointer = new Array<number>(n);
  }

  checkNeighborList() {
    let max = 0;
    for (const [i, a] of this.atoms.entries()) {
      if (a.fixed) continue;
      max = Math.max(max, Math.abs(a.position.x - this.lastPositions[i].x) / a.sigma);
      max = Math.max(max, Math.abs(a.position.y - this.lastPositions[i].y) / a.sigma);
      max = Math.max(max, Math.abs(a.position.z - this.lastPositions[i].z) / a.sigma);
    }
    max = 2 * Math.sqrt(3.0 * max * max);
    this.updateList = max > this.rList - this.rCutoff; // rList & rCutoff are relative to sigma
  }

  skipPair(i: number, j: number): boolean {
    // skip if both atoms are fixed
    if (this.atoms[i].fixed && this.atoms[j].fixed) return true;
    // skip if the two atoms are bonded
    for (const rb of this.radialBonds) {
      if (
        (rb.atom1 === this.atoms[i] && rb.atom2 === this.atoms[j]) ||
        (rb.atom2 === this.atoms[i] && rb.atom1 === this.atoms[j])
      )
        return true;
    }
    return false;
  }

  compute(): number {
    const atomCount = this.atoms.length;
    if (atomCount === 0) return 0;
    const atomCount1 = atomCount - 1;

    // reset all forces
    for (const a of this.atoms) {
      a.force?.set(0, 0, 0);
    }

    const rCutoffSq = this.rCutoff * this.rCutoff;
    const rListSq = this.rList * this.rList;
    let energy = 0;
    this.virialLJ = 0;
    this.virialEL = 0;

    // reuse this vector to store position difference between two atoms
    const v = new Vector3();

    if (this.updateList) {
      // store the current positions for the next update check
      for (let i = 0; i < atomCount; i++) {
        this.lastPositions[i].copy(this.atoms[i].position);
      }

      let listIndex = 0;
      for (let i = 0; i < atomCount1; i++) {
        this.pointer[i] = listIndex;
        let fxi = this.atoms[i].force?.x ?? 0;
        let fyi = this.atoms[i].force?.y ?? 0;
        let fzi = this.atoms[i].force?.z ?? 0;
        for (let j = i + 1; j < atomCount; j++) {
          if (this.skipPair(i, j)) continue;
          v.subVectors(this.atoms[i].position, this.atoms[j].position);
          let rsq = v.lengthSq();
          const sig = this.atoms[i].sigma * this.atoms[j].sigma;
          if (rsq < rListSq * sig) {
            this.neighborList[listIndex++] = j;
            if (rsq < rCutoffSq * sig) {
              let meanSig = 0.5 * (this.atoms[i].sigma + this.atoms[j].sigma);
              meanSig *= meanSig;
              let sr2 = meanSig / rsq;
              /* check if this pair gets too close */
              if (sr2 > 2) {
                sr2 = 2;
                rsq = 0.5 * meanSig;
              }
              const sr6 = sr2 * sr2 * sr2;
              const sr12 = sr6 * sr6;
              let meanEps;
              // workaround to prevent gas molecules from sticking to solids
              if (ModelUtil.isSolid(this.atoms[i]) && ModelUtil.isGas(this.atoms[j])) {
                meanEps = this.atoms[j].epsilon;
              } else if (ModelUtil.isSolid(this.atoms[j]) && ModelUtil.isGas(this.atoms[i])) {
                meanEps = this.atoms[i].epsilon;
              } else {
                // geometric mean is costly: 4*Math.sqrt(atom[i].epsilon*atom[j].epsilon); use arithmetic mean
                meanEps = 2.0 * (this.atoms[i].epsilon + this.atoms[j].epsilon);
              }
              const vij = meanEps * (sr12 - sr6); // Lennard-Jones potential
              const wij = vij + sr12 * meanEps; // Lennard-Jones virial
              energy += vij;
              this.virialLJ += wij;
              const fij = (wij / rsq) * SIX_TIMES_UNIT_FORCE;
              const gx = fij * v.x;
              const gy = fij * v.y;
              const gz = fij * v.z;
              fxi += gx;
              fyi += gy;
              fzi += gz;
              const force = this.atoms[j].force;
              if (force) {
                force.x -= gx;
                force.y -= gy;
                force.z -= gz;
              }
            }
          }

          if (Math.abs(this.atoms[i].charge) + Math.abs(this.atoms[j].charge) > ZERO_TOLERANCE) {
            if (!this.skipPair(i, j)) {
              const coulomb = (COULOMB_CONSTANT * this.atoms[i].charge * this.atoms[j].charge) / Math.sqrt(rsq);
              energy += coulomb; // Coulomb potential
              this.virialEL += coulomb; // Coulomb virial
              const fij = (coulomb / rsq) * GF_CONVERSION_CONSTANT;
              const gx = fij * v.x;
              const gy = fij * v.y;
              const gz = fij * v.z;
              fxi += gx;
              fyi += gy;
              fzi += gz;
              const force = this.atoms[j].force;
              if (force) {
                force.x -= gx;
                force.y -= gy;
                force.z -= gz;
              }
            }
          }
        }

        this.atoms[i].force?.set(fxi, fyi, fzi);
      }
      if (atomCount1 >= 0) this.pointer[atomCount1] = listIndex;
    } else {
      for (let i = 0; i < atomCount1; i++) {
        let fxi = this.atoms[i].force?.x ?? 0;
        let fyi = this.atoms[i].force?.y ?? 0;
        let fzi = this.atoms[i].force?.z ?? 0;
        const jBeg = this.pointer[i];
        const jEnd = this.pointer[i + 1];
        if (jBeg < jEnd) {
          for (let jList = jBeg; jList < jEnd; jList++) {
            const j = this.neighborList[jList];
            if (this.skipPair(i, j)) continue;
            v.subVectors(this.atoms[i].position, this.atoms[j].position);
            let rsq = v.lengthSq();
            if (rsq < rCutoffSq * this.atoms[i].sigma * this.atoms[j].sigma) {
              let meanSig = 0.5 * (this.atoms[i].sigma + this.atoms[j].sigma);
              meanSig *= meanSig;
              let sr2 = meanSig / rsq;
              /* check if this pair gets too close */
              if (sr2 > 2) {
                sr2 = 2;
                rsq = 0.5 * meanSig;
              }
              const sr6 = sr2 * sr2 * sr2;
              const sr12 = sr6 * sr6;
              let meanEps;
              // workaround to prevent gas molecules from sticking to solids
              if (ModelUtil.isSolid(this.atoms[i]) && ModelUtil.isGas(this.atoms[j])) {
                meanEps = this.atoms[j].epsilon;
              } else if (ModelUtil.isSolid(this.atoms[j]) && ModelUtil.isGas(this.atoms[i])) {
                meanEps = this.atoms[i].epsilon;
              } else {
                // geometric mean is costly: 4*Math.sqrt(atom[i].epsilon*atom[j].epsilon); use arithmetic mean
                meanEps = 2.0 * (this.atoms[i].epsilon + this.atoms[j].epsilon);
              }
              const vij = meanEps * (sr12 - sr6); // Lennard-Jones potential
              const wij = vij + sr12 * meanEps; // Lennard-Jones virial
              energy += vij;
              this.virialLJ += wij;
              const fij = (wij / rsq) * SIX_TIMES_UNIT_FORCE;
              const gx = fij * v.x;
              const gy = fij * v.y;
              const gz = fij * v.z;
              fxi += gx;
              fyi += gy;
              fzi += gz;
              const force = this.atoms[j].force;
              if (force) {
                force.x -= gx;
                force.y -= gy;
                force.z -= gz;
              }
            }
          }
        }

        // do not use neighbor list for computing Coulombic forces because they are long-range
        for (let j = i + 1; j < atomCount; j++) {
          if (Math.abs(this.atoms[i].charge) + Math.abs(this.atoms[j].charge) > ZERO_TOLERANCE) {
            if (!this.skipPair(i, j)) {
              v.subVectors(this.atoms[i].position, this.atoms[j].position);
              const rsq = v.lengthSq();
              const coulomb = (COULOMB_CONSTANT * this.atoms[i].charge * this.atoms[j].charge) / Math.sqrt(rsq);
              energy += coulomb;
              this.virialEL += coulomb;
              const fij = (coulomb / rsq) * GF_CONVERSION_CONSTANT;
              const fx = fij * v.x;
              const fy = fij * v.y;
              const fz = fij * v.z;
              fxi += fx;
              fyi += fy;
              fzi += fz;
              const force = this.atoms[j].force;
              if (force) {
                force.x -= fx;
                force.y -= fy;
                force.z -= fz;
              }
            }
          }
        }

        this.atoms[i].force?.set(fxi, fyi, fzi);
      }
    }

    for (let i = 0; i < atomCount; i++) {
      if (this.atoms[i].fixed) continue;
      this.atoms[i].force?.multiplyScalar(1 / this.atoms[i].mass);
    }

    this.virialLJ *= 3.0;

    return energy;
  }

  private expandPairs(increment?: number) {
    const n = increment ?? 100;
    for (let i = 0; i < n; i++) {
      this.pairs.push(new Pair(-1, -1));
    }
  }

  private addPair(i: number, j: number, indexOfPair: number) {
    // skip if one of the following conditions is met
    if (this.skipPair(i, j)) return;
    if (this.atoms[i].charge * this.atoms[j].charge > 0) return;
    const rsq = this.atoms[i].position.distanceToSquared(this.atoms[j].position);
    let sig = (this.atoms[i].sigma + this.atoms[j].sigma) * 0.5;
    sig *= sig;
    const cutoff = this.vdwLineCutoff * this.vdwLineCutoff;
    if (rsq > sig && rsq < sig * cutoff) {
      this.pairs[indexOfPair].set(i, j);
      if (indexOfPair >= this.pairs.length) this.expandPairs();
    }
  }

  generateVdwPairs() {
    if (this.pairs.length === 0) {
      this.expandPairs();
    } else {
      for (const p of this.pairs) {
        p.set(-1, -1);
      }
    }
    const atomCount = this.atoms.length;
    let indexOfPair = 0;
    if (this.updateList) {
      for (let i = 0; i < atomCount - 1; i++) {
        for (let j = i + 1; j < atomCount; j++) {
          this.addPair(i, j, indexOfPair);
          indexOfPair++;
        }
      }
    } else {
      let jBeg, jEnd;
      for (let i = 0; i < atomCount - 1; i++) {
        jBeg = this.pointer[i];
        jEnd = this.pointer[i + 1];
        if (jBeg < jEnd) {
          for (let j = jBeg; j < jEnd; j++) {
            this.addPair(i, this.neighborList[j], indexOfPair);
            indexOfPair++;
          }
        }
      }
    }
  }
}
