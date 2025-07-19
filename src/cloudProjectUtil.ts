/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import { useStore } from './stores/common';
import 'firebase/firestore';
import 'firebase/storage';
import i18n from './i18n/i18n';
import { ProjectState, MolecularContainer, MoleculeTransform, ProjectInfo } from './types';
import { DataColoring, GraphType, LabelType, ProjectType, SpaceshipDisplayMode } from './constants';
import { MolecularViewerColoring, MolecularViewerMaterial, MolecularViewerStyle } from './view/displayOptions';
import dayjs from 'dayjs';
import { Util } from './Util.ts';
import { ModelUtil } from './models/ModelUtil.ts';
import { SPEED_BIN_NUMBER } from './models/physicalConstants.ts';
import { useDataStore } from './stores/commonData.ts';
import { GravitationalField } from './models/GravitationalField.ts';
import { setMessage } from './helpers.tsx';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase.ts';

export const addProjectToList = async (uid: string, project: ProjectInfo) => {
  try {
    const userRef = doc(firestore, 'users', uid);
    const userSnap = await getDoc(userRef);
    const existingList = userSnap.data()?.projectList ?? [];
    const item = existingList.find((p: ProjectInfo) => p.title === project.title);
    if (item) {
      // if project exists, remove it and then add the new one (seems this is how Firebase updates an element of an array)
      await updateDoc(userRef, {
        projectList: arrayRemove(item),
      });
    }
    await updateDoc(userRef, {
      projectList: arrayUnion(project),
    });
  } catch (error) {
    console.error('Failed to add project to list or update its timestamp:', error);
  }
};

export const removeProjectFromList = async (uid: string, project: ProjectInfo) => {
  try {
    const userRef = doc(firestore, 'users', uid);
    await updateDoc(userRef, {
      projectList: arrayRemove(project),
    });
  } catch (error) {
    console.error('Failed to remove project from list:', error);
  }
};

