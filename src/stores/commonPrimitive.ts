/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import { produce } from 'immer';
import { MoleculeData, MoleculeTransform } from '../types';
import { ProjectType } from '../constants';

// avoid using undefined value in the store for now.
export interface PrimitiveStoreState {
  changed: boolean;
  setChanged: (b: boolean) => void;
  skipChange: boolean;
  setSkipChange: (b: boolean) => void;
  updateViewerFlag: boolean;

  dragAndDropMolecule: boolean;
  hoveredMolecule: MoleculeData | null;
  selectedPlane: number;

  pickedMoleculeIndex: number;
  copiedMoleculeIndex: number;
  cutMolecule: MoleculeData | null;
  cutMoleculeTransform: MoleculeTransform | null;

  boundingSphereRadius: number;

  enableRotate: boolean;
  autoRotate: boolean;

  resetViewFlag: boolean;
  resetView: () => void;

  zoomViewFlag: boolean;
  zoomScale: number;
  zoomView: (scale: number) => void;

  waiting: boolean;

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
  saveAndThenOpenProjectFlag: boolean;

  saveAccountSettingsFlag: boolean;

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
    skipChange: true,
    setSkipChange(b) {
      immerSet((state: PrimitiveStoreState) => {
        state.skipChange = b;
      });
    },
    updateViewerFlag: false,

    dragAndDropMolecule: false,
    hoveredMolecule: null,
    selectedPlane: -1,

    pickedMoleculeIndex: -1,
    copiedMoleculeIndex: -1,
    cutMolecule: null,
    cutMoleculeTransform: null,

    boundingSphereRadius: 10,

    enableRotate: true,
    autoRotate: false,

    resetViewFlag: true,
    resetView() {
      immerSet((state) => {
        state.resetViewFlag = !state.resetViewFlag;
      });
    },

    zoomViewFlag: true,
    zoomScale: 1,
    zoomView(scale) {
      immerSet((state) => {
        state.zoomViewFlag = !state.zoomViewFlag;
        state.zoomScale = scale;
      });
    },

    waiting: false,

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

    showProjectsFlag: false,
    updateProjectsFlag: false,
    showProjectListPanel: false,
    saveAndThenOpenProjectFlag: false,

    showAccountSettingsPanel: false,
    userCount: 0,
  };
});
