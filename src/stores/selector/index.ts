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

export const selectedMolecule = (state: CommonStoreState) => state.selectedMolecule;

export const collectedMolecules = (state: CommonStoreState) => state.collectedMolecules;

export const chamberViewerAxes = (state: CommonStoreState) => state.chamberViewerAxes;

export const chamberViewerStyle = (state: CommonStoreState) => state.chamberViewerStyle;

export const projectViewerStyle = (state: CommonStoreState) => state.projectViewerStyle;

export const undoManager = (state: CommonStoreState) => state.undoManager;

export const addUndoable = (state: CommonStoreState) => state.addUndoable;

export const loggable = (state: CommonStoreState) => state.loggable;

export const actionInfo = (state: CommonStoreState) => state.actionInfo;

export const currentUndoable = (state: CommonStoreState) => state.currentUndoable;

export const chemicalElements = (state: CommonStoreState) => state.chemicalElements;

export const getChemicalElement = (state: CommonStoreState) => state.getChemicalElement;

export const loadChemicalElements = (state: CommonStoreState) => state.loadChemicalElements;

export const contextMenuObjectType = (state: PrimitiveStoreState) => state.contextMenuObjectType;
