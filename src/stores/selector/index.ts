/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { CommonStoreState } from '../common';
import { PrimitiveStoreState } from '../commonPrimitive';
import { DataStoreState } from '../commonData.ts';

export const set = (state: CommonStoreState) => state.set;

export const setPrimitiveStore = (state: PrimitiveStoreState) => state.setPrimitiveStore;

export const user = (state: CommonStoreState) => state.user;

export const language = (state: CommonStoreState) => state.language;

export const locale = (state: CommonStoreState) => state.locale;

export const latestVersion = (state: PrimitiveStoreState) => state.latestVersion;

export const waiting = (state: PrimitiveStoreState) => state.waiting;

export const setWaiting = (state: PrimitiveStoreState) => state.setWaiting;

export const changed = (state: PrimitiveStoreState) => state.changed;

export const setChanged = (state: PrimitiveStoreState) => state.setChanged;

export const updateViewerFlag = (state: PrimitiveStoreState) => state.updateViewerFlag;

export const updateViewer = (state: PrimitiveStoreState) => state.updateViewer;

export const updateInfoFlag = (state: PrimitiveStoreState) => state.updateInfoFlag;

export const updateInfo = (state: PrimitiveStoreState) => state.updateInfo;

export const selectedPlane = (state: PrimitiveStoreState) => state.selectedPlane;

export const xyPlaneVisible = (state: CommonStoreState) => state.projectState.xyPlaneVisible;

export const yzPlaneVisible = (state: CommonStoreState) => state.projectState.yzPlaneVisible;

export const xzPlaneVisible = (state: CommonStoreState) => state.projectState.xzPlaneVisible;

export const xyPlanePosition = (state: CommonStoreState) => state.projectState.xyPlanePosition;

export const yzPlanePosition = (state: CommonStoreState) => state.projectState.yzPlanePosition;

export const xzPlanePosition = (state: CommonStoreState) => state.projectState.xzPlanePosition;

export const temperature = (state: CommonStoreState) => state.projectState.temperature;

export const constantTemperature = (state: CommonStoreState) => state.projectState.constantTemperature;

export const pressure = (state: CommonStoreState) => state.projectState.pressure;

export const constantPressure = (state: CommonStoreState) => state.projectState.constantPressure;

export const timeStep = (state: CommonStoreState) => state.projectState.timeStep;

export const refreshInterval = (state: CommonStoreState) => state.projectState.refreshInterval;

export const collectInterval = (state: CommonStoreState) => state.projectState.collectInterval;

export const testMolecules = (state: CommonStoreState) => state.projectState.testMolecules;

export const molecularContainer = (state: CommonStoreState) => state.projectState.molecularContainer;

export const gravitationalAcceleration = (state: CommonStoreState) => state.projectState.gravitationalAcceleration;

export const gravityDirection = (state: CommonStoreState) => state.projectState.gravityDirection;

export const molecularContainerVisible = (state: CommonStoreState) => state.projectState.molecularContainerVisible;

export const energyGraphVisible = (state: CommonStoreState) => state.projectState.energyGraphVisible;

export const speedGraphVisible = (state: CommonStoreState) => state.projectState.speedGraphVisible;

export const speedGraphMaxX = (state: CommonStoreState) => state.projectState.speedGraphMaxX;

export const speedGraphMaxY = (state: CommonStoreState) => state.projectState.speedGraphMaxY;

export const speedGraphSortByMolecule = (state: CommonStoreState) => state.projectState.speedGraphSortByMolecule;

export const speedGraphBinNumber = (state: CommonStoreState) => state.projectState.speedGraphBinNumber;

export const vdwBondsVisible = (state: CommonStoreState) => state.projectState.vdwBondsVisible;

export const vdwBondCutoffRelative = (state: CommonStoreState) => state.projectState.vdwBondCutoffRelative;

export const momentumVisible = (state: CommonStoreState) => state.projectState.momentumVisible;

