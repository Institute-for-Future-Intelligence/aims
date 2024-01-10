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
import moleculesUrl from '../assets/molecules.csv';
import { ChemicalElement } from '../models/ChemicalElement';
import Papa from 'papaparse';
import { AtomTS } from '../models/AtomTS';
import { BondTS } from '../models/BondTS';
import { useRefStore } from './commonRef';
import { MolecularProperties } from '../models/MolecularProperties';
import { Filter } from '../Filter';

enableMapSet();

export interface CommonStoreState {
  set: (fn: (state: CommonStoreState) => void) => void;

  // only the following properties are persisted (see the whitelist at the end)
  version: string | undefined;
  language: string;
  locale: Locale;
  user: User;
  cloudFile: string | undefined;

  selectedFloatingWindow: string | null;

  projectInfo: ProjectInfo;
  projectView: boolean;

  loadedMolecule: MoleculeData | null;
  selectedMolecule: MoleculeData | null;
  collectedMolecules: MoleculeData[];
  addMolecule: (molecule: MoleculeData) => boolean;
  removeMolecule: (molecule: MoleculeData) => void;

  molecularPropertiesMap: Map<string, MolecularProperties>;
  setMolecularProperties: (name: string, properties: MolecularProperties) => void;

  chamberViewerPercentWidth: number;
  chamberViewerAxes: boolean;
  chamberViewerShininess: number;
  chamberViewerStyle: MolecularViewerStyle;
  chamberViewerBackground: string;
  projectViewerStyle: MolecularViewerStyle;
  projectViewerBackground: string;

  navigationView: boolean;
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

  providedMolecules: { [key: string]: MolecularProperties };
  getProvidedMolecule: (name: string) => MolecularProperties;
  loadProvidedMolecules: () => void;
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

          selectedFloatingWindow: null,

          projectInfo: {
            owner: null,
            timestamp: -1,
            type: ProjectType.DEFAULT,
            title: null,
            description: null,
            selectedProperty: null,
            sortDescending: false,
            hiddenProperties: new Array<string>(),
            ranges: new Array<Range>(),
            filters: new Array<Filter>(),
          } as ProjectInfo,
          projectView: true,

          loadedMolecule: null,
          selectedMolecule: null,
          collectedMolecules: [],
          addMolecule(molecule: MoleculeData) {
            let added = true;
            immerSet((state: CommonStoreState) => {
              for (const m of state.collectedMolecules) {
                if (m.name === molecule.name) {
                  added = false;
                  break;
                }
              }
              if (added) {
                state.collectedMolecules.push(molecule);
              }
            });
            return added;
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

          molecularPropertiesMap: new Map<string, MolecularProperties>(),
          setMolecularProperties(name: string, properties: MolecularProperties) {
            immerSet((state: CommonStoreState) => {
              state.molecularPropertiesMap.set(name, properties);
            });
          },

          chamberViewerPercentWidth: 50,
          chamberViewerAxes: true,
          chamberViewerShininess: 1000,
          chamberViewerStyle: MolecularViewerStyle.BallAndStick,
          chamberViewerBackground: 'black',
          projectViewerStyle: MolecularViewerStyle.BallAndStick,
          projectViewerBackground: 'white',

          navigationView: false,
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
            Papa.parse(elementsUrl, {
              download: true,
              complete: function (results) {
                for (const token of results.data) {
                  if (Array.isArray(token) && token.length > 1) {
                    if (token[0] !== 'AtomicNumber') {
                      const element = {
                        atomicNumber: parseInt(token[0].trim()),
                        symbol: token[1].trim(),
                        name: token[2].trim(),
                        atomicMass: parseFloat(token[3].trim()),
                        cpkHexColor: token[4].trim(),
                        electronConfiguration: token[5].trim(),
                        electronegativity: parseFloat(token[6].trim()),
                        atomicRadius: parseFloat(token[7].trim()) * 0.01, // angstrom (100 pm)
                        ionizationEnergy: parseFloat(token[8].trim()),
                        electronAffinity: parseFloat(token[9].trim()),
                      } as ChemicalElement;
                      immerSet((state: CommonStoreState) => {
                        state.chemicalElements[element.symbol] = element;
                      });
                    }
                  }
                }
              },
            });
          },

          providedMolecules: {},
          getProvidedMolecule(name: string) {
            return get().providedMolecules[name];
          },
          loadProvidedMolecules() {
            Papa.parse(moleculesUrl, {
              download: true,
              complete: function (results) {
                for (const token of results.data) {
                  if (Array.isArray(token) && token.length > 1) {
                    if (token[0] !== 'Name') {
                      const mol = {
                        logP: parseFloat(token[1].trim()),
                        hydrogenBondDonorCount: parseInt(token[2].trim()),
                        hydrogenBondAcceptorCount: parseInt(token[3].trim()),
                        rotatableBondCount: parseInt(token[4].trim()),
                        polarSurfaceArea: parseFloat(token[5].trim()),
                      } as MolecularProperties;
                      immerSet((state: CommonStoreState) => {
                        state.providedMolecules[token[0].trim()] = mol;
                      });
                    }
                  }
                }
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
          collectedMolecules: state.collectedMolecules,
          chamberViewerPercentWidth: state.chamberViewerPercentWidth,
          chamberViewerAxes: state.chamberViewerAxes,
          chamberViewerShininess: state.chamberViewerShininess,
          chamberViewerStyle: state.chamberViewerStyle,
          chamberViewerBackground: state.chamberViewerBackground,
          projectViewerStyle: state.projectViewerStyle,
          projectViewerBackground: state.projectViewerBackground,
          projectInfo: state.projectInfo,
          cameraPosition: state.cameraPosition,
          panCenter: state.panCenter,
          selectedFloatingWindow: state.selectedFloatingWindow,
        }),
      },
    ),
  ),
);
