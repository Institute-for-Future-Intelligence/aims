/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from './stores/common';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { showError, showInfo } from './helpers';
import i18n from './i18n/i18n';
import { MoleculeInterface, Range, ProjectState, MolecularContainer, MoleculeTransform } from './types';
import { usePrimitiveStore } from './stores/commonPrimitive';
import { ChemicalNotation, DataColoring, GraphType, LabelType, ProjectType, SpaceshipDisplayMode } from './constants';
import { MolecularViewerColoring, MolecularViewerMaterial, MolecularViewerStyle } from './view/displayOptions';
import dayjs from 'dayjs';
import { Util } from './Util.ts';
import { ModelUtil } from './models/ModelUtil.ts';

export const fetchProject = async (userid: string, project: string, setProjectState: (ps: ProjectState) => void) => {
  const lang = { lng: useStore.getState().language };
  await firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(project)
    .get()
    .then((doc) => {
      const data = doc.data();
      if (data) {
        const cl = data.type === ProjectType.DRUG_DISCOVERY ? 50 : 20;
        setProjectState({
          owner: userid,
          title: doc.id,
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

          rotationStep: data.rotationStep ?? Util.toRadians(5),
          translationStep: data.translationStep ?? 1,

          ligandTransform: data.ligandTransform ?? ({ x: 0, y: 0, z: 0, euler: [0, 0, 0] } as MoleculeTransform),

          spaceshipDisplayMode: data.spaceshipDisplayMode ?? SpaceshipDisplayMode.NONE,
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
          molecularContainerVisible: !!data.molecularContainerVisible,
          vdwBondsVisible: !!data.vdwBondsVisible,
          vdwBondCutoffRelative: data.vdwBondCutoffRelative ?? 0.5,
          momentumVisible: !!data.momentumVisible,
          momentumScaleFactor: data.momentumScaleFactor ?? 1,
          forceVisible: !!data.forceVisible,
          forceScaleFactor: data.forceScaleFactor ?? 1,
          kineticEnergyScaleFactor: data.kineticEnergyScaleFactor ?? 1,
          energyGraphVisible: !!data.energyGraphVisible,
          angularBondsVisible: !!data.angularBondsVisible,
          torsionalBondsVisible: !!data.torsionalBondsVisible,

          testMolecules: ModelUtil.reconstructMoleculesFromFirestore(data.testMolecules),

          timeStep: data.timeStep ?? 0.5,
          refreshInterval: data.refreshInterval ?? 20,
          collectInterval: data.collectInterval ?? 100,
          constantTemperature: !!data.constantTemperature,
          temperature: data.temperature !== undefined && data.temperature !== null ? data.temperature : 300,
          pressure: data.pressure !== undefined && data.pressure !== null ? data.pressure : 1,

          cameraPosition: data.cameraPosition,
          cameraRotation: data.cameraRotation,
          cameraUp: data.cameraUp,
          panCenter: data.panCenter,
        } as ProjectState);
      } else {
        showError(i18n.t('message.CannotOpenProject', lang) + ': ' + project);
      }
    })
    .catch((error) => {
      showError(i18n.t('message.CannotOpenProject', lang) + ': ' + error);
    });
};

export const removeMoleculeFromProject = (userid: string, projectTitle: string, molecule: MoleculeInterface) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({
      molecules: firebase.firestore.FieldValue.arrayRemove(molecule),
    })
    .then(() => {
      usePrimitiveStore.getState().set((state) => {
        state.updateProjectsFlag = true;
      });
      // also delete the molecule
      firebase
        .firestore()
        .collection('users')
        .doc(userid)
        .collection('molecules')
        .doc(molecule.name)
        .delete()
        .then(() => {
          showInfo(i18n.t('message.MoleculeRemovedFromProject', lang) + '.');
        })
        .catch((error) => {
          showError(i18n.t('message.CannotDeleteCloudFile', lang) + ': ' + error);
        });
    })
    .catch((error) => {
      showError(i18n.t('message.CannotRemoveMoleculeFromProject', lang) + ': ' + error);
    });
};

