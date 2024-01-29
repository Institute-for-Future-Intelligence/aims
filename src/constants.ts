/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { Euler, Vector2, Vector3 } from 'three';

export const VERSION = '0.0.1';

export const isProd = process.env.NODE_ENV === 'production';

export const HOME_URL: string = isProd
  ? 'https://institute-for-future-intelligence.github.io/aims/'
  : 'http://localhost:3001/aims';

export const DEFAULT_FOV = 30;
export const DEFAULT_SHADOW_CAMERA_FAR = 10000;
export const DEFAULT_SHADOW_MAP_SIZE = 4096;
export const DEFAULT_LIGHT_INTENSITY = 5;

export const UNDO_SHOW_INFO_DURATION = 0.5;

export const GRID_RATIO = 5;
export const FINE_GRID_SCALE = 0.1;
export const NORMAL_GRID_SCALE = GRID_RATIO * FINE_GRID_SCALE;

export const Z_INDEX_FRONT_PANEL = 15;

export const HALF_PI = Math.PI / 2;

export const TWO_PI = Math.PI * 2;

export const ZERO_TOLERANCE = 0.0001;

export const UNIT_VECTOR_POS_Z_ARRAY = [0, 0, 1];

export const UNIT_VECTOR_NEG_Y_ARRAY = [0, -1, 0];

export const UNIT_VECTOR_POS_X = new Vector3(1, 0, 0);

export const UNIT_VECTOR_NEG_X = new Vector3(-1, 0, 0);

export const UNIT_VECTOR_POS_Y = new Vector3(0, 1, 0);

export const UNIT_VECTOR_NEG_Y = new Vector3(0, -1, 0);

export const UNIT_VECTOR_POS_Z = new Vector3(0, 0, 1);

export const UNIT_VECTOR_NEG_Z = new Vector3(0, 0, -1);

export const ORIGIN_VECTOR2 = new Vector2(0, 0);

export const ORIGIN_VECTOR3 = new Vector3(0, 0, 0);

export const HALF_PI_Z_EULER = new Euler(0, 0, HALF_PI);

export const REGEX_ALLOWABLE_IN_NAME = /^[A-Za-z0-9\s-_()!?%&,]*$/;

export const DEFAULT_CAMERA_POSITION = [5, 10, 20];

export const DEFAULT_CAMERA_ROTATION = [0, 0, 0];

export const DEFAULT_CAMERA_UP = [0, 0, 1];

export const DEFAULT_PAN_CENTER = [0, 0, 0];

export enum FirebaseName {
  FILES = 'Files',
  LOG_DATA = 'Log Data',
}

export enum MoveDirection {
  Left = 'Left',
  Right = 'Right',
  Up = 'Up',
  Down = 'Down',
}

export enum Language {
  English = 'English',
  ChineseSimplified = '简体中文',
  ChineseTraditional = '繁体中文',
}

export enum ProjectType {
  DRUG_DISCOVERY = 'Drug Discovery',
}

export enum BondType {
  SINGLE_BOND = 0,
  DOUBLE_BOND = 1,
  TRIPLE_BOND = 2,
  HYDROGEN_BOND = 3,
  VAN_DER_WAALS_BOND = 4,
}

export enum ObjectType {
  Atom = 'Atom',
  Bond = 'Bond',
  Molecule = 'Molecule',
  Spaceship = 'Spaceship',
}

export enum DataColoring {
  ALL = 0,
  INDIVIDUALS = 1,
  GROUPS = 2,
}