export const momentumScaleFactor = (state: CommonStoreState) => state.projectState.momentumScaleFactor;

export const forceVisible = (state: CommonStoreState) => state.projectState.forceVisible;

export const forceScaleFactor = (state: CommonStoreState) => state.projectState.forceScaleFactor;

export const kineticEnergyScaleFactor = (state: CommonStoreState) => state.projectState.kineticEnergyScaleFactor;

export const pickMode = (state: PrimitiveStoreState) => state.pickMode;

export const pickedAtomIndex = (state: PrimitiveStoreState) => state.pickedAtomIndex;

export const pickedMoleculeIndex = (state: PrimitiveStoreState) => state.pickedMoleculeIndex;

export const copiedMoleculeIndex = (state: PrimitiveStoreState) => state.copiedMoleculeIndex;

export const cutMolecule = (state: PrimitiveStoreState) => state.cutMolecule;

export const showAccountSettingsPanel = (state: PrimitiveStoreState) => state.showAccountSettingsPanel;

export const userCount = (state: PrimitiveStoreState) => state.userCount;

export const selectedFloatingWindow = (state: CommonStoreState) => state.selectedFloatingWindow;

export const cameraPosition = (state: CommonStoreState) => state.projectState.cameraPosition;

export const cameraRotation = (state: CommonStoreState) => state.projectState.cameraRotation;

export const cameraUp = (state: CommonStoreState) => state.projectState.cameraUp;

export const panCenter = (state: CommonStoreState) => state.projectState.panCenter;

export const navPosition = (state: CommonStoreState) => state.projectState.navPosition;

export const navRotation = (state: CommonStoreState) => state.projectState.navRotation;

export const navUp = (state: CommonStoreState) => state.projectState.navUp;

export const navTarget = (state: CommonStoreState) => state.projectState.navTarget;

export const proteinData = (state: CommonStoreState) => state.proteinData;

export const molecules = (state: CommonStoreState) => state.projectState.molecules;

export const numberOfColumns = (state: CommonStoreState) => state.projectState.numberOfColumns;

export const ligand = (state: CommonStoreState) => state.projectState.ligand;

export const ligandTransform = (state: CommonStoreState) => state.projectState.ligandTransform;

export const selectedProperty = (state: CommonStoreState) => state.projectState.selectedProperty;

export const autoscaleGraph = (state: CommonStoreState) => state.projectState.autoscaleGraph;

export const selectedMolecule = (state: CommonStoreState) => state.projectState.selectedMolecule;

export const hoveredMolecule = (state: PrimitiveStoreState) => state.hoveredMolecule;

export const dragAndDropMolecule = (state: PrimitiveStoreState) => state.dragAndDropMolecule;

export const enableRotate = (state: PrimitiveStoreState) => state.enableRotate;

export const autoRotate = (state: PrimitiveStoreState) => state.autoRotate;

export const startSimulation = (state: PrimitiveStoreState) => state.startSimulation;

export const resetSimulation = (state: PrimitiveStoreState) => state.resetSimulation;

export const updateDataFlag = (state: PrimitiveStoreState) => state.updateDataFlag;

export const resetViewFlag = (state: PrimitiveStoreState) => state.resetViewFlag;

export const zoomViewFlag = (state: PrimitiveStoreState) => state.zoomViewFlag;

export const addMolecule = (state: CommonStoreState) => state.addMolecule;

export const addMolecules = (state: CommonStoreState) => state.addMolecules;

export const removeMolecule = (state: CommonStoreState) => state.removeMolecule;

export const removeMoleculeByName = (state: CommonStoreState) => state.removeMoleculeByName;

export const removeAllMolecules = (state: CommonStoreState) => state.removeAllMolecules;

export const molecularPropertiesMap = (state: CommonStoreState) => state.molecularPropertiesMap;

export const molecularStructureMap = (state: CommonStoreState) => state.molecularStructureMap;

