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

export const projectInfo = (state: CommonStoreState) => state.projectInfo;

export const projectView = (state: CommonStoreState) => state.projectView;

export const loadedMolecule = (state: CommonStoreState) => state.loadedMolecule;

export const selectedMolecule = (state: CommonStoreState) => state.selectedMolecule;

export const collectedMolecules = (state: CommonStoreState) => state.collectedMolecules;

export const addMolecule = (state: CommonStoreState) => state.addMolecule;

export const removeMolecule = (state: CommonStoreState) => state.removeMolecule;

export const chamberViewerPercentWidth = (state: CommonStoreState) => state.chamberViewerPercentWidth;

export const chamberViewerAxes = (state: CommonStoreState) => state.chamberViewerAxes;

export const chamberViewerShininess = (state: CommonStoreState) => state.chamberViewerShininess;

export const chamberViewerStyle = (state: CommonStoreState) => state.chamberViewerStyle;

export const chamberViewerBackground = (state: CommonStoreState) => state.chamberViewerBackground;

export const projectViewerStyle = (state: CommonStoreState) => state.projectViewerStyle;

export const projectViewerBackground = (state: CommonStoreState) => state.projectViewerBackground;

export const navigationView = (state: CommonStoreState) => state.navigationView;

export const enableRotate = (state: CommonStoreState) => state.enableRotate;

export const autoRotate = (state: CommonStoreState) => state.autoRotate;

export const cameraPosition = (state: CommonStoreState) => state.cameraPosition;

export const panCenter = (state: CommonStoreState) => state.panCenter;

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

export const contextMenuObjectType = (state: PrimitiveStoreState) => state.contextMenuObjectType;
