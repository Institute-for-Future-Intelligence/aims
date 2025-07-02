/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from './stores/common';
import { usePrimitiveStore } from './stores/commonPrimitive';
import * as Selector from './stores/selector';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import { FirebaseError } from 'firebase/app';
import { onAuthStateChanged, signInWithPopup, signInAnonymously, signOut, GoogleAuthProvider } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, deleteDoc, getCountFromServer } from 'firebase/firestore';
import { setMessage } from './helpers';
import { ProjectInfo, ProjectState } from './types';
import Spinner from './components/spinner';
import { Util } from './Util';
import MainToolBar from './mainToolBar';
import ProjectListPanel from './project/projectListPanel.tsx';
import { addProjectToList, fetchProject, postFetch, removeProjectFromList } from './cloudProjectUtil';
import { ClassID, SchoolID, User } from './User';
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_ROTATION,
  DEFAULT_CAMERA_UP,
  DEFAULT_PAN_CENTER,
  ProjectType,
} from './constants';
import { ProjectUtil } from './project/ProjectUtil.ts';
import { useTranslation } from 'react-i18next';
import { useRefStore } from './stores/commonRef.ts';
import { useDataStore } from './stores/commonData.ts';
import { Molecule } from './models/Molecule.ts';
import AnonymousImage from './assets/anonymous.png';
import { auth, firestore } from './firebase.ts';

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
  const speedArrayMap = useDataStore(Selector.speedArrayMap);
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
    const unsubscribe = onAuthStateChanged(auth, (u) => {
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
      unsubscribe();
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
          postFetch();
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

  const handleSignInAnonymously = async () => {
    try {
      const result = await signInAnonymously(auth);
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
    } catch (e) {
      const error = e as FirebaseError;
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        setMessage('error', t('message.CannotSignIn', lang) + ': ' + error);
      }
    }
  };

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
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
    } catch (e) {
      const error = e as FirebaseError;
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        setMessage('error', t('message.CannotSignIn', lang) + ': ' + error);
      }
    }
  };

  const registerUser = async (user: User): Promise<any> => {
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
        try {
          const snapshot = await getCountFromServer(collection(firestore, 'users'));
          userCount = snapshot.data().count;
        } catch (e) {
          console.warn('Failed to count users:', e);
        }
      }

      const docSnap = await getDoc(doc(firestore, 'users', user.uid));
      const docData = docSnap.data();
      if (docData) {
        noLogging = !!docData.noLogging;
        anonymous = !!docData.anonymous;
        schoolID = docData.schoolID ? (docData.schoolID as SchoolID) : SchoolID.UNKNOWN;
        classID = docData.classID ? (docData.classID as ClassID) : ClassID.UNKNOWN;
        if (docData.likes) likes = docData.likes;
        if (docData.published) published = docData.published;
        if (docData.aliases) aliases = docData.aliases;
        found = true;
      }
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
        try {
          await setDoc(doc(firestore, 'users', user.uid), {
            uid: user.uid,
            noLogging: !!user.noLogging,
            anonymous: !!user.anonymous,
            schoolID: user.schoolID ?? SchoolID.UNKNOWN,
            classID: user.classID ?? ClassID.UNKNOWN,
            since: dayjs(new Date()).format('MM/DD/YYYY hh:mm A'),
            os: Util.getOS(),
          });
          setMessage('info', t('message.YourAccountWasCreated', lang));
        } catch (e) {
          setMessage('error', t('message.CannotCreateAccount', lang) + ': ' + e);
        }
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
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
    } catch (e) {
      const error = e as FirebaseError;
      setMessage('error', t('message.CannotSignOut', lang) + ': ' + error);
    }
  };

  // get latest version
  const fetchLatestVersion = async () => {
    try {
      const infoRef = doc(firestore, 'app', 'info');
      const infoSnap = await getDoc(infoRef);

      if (infoSnap.exists()) {
        const data = infoSnap.data();
        if (data?.latestVersion) {
          usePrimitiveStore.getState().set((state) => {
            state.latestVersion = data.latestVersion;
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch latest version:', error);
    }
  };

  // fetch owner's projects from the cloud
  const fetchMyProjects = async (silent: boolean) => {
    const uid = user.uid;
    if (!uid) return;
    if (!silent) setWaiting(true);
    myProjectsRef.current = [];
    try {
      const userRef = doc(firestore, 'users', uid);
      const userSnap = await getDoc(userRef);
      const projectList = userSnap.data()?.projectList;

      if (projectList && projectList.length > 0) {
        // if a project list exists, use it
        myProjectsRef.current.push(...projectList);
      } else {
        // if a project list does not exist, create one
        try {
          const projectsCol = collection(firestore, 'users', uid, 'projects');
          const snapshot = await getDocs(projectsCol);
          const collectedProjects: ProjectInfo[] = [];

          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            collectedProjects.push({
              timestamp: data.timestamp,
              title: docSnap.id,
              type: data.type,
            });
          });

          myProjectsRef.current.push(...collectedProjects);
        } catch (error) {
          setMessage('error', t('message.CannotOpenYourProjects', lang) + ': ' + (error as Error).message);
        } finally {
          try {
            await updateDoc(userRef, { projectList: myProjectsRef.current });
          } catch (error) {
            console.log(error);
          }
        }
      }

      setUpdateMyProjectsFlag((prev) => !prev);
    } catch (error) {
      console.log(error);
    } finally {
      if (!silent) setWaiting(false);
    }
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

  const deleteProject = async (title: string) => {
    const uid = user.uid;
    if (!uid) return;
    try {
      const projectRef = doc(firestore, 'users', uid, 'projects', title);
      await deleteDoc(projectRef);

      if (myProjectsRef.current) {
        await removeProjectIfExisting(uid, title);
        setUpdateFlag((prev) => !prev);
        // if the project list panel is open, update it
        if (showProjectListPanel) {
          await fetchMyProjects(false);
          setUpdateMyProjectsFlag((prev) => !prev);
          setUpdateFlag((prev) => !prev);
        }
      }

      setCommonStore((state) => {
        if (title === state.projectState.title) {
          state.projectState = ProjectUtil.createDefaultProjectState();
        }
      });
    } catch (error) {
      setMessage('error', t('message.CannotDeleteProject', lang) + ': ' + (error as Error).message);
    }
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

  const renameProject = async (oldTitle: string, newTitle: string) => {
    // check if the new project title is already taken
    await fetchMyProjects(false);

    const projectExists = myProjectsRef.current?.some((p) => p.title === newTitle);
    if (projectExists) {
      setMessage('info', t('message.TitleUsedChooseDifferentOne', lang) + ': ' + newTitle);
      return;
    }

    const uid = user?.uid;
    if (!uid) return;

    try {
      const oldRef = doc(firestore, 'users', uid, 'projects', oldTitle);
      const newRef = doc(firestore, 'users', uid, 'projects', newTitle);

      const oldSnap = await getDoc(oldRef);

      if (oldSnap.exists()) {
        const oldData = oldSnap.data();
        const newData = JSON.parse(JSON.stringify(oldData));
        newData.title = newTitle;

        await setDoc(newRef, newData);
        await deleteDoc(oldRef);

        renameProjectAndUpdateList(uid, oldTitle, newTitle);
        setUpdateFlag((prev) => !prev);

        setCommonStore((state) => {
          if (state.projectState.title === oldTitle) {
            state.projectState.title = newTitle;
          }
        });
      }
    } catch (error) {
      setMessage('error', t('message.CannotRenameProject', lang) + ': ' + (error as Error).message);
    }
  };

  const resetProject = () => {
    energyTimeSeries.clear();
    speedArrayMap.clear();
    positionTimeSeriesMap.clear();
    usePrimitiveStore.getState().set((state) => {
      state.resetSimulation = true;
      state.regressionAnalysis = false;
    });
  };

  async function createNewProject() {
    if (!user || !user.uid) return;
    const title = usePrimitiveStore.getState().projectTitle;
    if (!title) {
      setMessage('error', t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    const newTitle = title.trim();
    if (newTitle.length === 0) {
      setMessage('error', t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    // check if the project title is already used
    await fetchMyProjects(false);
    const exists = myProjectsRef.current?.some((p) => p.title === newTitle);
    if (exists) {
      setMessage('info', t('message.TitleUsedChooseDifferentOne', lang) + ': ' + newTitle);
      return;
    }

    const uid = user.uid;
    const timestamp = Date.now();

    const ps = ProjectUtil.createDefaultProjectState();
    ps.timestamp = timestamp;
    ps.key = timestamp.toString();
    ps.time = dayjs(timestamp).format('MM/DD/YYYY hh:mm A');
    ps.title = newTitle;
    ps.owner = uid;
    ps.type = usePrimitiveStore.getState().projectType ?? ProjectType.DRUG_DISCOVERY;
    ps.description = usePrimitiveStore.getState().projectDescription ?? null;
    ps.cameraPosition = DEFAULT_CAMERA_POSITION;
    ps.cameraRotation = DEFAULT_CAMERA_ROTATION;
    ps.cameraUp = DEFAULT_CAMERA_UP;
    ps.panCenter = DEFAULT_PAN_CENTER;

    try {
      const projectRef = doc(firestore, 'users', uid, 'projects', newTitle);
      await setDoc(projectRef, ps);

      const pi: ProjectInfo = {
        timestamp: ps.timestamp,
        title: ps.title,
        type: ps.type,
      };

      await addProjectToList(uid, pi);
      myProjectsRef.current.push(pi);
      // if the project list panel is open, update it
      if (showProjectListPanel) {
        setUpdateMyProjectsFlag((prev) => !prev);
        setUpdateFlag((prev) => !prev);
      }

      setCommonStore((state) => {
        state.projectState = ps;
      });
      setUpdateMyProjectsFlag((prev) => !prev);
    } catch (error) {
      setMessage('error', t('message.CannotCreateNewProject', lang) + ': ' + (error as Error).message);
    } finally {
      setWaiting(false);
      resetProject();
    }
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
          delete (m as any).data;
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
      if (!ps.gravitationalAcceleration) delete (ps as any).gravitationalAcceleration;
      if (!ps.gravityDirection) delete (ps as any).gravityDirection;
      if (!ps.molecularContainerVisible) delete (ps as any).molecularContainerVisible;
      if (!ps.momentumVisible) delete (ps as any).momentumVisible;
      if (!ps.forceVisible) delete (ps as any).forceVisible;
      if (!ps.vdwBondsVisible) delete (ps as any).vdwBondsVisible;
      if (!ps.energyGraphVisible) delete (ps as any).energyGraphVisible;
      if (!ps.speedGraphVisible) delete (ps as any).speedGraphVisible;
      if (!ps.speedGraphMaxX) delete (ps as any).speedGraphMaxX;
      if (!ps.speedGraphMaxY) delete (ps as any).speedGraphMaxY;
      if (!ps.speedGraphSortByMolecule) delete (ps as any).speedGraphSortByMolecule;
      if (!ps.speedGraphBinNumber) delete (ps as any).speedGraphBinNumber;
      if (!ps.constantTemperature) delete (ps as any).constantTemperature;
      if (!ps.constantPressure) delete (ps as any).constantPressure;
      if (!ps.navigationView) delete (ps as any).navigationView;
      if (!ps.showInstructionPanel) delete (ps as any).showInstructionPanel;
      if (!ps.spaceshipThrust) delete (ps as any).spaceshipThrust;
      if (ps.selectedMolecule) delete (ps as any).selectedMolecule.data;

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

  async function saveProject() {
    if (!user) return;
    const uid = user.uid;
    if (!uid) return;
    const title = useStore.getState().projectState.title;
    if (!title) {
      setMessage('error', t('message.CannotSaveProjectWithoutTitle', lang));
      return;
    }
    setWaiting(true);
    const ps = JSON.parse(JSON.stringify(useStore.getState().projectState)) as ProjectState;
    ps.timestamp = new Date().getTime();
    ps.time = dayjs(new Date(ps.timestamp)).format('MM/DD/YYYY hh:mm A');
    ps.key = ps.timestamp.toString();
    updateProjectStateVariables(ps);
    try {
      const projectRef = doc(firestore, 'users', uid, 'projects', title);
      await setDoc(projectRef, ps);

      if (myProjectsRef.current) {
        await removeProjectIfExisting(uid, title);

        const pi: ProjectInfo = { timestamp: ps.timestamp, title, type: ps.type };
        myProjectsRef.current.push(pi);

        await addProjectToList(uid, pi);

        setUpdateMyProjectsFlag((prev) => !prev);
      }
    } catch (error) {
      setMessage('error', t('message.CannotSaveProject', lang) + ': ' + (error as Error).message);
    } finally {
      setWaiting(false);
      if (saveAndThenOpenProjectFlag) {
        const projectToOpen = useStore.getState().projectToOpen?.title;
        if (projectToOpen) {
          setWaiting(true);
          await fetchProject(uid, projectToOpen, setProjectState);
          setWaiting(false);
          postFetch();
        }
      }
      setChanged(false);
    }
  }

  async function saveProjectAs() {
    if (!user || !user.uid) return;
    const title = usePrimitiveStore.getState().projectTitle;
    if (!title) {
      setMessage('error', t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    const newTitle = title.trim();
    if (newTitle.length === 0) {
      setMessage('error', t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    setWaiting(true);
    // check if the project title is already taken
    try {
      await fetchMyProjects(false);

      const exists = myProjectsRef.current?.some((p) => p.title === newTitle);
      if (exists) {
        setMessage('info', t('message.TitleUsedChooseDifferentOne', lang) + ': ' + title);
        return;
      }

      const uid = user.uid;
      const state = useStore.getState();
      const ps = JSON.parse(JSON.stringify(state.projectState)) as ProjectState;

      const timestamp = Date.now();
      ps.timestamp = timestamp;
      ps.key = timestamp.toString();
      ps.time = dayjs(timestamp).format('MM/DD/YYYY hh:mm A');
      ps.title = newTitle;
      ps.owner = uid;
      ps.type = usePrimitiveStore.getState().projectType;
      ps.description = usePrimitiveStore.getState().projectDescription ?? '';

      updateProjectStateVariables(ps);

      const projectRef = doc(firestore, 'users', uid, 'projects', newTitle);
      await setDoc(projectRef, ps);

      if (myProjectsRef.current) {
        const pi: ProjectInfo = {
          timestamp: ps.timestamp,
          title: title,
          type: ps.type,
        };
        await addProjectToList(uid, pi);
        myProjectsRef.current.push(pi);

        if (showProjectListPanel) {
          setUpdateMyProjectsFlag((prev) => !prev);
          setUpdateFlag((prev) => !prev);
        }
        setCommonStore((state) => {
          state.projectState.type = ps.type;
          state.projectState.title = ps.title;
          state.projectState.description = ps.description;
        });
      }
    } catch (error) {
      setMessage('error', t('message.CannotCreateNewProject', lang) + ': ' + (error as Error).message);
    } finally {
      setWaiting(false);
      setChanged(false);
    }
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

  async function saveAccountSettings() {
    if (!user?.uid) return;

    try {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        schoolID: user.schoolID ?? SchoolID.UNKNOWN,
        classID: user.classID ?? ClassID.UNKNOWN,
      });

      setMessage('info', t('message.YourAccountSettingsWereSaved', lang));
    } catch (error) {
      setMessage('error', t('message.CannotSaveYourAccountSettings', lang) + ': ' + (error as Error).message);
    }
  }

  return viewOnly ? (
    <>{waiting && <Spinner size={'large'} />}</>
  ) : (
    <>
      {waiting && <Spinner size={'large'} />}
      <MainToolBar signIn={signIn} signInAnonymously={handleSignInAnonymously} signOut={handleSignOut} />
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
