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
import { ExtendedProjectState, ProjectState } from './types';
import Spinner from './components/spinner';
import i18n from './i18n/i18n';
import { Util } from './Util';
import MainToolBar from './mainToolBar';
import ProjectListPanel from './projectListPanel';
import { fetchProject } from './cloudProjectUtil';
import { ClassID, SchoolID, User } from './User';
import { DataColoring, FirebaseName, ProjectType } from './constants';
import { MolecularViewerColoring, MolecularViewerStyle } from './view/displayOptions';

export interface CloudManagerProps {
  viewOnly: boolean;
}

const useFlag = (flag: boolean, fn: Function, setFlag: () => void) => {
  useEffect(() => {
    if (flag) {
      fn();
      setFlag();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag]);
};

const CloudManager = ({ viewOnly = false }: CloudManagerProps) => {
  const setCommonStore = useStore(Selector.set);
  const setPrimitiveStore = usePrimitiveStore(Selector.setPrimitiveStore);
  const language = useStore(Selector.language);
  const user = useStore(Selector.user);
  const saveAccountSettingsFlag = usePrimitiveStore(Selector.saveAccountSettingsFlag);
  const showProjectListPanel = usePrimitiveStore(Selector.showProjectListPanel);
  const createProjectFlag = usePrimitiveStore(Selector.createProjectFlag);
  const saveProjectAsFlag = usePrimitiveStore(Selector.saveProjectAsFlag);
  const saveProjectFlag = usePrimitiveStore(Selector.saveProjectFlag);
  const curateMoleculeToProjectFlag = usePrimitiveStore(Selector.curateMoleculeToProjectFlag);
  const showProjectsFlag = usePrimitiveStore(Selector.showProjectsFlag);
  const updateProjectsFlag = usePrimitiveStore(Selector.updateProjectsFlag);

  const [processing, setProcessing] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [updateMyProjectsFlag, setUpdateMyProjectsFlag] = useState(false);
  const myProjects = useRef<ExtendedProjectState[] | void>(); // Not sure why I need to use ref to store this

  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  useFlag(saveAccountSettingsFlag, saveAccountSettings, () => setPrimitiveStore('saveAccountSettingsFlag', false));

  useFlag(createProjectFlag, createNewProject, () => setPrimitiveStore('createProjectFlag', false));

  useFlag(saveProjectAsFlag, saveProjectAs, () => setPrimitiveStore('saveProjectAsFlag', false));

  useFlag(saveProjectFlag, saveProject, () => setPrimitiveStore('saveProjectFlag', false));

  useFlag(showProjectsFlag, showMyProjectsList, () => setPrimitiveStore('showProjectsFlag', false));

  useFlag(updateProjectsFlag, hideMyProjectsList, () => setPrimitiveStore('updateProjectsFlag', false));

  useFlag(curateMoleculeToProjectFlag, curateMoleculeToProject, () =>
    setPrimitiveStore('curateMoleculeToProjectFlag', false),
  );

  useEffect(() => {
    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
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
    if (myProjects.current) {
      myProjects.current.sort((a, b) => b.timestamp - a.timestamp);
    }
  }, [updateMyProjectsFlag]);

  const init = () => {
    const params = new URLSearchParams(window.location.search);
    const userid = params.get('userid');
    if (userid) {
      const project = params.get('project');
      if (project) {
        setProcessing(true);
        fetchProject(userid, project, setProjectState).finally(() => {
          setProcessing(false);
        });
      }
    }
  };

  const setProjectState = (extendedProjectState: ExtendedProjectState) => {
    setCommonStore((state) => {
      state.projectState = { ...extendedProjectState } as ProjectState;
      state.cameraPosition = extendedProjectState.cameraPosition;
      state.panCenter = extendedProjectState.panCenter;
      state.projectView = true;
    });
    usePrimitiveStore.getState().set((state) => {
      state.updateProjectsFlag = true;
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
          showError(i18n.t('message.CannotSignIn', lang) + ': ' + error);
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
            showInfo(i18n.t('message.YourAccountWasCreated', lang));
          })
          .catch((error) => {
            showError(i18n.t('message.CannotCreateAccount', lang) + ': ' + error);
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
        showError(i18n.t('message.CannotSignOut', lang) + ': ' + error);
      });
  };

  // fetch owner's projects from the cloud
  const fetchMyProjects = async (silent: boolean) => {
    if (!user.uid) return;
    if (!silent) setProcessing(true);
    myProjects.current = await firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('projects')
      .get()
      .then((querySnapshot) => {
        const a: ExtendedProjectState[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Assign default values below as an attribute may not be defined by the time the data was created
          // In that case, undefined will be used, resulting in a crash from Firestore
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
            xAxisNameScatteredPlot: data.xAxisNameScatteredPlot ?? 'atomCount',
            yAxisNameScatteredPlot: data.yAxisNameScatteredPlot ?? 'atomCount',
            dotSizeScatteredPlot: data.dotSizeScatteredPlot ?? 5,
            thumbnailWidth: data.thumbnailWidth ?? 200,
            type: data.type ?? ProjectType.DRUG_DISCOVERY,
            molecules: data.molecules ?? [],
            targetProtein: data.targetProtein ?? null,
            ranges: data.ranges ?? [],
            filters: data.filters ?? [],
            hiddenProperties: data.hiddenProperties ?? [],
            counter: data.counter ?? 0,

            chamberViewerPercentWidth: data.chamberViewerPercentWidth ?? 50,
            chamberViewerAxes: data.chamberViewerAxes ?? true,
            chamberViewerShininess: data.chamberViewerShininess ?? 1000,
            chamberViewerStyle: data.chamberViewerStyle ?? MolecularViewerStyle.QuickSurface,
            chamberViewerColoring: data.chamberViewerColoring ?? MolecularViewerColoring.SecondaryStructure,
            chamberViewerBackground: data.chamberViewerBackground ?? 'black',

            projectViewerStyle: data.projectViewerStyle ?? MolecularViewerStyle.Stick,
            projectViewerBackground: data.projectViewerBackground ?? 'white',

            cameraPosition: data.cameraPosition ?? [5, 10, 20],
            panCenter: data.panCenter ?? [0, 0, 0],
          } as ExtendedProjectState);
        });
        return a;
      })
      .catch((error) => {
        showError(i18n.t('message.CannotOpenYourProjects', lang) + ': ' + error);
      })
      .finally(() => {
        if (!silent) setProcessing(false);
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
        if (myProjects.current && user.uid) {
          setUpdateFlag(!updateFlag);
        }
        setCommonStore((state) => {
          if (title === state.projectState.title) {
            state.projectState.title = null;
            state.projectState.description = null;
            state.projectState.dataColoring = DataColoring.ALL;
            state.projectState.selectedProperty = null;
            state.projectState.sortDescending = false;
            state.projectState.xAxisNameScatteredPlot = null;
            state.projectState.yAxisNameScatteredPlot = null;
            state.projectState.dotSizeScatteredPlot = 5;
            state.projectState.thumbnailWidth = 200;
            state.projectState.counter = 0;
            state.projectState.molecules = [];
            state.projectState.targetProtein = null;
            state.projectState.ranges = [];
            state.projectState.filters = [];
            state.projectState.hiddenProperties = [];
            // state.projectView = false;
          }
        });
      })
      .catch((error) => {
        showError(i18n.t('message.CannotDeleteProject', lang) + ': ' + error);
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
      if (myProjects.current) {
        for (const p of myProjects.current) {
          if (p.title === newTitle) {
            exist = true;
            break;
          }
        }
      }
      if (exist) {
        showInfo(i18n.t('message.TitleUsedChooseDifferentOne', lang) + ': ' + newTitle);
      } else {
        if (!user.uid) return;
        const files = firebase.firestore().collection('users').doc(user.uid).collection('projects');
        files
          .doc(oldTitle)
          .get()
          .then((doc) => {
            if (doc && doc.exists) {
              const data = doc.data();
              if (data && user.uid) {
                // TODO
              }
            }
          })
          .catch((error) => {
            showError(i18n.t('message.CannotRenameProject', lang) + ': ' + error);
          });
      }
    });
  };

  const addMoleculeToProject = (
    projectType: string,
    projectTitle: string,
    moleculeTitle: string,
    thumbnailWidth: number,
  ) => {
    if (!user.uid) return;
    // TODO
  };

  function createNewProject() {
    if (!user || !user.uid) return;
    const title = usePrimitiveStore.getState().projectTitle;
    if (!title) {
      showError(i18n.t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    const t = title.trim();
    if (t.length === 0) {
      showError(i18n.t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    // check if the project title is already used
    fetchMyProjects(false).then(() => {
      let exist = false;
      if (myProjects.current) {
        for (const p of myProjects.current) {
          if (p.title === t) {
            exist = true;
            break;
          }
        }
      }
      if (exist) {
        showInfo(i18n.t('message.TitleUsedChooseDifferentOne', lang) + ': ' + t);
      } else {
        if (user && user.uid) {
          const timestamp = new Date().getTime();
          firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .collection('projects')
            .doc(t)
            .set({
              owner: user.uid,
              title: t,
              timestamp,
              key: timestamp.toString(),
              time: dayjs(new Date(timestamp)).format('MM/DD/YYYY hh:mm A'),
              type: usePrimitiveStore.getState().projectType ?? ProjectType.DRUG_DISCOVERY,
              description: null,
              counter: 0,
              dataColoring: DataColoring.ALL,
              selectedProperty: null,
              sortDescending: false,
              xAxisNameScatteredPlot: 'atomCount',
              yAxisNameScatteredPlot: 'atomCount',
              dotSizeScatteredPlot: 5,
              thumbnailWidth: 200,
              molecules: [],
              targetProtein: null,
              ranges: [],
              filters: [],
              hiddenProperties: [],

              chamberViewerPercentWidth: 50,
              chamberViewerAxes: true,
              chamberViewerShininess: 1000,
              chamberViewerStyle: MolecularViewerStyle.QuickSurface,
              chamberViewerColoring: MolecularViewerColoring.SecondaryStructure,
              chamberViewerBackground: 'black',

              projectViewerStyle: MolecularViewerStyle.Stick,
              projectViewerBackground: 'white',

              cameraPosition: [5, 10, 20],
              panCenter: [0, 0, 0],
            } as ExtendedProjectState)
            .then(() => {
              setCommonStore((state) => {
                state.projectView = true;
                // update the local copy as well
                state.projectState.owner = user.uid;
                state.projectState.type = usePrimitiveStore.getState().projectType ?? ProjectType.DRUG_DISCOVERY;
                state.projectState.title = t;
                state.projectState.description = null;
                state.projectState.counter = 0;
                state.projectState.dataColoring = DataColoring.ALL;
                state.projectState.selectedProperty = null;
                state.projectState.sortDescending = false;
                state.projectState.xAxisNameScatteredPlot = null;
                state.projectState.yAxisNameScatteredPlot = null;
                state.projectState.dotSizeScatteredPlot = 5;
                state.projectState.thumbnailWidth = 200;
                state.projectState.molecules = [];
                state.projectState.targetProtein = null;
                state.projectState.ranges = [];
                state.projectState.filters = [];
                state.projectState.hiddenProperties = [];

                state.projectState.chamberViewerPercentWidth = 50;
                state.projectState.chamberViewerAxes = true;
                state.projectState.chamberViewerShininess = 1000;
                state.projectState.chamberViewerStyle = MolecularViewerStyle.QuickSurface;
                state.projectState.chamberViewerColoring = MolecularViewerColoring.SecondaryStructure;
                state.projectState.chamberViewerBackground = 'black';

                state.projectState.projectViewerStyle = MolecularViewerStyle.Stick;
                state.projectState.projectViewerBackground = 'white';

                state.cameraPosition = [5, 10, 20];
                state.panCenter = [0, 0, 0];
              });
            })
            .catch((error) => {
              showError(i18n.t('message.CannotCreateNewProject', lang) + ': ' + error);
            })
            .finally(() => {
              // if the project list panel is open, update it
              if (showProjectListPanel) {
                fetchMyProjects(false).then(() => {
                  setUpdateFlag(!updateFlag);
                });
              }
              setProcessing(false);
            });
        }
      }
    });
  }

  function saveProject() {
    if (!user || !user.uid) return;
    const title = useStore.getState().projectState.title;
    if (title) {
      setProcessing(true);
      const eps = { ...useStore.getState().projectState } as ExtendedProjectState;
      eps.cameraPosition = useStore.getState().cameraPosition;
      eps.panCenter = useStore.getState().panCenter;
      eps.timestamp = new Date().getTime();
      eps.time = dayjs(new Date(eps.timestamp)).format('MM/DD/YYYY hh:mm A');
      if (myProjects.current) {
        for (const p of myProjects.current) {
          if (p.title === eps.title) {
            p.timestamp = eps.timestamp;
            p.time = eps.time;
            p.key = eps.timestamp.toString();
            break;
          }
        }
      }
      firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .collection('projects')
        .doc(title)
        .set(eps)
        .then(() => {
          setUpdateMyProjectsFlag(!updateMyProjectsFlag);
        })
        .catch((error) => {
          showError(i18n.t('message.CannotSaveProject', lang) + ': ' + error);
        })
        .finally(() => {
          setProcessing(false);
        });
    }
  }

  function saveProjectAs() {
    if (!user || !user.uid) return;
    const title = usePrimitiveStore.getState().projectTitle;
    if (!title) {
      showError(i18n.t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    const t = title.trim();
    if (t.length === 0) {
      showError(i18n.t('message.CannotCreateNewProjectWithoutTitle', lang) + '.');
      return;
    }
    // check if the project title is already taken
    fetchMyProjects(false).then(() => {
      let exist = false;
      if (myProjects.current) {
        for (const p of myProjects.current) {
          if (p.title === t) {
            exist = true;
            break;
          }
        }
      }
      if (exist) {
        showInfo(i18n.t('message.TitleUsedChooseDifferentOne', lang) + ': ' + t);
      } else {
        if (user && user.uid) {
          const state = useStore.getState();
          const ps = state.projectState;
          const molecules = ps.molecules;
          if (molecules) {
            const type = usePrimitiveStore.getState().projectType;
            const description = usePrimitiveStore.getState().projectDescription ?? '';
            firebase
              .firestore()
              .collection('users')
              .doc(user.uid)
              .collection('projects')
              .doc(t)
              .set({
                owner: user.uid,
                title: t,
                timestamp: new Date().getTime(),
                type,
                description,
                counter: ps.counter ?? 0,
                dataColoring: ps.dataColoring ?? null,
                selectedProperty: ps.selectedProperty ?? null,
                sortDescending: !!ps.sortDescending,
                xAxisNameScatteredPlot: ps.xAxisNameScatteredPlot ?? 'atomCount',
                yAxisNameScatteredPlot: ps.yAxisNameScatteredPlot ?? 'atomCount',
                dotSizeScatteredPlot: ps.dotSizeScatteredPlot ?? 5,
                thumbnailWidth: ps.thumbnailWidth ?? 200,
                molecules: molecules,
                targetProtein: ps.targetProtein,
                ranges: ps.ranges,
                filters: ps.filters,
                hiddenProperties: ps.hiddenProperties,

                chamberViewerPercentWidth: ps.chamberViewerPercentWidth,
                chamberViewerAxes: ps.chamberViewerAxes,
                chamberViewerShininess: ps.chamberViewerShininess,
                chamberViewerStyle: ps.chamberViewerStyle,
                chamberViewerColoring: ps.chamberViewerColoring,
                chamberViewerBackground: ps.chamberViewerBackground,

                projectViewerStyle: ps.projectViewerStyle,
                projectViewerBackground: ps.projectViewerBackground,

                cameraPosition: state.cameraPosition,
                panCenter: state.panCenter,
              } as ExtendedProjectState)
              .then(() => {
                setCommonStore((state) => {
                  state.projectView = true;
                  state.projectState.owner = user.uid;
                  state.projectState.type = type;
                  state.projectState.title = title;
                  state.projectState.description = description;
                  state.projectState.molecules = [...molecules];
                });
              })
              .catch((error) => {
                showError(i18n.t('message.CannotCreateNewProject', lang) + ': ' + error);
              })
              .finally(() => {
                if (showProjectListPanel) {
                  fetchMyProjects(false).then(() => {
                    setUpdateFlag(!updateFlag);
                  });
                }
                setProcessing(false);
              });
          }
        }
      }
    });
  }

  function curateMoleculeToProject() {
    const projectOwner = useStore.getState().projectState.owner;
    if (user.uid !== projectOwner) {
      showInfo(i18n.t('message.CannotAddMoleculeToProjectOwnedByOthers', lang));
    } else {
      const projectTitle = useStore.getState().projectState.title;
      if (projectTitle) {
        setProcessing(true);
        const projectType = useStore.getState().projectState.type ?? ProjectType.DRUG_DISCOVERY;
        const thumbnailWidth = useStore.getState().projectState.thumbnailWidth ?? 200;
        const counter = useStore.getState().projectState.counter ?? 0;
        addMoleculeToProject(projectType, projectTitle, projectTitle + ' ' + counter, thumbnailWidth);
      }
    }
  }

  function showMyProjectsList() {
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
          showInfo(i18n.t('message.YourAccountSettingsWereSaved', lang));
        })
        .catch((error) => {
          showError(i18n.t('message.CannotSaveYourAccountSettings', lang) + ': ' + error);
        });
    }
  }

  return viewOnly ? (
    <></>
  ) : (
    <>
      {processing && <Spinner />}
      <MainToolBar signIn={signIn} signOut={signOut} />
      {showProjectListPanel && myProjects.current && (
        <ProjectListPanel
          projects={myProjects.current}
          setProjectState={setProjectState}
          deleteProject={deleteProject}
          renameProject={renameProject}
          updateFlag={updateMyProjectsFlag}
        />
      )}
    </>
  );
};

export default React.memo(CloudManager);