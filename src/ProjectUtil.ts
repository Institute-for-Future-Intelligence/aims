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
    a.push('logP');
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

  // mimic database calls
  static getLogP(name: string): number {
    if (name === 'Aspirin') return 1.2;
    if (name === 'Ibuprofen') return 3.5;
    if (name === 'Benzene') return 2.1;
    if (name === 'Paxlovid') return 2.2;
    if (name === 'Caffeine') return -0.1;
    if (name === 'Glucose') return -2.6;
    return 0;
  }

  // mimic database calls
  static getPolarSurfaceArea(name: string): number {
    if (name === 'Aspirin') return 63.6;
    if (name === 'Ibuprofen') return 37.3;
    if (name === 'Benzene') return 0;
    if (name === 'Paxlovid') return 131;
    if (name === 'Caffeine') return 58.4;
    if (name === 'Glucose') return 110;
    return 0;
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
