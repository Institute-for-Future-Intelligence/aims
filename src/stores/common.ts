/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import produce, { enableMapSet } from 'immer';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Util } from '../Util';
import { VERSION } from '../programmaticConstants';
import { Undoable } from '../undo/Undoable';
import { UndoManager } from '../undo/UndoManager';
import { ActionInfo, MolecularViewerStyle, MoleculeData, ProjectInfo, ProjectType, Range, User } from '../types';
import { Locale } from 'antd/lib/locale';
import enUS from 'antd/lib/locale/en_US';
import elementsUrl from '../assets/elements.csv';
import { ChemicalElement } from '../models/ChemicalElement';
import Papa from 'papaparse';
import { AtomTS } from '../models/AtomTS';
import { BondTS } from '../models/BondTS';
import { useRefStore } from './commonRef';

enableMapSet();

export interface CommonStoreState {
  set: (fn: (state: CommonStoreState) => void) => void;

  // only the following properties are persisted (see the whitelist at the end)
  version: string | undefined;
  language: string;
  locale: Locale;
  user: User;
  cloudFile: string | undefined;

  projectInfo: ProjectInfo;
  projectView: boolean;

  loadedMolecule: MoleculeData | null;
  selectedMolecule: MoleculeData | null;
  collectedMolecules: MoleculeData[];
  addMolecule: (molecule: MoleculeData) => void;
  removeMolecule: (molecule: MoleculeData) => void;

  chamberViewerAxes: boolean;
  chamberViewerShininess: number;
  chamberViewerStyle: MolecularViewerStyle;
  chamberViewerBackground: string;
  projectViewerStyle: MolecularViewerStyle;
  projectViewerBackground: string;

  autoRotate: boolean;
  navigationView: boolean;
  enableRotate: boolean;
  cameraPosition: number[];
  panCenter: number[];

  selectedObject: AtomTS | BondTS | null;
  selectedObjectIdSet: Set<string>;
  selectNone: () => void;

  undoManager: UndoManager;
  addUndoable: (undoable: Undoable) => void;
  loggable: boolean;
  actionInfo: ActionInfo | undefined;
  currentUndoable: Undoable | undefined;

  chemicalElements: { [key: string]: ChemicalElement };
  getChemicalElement: (name: string) => ChemicalElement;
  loadChemicalElements: () => void;
}

export const useStore = createWithEqualityFn<CommonStoreState>()(
  devtools(
    persist(
      (set, get) => {
        const immerSet: CommonStoreState['set'] = (fn) => set(produce(fn));

        return {
          set: (fn) => {
            try {
              immerSet(fn);
            } catch (e) {
              console.log(e);
            }
          },
          version: VERSION,
          language: 'en',
          locale: enUS,
          user: {} as User,
          cloudFile: undefined,

          projectInfo: {
            owner: null,
            timestamp: -1,
            type: ProjectType.DEFAULT,
            title: null,
            description: null,
            selectedProperty: null,
            sortDescending: false,
            ranges: new Array<Range>(),
          } as ProjectInfo,
          projectView: true,

          loadedMolecule: null,
          selectedMolecule: null,
          collectedMolecules: [],
          addMolecule(molecule: MoleculeData) {
            immerSet((state: CommonStoreState) => {
              let alreadyIncluded = false;
              for (const m of state.collectedMolecules) {
                if (m.name === molecule.name) {
                  alreadyIncluded = true;
                  break;
                }
              }
              if (!alreadyIncluded) {
                state.collectedMolecules.push(molecule);
              }
            });
          },
          removeMolecule(molecule: MoleculeData) {
            immerSet((state: CommonStoreState) => {
              for (const [i, m] of state.collectedMolecules.entries()) {
                if (m.name === molecule.name) {
                  state.collectedMolecules.splice(i, 1);
                  break;
                }
              }
            });
          },

          chamberViewerAxes: true,
          chamberViewerShininess: 1000,
          chamberViewerStyle: MolecularViewerStyle.BallAndStick,
          chamberViewerBackground: 'black',
          projectViewerStyle: MolecularViewerStyle.BallAndStick,
          projectViewerBackground: 'white',

          autoRotate: false,
          navigationView: false,
          enableRotate: true,
          cameraPosition: [5, 10, 20],
          panCenter: [0, 0, 0],

          selectedObject: null,
          selectedObjectIdSet: new Set<string>(),
          selectNone() {
            immerSet((state: CommonStoreState) => {
              state.selectedObjectIdSet.clear();
              state.selectedObject = null;
            });
            useRefStore.getState().selectNone();
          },

          undoManager: new UndoManager(),
          addUndoable(undoable: Undoable) {
            immerSet((state: CommonStoreState) => {
              if (state.loggable) {
                state.currentUndoable = undoable;
              }
              state.undoManager.add(undoable);
            });
          },
          loggable: false,
          actionInfo: undefined,
          currentUndoable: undefined,

          chemicalElements: {},
          getChemicalElement(name: string) {
            return get().chemicalElements[name];
          },
          loadChemicalElements() {
            const chemicalElements: ChemicalElement[] = [];
            Papa.parse(elementsUrl, {
              download: true,
              complete: function (results) {
                for (const row of results.data) {
                  if (Array.isArray(row) && row.length > 1) {
                    const element = {
                      name: row[0].trim(),
                      index: parseInt(row[1].trim()),
                      mass: parseFloat(row[2].trim()),
                      sigma: parseFloat(row[3].trim()),
                      epsilon: parseFloat(row[4].trim()),
                    } as ChemicalElement;
                    chemicalElements.push(element);
                  }
                }
                immerSet((state: CommonStoreState) => {
                  for (const model of chemicalElements) {
                    state.chemicalElements[model.name] = model;
                  }
                });
              },
            });
          },
        };
      },
      {
        name: 'aims-storage',
        storage: createJSONStorage(() => {
          const params = new URLSearchParams(window.location.search);
          const viewOnly = params.get('viewonly') === 'true';
          return viewOnly ? sessionStorage : localStorage;
        }),
        skipHydration: Util.isOpenFromURL(),
        partialize: (state) => ({
          language: state.language,
          loadedMolecule: state.loadedMolecule,
          selectedMolecule: state.selectedMolecule,
          // collectedMolecules: state.collectedMolecules,
          chamberViewerAxes: state.chamberViewerAxes,
          chamberViewerShininess: state.chamberViewerShininess,
          chamberViewerStyle: state.chamberViewerStyle,
          chamberViewerBackground: state.chamberViewerBackground,
          projectViewerStyle: state.projectViewerStyle,
          projectViewerBackground: state.projectViewerBackground,
          cameraPosition: state.cameraPosition,
          panCenter: state.panCenter,
        }),
      },
    ),
  ),
);
