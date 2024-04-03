/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import i18n from '../i18n/i18n.ts';
import { MolecularContainer, MoleculeInterface, MoleculeTransform, ProjectState, Range } from '../types.ts';
import { MolecularProperties } from '../models/MolecularProperties.ts';
import { Filter, FilterType } from '../Filter.ts';
import {
  DataColoring,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_ROTATION,
  DEFAULT_CAMERA_UP,
  DEFAULT_PAN_CENTER,
  GraphType,
  LabelType,
  ProjectType,
  SpaceshipDisplayMode,
} from '../constants.ts';
import { MolecularViewerColoring, MolecularViewerMaterial, MolecularViewerStyle } from '../view/displayOptions.ts';
import { Util } from '../Util.ts';
import { Molecule } from '../models/Molecule.ts';

export class ProjectUtil {
  static createDefaultProjectState() {
    return {
      owner: null,
      timestamp: -1,
      type: ProjectType.DRUG_DISCOVERY,
      title: null,
      description: null,
      molecules: new Array<MoleculeInterface>(),
      numberOfColumns: 3,
      selectedMolecule: null,
      ligand: null,
      protein: null,
      selectedProperty: null,
      dataColoring: DataColoring.ALL,
      sortDescending: false,
      ranges: new Array<Range>(),
      filters: new Array<Filter>(),
      hiddenProperties: [
        'atomCount',
        'bondCount',
        'heavyAtomCount',
        'complexity',
        'density',
        'boilingPoint',
        'meltingPoint',
      ],
      counter: 0,
      xAxisNameScatterPlot: 'atomCount',
      yAxisNameScatterPlot: 'bondCount',
      xFormula: 'x',
      yFormula: 'y',
      xMinScatterPlot: 0,
      xMaxScatterPlot: 100,
      yMinScatterPlot: 0,
      yMaxScatterPlot: 100,
      xLinesScatterPlot: false,
      yLinesScatterPlot: false,
      lineWidthScatterPlot: 1,
      dotSizeScatterPlot: 4,

      cameraPosition: DEFAULT_CAMERA_POSITION,
      cameraRotation: DEFAULT_CAMERA_ROTATION,
      cameraUp: DEFAULT_CAMERA_UP,
      panCenter: DEFAULT_PAN_CENTER,

      hideGallery: false,

      chamberViewerPercentWidth: 50,
      chamberViewerAxes: true,
      chamberViewerStyle: MolecularViewerStyle.BallAndStick,
      chamberViewerMaterial: MolecularViewerMaterial.Diffuse,
      chamberViewerColoring: MolecularViewerColoring.Element,
      chamberViewerFoggy: false,
      chamberViewerBackground: 'black',
      chamberViewerSelector: 'all',

      rotationStep: Util.toRadians(5),
      translationStep: 1,

      ligandTransform: { x: 0, y: 0, z: 0, euler: [0, 0, 0] } as MoleculeTransform,

      spaceshipDisplayMode: SpaceshipDisplayMode.NONE,
      spaceshipSize: 1,
      spaceshipRoll: 0,
      spaceshipPitch: 0,
      spaceshipYaw: 0,
      spaceshipX: 0,
      spaceshipY: 0,
      spaceshipZ: 0,

      projectViewerStyle: MolecularViewerStyle.Stick,
      projectViewerMaterial: MolecularViewerMaterial.Soft,
      projectViewerBackground: 'white',

      graphType: GraphType.PARALLEL_COORDINATES,
      labelType: LabelType.NAME,

      xyPlaneVisible: false,
      yzPlaneVisible: false,
      xzPlaneVisible: false,
      xyPlanePosition: 0,
      yzPlanePosition: 0,
      xzPlanePosition: 0,

      molecularContainer: { lx: 50, ly: 50, lz: 50 } as MolecularContainer,
      molecularContainerVisible: false,
      vdwBondsVisible: false,
      vdwBondCutoffRelative: 0.5,
      momentumVisible: false,
      momentumScaleFactor: 1,
      forceVisible: false,
      forceScaleFactor: 1,
      kineticEnergyScaleFactor: 1,
      energyGraphVisible: false,

      testMolecules: new Array<Molecule>(),

      timeStep: 0.5,
      temperature: 300,
      pressure: 1,
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
    if (!hidden?.includes('heavyAtomCount')) a.push('heavyAtomCount');
    if (!hidden?.includes('complexity')) a.push('complexity');
    if (!hidden?.includes('density')) a.push('density');
    if (!hidden?.includes('boilingPoint')) a.push('boilingPoint');
    if (!hidden?.includes('meltingPoint')) a.push('meltingPoint');
    return a;
  }

  static getTitles(hidden: string[], l: { lng: string }): string[] {
    const a: string[] = [];
    if (!hidden?.includes('atomCount')) a.push(i18n.t('projectPanel.AtomCount', l));
    if (!hidden?.includes('bondCount')) a.push(i18n.t('projectPanel.CovalentBondCount', l));
    if (!hidden?.includes('molecularMass')) a.push(i18n.t('projectPanel.MolecularMass', l));
    if (!hidden?.includes('logP')) a.push('log P');
    if (!hidden?.includes('hydrogenBondDonorCount')) a.push(i18n.t('projectPanel.HydrogenBondDonorCountShort', l));
    if (!hidden?.includes('hydrogenBondAcceptorCount'))
      a.push(i18n.t('projectPanel.HydrogenBondAcceptorCountShort', l));
    if (!hidden?.includes('rotatableBondCount')) a.push(i18n.t('projectPanel.RotatableBondCountShort', l));
    if (!hidden?.includes('polarSurfaceArea')) a.push(i18n.t('projectPanel.PolarSurfaceAreaShort', l));
    if (!hidden?.includes('heavyAtomCount')) a.push(i18n.t('projectPanel.HeavyAtomCountShort', l));
    if (!hidden?.includes('complexity')) a.push(i18n.t('projectPanel.Complexity', l));
    if (!hidden?.includes('density')) a.push(i18n.t('projectPanel.Density', l));
    if (!hidden?.includes('boilingPoint')) a.push(i18n.t('projectPanel.BoilingPoint', l));
    if (!hidden?.includes('meltingPoint')) a.push(i18n.t('projectPanel.MeltingPoint', l));
    return a;
  }

  static getPropertyName(property: string, l: { lng: string }): string | undefined {
    if (property === 'atomCount') return i18n.t('projectPanel.AtomCount', l);
    if (property === 'bondCount') return i18n.t('projectPanel.CovalentBondCount', l);
    if (property === 'molecularMass') return i18n.t('projectPanel.MolecularMass', l);
    if (property === 'logP') return 'log P';
    if (property === 'hydrogenBondDonorCount') return i18n.t('projectPanel.HydrogenBondDonorCountShort', l);
    if (property === 'hydrogenBondAcceptorCount') return i18n.t('projectPanel.HydrogenBondAcceptorCountShort', l);
    if (property === 'rotatableBondCount') return i18n.t('projectPanel.RotatableBondCountShort', l);
    if (property === 'polarSurfaceArea') return i18n.t('projectPanel.PolarSurfaceAreaShort', l);
    if (property === 'heavyAtomCount') return i18n.t('projectPanel.HeavyAtomCountShort', l);
    if (property === 'complexity') return i18n.t('projectPanel.Complexity', l);
    if (property === 'density') return i18n.t('projectPanel.Density', l);
    if (property === 'boilingPoint') return i18n.t('projectPanel.BoilingPoint', l);
    if (property === 'meltingPoint') return i18n.t('projectPanel.MeltingPoint', l);
    return undefined;
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
    if (!hidden?.includes('heavyAtomCount')) a.push('number');
    if (!hidden?.includes('complexity')) a.push('number');
    if (!hidden?.includes('density')) a.push('number');
    if (!hidden?.includes('boilingPoint')) a.push('number');
    if (!hidden?.includes('meltingPoint')) a.push('number');
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
    if (!hidden?.includes('heavyAtomCount')) a.push(0);
    if (!hidden?.includes('complexity')) a.push(1);
    if (!hidden?.includes('density')) a.push(1);
    if (!hidden?.includes('boilingPoint')) a.push(1);
    if (!hidden?.includes('meltingPoint')) a.push(1);
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
    if (!hidden?.includes('heavyAtomCount')) a.push(true);
    if (!hidden?.includes('complexity')) a.push(false);
    if (!hidden?.includes('density')) a.push(false);
    if (!hidden?.includes('boilingPoint')) a.push(true);
    if (!hidden?.includes('meltingPoint')) a.push(true);
    return a;
  }

  static getUnits(hidden: string[]): string[] {
    const a: string[] = [];
    if (!hidden?.includes('atomCount')) a.push('');
    if (!hidden?.includes('bondCount')) a.push('');
    if (!hidden?.includes('molecularMass')) a.push('u');
    if (!hidden?.includes('logP')) a.push('');
    if (!hidden?.includes('hydrogenBondDonorCount')) a.push('');
    if (!hidden?.includes('hydrogenBondAcceptorCount')) a.push('');
    if (!hidden?.includes('rotatableBondCount')) a.push('');
    if (!hidden?.includes('polarSurfaceArea')) a.push('Å²');
    if (!hidden?.includes('heavyAtomCount')) a.push('');
    if (!hidden?.includes('complexity')) a.push('');
    if (!hidden?.includes('density')) a.push('g/ml');
    if (!hidden?.includes('boilingPoint')) a.push('°C');
    if (!hidden?.includes('meltingPoint')) a.push('°C');
    return a;
  }

  static getUnit(property: string): string {
    if (property === 'molecularMass') return 'u';
    if (property === 'polarSurfaceArea') return 'Å²';
    if (property === 'density') return 'g/ml';
    if (property === 'boilingPoint') return '°C';
    if (property === 'meltingPoint') return '°C';
    return '';
  }

  static isExcluded(filters: Filter[], p: MolecularProperties): boolean {
    for (const f of filters) {
      if (f.type === FilterType.Between && f.upperBound !== undefined && f.lowerBound !== undefined) {
        const v = p[f.variable as keyof MolecularProperties];
        if (typeof v === 'number') {
          if (v > f.upperBound || v < f.lowerBound) return true;
        }
      }
    }
    return false;
  }
}
