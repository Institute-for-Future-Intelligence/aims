/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import produce from 'immer';
import { MoleculeData, ObjectType, ProjectType } from '../types';

// avoid using undefined value in the store for now.
export interface PrimitiveStoreState {
  changed: boolean;
  setChanged: (b: boolean) => void;

  hoveredMolecule: MoleculeData | null;

  boundingSphereRadius: number;

  enableRotate: boolean;
  autoRotate: boolean;

  waiting: boolean;

  contextMenuObjectType: ObjectType | null;
  contextMenuFlag: boolean;
  updateContextMenu: () => void;

  // These stores the settings from newProjectDialog.tsx, because we don't want to overwrite
  // the local state in the common store yet. Don't be confused with commonStore's projectState,
  // which holds the state of a project.
  projectType: ProjectType;
  projectTitle: string | null;
  projectDescription: string | null;

  createProjectFlag: boolean;
  createProjectDialog: boolean;
  setCreateProjectDialog: (b: boolean) => void;
  saveProjectFlag: boolean;
  saveProjectAsFlag: boolean;
  saveProjectAsDialog: boolean;
  setSaveProjectAsDialog: (b: boolean) => void;

  saveAccountSettingsFlag: boolean;

  curateMoleculeToProjectFlag: boolean;
  showProjectsFlag: boolean;
  updateProjectsFlag: boolean;
  showProjectListPanel: boolean;

  showAccountSettingsPanel: boolean;
  userCount: number;

  set: (fn: (state: PrimitiveStoreState) => void) => void;
  setPrimitiveStore: <K extends keyof PrimitiveStoreState, V extends PrimitiveStoreState[K]>(key: K, val: V) => void;
}

export const usePrimitiveStore = createWithEqualityFn<PrimitiveStoreState>()((set, get) => {
  const immerSet: PrimitiveStoreState['set'] = (fn) => set(produce(fn));

  return {
    set: (fn) => {
      try {
        immerSet(fn);
      } catch (e) {
        console.log(e);
      }
    },

    setPrimitiveStore(key, val) {
      immerSet((state) => {
        if (state[key] !== undefined) {
          state[key] = val;
        } else {
          console.error(`key ${key} is not defined in PrimitiveStoreState`);
        }
      });
    },

    changed: false,
    setChanged(b) {
      immerSet((state: PrimitiveStoreState) => {
        state.changed = b;
      });
    },

    hoveredMolecule: null,

    boundingSphereRadius: 10,

    enableRotate: true,
    autoRotate: false,

    waiting: false,

    contextMenuObjectType: null,
    contextMenuFlag: false,
    updateContextMenu() {
      immerSet((state) => {
        state.contextMenuFlag = !state.contextMenuFlag;
      });
    },

    projectType: ProjectType.DRUG_DISCOVERY,
    projectTitle: null,
    projectDescription: null,

    createProjectFlag: false,
    createProjectDialog: false,
    setCreateProjectDialog(b) {
      immerSet((state) => {
        state.createProjectDialog = b;
      });
    },
    saveProjectFlag: false,
    saveProjectAsFlag: false,
    saveProjectAsDialog: false,
    setSaveProjectAsDialog(b) {
      immerSet((state) => {
        state.saveProjectAsDialog = b;
      });
    },

    saveAccountSettingsFlag: false,

    curateMoleculeToProjectFlag: false,
    showProjectsFlag: false,
    updateProjectsFlag: false,
    showProjectListPanel: false,

    showAccountSettingsPanel: false,
    userCount: 0,
  };
});