export const updateHiddenProperties = (
  userid: string,
  projectTitle: string,
  hiddenProperty: string,
  add: boolean, // true is to add, false is to remove
) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({
      hiddenProperties: add
        ? firebase.firestore.FieldValue.arrayUnion(hiddenProperty)
        : firebase.firestore.FieldValue.arrayRemove(hiddenProperty),
    })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const addRange = (userid: string, projectTitle: string, range: Range) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({
      ranges: firebase.firestore.FieldValue.arrayUnion(range),
    })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateRanges = (userid: string, projectTitle: string, ranges: Range[]) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ ranges })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateDescription = (userid: string, projectTitle: string, description: string | null) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ description })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateDataColoring = (userid: string, projectTitle: string, dataColoring: DataColoring) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ dataColoring })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateSelectedProperty = (userid: string, projectTitle: string, selectedProperty: string | null) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ selectedProperty })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateXAxisNameScatterPlot = (
  userid: string,
  projectTitle: string,
  xAxisNameScatterPlot: string | null,
) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ xAxisNameScatterPlot })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateYAxisNameScatterPlot = (
  userid: string,
  projectTitle: string,
  yAxisNameScatterPlot: string | null,
) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ yAxisNameScatterPlot })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateXMinScatterPlot = (userid: string, projectTitle: string, xMinScatterPlot: number) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ xMinScatterPlot })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateXMaxScatterPlot = (userid: string, projectTitle: string, xMaxScatterPlot: number) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ xMaxScatterPlot })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateYMinScatterPlot = (userid: string, projectTitle: string, yMinScatterPlot: number) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ yMinScatterPlot })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateYMaxScatterPlot = (userid: string, projectTitle: string, yMaxScatterPlot: number) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ yMaxScatterPlot })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateHorizontalLinesScatterPlot = (userid: string, projectTitle: string, xLinesScatterPlot: boolean) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ xLinesScatterPlot })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateVerticalLinesScatterPlot = (userid: string, projectTitle: string, yLinesScatterPlot: boolean) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ yLinesScatterPlot })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateSymbolSizeScatterPlot = (userid: string, projectTitle: string, dotSizeScatterPlot: number) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ dotSizeScatterPlot })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateLineWidthScatterPlot = (userid: string, projectTitle: string, lineWidthScatterPlot: number) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ lineWidthScatterPlot })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const updateNumberOfColumns = (userid: string, projectTitle: string, numberOfColumns: number) => {
  const lang = { lng: useStore.getState().language };
  return firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .update({ numberOfColumns })
    .then(() => {
      // ignore
    })
    .catch((error) => {
      showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
    });
};

export const createMolecule = (type: ProjectType, name: string, url?: string): MoleculeInterface => {
  const molecule = { name, url } as MoleculeInterface;
  switch (type) {
    case ProjectType.DRUG_DISCOVERY:
      break;
  }
  return molecule;
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

export const copyMolecule = (original: string, copy: string, owner: string | null, userid: string) => {
  const lang = { lng: useStore.getState().language };
  firebase
    .firestore()
    .collection('users')
    .doc(owner ?? userid)
    .collection('designs')
    .doc(original)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data) {
          firebase
            .firestore()
            .collection('users')
            .doc(userid)
            .collection('molecules')
            .doc(copy)
            .set(data)
            .then(() => {
              showInfo(i18n.t('message.CloudFileCopied', lang) + ': ' + copy);
            })
            .catch((error) => {
              showError(i18n.t('message.CannotWriteCloudFile', lang) + ': ' + error);
            });
        }
      } else {
        showError(i18n.t('message.CannotReadCloudFile', lang));
      }
    })
    .catch((error) => {
      showError(i18n.t('message.CannotReadCloudFile', lang) + ': ' + error);
    });
};

export const updateMoleculeVisibility = (userid: string, projectTitle: string, molecule: MoleculeInterface) => {
  const lang = { lng: useStore.getState().language };
  firebase
    .firestore()
    .collection('users')
    .doc(userid)
    .collection('projects')
    .doc(projectTitle)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data) {
          const updatedMolecules: MoleculeInterface[] = [];
          updatedMolecules.push(...data.molecules);
          // Get the index of the molecule to be modified by the visibility
          let index = -1;
          for (const [i, d] of updatedMolecules.entries()) {
            if (d.name === molecule.name) {
              index = i;
              break;
            }
          }
          // If found, update the design in the array
          if (index >= 0) {
            updatedMolecules[index].invisible = !molecule.invisible;
            // Finally, upload the updated design array back to Firestore
            firebase
              .firestore()
              .collection('users')
              .doc(userid)
              .collection('projects')
              .doc(projectTitle)
              .update({ molecules: updatedMolecules })
              .then(() => {
                // ignore
              })
              .catch((error) => {
                showError(i18n.t('message.CannotUpdateProject', lang) + ': ' + error);
              });
          }
        }
      }
    })
    .catch((error) => {
      showError(i18n.t('message.CannotFetchProjectData', lang) + ': ' + error);
    })
    .finally(() => {
      // ignore
    });
};
