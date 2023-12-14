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
