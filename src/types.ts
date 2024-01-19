/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { Filter } from './Filter';
import { DataColoring, ProjectType } from './constants';
import { MolecularViewerColoring, MolecularViewerStyle } from './view/displayOptions';

// use null for undefined, as we need to persist this in Firebase
export interface ProjectState {
  owner: string | null;
  timestamp: number;
  type: ProjectType;
  title: string | null;
  description: string | null;
  molecules: MoleculeData[];
  targetProtein: MoleculeData | null;
  selectedProperty: string | null;
  dataColoring: DataColoring;
  sortDescending: boolean | null;
  ranges: Range[] | null;
  filters: Filter[] | null;
  hiddenProperties: string[] | null;
  counter: number;
  xAxisNameScatteredPlot: string | null;
  yAxisNameScatteredPlot: string | null;
  dotSizeScatteredPlot: number | null;
  thumbnailWidth: number | null;

  chamberViewerPercentWidth: number;
  chamberViewerAxes: boolean;
  chamberViewerShininess: number;
  chamberViewerStyle: MolecularViewerStyle;
  chamberViewerColoring: MolecularViewerColoring;
  chamberViewerBackground: string;

  projectViewerStyle: MolecularViewerStyle;
  projectViewerBackground: string;
}

// frequently-updated variables must be stored here
export interface ExtendedProjectState extends ProjectState {
  cameraPosition: number[];
  panCenter: number[];
}

export interface DatumEntry {
  [key: string]: number | undefined | string | boolean;
}

export interface Range {
  variable: string;
  minimum: number;
  maximum: number;
}

export interface MoleculeData {
  name: string;
  internal?: boolean;
  url?: string;
  invisible?: boolean;
  excluded?: boolean;
}

export interface ActionInfo {
  readonly timestamp: number;
  readonly name: string;
}
