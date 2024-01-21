/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import i18n from './i18n/i18n';
import { MoleculeData, ProjectState, Range } from './types';
import { MolecularProperties } from './models/MolecularProperties';
import { Filter, FilterType } from './Filter';
import { DataColoring, ProjectType } from './constants';
import { MolecularViewerColoring, MolecularViewerMaterial, MolecularViewerStyle } from './view/displayOptions';

export class ProjectUtil {
  static createDefaultProjectState() {
    return {
      owner: null,
      timestamp: -1,
      type: ProjectType.DRUG_DISCOVERY,
      title: null,
      description: null,
      molecules: new Array<MoleculeData>(),
      targetProtein: null,
      selectedProperty: null,
      dataColoring: DataColoring.ALL,
      sortDescending: false,
      ranges: new Array<Range>(),
      filters: new Array<Filter>(),
      hiddenProperties: new Array<string>(),
      counter: 0,
      xAxisNameScatteredPlot: 'atomCount',
      yAxisNameScatteredPlot: 'atomCount',
      dotSizeScatteredPlot: 5,
      thumbnailWidth: 200,

      chamberViewerPercentWidth: 50,
      chamberViewerAxes: true,
      chamberViewerStyle: MolecularViewerStyle.QuickSurface,
      chamberViewerMaterial: MolecularViewerMaterial.Soft,
      chamberViewerColoring: MolecularViewerColoring.SecondaryStructure,
      chamberViewerBackground: 'black',
      chamberViewerSelector: 'all',

      projectViewerStyle: MolecularViewerStyle.Stick,
      projectViewerMaterial: MolecularViewerMaterial.Soft,
      projectViewerBackground: 'white',
    } as ProjectState;
  }

  static getVariables(hidden: string[]): string[] {
    const a: string[] = [];
    if (!hidden?.includes('atomCount')) a.push('atomCount');
    if (!hidden?.includes('bondCount')) a.push('bondCount');
    if (!hidden?.includes('molecularMass')) a.push('molecularMass');
    if (!hidden?.includes('logP')) a.push('logP');
    if (!hidden?.includes('hydrogenBondDonorCount')) a.push('hydrogenBondDonorCount');
    if (!hidden?.includes('hydrogenBondAcceptorCount')) a.push('hydrogenBondAcceptorCount');
    if (!hidden?.includes('rotatableBondCount')) a.push('rotatableBondCount');
    if (!hidden?.includes('polarSurfaceArea')) a.push('polarSurfaceArea');
    return a;
  }

  static getTitles(hidden: string[], l: { lng: string }): string[] {
    const a: string[] = [];
    if (!hidden?.includes('atomCount')) a.push(i18n.t('projectPanel.AtomCount', l));
    if (!hidden?.includes('bondCount')) a.push(i18n.t('projectPanel.BondCount', l));
    if (!hidden?.includes('molecularMass')) a.push(i18n.t('projectPanel.MolecularMass', l));
    if (!hidden?.includes('logP')) a.push('log P');
    if (!hidden?.includes('hydrogenBondDonorCount')) a.push(i18n.t('projectPanel.HydrogenBondDonorCountShort', l));
    if (!hidden?.includes('hydrogenBondAcceptorCount'))
      a.push(i18n.t('projectPanel.HydrogenBondAcceptorCountShort', l));
    if (!hidden?.includes('rotatableBondCount')) a.push(i18n.t('projectPanel.RotatableBondCountShort', l));
    if (!hidden?.includes('polarSurfaceArea')) a.push(i18n.t('projectPanel.PolarSurfaceAreaShort', l));
    return a;
  }

  static getTypes(hidden: string[]): string[] {
    const a: string[] = [];
    if (!hidden?.includes('atomCount')) a.push('number');
    if (!hidden?.includes('bondCount')) a.push('number');
    if (!hidden?.includes('molecularMass')) a.push('number');
    if (!hidden?.includes('logP')) a.push('number');
    if (!hidden?.includes('hydrogenBondDonorCount')) a.push('number');
    if (!hidden?.includes('hydrogenBondAcceptorCount')) a.push('number');
    if (!hidden?.includes('rotatableBondCount')) a.push('number');
    if (!hidden?.includes('polarSurfaceArea')) a.push('number');
    return a;
  }