export const undoManager = (state: CommonStoreState) => state.undoManager;

export const addUndoable = (state: CommonStoreState) => state.addUndoable;

export const loggable = (state: CommonStoreState) => state.loggable;

export const logAction = (state: CommonStoreState) => state.logAction;

export const loadChemicalElements = (state: CommonStoreState) => state.loadChemicalElements;

export const chemicalElements = (state: CommonStoreState) => state.chemicalElements;

export const providedMolecularProperties = (state: CommonStoreState) => state.providedMolecularProperties;

export const getProvidedMolecularProperties = (state: CommonStoreState) => state.getProvidedMolecularProperties;

export const loadProvidedMolecularProperties = (state: CommonStoreState) => state.loadProvidedMolecularProperties;

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

export const projectSortDescending = (state: CommonStoreState) => state.projectState.sortDescending;

export const projectDataColoring = (state: CommonStoreState) => state.projectState.dataColoring;

export const projectFilters = (state: CommonStoreState) => state.projectState.filters;

export const projectRanges = (state: CommonStoreState) => state.projectState.ranges;

export const hiddenProperties = (state: CommonStoreState) => state.projectState.hiddenProperties;

export const xAxisNameScatterPlot = (state: CommonStoreState) => state.projectState.xAxisNameScatterPlot;

export const yAxisNameScatterPlot = (state: CommonStoreState) => state.projectState.yAxisNameScatterPlot;

export const xFormula = (state: CommonStoreState) => state.projectState.xFormula;

export const yFormula = (state: CommonStoreState) => state.projectState.yFormula;

export const xMinScatterPlot = (state: CommonStoreState) => state.projectState.xMinScatterPlot;

export const xMaxScatterPlot = (state: CommonStoreState) => state.projectState.xMaxScatterPlot;

export const yMinScatterPlot = (state: CommonStoreState) => state.projectState.yMinScatterPlot;

export const yMaxScatterPlot = (state: CommonStoreState) => state.projectState.yMaxScatterPlot;

export const xLinesScatterPlot = (state: CommonStoreState) => state.projectState.xLinesScatterPlot;

export const yLinesScatterPlot = (state: CommonStoreState) => state.projectState.yLinesScatterPlot;

export const lineWidthScatterPlot = (state: CommonStoreState) => state.projectState.lineWidthScatterPlot;

export const dotSizeScatterPlot = (state: CommonStoreState) => state.projectState.dotSizeScatterPlot;

export const sortDataScatterPlot = (state: CommonStoreState) => state.projectState.sortDataScatterPlot;

export const regressionAnalysis = (state: PrimitiveStoreState) => state.regressionAnalysis;

export const regression = (state: PrimitiveStoreState) => state.regression;

export const regressionDegree = (state: CommonStoreState) => state.projectState.regressionDegree;

export const numberOfMostSimilarMolecules = (state: CommonStoreState) =>
  state.projectState.numberOfMostSimilarMolecules;

export const hideGallery = (state: CommonStoreState) => state.projectState.hideGallery;

export const chamberViewerPercentWidth = (state: CommonStoreState) => state.projectState.chamberViewerPercentWidth;

export const chamberViewerBackground = (state: CommonStoreState) => state.projectState.chamberViewerBackground;

export const chamberViewerAxes = (state: CommonStoreState) => state.projectState.chamberViewerAxes;

export const chamberViewerFoggy = (state: CommonStoreState) => state.projectState.chamberViewerFoggy;

export const chamberViewerSelector = (state: CommonStoreState) => state.projectState.chamberViewerSelector;

export const chamberViewerColoring = (state: CommonStoreState) => state.projectState.chamberViewerColoring;

export const chamberViewerMaterial = (state: CommonStoreState) => state.projectState.chamberViewerMaterial;

export const chamberViewerStyle = (state: CommonStoreState) => state.projectState.chamberViewerStyle;

export const chamberTemperatureKevin = (state: CommonStoreState) => state.projectState.chamberTemperatureKevin;

