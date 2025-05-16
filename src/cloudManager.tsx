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
import { ProjectInfo, ProjectState } from './types';
import Spinner from './components/spinner';
import { Util } from './Util';
import MainToolBar from './mainToolBar';
import ProjectListPanel from './project/projectListPanel.tsx';
import { addProjectToList, fetchProject, removeProjectFromList } from './cloudProjectUtil';
import { ClassID, SchoolID, User } from './User';
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_ROTATION,
  DEFAULT_CAMERA_UP,
  DEFAULT_PAN_CENTER,
  FirebaseName,
  ProjectType,
} from './constants';
import { ProjectUtil } from './project/ProjectUtil.ts';
import { useTranslation } from 'react-i18next';
import { useRefStore } from './stores/commonRef.ts';
import { useDataStore } from './stores/commonData.ts';
import { Molecule } from './models/Molecule.ts';
import AnonymousImage from './assets/anonymous.png';

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
  const positionTimeSeriesMap = useDataStore(Selector.positionTimeSeriesMap);

  const [updateFlag, setUpdateFlag] = useState(false);
  const [updateMyProjectsFlag, setUpdateMyProjectsFlag] = useState(false);
  const myProjectsRef = useRef<ProjectInfo[]>([]);

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

  useFlag(updateProjectsFlag, updateProjects, () => setPrimitiveStore('updateProjectsFlag', false));

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
            state.user.displayName = u.displayName ?? 'Anonymous';
            state.user.email = u.email;
            state.user.photoURL = u.photoURL ?? AnonymousImage;
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
    fetchLatestVersion().then(() => {
      // ignore
    });
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

  const signInAnonymously = () => {
    firebase
      .auth()
      .signInAnonymously()
      .then((result) => {
        setCommonStore((state) => {
          if (result.user) {
            state.user.uid = result.user.uid;
            state.user.anonymous = true;
            state.user.displayName = 'Anonymous';
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
    let anonymous = false;
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
            anonymous = !!docData.anonymous;
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
        state.user.anonymous = anonymous;
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
      user.anonymous = anonymous;
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
            anonymous: !!user.anonymous,
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

  // get latest version
  const fetchLatestVersion = async () => {
    await firebase
      .firestore()
      .collection('app')
      .doc('info')
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data && data.latestVersion) {
            usePrimitiveStore.getState().set((state) => {
              state.latestVersion = data.latestVersion;
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // fetch owner's projects from the cloud
  const fetchMyProjects = async (silent: boolean) => {
    const uid = user.uid;
    if (!uid) return;
    if (!silent) setWaiting(true);
    myProjectsRef.current = [];
    await firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(async (doc) => {
        const projectList = doc.data()?.projectList;
        if (projectList && projectList.length > 0) {
          // if a project list exists, use it
          myProjectsRef.current?.push(...projectList);
        } else {
          // if a project list does not exist, create one
          await firebase
            .firestore()
            .collection('users')
            .doc(uid)
            .collection('projects')
            .get()
            .then((querySnapshot) => {
              const a: ProjectState[] = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                myProjectsRef.current?.push({
                  timestamp: data.timestamp,
                  title: doc.id,
                  type: data.type,
                } as ProjectInfo);
              });
              return a;
            })
            .catch((error) => {
              showError(t('message.CannotOpenYourProjects', lang) + ': ' + error);
            })
            .finally(() => {
              firebase
                .firestore()
                .collection('users')
                .doc(uid)
                .update({ projectList: myProjectsRef.current })
                .then(() => {
                  // ignore
                })
                .catch((error) => {
                  console.log(error);
                });
            });
        }
        setUpdateMyProjectsFlag(!updateMyProjectsFlag);
      })
      .finally(() => {
        if (!silent) setWaiting(false);
      });
  };

  const listMyProjects = () => {
    if (user.uid) {
      fetchMyProjects(false).then(() => {
        usePrimitiveStore.getState().set((state) => {
          state.showProjectListPanel = true;
        });
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
          removeProjectIfExisting(user.uid, title).then(() => {
            setUpdateFlag(!updateFlag);
            // if the project list panel is open, update it
            if (showProjectListPanel) {
              fetchMyProjects(false).then(() => {
                setUpdateMyProjectsFlag(!updateMyProjectsFlag);
                setUpdateFlag(!updateFlag);
              });
            }
          });
        }
        setCommonStore((state) => {
          if (title === state.projectState.title) {
            state.projectState = ProjectUtil.createDefaultProjectState();
          }
        });
      })
      .catch((error) => {
        showError(t('message.CannotDeleteProject', lang) + ': ' + error);
      });
  };

  const renameProjectAndUpdateList = (uid: string, oldTitle: string, newTitle: string) => {
    if (myProjectsRef.current) {
      let index = -1;
      let oldProject = null;
      let newProject = null;
      for (const [i, p] of myProjectsRef.current.entries()) {
        if (p.title === oldTitle) {
          index = i;
          oldProject = { title: oldTitle, timestamp: p.timestamp, type: p.type } as ProjectInfo;
          newProject = { title: newTitle, timestamp: p.timestamp, type: p.type } as ProjectInfo;
          break;
        }
      }
      if (index !== -1 && newProject && oldProject) {
        myProjectsRef.current.splice(index, 1);
        myProjectsRef.current.push(newProject);
        removeProjectFromList(uid, oldProject).then(() => {
          // ignore for now
        });
        addProjectToList(uid, newProject).then(() => {
          // ignore for now
        });
      }
    }
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
        const uid = user.uid;
        if (!uid) return;
        const files = firebase.firestore().collection('users').doc(uid).collection('projects');
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
                        renameProjectAndUpdateList(uid, oldTitle, newTitle);
                        setUpdateFlag(!updateFlag);
                        setCommonStore((state) => {
                          if (state.projectState.title === oldTitle) {
                            state.projectState.title = newTitle;
                          }
                        });
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
      state.regressionAnalysis = false;
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
        if (user) {
          const uid = user.uid;
          if (uid) {
            const timestamp = new Date().getTime();
            const ps = ProjectUtil.createDefaultProjectState();
            ps.timestamp = timestamp;
            ps.key = timestamp.toString();
            ps.time = dayjs(new Date(timestamp)).format('MM/DD/YYYY hh:mm A');
            ps.title = newTitle;
            ps.owner = user.uid;
            ps.type = usePrimitiveStore.getState().projectType ?? ProjectType.DRUG_DISCOVERY;
            ps.description = usePrimitiveStore.getState().projectDescription ?? null;
            ps.cameraPosition = DEFAULT_CAMERA_POSITION;
            ps.cameraRotation = DEFAULT_CAMERA_ROTATION;
            ps.cameraUp = DEFAULT_CAMERA_UP;
            ps.panCenter = DEFAULT_PAN_CENTER;
            firebase
              .firestore()
              .collection('users')
              .doc(uid)
              .collection('projects')
              .doc(newTitle)
              .set(ps)
              .then(() => {
                const pi = { timestamp: ps.timestamp, title: ps.title, type: ps.type } as ProjectInfo;
                addProjectToList(uid, pi).then(() => {
                  myProjectsRef.current.push(pi);
                  // if the project list panel is open, update it
                  if (showProjectListPanel) {
                    setUpdateMyProjectsFlag(!updateMyProjectsFlag);
                    setUpdateFlag(!updateFlag);
                  }
                });
                setCommonStore((state) => {
                  state.projectState = ps;
                });
                setUpdateMyProjectsFlag(!updateMyProjectsFlag);
              })
              .catch((error) => {
                showError(t('message.CannotCreateNewProject', lang) + ': ' + error);
              })
              .finally(() => {
                setWaiting(false);
                resetProject();
              });
          }
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
          a.sigma = b.sigma;
          a.epsilon = b.epsilon;
          a.mass = b.mass;
          a.charge = b.charge;
          a.fixed = b.fixed;
        }
        if (remote) {
          // avoid serializing bonds as they will be reconstructed later
          delete (m as any).radialBonds;
          delete (m as any).angularBonds;
          delete (m as any).torsionalBonds;
          delete (m as any).center;
          delete (m as any).multipleResidues;
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
          delete a.force;
          delete a.acceleration;
          delete a.displacement;
          delete a.initialPosition;
          delete a.initialVelocity;
          delete (a as any).index;
          delete (a as any).mass;
          delete (a as any).sigma;
          delete (a as any).epsilon;
          delete (a as any).charge;
          if (!a.fixed) delete a.fixed;
          if (!a.damp) delete a.damp;
          if (!a.trajectory) delete a.trajectory;
          if (a.restraint && a.restraint.strength === 0) delete a.restraint;
        }
      }
      // skip false or null
      if (!ps.hideGallery) delete (ps as any).hideGallery;
      if (!ps.description) delete (ps as any).description;
      if (!ps.selectedMolecule) delete (ps as any).selectedMolecule;
      if (!ps.selectedProperty) delete (ps as any).selectedProperty;
      if (!ps.autoscaleGraph) delete (ps as any).autoscaleGraph;
      if (!ps.sortDescending) delete (ps as any).sortDescending;
      if (!ps.xLinesScatterPlot) delete (ps as any).xLinesScatterPlot;
      if (!ps.yLinesScatterPlot) delete (ps as any).yLinesScatterPlot;
      if (!ps.angularBondsVisible) delete (ps as any).angularBondsVisible;
      if (!ps.torsionalBondsVisible) delete (ps as any).torsionalBondsVisible;
      if (!ps.chamberViewerAxes) delete (ps as any).chamberViewerAxes;
      if (!ps.chamberViewerFoggy) delete (ps as any).chamberViewerFoggy;
      if (!ps.xyPlaneVisible) delete (ps as any).xyPlaneVisible;
      if (!ps.yzPlaneVisible) delete (ps as any).yzPlaneVisible;
      if (!ps.xzPlaneVisible) delete (ps as any).xzPlaneVisible;
      if (!ps.molecularContainerVisible) delete (ps as any).molecularContainerVisible;
      if (!ps.momentumVisible) delete (ps as any).momentumVisible;
      if (!ps.forceVisible) delete (ps as any).forceVisible;
      if (!ps.vdwBondsVisible) delete (ps as any).vdwBondsVisible;
      if (!ps.energyGraphVisible) delete (ps as any).energyGraphVisible;
      if (!ps.speedGraphVisible) delete (ps as any).speedGraphVisible;
      if (!ps.constantTemperature) delete (ps as any).constantTemperature;
      if (!ps.navigationView) delete (ps as any).navigationView;
      if (!ps.showInstructionPanel) delete (ps as any).showInstructionPanel;
      if (!ps.spaceshipThrust) delete (ps as any).spaceshipThrust;

      // not needed in this type of project
      delete (ps as any).protein;
      delete (ps as any).ligand;
      delete (ps as any).ligandTransform;
      delete (ps as any).ligandVelocity;
      delete (ps as any).spaceshipDisplayMode;
      delete (ps as any).spaceshipX;
      delete (ps as any).spaceshipY;
      delete (ps as any).spaceshipZ;
      delete (ps as any).spaceshipSize;
      delete (ps as any).spaceshipPitch;
      delete (ps as any).spaceshipRoll;
      delete (ps as any).spaceshipYaw;
    }
  };

  const removeProjectIfExisting = async (uid: string, title: string) => {
    if (myProjectsRef.current) {
      let index = -1;
      for (const [i, p] of myProjectsRef.current.entries()) {
        if (p.title === title) {
          index = i;
          await removeProjectFromList(uid, p);
          break;
        }
      }
      if (index !== -1) {
        myProjectsRef.current.splice(index, 1);
      }
    }
  };

  function saveProject() {
    if (!user) return;
    const uid = user.uid;
    if (!uid) return;
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
    updateProjectStateVariables(ps);
    firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('projects')
      .doc(title)
      .set(ps)
      .then(() => {
        if (myProjectsRef.current) {
          removeProjectIfExisting(uid, title).then(() => {
            const pi = { timestamp: ps.timestamp, title, type: ps.type } as ProjectInfo;
            myProjectsRef.current.push(pi);
            addProjectToList(uid, pi).then(() => {
              setUpdateMyProjectsFlag(!updateMyProjectsFlag);
            });
          });
        }
      })
      .catch((error) => {
        showError(t('message.CannotSaveProject', lang) + ': ' + error);
      })
      .finally(() => {
        setWaiting(false);
        if (saveAndThenOpenProjectFlag) {
          const title = useStore.getState().projectToOpen?.title;
          if (title) {
            setWaiting(true);
            fetchProject(uid, title, setProjectState).finally(() => {
              setWaiting(false);
            });
          }
        }
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
    setWaiting(true);
    // check if the project title is already taken
    fetchMyProjects(false)
      .then(() => {
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
            const uid = user.uid;
            const state = useStore.getState();
            const ps = JSON.parse(JSON.stringify(state.projectState)) as ProjectState;
            ps.timestamp = new Date().getTime();
            ps.key = ps.timestamp.toString();
            ps.time = dayjs(new Date(ps.timestamp)).format('MM/DD/YYYY hh:mm A');
            ps.title = newTitle;
            ps.owner = uid; // make sure the current user becomes the owner
            ps.type = usePrimitiveStore.getState().projectType;
            ps.description = usePrimitiveStore.getState().projectDescription ?? '';
            updateProjectStateVariables(ps);
            firebase
              .firestore()
              .collection('users')
              .doc(uid)
              .collection('projects')
              .doc(newTitle)
              .set(ps)
              .then(() => {
                if (myProjectsRef.current) {
                  const pi = { timestamp: ps.timestamp, title, type: ps.type } as ProjectInfo;
                  addProjectToList(uid, pi).then(() => {
                    myProjectsRef.current.push(pi);
                    // if the project list panel is open, update it
                    if (showProjectListPanel) {
                      setUpdateMyProjectsFlag(!updateMyProjectsFlag);
                      setUpdateFlag(!updateFlag);
                    }
                  });
                  setCommonStore((state) => {
                    state.projectState.type = ps.type;
                    state.projectState.title = ps.title;
                    state.projectState.description = ps.description;
                  });
                }
              })
              .catch((error) => {
                showError(t('message.CannotCreateNewProject', lang) + ': ' + error);
              });
          }
        }
      })
      .finally(() => {
        setWaiting(false);
        setChanged(false);
      });
  }

  function showMyProjectsList() {
    usePrimitiveStore.getState().set((state) => {
      state.startSimulation = false;
    });
    listMyProjects();
  }

  function updateProjects() {
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
      <MainToolBar signIn={signIn} signInAnonymously={signInAnonymously} signOut={signOut} />
      {showProjectListPanel && myProjectsRef.current && (
        <ProjectListPanel
          projects={[...myProjectsRef.current]}
          setProjectState={setProjectState}
          deleteProject={deleteProject}
          renameProject={renameProject}
        />
      )}
    </>
  );
});

export default CloudManager;
