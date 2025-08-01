/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import { Object3DNode } from '@react-three/fiber';
import { Filter } from './Filter';
import { DataColoring, GraphType, LabelType, ProjectType, SpaceshipDisplayMode } from './constants';
import { MolecularViewerColoring, MolecularViewerMaterial, MolecularViewerStyle } from './view/displayOptions';
import RCGroup from './lib/gfx/RCGroup';
import { Molecule } from './models/Molecule.ts';
import { MolecularProperties } from './models/MolecularProperties.ts';

declare module '@react-three/fiber' {
  interface ThreeElements {
    rCGroup: Object3DNode<RCGroup, typeof RCGroup>;
  }
}

export interface ProjectInfo {
  timestamp: number;
  type: ProjectType;
  title: string;
}

// use null for undefined, as we need to persist this in Firebase
export interface ProjectState {
  key: string;
  owner: string | null;
  time: string;
  timestamp: number;
  type: ProjectType;
  title: string | null;
  description: string | null;
  molecules: MoleculeInterface[]; // molecules in the project gallery
  numberOfColumns: number;
  selectedMolecule: MoleculeInterface | null;
  ligand: MoleculeInterface | null;
  protein: MoleculeInterface | null;
  selectedProperty: string | null;
  autoscaleGraph: boolean;
  dataColoring: DataColoring;
  sortDescending: boolean | null;
  ranges: Range[] | null;
  filters: Filter[] | null;
  hiddenProperties: string[] | null;
  xAxisNameScatterPlot: string | null;
  yAxisNameScatterPlot: string | null;
  xFormula: string | null;
  yFormula: string | null;
  xMinScatterPlot: number;
  xMaxScatterPlot: number;
  yMinScatterPlot: number;
  yMaxScatterPlot: number;
  xLinesScatterPlot: boolean;
  yLinesScatterPlot: boolean;
  lineWidthScatterPlot: number;
  dotSizeScatterPlot: number;
  sortDataScatterPlot: string;
  regressionDegree: number;
  numberOfMostSimilarMolecules: number;

  cameraPosition: number[];
  cameraRotation: number[];
  cameraUp: number[];
  panCenter: number[];
  navPosition: number[];
  navRotation: number[];
  navUp: number[];
  navTarget: number[];

  hideGallery: boolean;

  chamberViewerPercentWidth: number;
  chamberViewerAxes: boolean;
  chamberViewerStyle: MolecularViewerStyle;
  chamberViewerMaterial: MolecularViewerMaterial;
  chamberViewerColoring: MolecularViewerColoring;
  chamberViewerFoggy: boolean;
  chamberViewerBackground: string;
  chamberViewerSelector: string;
  chamberTemperatureKevin?: boolean;

  rotationStep: number;
  translationStep: number;

  ligandTransform: MoleculeTransform;
  ligandVelocity: number[]; // velocity along x, y, z axes
  // ligandAcceleration: number[]; // acceleration along x, y, z axes

  spaceshipDisplayMode: SpaceshipDisplayMode;
  spaceshipThrust: number;
  spaceshipRoll: number;
  spaceshipPitch: number;
  spaceshipYaw: number;
  spaceshipX: number;
  spaceshipY: number;
  spaceshipZ: number;
  spaceshipSize: number;

  projectViewerStyle: MolecularViewerStyle;
  projectViewerMaterial: MolecularViewerMaterial;
  projectViewerBackground: string;

  graphType: GraphType;
  labelType: LabelType;

  xyPlaneVisible: boolean;
  yzPlaneVisible: boolean;
  xzPlaneVisible: boolean;
  xyPlanePosition: number;
  yzPlanePosition: number;
  xzPlanePosition: number;

  testMolecules: Molecule[]; // molecules in the reaction chamber
  molecularContainer: MolecularContainer;
  gravitationalAcceleration: number;
  gravityDirection: number;
  molecularContainerVisible: boolean;
  vdwBondsVisible: boolean;
  vdwBondCutoffRelative: number;
  momentumVisible: boolean;
  momentumScaleFactor: number;
  forceVisible: boolean;
  forceScaleFactor: number;
  kineticEnergyScaleFactor: number;
  energyGraphVisible: boolean;
  speedGraphVisible: boolean;
  speedGraphMaxX: number;
  speedGraphMaxY: number;
  speedGraphSortByMolecule: boolean;
  speedGraphBinNumber: number;
  angularBondsVisible: boolean;
  torsionalBondsVisible: boolean;

  timeStep: number;
  refreshInterval: number;
  collectInterval: number;
  constantTemperature: boolean;
  temperature: number; // if temperature is constant, what value
  constantPressure: boolean;
  pressure: number; // if pressure is constant, what value

  navigationView: boolean;
  showInstructionPanel: boolean;

  reasoningEffort: string;
  independentPrompt: boolean;
  showPrompts: boolean;
  generateMoleculePrompt: string;
  generatedMolecularProperties: { [key: string]: MolecularProperties };
}

export interface MolecularContainer {
  lx: number;
  ly: number;
  lz: number;
  opacity?: number;
}

export interface DatumEntry {
  [key: string]: number | undefined | string | boolean;
}

export interface Range {
  variable: string;
  minimum: number;
  maximum: number;
}

export interface MoleculeInterface {
  name: string;
  url?: string;
  data?: string;
  internal?: boolean;
  invisible?: boolean;
  excluded?: boolean;
  style?: MolecularViewerStyle;
  autoBond?: boolean;
  prompt?: string; // LLM prompt used to generate this molecule, if any
}

export interface MoleculeTransform {
  x: number;
  y: number;
  z: number;
  euler: number[];
}

export interface ActionInfo {
  readonly timestamp: number;
  readonly name: string;
}

export interface Message {
  type: string;
  content: string;
  duration?: number;
}
