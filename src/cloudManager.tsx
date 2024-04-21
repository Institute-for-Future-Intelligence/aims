/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from './stores/common';
import { usePrimitiveStore } from './stores/commonPrimitive';
import * as Selector from './stores/selector';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { showError, showInfo } from './helpers';
import { MolecularContainer, MoleculeTransform, ProjectState } from './types';
import Spinner from './components/spinner';
import { Util } from './Util';
import MainToolBar from './mainToolBar';
import ProjectListPanel from './project/projectListPanel.tsx';
import { fetchProject } from './cloudProjectUtil';
import { ClassID, SchoolID, User } from './User';
import {
  DataColoring,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_ROTATION,
  DEFAULT_CAMERA_UP,
  DEFAULT_PAN_CENTER,
  FirebaseName,
  GraphType,
  LabelType,
  ProjectType,
  SpaceshipDisplayMode,
} from './constants';
import { MolecularViewerColoring, MolecularViewerMaterial, MolecularViewerStyle } from './view/displayOptions';
import { ProjectUtil } from './project/ProjectUtil.ts';
import { useTranslation } from 'react-i18next';
import { useRefStore } from './stores/commonRef.ts';
import { ModelUtil } from './models/ModelUtil.ts';
import { useDataStore } from './stores/commonData.ts';
import { Molecule } from './models/Molecule.ts';

export interface CloudManagerProps {
  viewOnly: boolean;
}

