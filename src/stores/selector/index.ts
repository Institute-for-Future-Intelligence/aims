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

export const waiting = (state: PrimitiveStoreState) => state.waiting;

export const changed = (state: PrimitiveStoreState) => state.changed;

export const setChanged = (state: PrimitiveStoreState) => state.setChanged;

export const setSkipChange = (state: PrimitiveStoreState) => state.setSkipChange;

export const showAccountSettingsPanel = (state: PrimitiveStoreState) => state.showAccountSettingsPanel;

export const userCount = (state: PrimitiveStoreState) => state.userCount;

export const selectedFloatingWindow = (state: CommonStoreState) => state.selectedFloatingWindow;

export const projectView = (state: CommonStoreState) => state.projectView;

export const cameraPosition = (state: CommonStoreState) => state.projectState.cameraPosition;

export const cameraRotation = (state: CommonStoreState) => state.projectState.cameraRotation;

export const cameraUp = (state: CommonStoreState) => state.projectState.cameraUp;

export const panCenter = (state: CommonStoreState) => state.projectState.panCenter;

export const targetProteinData = (state: CommonStoreState) => state.targetProteinData;

export const molecules = (state: CommonStoreState) => state.projectState.molecules;

export const testMolecule = (state: CommonStoreState) => state.projectState.testMolecule;

export const updateTestMoleculeData = (state: CommonStoreState) => state.updateTestMoleculeData;

export const selectedProperty = (state: CommonStoreState) => state.projectState.selectedProperty;

export const selectedMolecule = (state: CommonStoreState) => state.projectState.selectedMolecule;

export const hoveredMolecule = (state: PrimitiveStoreState) => state.hoveredMolecule;

export const clickedMolecule = (state: PrimitiveStoreState) => state.clickedMolecule;

export const enableRotate = (state: PrimitiveStoreState) => state.enableRotate;

export const autoRotate = (state: PrimitiveStoreState) => state.autoRotate;

export const resetViewFlag = (state: PrimitiveStoreState) => state.resetViewFlag;

export const zoomViewFlag = (state: PrimitiveStoreState) => state.zoomViewFlag;

export const addMolecule = (state: CommonStoreState) => state.addMolecule;

export const removeMolecule = (state: CommonStoreState) => state.removeMolecule;

export const molecularPropertiesMap = (state: CommonStoreState) => state.molecularPropertiesMap;

export const setMolecularProperties = (state: CommonStoreState) => state.setMolecularProperties;

export const parsedResultsMap = (state: CommonStoreState) => state.parsedResultsMap;

export const setParsedResult = (state: CommonStoreState) => state.setParsedResult;

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

export const saveAndThenOpenProjectFlag = (state: PrimitiveStoreState) => state.saveAndThenOpenProjectFlag;

export const saveProjectAsFlag = (state: PrimitiveStoreState) => state.saveProjectAsFlag;

export const saveProjectAsDialog = (state: PrimitiveStoreState) => state.saveProjectAsDialog;

export const showProjectsFlag = (state: PrimitiveStoreState) => state.showProjectsFlag;

export const updateProjectsFlag = (state: PrimitiveStoreState) => state.updateProjectsFlag;

export const showProjectListPanel = (state: PrimitiveStoreState) => state.showProjectListPanel;

export const saveAccountSettingsFlag = (state: PrimitiveStoreState) => state.saveAccountSettingsFlag;

export const projectType = (state: CommonStoreState) => state.projectState.type;

export const projectTitle = (state: CommonStoreState) => state.projectState.title;

export const projectOwner = (state: CommonStoreState) => state.projectState.owner;

export const projectDescription = (state: CommonStoreState) => state.projectState.description;

export const projectSortDesending = (state: CommonStoreState) => state.projectState.sortDescending;

export const projectDataColoring = (state: CommonStoreState) => state.projectState.dataColoring;

export const projectFilters = (state: CommonStoreState) => state.projectState.filters;

export const projectRanges = (state: CommonStoreState) => state.projectState.ranges;

export const hiddenProperties = (state: CommonStoreState) => state.projectState.hiddenProperties;

export const xAxisNameScatterPlot = (state: CommonStoreState) => state.projectState.xAxisNameScatterPlot;

export const yAxisNameScatterPlot = (state: CommonStoreState) => state.projectState.yAxisNameScatterPlot;

export const xMinScatterPlot = (state: CommonStoreState) => state.projectState.xMinScatterPlot;

export const xMaxScatterPlot = (state: CommonStoreState) => state.projectState.xMaxScatterPlot;

export const yMinScatterPlot = (state: CommonStoreState) => state.projectState.yMinScatterPlot;

export const yMaxScatterPlot = (state: CommonStoreState) => state.projectState.yMaxScatterPlot;

export const xLinesScatterPlot = (state: CommonStoreState) => state.projectState.xLinesScatterPlot;

export const yLinesScatterPlot = (state: CommonStoreState) => state.projectState.yLinesScatterPlot;

export const lineWidthScatterPlot = (state: CommonStoreState) => state.projectState.lineWidthScatterPlot;

export const dotSizeScatterPlot = (state: CommonStoreState) => state.projectState.dotSizeScatterPlot;

export const chamberViewerPercentWidth = (state: CommonStoreState) => state.projectState.chamberViewerPercentWidth;

export const chamberViewerBackground = (state: CommonStoreState) => state.projectState.chamberViewerBackground;

export const chamberViewerAxes = (state: CommonStoreState) => state.projectState.chamberViewerAxes;

export const chamberViewerFoggy = (state: CommonStoreState) => state.projectState.chamberViewerFoggy;

export const chamberViewerSelector = (state: CommonStoreState) => state.projectState.chamberViewerSelector;

export const chamberViewerColoring = (state: CommonStoreState) => state.projectState.chamberViewerColoring;

export const chamberViewerMaterial = (state: CommonStoreState) => state.projectState.chamberViewerMaterial;

export const chamberViewerStyle = (state: CommonStoreState) => state.projectState.chamberViewerStyle;

export const projectViewerStyle = (state: CommonStoreState) => state.projectState.projectViewerStyle;

export const projectViewerMaterial = (state: CommonStoreState) => state.projectState.projectViewerMaterial;

export const projectViewerBackground = (state: CommonStoreState) => state.projectState.projectViewerBackground;

export const graphType = (state: CommonStoreState) => state.projectState.graphType;

export const labelType = (state: CommonStoreState) => state.projectState.labelType;

export const targetProtein = (state: CommonStoreState) => state.projectState.targetProtein;

export const spaceshipDisplayMode = (state: CommonStoreState) => state.projectState.spaceshipDisplayMode;

export const spaceshipSize = (state: CommonStoreState) => state.projectState.spaceshipSize;

export const spaceshipRoll = (state: CommonStoreState) => state.projectState.spaceshipRoll;

export const spaceshipPitch = (state: CommonStoreState) => state.projectState.spaceshipPitch;

export const spaceshipYaw = (state: CommonStoreState) => state.projectState.spaceshipYaw;

export const spaceshipX = (state: CommonStoreState) => state.projectState.spaceshipX;

export const spaceshipY = (state: CommonStoreState) => state.projectState.spaceshipY;

export const spaceshipZ = (state: CommonStoreState) => state.projectState.spaceshipZ;

export const rotationStep = (state: CommonStoreState) => state.projectState.rotationStep;

export const translationStep = (state: CommonStoreState) => state.projectState.translationStep;
