/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import i18n from './i18n/i18n';
import { MoleculeData } from './types';

export class ProjectUtil {
  static getVariables(): string[] {
    const a: string[] = [];
    a.push('atomCount');
    a.push('bondCount');
    a.push('molecularMass');
    a.push('logP');
    a.push('polarSurfaceArea');
    return a;
  }

  static getTitles(l: { lng: string }): string[] {
    const a: string[] = [];
    a.push(i18n.t('projectPanel.AtomCount', l));
    a.push(i18n.t('projectPanel.BondCount', l));
    a.push(i18n.t('projectPanel.MolecularMass', l));
    a.push('log P');
    a.push(i18n.t('projectPanel.PolarSurfaceArea', l));
    return a;
  }

  static getTypes(): string[] {
    const a: string[] = [];
    a.push('number');
    a.push('number');
    a.push('number');
    a.push('number');
    a.push('number');
    return a;
  }

  static getDigits(): number[] {
    const a: number[] = [];
    a.push(0);
    a.push(0);
    a.push(2);
    a.push(2);
    a.push(2);
    return a;
  }

  static getTickIntegers(): boolean[] {
    const a: boolean[] = [];
    a.push(false);
    a.push(false);
    a.push(false);
    a.push(false);
    a.push(false);
    return a;
  }

  static getUnits(l: { lng: string }): string[] {
    const a: string[] = [];
    a.push('');
    a.push('');
    a.push('u');
    a.push('');
    a.push('Å²');
    return a;
  }

  static getUnit(variable: string, l: { lng: string }): string {
    if (variable === 'atomCount') return '';
    if (variable === 'bondCount') return '';
    if (variable === 'molecularMass') return 'u';
    if (variable === 'logP') return '';
    if (variable === 'polarSurfaceArea') return 'Å²';
    return '';
  }

  static setScatterData(name: string, axis: 'x' | 'y', datum: { x: number; y: number }, m: MoleculeData) {
    switch (name) {
      case 'atomCount':
        // datum[axis] =;
        break;
      case 'bondCount':
        break;
      case 'molecularMass':
        break;
      case 'logP':
        break;
    }
  }
}