const useFlag = (flag: boolean, fn: () => void, setFlag: () => void) => {
  useEffect(() => {
    if (flag) {
      fn();
      setFlag();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag]);
};

const CloudManager = React.memo(({ viewOnly = false }: CloudManagerProps) => {
  const setCommonStore = useStore(Selector.set);
  const setPrimitiveStore = usePrimitiveStore(Selector.setPrimitiveStore);
  const language = useStore(Selector.language);
  const user = useStore(Selector.user);
  const waiting = usePrimitiveStore(Selector.waiting);
  const setWaiting = usePrimitiveStore(Selector.setWaiting);
  const saveAccountSettingsFlag = usePrimitiveStore(Selector.saveAccountSettingsFlag);
  const showProjectListPanel = usePrimitiveStore(Selector.showProjectListPanel);
  const createProjectFlag = usePrimitiveStore(Selector.createProjectFlag);
  const saveProjectAsFlag = usePrimitiveStore(Selector.saveProjectAsFlag);
  const saveProjectFlag = usePrimitiveStore(Selector.saveProjectFlag);
  const saveAndThenOpenProjectFlag = usePrimitiveStore(Selector.saveAndThenOpenProjectFlag);
  const showProjectsFlag = usePrimitiveStore(Selector.showProjectsFlag);
  const updateProjectsFlag = usePrimitiveStore(Selector.updateProjectsFlag);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const moleculesRef = useRefStore.getState().moleculesRef;
  const energyTimeSeries = useDataStore(Selector.energyTimeSeries);
  const positionTimeSeriesMap = useDataStore(Selector.positionimeSeriesMap);

  const [updateFlag, setUpdateFlag] = useState(false);
  const [updateMyProjectsFlag, setUpdateMyProjectsFlag] = useState(false);
  const myProjectsRef = useRef<ProjectState[] | void>(); // Not sure why I need to use ref to store this

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  useFlag(saveAccountSettingsFlag, saveAccountSettings, () => setPrimitiveStore('saveAccountSettingsFlag', false));

  useFlag(createProjectFlag, createNewProject, () => setPrimitiveStore('createProjectFlag', false));

  useFlag(saveProjectAsFlag, saveProjectAs, () => setPrimitiveStore('saveProjectAsFlag', false));

  useFlag(saveProjectFlag, saveProject, () => setPrimitiveStore('saveProjectFlag', false));

  useFlag(saveAndThenOpenProjectFlag, saveProject, () => setPrimitiveStore('saveAndThenOpenProjectFlag', false));

  useFlag(showProjectsFlag, showMyProjectsList, () => setPrimitiveStore('showProjectsFlag', false));

  useFlag(updateProjectsFlag, hideMyProjectsList, () => setPrimitiveStore('updateProjectsFlag', false));

  useEffect(() => {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    let initialize = firebase.apps.length === 0; // no app, should initialize
    if (firebase.apps.length === 1 && firebase.apps[0].name === FirebaseName.LOG_DATA) {
      initialize = true; // if there is only the logger app, should initialize
    }
    if (initialize) {
      firebase.initializeApp(config);
    } else {
      firebase.app(); // if already initialized, use the default one
    }

    // don't enable persistence as we often need to open multiple tabs
    // firebase.firestore().enablePersistence()
    //   .catch((err) => {
    //     if (err.code === 'failed-precondition') {
    //       showWarning('Firestore: Multiple tabs open, persistence can only be enabled in one tab at a time.', 10);
    //     } else if (err.code === 'unimplemented') {
    //       showWarning('Firestore: The current browser does not support offline persistence, 10');
    //     }
    //   });

    // do not use firebase.auth().currentUser - currentUser might be null because the auth object has not finished initializing.
    // If you use an observer to keep track of the user's sign-in status, you don't need to handle this case.
    firebase.auth().onAuthStateChanged((u) => {
      if (u) {
        setCommonStore((state) => {
          if (state.user) {
            state.user.uid = u.uid;
            state.user.displayName = u.displayName;
            state.user.email = u.email;
            state.user.photoURL = u.photoURL;
          }
        });
      }
    });
    init();
    window.addEventListener('popstate', handlePopStateEvent);
    return () => {
      window.removeEventListener('popstate', handlePopStateEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePopStateEvent = () => {
    if (viewOnly) return;
    const p = new URLSearchParams(window.location.search);
    const userid = p.get('userid');
    const project = p.get('project');
    if (userid && project) {
      // TODO: Not sure if we should change the browser's URL address
    }
  };

  useEffect(() => {
    if (myProjectsRef.current) {
      myProjectsRef.current.sort((a, b) => b.timestamp - a.timestamp);
    }
  }, [updateMyProjectsFlag]);

  const init = () => {
    const params = new URLSearchParams(window.location.search);
    const userid = params.get('userid');
    if (userid) {
      const project = params.get('project');
      if (project) {
        setWaiting(true);
        fetchProject(userid, project, setProjectState).finally(() => {
          setWaiting(false);
        });
      }
    }
  };

  const setProjectState = (projectState: ProjectState | null) => {
    if (!projectState) return;
    setCommonStore((state) => {
      state.projectState = { ...projectState };
    });
    usePrimitiveStore.getState().set((state) => {
      state.updateProjectsFlag = true;
      state.changed = false;
    });
    resetProject();
  };

  const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        setCommonStore((state) => {
          if (result.user) {
            state.user.uid = result.user.uid;
            state.user.email = result.user.email;
            state.user.displayName = result.user.displayName;
            state.user.photoURL = result.user.photoURL;
            registerUser({ ...state.user }).then(() => {
              // ignore
            });
          }
        });
      })
      .catch((error) => {
        if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
          showError(t('message.CannotSignIn', lang) + ': ' + error);
        }
      });
  };

  const registerUser = async (user: User): Promise<any> => {
    const firestore = firebase.firestore();
    let noLogging = false;
    let schoolID = SchoolID.UNKNOWN;
    let classID = ClassID.UNKNOWN;
    let likes: string[] = [];
    let published: string[] = [];
    let aliases: string[] = [];
    let found = false;
    let userCount = 0;
    if (user.uid !== null) {
      const superuser = user && user.email === 'charles@intofuture.org';
      if (superuser) {
        // This way of counting a collection is expensive. It is reserved for only superusers.
        // It should be replaced by getCountFromServer in the latest version of Firestore;
        await firestore
          .collection('users')
          .get()
          .then((querySnapshot) => {
            userCount = querySnapshot.size;
          });
      }
      found = await firestore
        .collection('users')
        .doc(user.uid)
        .get()
        .then((doc) => {
          const docData = doc.data();
          if (docData) {
            noLogging = !!docData.noLogging;
            schoolID = docData.schoolID ? (docData.schoolID as SchoolID) : SchoolID.UNKNOWN;
            classID = docData.classID ? (docData.classID as ClassID) : ClassID.UNKNOWN;
            if (docData.likes) likes = docData.likes;
            if (docData.published) published = docData.published;
            if (docData.aliases) aliases = docData.aliases;
            return true;
          }
          return false;
        });
    }
    if (found) {
      // update common store state
      setCommonStore((state) => {
        state.user.noLogging = noLogging;
        state.user.schoolID = schoolID;
        state.user.classID = classID;
        state.user.likes = likes;
        state.user.published = published;
        state.user.aliases = aliases;
      });
      usePrimitiveStore.getState().set((state) => {
        state.userCount = userCount;
      });
      // update current user object
      user.noLogging = noLogging;
      user.schoolID = schoolID;
      user.classID = classID;
      user.likes = likes;
      user.published = published;
      user.aliases = aliases;
    } else {
      if (user.uid) {
        firestore
          .collection('users')
          .doc(user.uid)
          .set({
            uid: user.uid,
            noLogging: !!user.noLogging,
            schoolID: user.schoolID ?? SchoolID.UNKNOWN,
            classID: user.classID ?? ClassID.UNKNOWN,
            since: dayjs(new Date()).format('MM/DD/YYYY hh:mm A'),
            os: Util.getOS(),
          })
          .then(() => {
            showInfo(t('message.YourAccountWasCreated', lang));
          })
          .catch((error) => {
            showError(t('message.CannotCreateAccount', lang) + ': ' + error);
          });
      }
    }
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setCommonStore((state) => {
          state.user.uid = null;
          state.user.email = null;
          state.user.displayName = null;
          state.user.photoURL = null;
          state.user.likes = [];
          state.user.published = [];
          state.user.aliases = [];
        });
        usePrimitiveStore.getState().set((state) => {
          state.showAccountSettingsPanel = false;
          state.showProjectListPanel = false;
        });
      })
      .catch((error) => {
        showError(t('message.CannotSignOut', lang) + ': ' + error);
      });
  };

  // fetch owner's projects from the cloud
  const fetchMyProjects = async (silent: boolean) => {
    if (!user.uid) return;
    if (!silent) setWaiting(true);
    myProjectsRef.current = await firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('projects')
      .get()
      .then((querySnapshot) => {
        const a: ProjectState[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Assign default values below as an attribute may not be defined by the time the data was created
          // In that case, undefined will be used, resulting in a crash from Firestore
          const cl = data.type === ProjectType.DRUG_DISCOVERY ? 50 : 20;
          a.push({
            owner: user.uid,
            title: doc.id,
            timestamp: data.timestamp ?? -1,
            key: data.key ?? data.timestamp,
            time: data.time,
            description: data.description ?? '',
            dataColoring: data.dataColoring ?? DataColoring.ALL,
            selectedProperty: data.selectedProperty ?? null,
            sortDescending: data.sortDescending ?? 'false',
            xAxisNameScatterPlot: data.xAxisNameScatterPlot ?? 'atomCount',
            yAxisNameScatterPlot: data.yAxisNameScatterPlot ?? 'bondCount',
            xFormula: data.xFormula ?? 'x',
            yFormula: data.yFormula ?? 'y',
            xMinScatterPlot: data.xMinScatterPlot !== undefined ? data.xMinScatterPlot : 0,
            xMaxScatterPlot: data.xMaxScatterPlot !== undefined ? data.xMaxScatterPlot : 100,
            yMinScatterPlot: data.yMinScatterPlot !== undefined ? data.yMinScatterPlot : 0,
            yMaxScatterPlot: data.yMaxScatterPlot !== undefined ? data.yMaxScatterPlot : 100,
            xLinesScatterPlot: !!data.xLinesScatterPlot,
            yLinesScatterPlot: !!data.yLinesScatterPlot,
            lineWidthScatterPlot: data.lineWidthScatterPlot !== undefined ? data.lineWidthScatterPlot : 1,
            dotSizeScatterPlot: data.dotSizeScatterPlot !== undefined ? data.dotSizeScatterPlot : 4,
            type: data.type ?? ProjectType.DRUG_DISCOVERY,
            molecules: data.molecules ?? [],
            numberOfColumns: data.numberOfColumns ?? 3,
            selectedMolecule: data.selectedMolecule ?? null,
            ligand: data.ligand ?? null,
            protein: data.protein ?? null,
            ranges: data.ranges ?? [],
            filters: data.filters ?? [],
            hiddenProperties: data.hiddenProperties ?? [],
            counter: data.counter ?? 0,

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
            trajectoryAtomIndices: data.trajectoryAtomIndices ?? [],
            angularBondsVisible: !!data.angularBondsVisible,
            torsionalBondsVisible: !!data.torsionalBondsVisible,

            testMolecules: ModelUtil.reconstructMoleculesFromFirestore(data.testMolecules),

            timeStep: data.timeStep ?? 0.5,
            refreshInterval: data.refreshInterval ?? 20,
            collectInterval: data.collectInterval ?? 100,
            constantTemperature: !!data.constantTemperature,
            temperature: data.temperature !== undefined && data.temperature !== null ? data.temperature : 300,
            pressure: data.pressure !== undefined && data.pressure !== null ? data.pressure : 1,

            cameraPosition: data.cameraPosition ?? DEFAULT_CAMERA_POSITION,
            cameraRotation: data.cameraRotation ?? DEFAULT_CAMERA_ROTATION,
            cameraUp: data.cameraUp ?? DEFAULT_CAMERA_UP,
            panCenter: data.panCenter ?? DEFAULT_PAN_CENTER,
          } as ProjectState);
        });
        return a;
      })
      .catch((error) => {
        showError(t('message.CannotOpenYourProjects', lang) + ': ' + error);
      })
      .finally(() => {
        if (!silent) setWaiting(false);
      });
  };

  const listMyProjects = (show: boolean) => {
    if (user.uid) {
      fetchMyProjects(!show).then(() => {
        if (show) {
          usePrimitiveStore.getState().set((state) => {
            state.showProjectListPanel = true;
          });
        }
        setUpdateMyProjectsFlag(!updateMyProjectsFlag);
      });
    }
  };

  const deleteProject = (title: string) => {
    if (!user.uid) return;
    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('projects')
      .doc(title)
      .delete()
      .then(() => {
        if (myProjectsRef.current && user.uid) {
          setUpdateFlag(!updateFlag);
        }
        setCommonStore((state) => {
          if (title === state.projectState.title) {
            state.projectState = ProjectUtil.createDefaultProjectState();
          }
        });
        setUpdateMyProjectsFlag(!updateMyProjectsFlag);
      })
      .catch((error) => {
        showError(t('message.CannotDeleteProject', lang) + ': ' + error);
      })
      .finally(() => {
        // if the project list panel is open, update it
        if (showProjectListPanel) {
          fetchMyProjects(false).then(() => {
            setUpdateFlag(!updateFlag);
          });
        }
      });
  };

  const renameProject = (oldTitle: string, newTitle: string) => {
    // check if the new project title is already taken
    fetchMyProjects(false).then(() => {
      let exist = false;
      if (myProjectsRef.current) {
        for (const p of myProjectsRef.current) {
          if (p.title === newTitle) {
            exist = true;
            break;
          }
        }
      }
      if (exist) {
        showInfo(t('message.TitleUsedChooseDifferentOne', lang) + ': ' + newTitle);
      } else {
        if (!user.uid) return;
        const files = firebase.firestore().collection('users').doc(user.uid).collection('projects');
        files
          .doc(oldTitle)
          .get()
          .then((doc) => {
            if (doc && doc.exists) {
              const data = doc.data();
              if (data) {
                const newData = JSON.parse(JSON.stringify(data));
                newData.title = newTitle;
                files
                  .doc(newTitle)
                  .set(newData)
                  .then(() => {
                    files
                      .doc(oldTitle)
                      .delete()
                      .then(() => {
                        // ignore
                      });
                    if (myProjectsRef.current) {
                      for (const p of myProjectsRef.current) {
                        if (p.title === oldTitle) {
                          p.title = newTitle;
                        }
                      }
                      setUpdateFlag(!updateFlag);
                    }
                    setCommonStore((state) => {
                      if (state.projectState.title === oldTitle) {
                        state.projectState.title = newTitle;
                      }
                    });
                  });
              }
            }
          })
          .catch((error) => {
            showError(t('message.CannotRenameProject', lang) + ': ' + error);
          });
      }
    });
  };

  const resetProject = () => {
    energyTimeSeries.clear();
    positionTimeSeriesMap.clear();
    usePrimitiveStore.getState().set((state) => {
      state.resetSimulation = true;
    });
  };

  function createNewProject() {
    if (!user || !user.uid) return;
    const title = usePrimitiveStore.getState().projectTitle;
    if (!title) {
      showError(t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    const newTitle = title.trim();
    if (newTitle.length === 0) {
      showError(t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    // check if the project title is already used
    fetchMyProjects(false).then(() => {
      let exist = false;
      if (myProjectsRef.current) {
        for (const p of myProjectsRef.current) {
          if (p.title === newTitle) {
            exist = true;
            break;
          }
        }
      }
      if (exist) {
        showInfo(t('message.TitleUsedChooseDifferentOne', lang) + ': ' + newTitle);
      } else {
        if (user && user.uid) {
          const timestamp = new Date().getTime();
          const ps = ProjectUtil.createDefaultProjectState();
          ps.timestamp = timestamp;
          ps.key = timestamp.toString();
          ps.time = dayjs(new Date(timestamp)).format('MM/DD/YYYY hh:mm A');
          ps.title = newTitle;
          ps.owner = user.uid;
          ps.type = usePrimitiveStore.getState().projectType ?? ProjectType.DRUG_DISCOVERY;
          ps.description = usePrimitiveStore.getState().projectDescription;
          ps.cameraPosition = DEFAULT_CAMERA_POSITION;
          ps.cameraRotation = DEFAULT_CAMERA_ROTATION;
          ps.cameraUp = DEFAULT_CAMERA_UP;
          ps.panCenter = DEFAULT_PAN_CENTER;
          firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .collection('projects')
            .doc(newTitle)
            .set(ps)
            .then(() => {
              setCommonStore((state) => {
                state.projectState = ps;
              });
              setUpdateMyProjectsFlag(!updateMyProjectsFlag);
            })
            .catch((error) => {
              showError(t('message.CannotCreateNewProject', lang) + ': ' + error);
            })
            .finally(() => {
              // if the project list panel is open, update it
              if (showProjectListPanel) {
                fetchMyProjects(false).then(() => {
                  setUpdateFlag(!updateFlag);
                });
              }
              setWaiting(false);
              resetProject();
            });
        }
      }
    });
  }

  const updateMolecularVariables = (molecules: Molecule[], remote: boolean) => {
    if (moleculesRef?.current) {
      // update properties of molecules in the remote state
      for (const [i, m] of molecules.entries()) {
        const currentMol = moleculesRef.current[i];
        for (const [j, a] of m.atoms.entries()) {
          // cannot use Vector3 as it is not supported by Firestore
          const b = currentMol.atoms[j];
          a.position.x = b.position.x;
          a.position.y = b.position.y;
          a.position.z = b.position.z;
          a.velocity.x = b.velocity.x;
          a.velocity.y = b.velocity.y;
          a.velocity.z = b.velocity.z;
          a.force.x = b.force.x;
          a.force.y = b.force.y;
          a.force.z = b.force.z;
          a.sigma = b.sigma;
          a.epsilon = b.epsilon;
          a.mass = b.mass;
          a.charge = b.charge;
          a.damp = b.damp;
          a.fixed = b.fixed;
        }
        if (remote) {
          // avoid serializing bonds as they will be reconstructed later
          m.radialBonds = [];
          m.angularBonds = [];
          m.torsionalBonds = [];
        }
      }
    }
  };

  const updateProjectStateVariables = (ps: ProjectState) => {
    if (ps.type === ProjectType.MOLECULAR_MODELING) {
      if (moleculesRef?.current) {
        // update properties of molecules in the remote state
        updateMolecularVariables(ps.testMolecules, true);
        // update properties of molecules in the local state
        setCommonStore((state) => {
          updateMolecularVariables(state.projectState.testMolecules, false);
        });
      }
      // get rid of unnecessary variables
      for (const m of ps.testMolecules) {
        for (const a of m.atoms) {
          delete a.acceleration;
          delete a.displacement;
          delete a.initialPosition;
          delete a.initialVelocity;
        }
      }
    }
  };

  function saveProject() {
    if (!user || !user.uid) return;
    const title = useStore.getState().projectState.title;
    if (!title) {
      showError(t('message.CannotSaveProjectWithoutTitle', lang));
      return;
    }
    setWaiting(true);
    const ps = JSON.parse(JSON.stringify(useStore.getState().projectState)) as ProjectState;
    ps.timestamp = new Date().getTime();
    ps.time = dayjs(new Date(ps.timestamp)).format('MM/DD/YYYY hh:mm A');
    ps.key = ps.timestamp.toString();
    if (myProjectsRef.current) {
      for (const p of myProjectsRef.current) {
        if (p.title === ps.title) {
          p.timestamp = ps.timestamp;
          p.time = ps.time;
          p.key = ps.key;
          break;
        }
      }
    }
    updateProjectStateVariables(ps);
    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('projects')
      .doc(title)
      .set(ps)
      .then(() => {
        setUpdateMyProjectsFlag(!updateMyProjectsFlag);
      })
      .catch((error) => {
        showError(t('message.CannotSaveProject', lang) + ': ' + error);
      })
      .finally(() => {
        if (saveAndThenOpenProjectFlag) {
          setProjectState(useStore.getState().projectStateToOpen);
        }
        setWaiting(false);
        setChanged(false);
      });
  }

  function saveProjectAs() {
    if (!user || !user.uid) return;
    const title = usePrimitiveStore.getState().projectTitle;
    if (!title) {
      showError(t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    const newTitle = title.trim();
    if (newTitle.length === 0) {
      showError(t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    // check if the project title is already taken
    fetchMyProjects(false).then(() => {
      let exist = false;
      if (myProjectsRef.current) {
        for (const p of myProjectsRef.current) {
          if (p.title === newTitle) {
            exist = true;
            break;
          }
        }
      }
      if (exist) {
        showInfo(t('message.TitleUsedChooseDifferentOne', lang) + ': ' + newTitle);
      } else {
        if (user && user.uid) {
          const state = useStore.getState();
          const ps = JSON.parse(JSON.stringify(state.projectState)) as ProjectState;
          ps.timestamp = new Date().getTime();
          ps.key = ps.timestamp.toString();
          ps.time = dayjs(new Date(ps.timestamp)).format('MM/DD/YYYY hh:mm A');
          ps.title = newTitle;
          ps.owner = user.uid; // make sure the current user becomes the owner
          ps.type = usePrimitiveStore.getState().projectType;
          ps.description = usePrimitiveStore.getState().projectDescription ?? '';
          updateProjectStateVariables(ps);
          firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .collection('projects')
            .doc(newTitle)
            .set(ps)
            .then(() => {
              setUpdateMyProjectsFlag(!updateMyProjectsFlag);
              setCommonStore((state) => {
                state.projectState.type = ps.type;
                state.projectState.title = ps.title;
                state.projectState.description = ps.description;
              });
            })
            .catch((error) => {
              showError(t('message.CannotCreateNewProject', lang) + ': ' + error);
            })
            .finally(() => {
              // if the project list panel is open, update it
              if (showProjectListPanel) {
                fetchMyProjects(false).then(() => {
                  setUpdateFlag(!updateFlag);
                });
              }
              setWaiting(false);
              setChanged(false);
            });
        }
      }
    });
  }

  function showMyProjectsList() {
    usePrimitiveStore.getState().set((state) => {
      state.startSimulation = false;
    });
    listMyProjects(true);
  }

  function hideMyProjectsList() {
    listMyProjects(false);
    setUpdateFlag(!updateFlag);
  }

  function saveAccountSettings() {
    if (user.uid) {
      const firestore = firebase.firestore();
      firestore
        .collection('users')
        .doc(user.uid)
        .update({
          schoolID: user.schoolID ?? SchoolID.UNKNOWN,
          classID: user.classID ?? ClassID.UNKNOWN,
        })
        .then(() => {
          showInfo(t('message.YourAccountSettingsWereSaved', lang));
        })
        .catch((error) => {
          showError(t('message.CannotSaveYourAccountSettings', lang) + ': ' + error);
        });
    }
  }

  return viewOnly ? (
    <>{waiting && <Spinner />}</>
  ) : (
    <>
      {waiting && <Spinner />}
      <MainToolBar signIn={signIn} signOut={signOut} />
      {showProjectListPanel && myProjectsRef.current && (
        <ProjectListPanel
          projects={myProjectsRef.current}
          setProjectState={setProjectState}
          deleteProject={deleteProject}
          renameProject={renameProject}
          updateFlag={updateMyProjectsFlag}
        />
      )}
    </>
  );
});

export default CloudManager;