export const projectViewerStyle = (state: CommonStoreState) => state.projectState.projectViewerStyle;

export const projectViewerMaterial = (state: CommonStoreState) => state.projectState.projectViewerMaterial;

export const projectViewerBackground = (state: CommonStoreState) => state.projectState.projectViewerBackground;

export const graphType = (state: CommonStoreState) => state.projectState.graphType;

export const labelType = (state: CommonStoreState) => state.projectState.labelType;

export const protein = (state: CommonStoreState) => state.projectState.protein;

export const spaceshipDisplayMode = (state: CommonStoreState) => state.projectState.spaceshipDisplayMode;

export const spaceshipThrust = (state: CommonStoreState) => state.projectState.spaceshipThrust;

export const showThrustFlame = (state: PrimitiveStoreState) => state.showThrustFlame;

export const navCoordinates = (state: PrimitiveStoreState) => state.navCoordinates;

export const spaceshipSize = (state: CommonStoreState) => state.projectState.spaceshipSize;

export const spaceshipRoll = (state: CommonStoreState) => state.projectState.spaceshipRoll;

export const spaceshipPitch = (state: CommonStoreState) => state.projectState.spaceshipPitch;

export const spaceshipYaw = (state: CommonStoreState) => state.projectState.spaceshipYaw;

export const spaceshipX = (state: CommonStoreState) => state.projectState.spaceshipX;

export const spaceshipY = (state: CommonStoreState) => state.projectState.spaceshipY;

export const spaceshipZ = (state: CommonStoreState) => state.projectState.spaceshipZ;

export const rotationStep = (state: CommonStoreState) => state.projectState.rotationStep;

export const translationStep = (state: CommonStoreState) => state.projectState.translationStep;

export const energyTimeSeries = (state: DataStoreState) => state.energyTimeSeries;

export const speedArrayMap = (state: DataStoreState) => state.speedArrayMap;

export const positionTimeSeriesMap = (state: DataStoreState) => state.positionTimeSeriesMap;

export const currentTemperature = (state: PrimitiveStoreState) => state.currentTemperature;

export const currentPressure = (state: PrimitiveStoreState) => state.currentPressure;

export const currentDensity = (state: PrimitiveStoreState) => state.currentDensity;

export const deleteAllAtoms = (state: CommonStoreState) => state.deleteAllAtoms;

export const getAtomByIndex = (state: CommonStoreState) => state.getAtomByIndex;

export const fixAtomByIndex = (state: CommonStoreState) => state.fixAtomByIndex;

export const restrainAtomByIndex = (state: CommonStoreState) => state.restrainAtomByIndex;

export const dampAtomByIndex = (state: CommonStoreState) => state.dampAtomByIndex;

export const chargeAtomByIndex = (state: CommonStoreState) => state.chargeAtomByIndex;

export const setAtomEpsilonByIndex = (state: CommonStoreState) => state.setAtomEpsilonByIndex;

export const setAtomTrajectoryByIndex = (state: CommonStoreState) => state.setAtomTrajectoryByIndex;

export const angularBondsMap = (state: CommonStoreState) => state.angularBondsMap;

export const angularBondsVisible = (state: CommonStoreState) => state.projectState.angularBondsVisible;

export const torsionalBondsMap = (state: CommonStoreState) => state.torsionalBondsMap;

export const torsionalBondsVisible = (state: CommonStoreState) => state.projectState.torsionalBondsVisible;

export const showInstructionPanel = (state: CommonStoreState) => state.projectState.showInstructionPanel;

export const navigationView = (state: CommonStoreState) => state.projectState.navigationView;

export const showPeriodicTable = (state: PrimitiveStoreState) => state.showPeriodicTable;

export const message = (state: PrimitiveStoreState) => state.message;

export const generateMoleculePrompt = (state: CommonStoreState) => state.projectState.generateMoleculePrompt;