export const fetchProject = async (userid: string, project: string, setProjectState: (ps: ProjectState) => void) => {
  const lang = { lng: useStore.getState().language };
  try {
    const docRef = doc(firestore, 'users', userid, 'projects', project);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data) {
        const cl = data.type === ProjectType.DRUG_DISCOVERY ? 50 : 20;
        const ps = {
          owner: userid,
          title: docSnap.id,
          key: data.key ?? data.timestamp,
          timestamp: data.timestamp,
          time: data.time ?? dayjs(new Date(data.timestamp)).format('MM/DD/YYYY hh:mm A'),
          description: data.description,
          dataColoring: data.dataColoring ?? DataColoring.ALL,
          type: data.type,
          molecules: data.molecules,
          numberOfColumns: data.numberOfColumns ?? 3,
          selectedMolecule: data.selectedMolecule,
          ligand: data.ligand,
          protein: data.protein,
          ranges: data.ranges,
          filters: data.filters,
          hiddenProperties: data.hiddenProperties,
          selectedProperty: data.selectedProperty,
          autoscaleGraph: data.autoscaleGraph,
          sortDescending: data.sortDescending,
          xAxisNameScatterPlot: data.xAxisNameScatterPlot,
          yAxisNameScatterPlot: data.yAxisNameScatterPlot,
          xFormula: data.xFormula,
          yFormula: data.yFormula,
          xMinScatterPlot: data.xMinScatterPlot !== undefined ? data.xMinScatterPlot : 0,
          xMaxScatterPlot: data.xMaxScatterPlot !== undefined ? data.xMaxScatterPlot : 100,
          yMinScatterPlot: data.yMinScatterPlot !== undefined ? data.yMinScatterPlot : 0,
          yMaxScatterPlot: data.yMaxScatterPlot !== undefined ? data.yMaxScatterPlot : 100,
          xLinesScatterPlot: !!data.xLinesScatterPlot,
          yLinesScatterPlot: !!data.yLinesScatterPlot,
          lineWidthScatterPlot: data.lineWidthScatterPlot !== undefined ? data.lineWidthScatterPlot : 1,
          dotSizeScatterPlot: data.dotSizeScatterPlot !== undefined ? data.dotSizeScatterPlot : 4,
          sortDataScatterPlot: data.sortDataScatterPlot ?? 'None',
          regressionDegree: data.regressionDegree ?? 1,
          numberOfMostSimilarMolecules: data.numberOfMostSimilarMolecules ?? 5,

          hideGallery: !!data.hideGallery,

          chamberViewerPercentWidth: data.chamberViewerPercentWidth ?? 50,
          chamberViewerAxes: data.chamberViewerAxes ?? true,
          chamberViewerStyle: data.chamberViewerStyle ?? MolecularViewerStyle.BallAndStick,
          chamberViewerMaterial: data.chamberViewerMaterial ?? MolecularViewerMaterial.Diffuse,
          chamberViewerColoring: data.chamberViewerColoring ?? MolecularViewerColoring.Element,
          chamberViewerFoggy: !!data.chamberViewerFoggy,
          chamberViewerBackground: data.chamberViewerBackground ?? 'black',
          chamberViewerSelector: data.chamberViewerSelector ?? 'all',
          chamberTemperatureKevin: !!data.chamberTemperatureKevin,

          rotationStep: data.rotationStep ?? Util.toRadians(5),
          translationStep: data.translationStep ?? 1,

          ligandTransform: data.ligandTransform ?? ({ x: 0, y: 0, z: 0, euler: [0, 0, 0] } as MoleculeTransform),

          spaceshipDisplayMode: data.spaceshipDisplayMode ?? SpaceshipDisplayMode.NONE,
          spaceshipThrust: data.spaceshipThrust ?? 1,
          spaceshipSize: data.spaceshipSize ?? 1,
          spaceshipRoll: data.spaceshipRoll ?? 0,
          spaceshipPitch: data.spaceshipPitch ?? 0,
          spaceshipYaw: data.spaceshipYaw ?? 0,
          spaceshipX: data.spaceshipX ?? 0,
          spaceshipY: data.spaceshipY ?? 0,
          spaceshipZ: data.spaceshipZ ?? 0,

          projectViewerStyle: data.projectViewerStyle ?? MolecularViewerStyle.Stick,
          projectViewerMaterial: data.projectViewerMaterial ?? MolecularViewerMaterial.Soft,
          projectViewerBackground: data.projectViewerBackground ?? 'white',

          graphType: data.graphType ?? GraphType.PARALLEL_COORDINATES,
          labelType: data.labelType ?? LabelType.NAME,

          xyPlaneVisible: !!data.xyPlaneVisible,
          yzPlaneVisible: !!data.yzPlaneVisible,
          xzPlaneVisible: !!data.xzPlaneVisible,
          xyPlanePosition: data.xyPlanePosition ?? 0,
          yzPlanePosition: data.yzPlanePosition ?? 0,
          xzPlanePosition: data.xzPlanePosition ?? 0,

          molecularContainer: data.molecularContainer ?? ({ lx: cl, ly: cl, lz: cl } as MolecularContainer),
          gravitationalAcceleration: data.gravitationalAcceleration ?? 0,
          gravityDirection: data.gravityDirection ?? GravitationalField.VIEWER_COORDINATE_SYSTEM,
          molecularContainerVisible: !!data.molecularContainerVisible,
          vdwBondsVisible: !!data.vdwBondsVisible,
          vdwBondCutoffRelative: data.vdwBondCutoffRelative ?? 0.5,
          momentumVisible: !!data.momentumVisible,
          momentumScaleFactor: data.momentumScaleFactor ?? 1,
          forceVisible: !!data.forceVisible,
          forceScaleFactor: data.forceScaleFactor ?? 1,
          kineticEnergyScaleFactor: data.kineticEnergyScaleFactor ?? 1,
          energyGraphVisible: !!data.energyGraphVisible,
          speedGraphVisible: !!data.speedGraphVisible,
          speedGraphMaxX: data.speedGraphMaxX ?? 0,
          speedGraphMaxY: data.speedGraphMaxY ?? 0,
          speedGraphSortByMolecule: !!data.speedGraphSortByMolecule,
          speedGraphBinNumber: data.speedGraphBinNumber ?? SPEED_BIN_NUMBER,
          angularBondsVisible: !!data.angularBondsVisible,
          torsionalBondsVisible: !!data.torsionalBondsVisible,

          testMolecules: ModelUtil.reconstructMoleculesFromFirestore(data.testMolecules),

          timeStep: data.timeStep ?? 0.5,
          refreshInterval: data.refreshInterval ?? 20,
          collectInterval: data.collectInterval ?? 100,
          constantTemperature: !!data.constantTemperature,
          temperature: data.temperature !== undefined && data.temperature !== null ? data.temperature : 300,
          constantPressure: !!data.constantPressure,
          pressure: data.pressure !== undefined && data.pressure !== null ? data.pressure : 1,

          cameraPosition: data.cameraPosition,
          cameraRotation: data.cameraRotation,
          cameraUp: data.cameraUp,
          panCenter: data.panCenter,
          navigationView: !!data.navigationView,
          navPosition: data.navPosition ?? data.cameraPosition,
          navRotation: data.navRotation ?? data.cameraRotation,
          navUp: data.navUp ?? data.cameraUp,
          navTarget: data.navTarget ?? data.panCenter,
          showInstructionPanel: !!data.showInstructionPanel,
          reasoningEffort: data.reasoningEffort ?? 'medium',
          generateMoleculePrompt: data.generateMoleculePrompt ?? 'Generate a novel molecule similar to benzene.',
          generatedMolecularProperties: data.generatedMolecularProperties ?? {},
        } as ProjectState;
        for (const m of ps.testMolecules) {
          for (const n of ps.molecules) {
            if (n.name === m.name) {
              m.data = n.data;
              break;
            }
          }
        }
        setProjectState(ps);
      } else {
        setMessage('error', i18n.t('message.CannotOpenProject', lang) + ': ' + project);
      }
    }
  } catch (e) {
    setMessage('error', i18n.t('message.CannotOpenProject', lang) + ': ' + e);
  }
};

export const postFetch = () => {
  useDataStore.getState().speedArrayMap.clear();
};

export const getImageData = (image: HTMLImageElement) => {
  const c = document.createElement('canvas');
  c.width = image.width;
  c.height = image.height;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.drawImage(image, 1, 1); // 1 is for padding
  }
  return c.toDataURL();
};