  static getDigits(hidden: string[]): number[] {
    const a: number[] = [];
    if (!hidden?.includes('atomCount')) a.push(0);
    if (!hidden?.includes('bondCount')) a.push(0);
    if (!hidden?.includes('molecularMass')) a.push(2);
    if (!hidden?.includes('logP')) a.push(2);
    if (!hidden?.includes('hydrogenBondDonorCount')) a.push(0);
    if (!hidden?.includes('hydrogenBondAcceptorCount')) a.push(0);
    if (!hidden?.includes('rotatableBondCount')) a.push(0);
    if (!hidden?.includes('polarSurfaceArea')) a.push(1);
    return a;
  }

  static getTickIntegers(hidden: string[]): boolean[] {
    const a: boolean[] = [];
    if (!hidden?.includes('atomCount')) a.push(true);
    if (!hidden?.includes('bondCount')) a.push(true);
    if (!hidden?.includes('molecularMass')) a.push(false);
    if (!hidden?.includes('logP')) a.push(false);
    if (!hidden?.includes('hydrogenBondDonorCount')) a.push(true);
    if (!hidden?.includes('hydrogenBondAcceptorCount')) a.push(true);
    if (!hidden?.includes('rotatableBondCount')) a.push(true);
    if (!hidden?.includes('polarSurfaceArea')) a.push(false);
    return a;
  }

  static getUnits(hidden: string[], l: { lng: string }): string[] {
    const a: string[] = [];
    if (!hidden?.includes('atomCount')) a.push('');
    if (!hidden?.includes('bondCount')) a.push('');
    if (!hidden?.includes('molecularMass')) a.push('u');
    if (!hidden?.includes('logP')) a.push('');
    if (!hidden?.includes('hydrogenBondDonorCount')) a.push('');
    if (!hidden?.includes('hydrogenBondAcceptorCount')) a.push('');
    if (!hidden?.includes('rotatableBondCount')) a.push('');
    if (!hidden?.includes('polarSurfaceArea')) a.push('Å²');
    return a;
  }

  static getUnit(variable: string, l: { lng: string }): string {
    if (variable === 'molecularMass') return 'u';
    if (variable === 'polarSurfaceArea') return 'Å²';
    return '';
  }

  static isExcluded(filters: Filter[], p: MolecularProperties): boolean {
    for (const f of filters) {
      if (f.type === FilterType.Between && f.upperBound !== undefined && f.lowerBound !== undefined) {
        if (f.variable === 'molecularMass') {
          if (p.molecularMass > f.upperBound || p.molecularMass < f.lowerBound) return true;
        } else if (f.variable === 'logP') {
          if (p.logP > f.upperBound || p.logP < f.lowerBound) return true;
        } else if (f.variable === 'hydrogenBondDonorCount') {
          if (p.hydrogenBondDonorCount > f.upperBound || p.hydrogenBondDonorCount < f.lowerBound) return true;
        } else if (f.variable === 'hydrogenBondAcceptorCount') {
          if (p.hydrogenBondAcceptorCount > f.upperBound || p.hydrogenBondAcceptorCount < f.lowerBound) return true;
        } else if (f.variable === 'rotatableBondCount') {
          if (p.rotatableBondCount > f.upperBound || p.rotatableBondCount < f.lowerBound) return true;
        } else if (f.variable === 'polarSurfaceArea') {
          if (p.polarSurfaceArea > f.upperBound || p.polarSurfaceArea < f.lowerBound) return true;
        }
      }
    }
    return false;
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
      case 'hydrogenBondDonorCount':
        break;
      case 'hydrogenBondAcceptorCount':
        break;
      case 'rotatableBondCount':
        break;
      case 'polarSurfaceArea':
        break;
    }
  }
}
