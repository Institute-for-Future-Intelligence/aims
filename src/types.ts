/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { extend, Object3DNode } from '@react-three/fiber';
import { MyPDBLoader } from './js/MyPDBLoader';

// Extend makes these JSX elements (with the first character lower-cased)
extend({ MyPDBLoader });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      myOrbitControls: Object3DNode<MyPDBLoader, typeof MyPDBLoader>;
    }
  }
}

export enum BondType {
  SINGLE_BOND = 0,
  DOUBLE_BOND = 1,
  TRIPLE_BOND = 2,
  HYDROGEN_BOND = 3,
  VAN_DER_WAALS_BOND = 4,
}

export interface DatumEntry {
  [key: string]: number | undefined | string | boolean;
}

export interface Range {
  variable: string;
  minimum: number;
  maximum: number;
}

export enum ObjectType {
  Atom = 'Atom',
  Bond = 'Bond',
  Surface = 'Surface',
}

export enum MolecularViewerStyle {
  BallAndStick = 'Ball-and-Stick',
  Wireframe = 'Wireframe',
  Stick = 'Stick',
  SpaceFilling = 'Space-Filling',
}

export interface MoleculeData {
  name: string;
  url: string;
}

// use null for undefined, as we need to persist this in Firebase
export interface ProjectInfo {
  owner: string | null;
  timestamp: number;
  title: string | null;
  description: string | null;
  selectedProperty: string | null;
  sortDescending: boolean | null;
  ranges: Range[] | null;
}

export enum DataColoring {
  ALL = 0,
  INDIVIDUALS = 1,
  GROUPS = 2,
}

export interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string | null;
  noLogging: boolean;
  schoolID: SchoolID;
  classID: ClassID;
  likes?: string[];
  published?: string[];
  aliases?: string[];
}

export enum SchoolID {
  UNKNOWN = 'UNKNOWN SCHOOL',
  SCHOOL1 = 'SCHOOL 1',
  SCHOOL2 = 'SCHOOL 2',
  SCHOOL3 = 'SCHOOL 3',
  SCHOOL4 = 'SCHOOL 4',
  SCHOOL5 = 'SCHOOL 5',
}

export enum ClassID {
  UNKNOWN = 'UNKNOWN CLASS',
  CLASS1 = 'CLASS 1',
  CLASS2 = 'CLASS 2',
  CLASS3 = 'CLASS 3',
  CLASS4 = 'CLASS 4',
  CLASS5 = 'CLASS 5',
  CLASS6 = 'CLASS 6',
  CLASS7 = 'CLASS 7',
  CLASS8 = 'CLASS 8',
  CLASS9 = 'CLASS 9',
}

export enum Language {
  English = 'English',
  ChineseSimplified = '简体中文',
  ChineseTraditional = '繁体中文',
}

export interface ActionInfo {
  readonly timestamp: number;
  readonly name: string;
}
