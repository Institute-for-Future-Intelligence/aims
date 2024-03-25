/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
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
import { MolecularContainer } from '../types.ts';

export class NonBondedInteractions {
  atoms: Atom[] = [];
  container: MolecularContainer = { lx: 50, ly: 50, lz: 50 } as MolecularContainer;
  rCutOff: number = 2.5;

  private updateList: boolean = true;
  private neighborList: number[] = [];
  private pointer: number[] = [];
  private lastPositions: Vector3[] = [];
  private rList: number = this.rCutOff + 1;
  private pairs: Pair[] = [];
  private indexOfPair: number = 0;

  constructor() {}

  initArrays(size: number) {
    this.lastPositions = new Array<Vector3>(size);
    for (let i = 0; i < this.lastPositions.length; i++) {
      this.lastPositions[i] = new Vector3();
    }
    this.neighborList = new Array<number>((size * size) / 2);
    this.pointer = new Array<number>(size);
  }

  setContainer(lx: number, ly: number, lz: number) {
    this.container.lx = lx;
    this.container.ly = ly;
    this.container.lz = lz;
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

  private checkNeighborList() {
    let max = 0;
    for (const [i, a] of this.atoms.entries()) {
      if (a.fixed) continue;
      max = Math.max(max, Math.abs(a.position.x - this.lastPositions[i].x) / a.sigma);
      max = Math.max(max, Math.abs(a.position.y - this.lastPositions[i].y) / a.sigma);
      max = Math.max(max, Math.abs(a.position.z - this.lastPositions[i].z) / a.sigma);
    }
    max = 2 * Math.sqrt(3.0 * max * max);
    this.updateList = max > this.rList - this.rCutOff; // rList & rCutOff are relative to sigma
  }

  private expandPairs(additionalSize?: number) {
    const n = additionalSize ?? 100;
    for (let i = 0; i < n; i++) {
      this.pairs.push(new Pair(-1, -1));
    }
  }

  private addPair(atomI: Atom, atomJ: Atom) {
    // skip if one of the following conditions is met
    if (atomI.fixed && atomJ.fixed) return;
    if (atomI.isRBonded(atomJ) || atomI.isABonded(atomJ) || atomI.isTBonded(atomJ)) return;
    if (atomI.charge * atomJ.charge > 0) return;
    const rijsq = atomI.position.distanceToSquared(atomJ.position);
    let sigab = (atomI.sigma + atomJ.sigma) * 0.5;
    sigab *= sigab;
    let ratio = 1; //model.getView().getVdwLinesRatio();
    ratio *= ratio;
    if (rijsq > sigab && rijsq < sigab * ratio) {
      this.pairs[this.indexOfPair].set(atomI.index, atomJ.index);
      this.indexOfPair++;
      if (this.indexOfPair >= this.pairs.length) this.expandPairs();
    }
  }

  private generateVdwPairs(useNeightborList: boolean) {
    if (this.pairs.length === 0) {
      this.expandPairs();
    } else {
      for (const p of this.pairs) {
        p.set(-1, -1);
      }
    }
    const atomCount = this.atoms.length;
    this.indexOfPair = 0;
    if (useNeightborList) {
      let jBeg, jEnd;
      for (let i = 0; i < atomCount - 1; i++) {
        jBeg = this.pointer[i];
        jEnd = this.pointer[i + 1];
        if (jBeg < jEnd) {
          for (let j = jBeg; j < jEnd; j++) {
            this.addPair(this.atoms[i], this.atoms[this.neighborList[j]]);
          }
        }
      }
    } else {
      for (let i = 0; i < atomCount - 1; i++) {
        for (let j = i + 1; j < atomCount; j++) {
          this.addPair(this.atoms[i], this.atoms[j]);
        }
      }
    }
  }

  compute(time: number): number {
    const atomCount = this.atoms.length;
    if (atomCount === 0) return 0;

    let movableCount = 0;
    for (const a of this.atoms) {
      a.force?.set(0, 0, 0);
      if (!a.fixed) movableCount++;
    }
    if (movableCount === 0) return 0;

    this.checkNeighborList();

    const rCutOffSq = this.rCutOff * this.rCutOff;
    let vsum = 0;
    let coul = 0;
    let virialLJ = 0;
    let virialEL = 0;
    let rijsq, sigij, sigab, epsab, sr2, sr6, sr12, vij, wij, fij, fxij, fyij, fzij;

    if (this.updateList) {
      for (let i = 0; i < atomCount; i++) {
        this.lastPositions[i].copy(this.atoms[i].position);
      }

      let nlist = 0;

      for (let i = 0, atomCount1 = atomCount - 1; i < atomCount1; i++) {
        this.pointer[i] = nlist;

        const rxi = this.atoms[i].position.x;
        const ryi = this.atoms[i].position.y;
        const rzi = this.atoms[i].position.z;
        let fxi = this.atoms[i].force.x;
        let fyi = this.atoms[i].force.y;
        let fzi = this.atoms[i].force.z;

        for (let j = i + 1; j < atomCount; j++) {
          if (this.atoms[i].fixed && this.atoms[j].fixed) continue;
          // no need to compute Lennard-Jones and Coulombic forces for bonded pairs
          if (this.atoms[i].isRBonded(this.atoms[j]) || this.atoms[i].isABonded(this.atoms[j])) continue;

          const rxij = rxi - this.atoms[j].position.x;
          const ryij = ryi - this.atoms[j].position.y;
          const rzij = rzi - this.atoms[j].position.z;
          rijsq = Math.hypot(rxij, ryij, rzij);
          sigij = this.atoms[i].sigma * this.atoms[j].sigma;

          if (rijsq < this.rList * this.rList * sigij) {
            this.neighborList[nlist++] = j;
          }

          if (rijsq < rCutOffSq * sigij) {
            sigab = 0.5 * (this.atoms[i].sigma + this.atoms[j].sigma);
            sigab *= sigab;
            sr2 = sigab / rijsq;
            /* check if this pair gets too close */
            if (sr2 > 2.0) {
              sr2 = 2.0;
              rijsq = 0.5 * sigab;
            }
            sr6 = sr2 * sr2 * sr2;
            sr12 = sr6 * sr6;
            // geometric mean is costly
            // epsab = 4 * Math.sqrt(atom[i].epsilon * atom[j].epsilon);
            // use arithmetic mean instead
            epsab = 2.0 * (this.atoms[i].epsilon + this.atoms[j].epsilon);
            vij = (sr12 - sr6) * epsab;
            wij = vij + sr12 * epsab;

            vsum += vij;
            fij = (wij / rijsq) * SIX_TIMES_UNIT_FORCE;
            fxij = fij * rxij;
            fyij = fij * ryij;
            fzij = fij * rzij;
            fxi += fxij;
            fyi += fyij;
            fzi += fzij;
            this.atoms[j].force.x -= fxij;
            this.atoms[j].force.y -= fyij;
            this.atoms[j].force.z -= fzij;
          }

          if (Math.abs(this.atoms[i].charge) + Math.abs(this.atoms[j].charge) > ZERO_TOLERANCE) {
            coul = (COULOMB_CONSTANT * this.atoms[i].charge * this.atoms[j].charge) / Math.sqrt(rijsq);
            vsum += coul;
            virialEL += coul;
            fij = (coul / rijsq) * GF_CONVERSION_CONSTANT;
            fxij = fij * rxij;
            fyij = fij * ryij;
            fzij = fij * rzij;
            fxi += fxij;
            fyi += fyij;
            fzi += fzij;
            this.atoms[j].force.x -= fxij;
            this.atoms[j].force.y -= fyij;
            this.atoms[j].force.z -= fzij;
          }
        }

        this.atoms[i].force.x = fxi;
        this.atoms[i].force.y = fyi;
        this.atoms[i].force.z = fzi;
      }

      if (atomCount > 0) this.pointer[atomCount - 1] = nlist;
    } else {
      let j, jBeg, jEnd;

      for (let i = 0, atomCount1 = atomCount; i < atomCount1; i++) {
        const rxi = this.atoms[i].position.x;
        const ryi = this.atoms[i].position.y;
        const rzi = this.atoms[i].position.z;
        if (!this.atoms[i].force) this.atoms[i].force = new Vector3();
        let fxi = this.atoms[i].force.x;
        let fyi = this.atoms[i].force.y;
        let fzi = this.atoms[i].force.z;

        jBeg = this.pointer[i];
        jEnd = this.pointer[i + 1];

        if (jBeg < jEnd) {
          for (let jnab = jBeg; jnab < jEnd; jnab++) {
            j = this.neighborList[jnab];
            if (this.atoms[i].fixed && this.atoms[j].fixed) continue;
            // do not compute Lennard-Jones for bonded pairs.
            if (this.atoms[i].isRBonded(this.atoms[j]) || this.atoms[i].isABonded(this.atoms[j])) continue;

            const rxij = rxi - this.atoms[j].position.x;
            const ryij = ryi - this.atoms[j].position.y;
            const rzij = rzi - this.atoms[j].position.z;
            rijsq = Math.hypot(rxij, ryij, rzij);

            if (rijsq < rCutOffSq * this.atoms[i].sigma * this.atoms[j].sigma) {
              sigab = 0.5 * (this.atoms[i].sigma + this.atoms[j].sigma);
              sigab *= sigab;
              sr2 = sigab / rijsq;
              /* check if this pair gets too close */
              if (sr2 > 2.0) {
                sr2 = 2.0;
                rijsq = 0.5 * sigab;
              }
              sr6 = sr2 * sr2 * sr2;
              sr12 = sr6 * sr6;
              // geometric mean is costly
              // epsab = 4 * Math.sqrt(atom[i].epsilon * atom[j].epsilon);
              // use arithmetic mean instead
              epsab = 2.0 * (this.atoms[i].epsilon + this.atoms[j].epsilon);
              vij = (sr12 - sr6) * epsab;
              wij = vij + sr12 * epsab;
              vsum += vij;
              virialLJ += wij;

              fij = (wij / rijsq) * SIX_TIMES_UNIT_FORCE;
              fxij = fij * rxij;
              fyij = fij * ryij;
              fzij = fij * rzij;
              fxi += fxij;
              fyi += fyij;
              fzi += fzij;
              this.atoms[j].force.x -= fxij;
              this.atoms[j].force.y -= fyij;
              this.atoms[j].force.z -= fzij;
            }
          }
        }

        // do not use neighbor list for computing Coulombic forces because they are long-range
        for (j = i + 1; j < atomCount; j++) {
          if (Math.abs(this.atoms[i].charge) + Math.abs(this.atoms[j].charge) > ZERO_TOLERANCE) {
            if (this.atoms[i].fixed && this.atoms[j].fixed) continue;
            if (this.atoms[i].isRBonded(this.atoms[j]) || this.atoms[i].isABonded(this.atoms[j])) continue;
            const rxij = rxi - this.atoms[j].position.x;
            const ryij = ryi - this.atoms[j].position.y;
            const rzij = rzi - this.atoms[j].position.z;
            rijsq = Math.hypot(rxij, ryij, rzij);
            coul = (COULOMB_CONSTANT * this.atoms[i].charge * this.atoms[j].charge) / Math.sqrt(rijsq);
            vsum += coul;
            virialEL += coul;
            fij = (coul / rijsq) * GF_CONVERSION_CONSTANT;
            fxij = fij * rxij;
            fyij = fij * ryij;
            fzij = fij * rzij;
            fxi += fxij;
            fyi += fyij;
            fzi += fzij;
            this.atoms[j].force.x -= fxij;
            this.atoms[j].force.y -= fyij;
            this.atoms[j].force.z -= fzij;
          }
        }

        this.atoms[i].force.set(fxi, fyi, fzi);
      }
    }

    for (let i = 0; i < atomCount; i++) {
      if (this.atoms[i].fixed) continue;
      this.atoms[i].applyDamping();
      // vsum += computeFields(atom[i]);
      this.atoms[i].force.multiplyScalar(1 / this.atoms[i].mass);
    }

    // must be after the above procedure because the mass is divided separately for the following forces
    // each of the following routines consume much less time than the vdw calculations (for <1000 r, a, t-bonds)
    // vsum += calculateRestraints();
    // vsum += calculateRBonds();
    // vsum += calculateABonds();
    // vsum += calculateTBonds();

    virialLJ *= 3.0;

    return vsum / movableCount;
  }
}
