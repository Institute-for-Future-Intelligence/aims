/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 */

import { Atom } from './Atom.ts';
import { Vector3 } from 'three';
import { Pair } from './Pair.ts';

export class ForceCalculator {
  // Coulomb's constant times the square of electron charge (ke^2), in eV*angstrom.
  // see http://hyperphysics.phy-astr.gsu.edu/hbase/electric/elefor.html
  static readonly COULOMB_CONSTANT = 14.4;

  // converts energy gradient unit into force unit:
  // 1.6E-19 [J] / ( E-10 [m] x E-3 / 6E23 [kg] ) / ( E-10 / ( E-15 ) ^2 ) [m/s^2]
  static readonly GF_CONVERSION_CONSTANT = 0.0096;

  static readonly SIX_TIMES_UNIT_FORCE = 6 * ForceCalculator.GF_CONVERSION_CONSTANT;

  static readonly MIN_SIN_THETA = 0.001;

  atoms: Atom[] = [];
  xBox: number = 50;
  yBox: number = 25;
  zBox: number = 25;
  rCutOff: number = 2.5;
  updateList: boolean = true;
  neighborList: number[] = [];
  pointer: number[] = [];
  isPBC: boolean = false;

  // internal variables

  private rx0: number[] = [];
  private ry0: number[] = [];
  private rz0: number[] = [];
  private nList: number = 0;
  private jBeg: number = 0;
  private jEnd: number = 0;
  private sigmaI: number = 0;
  private sigmaJ: number = 0;
  private sigmaIJ: number = 0;

  private fxi: number = 0;
  private fyi: number = 0;
  private fzi: number = 0;
  private fxk: number = 0;
  private fyk: number = 0;
  private fzk: number = 0;
  private fxl: number = 0;
  private fyl: number = 0;
  private fzl: number = 0;

  private rij: number = 0;
  private rijsq: number = 0;
  private rxkj: number = 0;
  private rykj: number = 0;
  private rzkj: number = 0;
  private rkj: number = 0;
  private rkjsq: number = 0;
  private rxlk: number = 0;
  private rylk: number = 0;
  private rzlk: number = 0;
  private rlk: number = 0;
  private rlksq: number = 0;

  private virialLJ: number = 0;
  private virialEL: number = 0;

  private sr2: number = 0;
  private sr6: number = 0;
  private sr12: number = 0;
  private vij: number = 0;
  private wij: number = 0;
  private fij: number = 0;

  private fxij: number = 0;
  private fyij: number = 0;
  private fzij: number = 0;

  private rList: number = this.rCutOff + 1;
  private rCutOffSq = this.rCutOff * this.rCutOff;
  private sigab: number = 0;
  private epsab: number = 0;
  private strength: number = 0;
  private angle: number = 0;
  private length: number = 0;

  private inverseMass1: number = 1;
  private inverseMass2: number = 1;
  private inverseMass3: number = 1;
  private inverseMass4: number = 1;

  private atom1?: Atom;
  private atom2?: Atom;
  private atom3?: Atom;
  private atom4?: Atom;

  private theta: number = 0;
  private sinTheta: number = 0;

  private vector1: Vector3 = new Vector3();
  private vector2: Vector3 = new Vector3();

  private pairs: Pair[] = [];
  private indexOfPair: number = 0;

  constructor() {}

  initArrays(size: number) {
    this.rx0 = new Array<number>(size);
    this.ry0 = new Array<number>(size);
    this.rz0 = new Array<number>(size);
    this.neighborList = new Array<number>((size * size) / 2);
    this.pointer = new Array<number>(size);
  }

  setBoxSize(xBox: number, yBox: number, zBox: number) {
    this.xBox = xBox;
    this.yBox = yBox;
    this.zBox = zBox;
  }

  applyBoundary() {
    let radius = 0;
    for (const a of this.atoms) {
      if (a.fixed || !a.velocity) continue;
      radius = 0.5 * a.sigma;
      if (a.position.x > this.xBox - radius) {
        a.velocity.x = -Math.abs(a.velocity.x);
      } else if (a.position.x < radius - this.xBox) {
        a.velocity.x = Math.abs(a.velocity.x);
      }
      if (a.position.y > this.yBox - radius) {
        a.velocity.y = -Math.abs(a.velocity.y);
      } else if (a.position.y < radius - this.yBox) {
        a.velocity.y = Math.abs(a.velocity.y);
      }
      if (a.position.z > this.zBox - radius) {
        a.velocity.z = -Math.abs(a.velocity.z);
      } else if (a.position.z < radius - this.zBox) {
        a.velocity.z = Math.abs(a.velocity.z);
      }
    }
  }

  private expandPairs(additionalSize: number) {
    for (let i = 0; i < additionalSize; i++) {
      this.pairs.push(new Pair(-1, -1));
    }
  }

  private addPair(atomI: Atom, atomJ: Atom) {
    // skip if one of the following conditions is met
    if (atomI.fixed && atomJ.fixed) return;
    if (atomI.isRBonded(atomJ) || atomI.isABonded(atomJ) || atomI.isTBonded(atomJ)) return;
    if (atomI.charge * atomJ.charge > 0) return;
    this.rijsq = atomI.position.distanceToSquared(atomJ.position);
    this.sigab = (atomI.sigma + atomJ.sigma) * 0.5;
    this.sigab *= this.sigab;
    let ratio = 1; //model.getView().getVdwLinesRatio();
    ratio *= ratio;
    if (this.rijsq > this.sigab && this.rijsq < this.sigab * ratio) {
      this.pairs[this.indexOfPair].set(atomI.index, atomJ.index);
      this.indexOfPair++;
      if (this.indexOfPair >= this.pairs.length) this.expandPairs(100);
    }
  }

  private generateVdwPairs(useNeightborList: boolean) {
    if (this.pairs.length === 0) {
      this.expandPairs(100);
    } else {
      for (const p of this.pairs) {
        p.set(-1, -1);
      }
    }
    const atomCount = this.atoms.length;
    this.indexOfPair = 0;
    if (useNeightborList) {
      for (let i = 0; i < atomCount - 1; i++) {
        this.jBeg = this.pointer[i];
        this.jEnd = this.pointer[i + 1];
        if (this.jBeg < this.jEnd) {
          for (let j = this.jBeg; j < this.jEnd; j++) {
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
}
