/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import { produce } from 'immer';
import { MoleculeInterface } from '../types';
import { PickMode, ProjectType } from '../constants';
import { Molecule } from '../models/Molecule.ts';
import { PolynomialRegression } from 'ml-regression-polynomial';

// avoid using undefined value in the store for now.
export interface PrimitiveStoreState {
  latestVersion: string | undefined;
  changed: boolean;
  setChanged: (b: boolean) => void;
  skipChange: boolean;
  setSkipChange: (b: boolean) => void;
  muteUndoMessage: boolean;
  updateViewerFlag: boolean;
  updateViewer: () => void;
  updateInfoFlag: boolean;
  updateInfo: () => void;

  dragAndDropMolecule: boolean;
  hoveredMolecule: MoleculeInterface | null;
  selectedPlane: number;
  regressionAnalysis: boolean;
  regression: PolynomialRegression | null;

  pickMode: PickMode;
  pickedAtomIndex: number;
  pickedMoleculeIndex: number;
  copiedMoleculeIndex: number;
  cutMolecule: Molecule | null;

  boundingSphereRadius: number;

  startSimulation: boolean;
  resetSimulation: boolean;

  enableRotate: boolean;
  autoRotate: boolean;

  resetViewFlag: boolean;
  resetView: () => void;

  zoomViewFlag: boolean;
  zoomScale: number;
  zoomView: (scale: number) => void;

  waiting: boolean;
  setWaiting: (waiting: boolean) => void;

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
  setSaveProjectFlag: (b: boolean) => void;
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

  currentTemperature: number;

  showThrustFlame: boolean;
  navCoordinates: number[];

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

    latestVersion: undefined,
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
    muteUndoMessage: false,

    updateViewerFlag: false,
    updateViewer() {
      immerSet((state: PrimitiveStoreState) => {
        state.updateViewerFlag = !state.updateViewerFlag;
      });
    },
    updateInfoFlag: false,
    updateInfo() {
      immerSet((state: PrimitiveStoreState) => {
        state.updateInfoFlag = !state.updateInfoFlag;
      });
    },

    dragAndDropMolecule: false,
    hoveredMolecule: null,
    selectedPlane: -1,
    regressionAnalysis: false,
    regression: null,

    pickMode: PickMode.MOLECULE,
    pickedAtomIndex: -1,
    pickedMoleculeIndex: -1,
    copiedMoleculeIndex: -1,
    cutMolecule: null,

    boundingSphereRadius: 10,

    startSimulation: false,
    resetSimulation: false,

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
    setWaiting(waiting: boolean) {
      immerSet((state) => {
        state.waiting = waiting;
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
    setSaveProjectFlag(b) {
      immerSet((state) => {
        state.saveProjectFlag = b;
      });
    },
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

    currentTemperature: 300,

    showThrustFlame: false,
    navCoordinates: [0, 0, 0],
  };
});
