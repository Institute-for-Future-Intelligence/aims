/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { CommonStoreState } from '../common';
import { PrimitiveStoreState } from '../commonPrimitive';

export const set = (state: CommonStoreState) => state.set;

export const setPrimitiveStore = (state: PrimitiveStoreState) => state.setPrimitiveStore;

export const user = (state: CommonStoreState) => state.user;

export const language = (state: CommonStoreState) => state.language;

export const locale = (state: CommonStoreState) => state.locale;

export const changed = (state: PrimitiveStoreState) => state.changed;

export const showAccountSettingsPanel = (state: PrimitiveStoreState) => state.showAccountSettingsPanel;

export const userCount = (state: PrimitiveStoreState) => state.userCount;

export const selectedFloatingWindow = (state: CommonStoreState) => state.selectedFloatingWindow;

export const projectState = (state: CommonStoreState) => state.projectState;

export const projectView = (state: CommonStoreState) => state.projectView;

export const cameraPosition = (state: CommonStoreState) => state.cameraPosition;

export const panCenter = (state: CommonStoreState) => state.panCenter;

export const loadedMolecule = (state: CommonStoreState) => state.loadedMolecule;

export const selectedMolecule = (state: CommonStoreState) => state.selectedMolecule;

export const hoveredMolecule = (state: PrimitiveStoreState) => state.hoveredMolecule;

export const enableRotate = (state: PrimitiveStoreState) => state.enableRotate;

export const autoRotate = (state: PrimitiveStoreState) => state.autoRotate;

export const addMolecule = (state: CommonStoreState) => state.addMolecule;

export const removeMolecule = (state: CommonStoreState) => state.removeMolecule;

export const molecularPropertiesMap = (state: CommonStoreState) => state.molecularPropertiesMap;

export const setMolecularProperties = (state: CommonStoreState) => state.setMolecularProperties;

export const navigationView = (state: CommonStoreState) => state.navigationView;

export const selectedObject = (state: CommonStoreState) => state.selectedObject;

export const selectNone = (state: CommonStoreState) => state.selectNone;

export const undoManager = (state: CommonStoreState) => state.undoManager;

export const addUndoable = (state: CommonStoreState) => state.addUndoable;

export const loggable = (state: CommonStoreState) => state.loggable;

export const actionInfo = (state: CommonStoreState) => state.actionInfo;

export const currentUndoable = (state: CommonStoreState) => state.currentUndoable;

export const chemicalElements = (state: CommonStoreState) => state.chemicalElements;

export const getChemicalElement = (state: CommonStoreState) => state.getChemicalElement;

export const loadChemicalElements = (state: CommonStoreState) => state.loadChemicalElements;

export const getProvidedMolecularProperties = (state: CommonStoreState) => state.getProvidedMolecularProperties;

export const loadProvidedMolecularProperties = (state: CommonStoreState) => state.loadProvidedMolecularProperties;

export const contextMenuObjectType = (state: PrimitiveStoreState) => state.contextMenuObjectType;

export const createProjectFlag = (state: PrimitiveStoreState) => state.createProjectFlag;

export const createProjectDialog = (state: PrimitiveStoreState) => state.createProjectDialog;

export const saveProjectFlag = (state: PrimitiveStoreState) => state.saveProjectFlag;

export const saveProjectAsFlag = (state: PrimitiveStoreState) => state.saveProjectAsFlag;

export const saveProjectAsDialog = (state: PrimitiveStoreState) => state.saveProjectAsDialog;

export const showProjectsFlag = (state: PrimitiveStoreState) => state.showProjectsFlag;

export const updateProjectsFlag = (state: PrimitiveStoreState) => state.updateProjectsFlag;

export const curateMoleculeToProjectFlag = (state: PrimitiveStoreState) => state.curateMoleculeToProjectFlag;

export const showProjectListPanel = (state: PrimitiveStoreState) => state.showProjectListPanel;

export const saveAccountSettingsFlag = (state: PrimitiveStoreState) => state.saveAccountSettingsFlag;
