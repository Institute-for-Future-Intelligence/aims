/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import { enableMapSet, produce } from 'immer';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Util } from '../Util';
import { VERSION } from '../constants';
import { Undoable } from '../undo/Undoable';
import { UndoManager } from '../undo/UndoManager';
import { ActionInfo, MoleculeData, ProjectState } from '../types';
import { Locale } from 'antd/lib/locale';
import enUS from 'antd/lib/locale/en_US';
import elementsUrl from '../assets/elements.csv';
import molecularPropertiesUrl from '../assets/molecular-properties.csv';
import { ChemicalElement } from '../models/ChemicalElement';
import Papa from 'papaparse';
import { AtomTS } from '../models/AtomTS';
import { BondTS } from '../models/BondTS';
import { useRefStore } from './commonRef';
import { MolecularProperties } from '../models/MolecularProperties';
import { User } from '../User';
import { ProjectUtil } from '../ProjectUtil';
import { MoleculeTS } from '../models/MoleculeTS';
import Complex from '../lib/chem/Complex';
import AtomJS from '../lib/chem/Atom';
import { Vector3 } from 'three';

enableMapSet();

export interface CommonStoreState {
  set: (fn: (state: CommonStoreState) => void) => void;

  // only the following properties are persisted (see the whitelist at the end)
  version: string | undefined;
  language: string;
  locale: Locale;
  user: User;

  selectedFloatingWindow: string | null;

  projectState: ProjectState;
  projectView: boolean;

  targetProteinData: MoleculeTS | undefined;
  testMoleculeData: AtomTS[] | undefined;
  updateTestMoleculeData: () => void;

  projectStateToOpen: ProjectState | null;

  // cache parsed molecules to accelerate loading speed
  parsedResultsMap: Map<string, Complex>;
  setParsedResult: (name: string, result: Complex) => void;

  addMolecule: (molecule: MoleculeData) => boolean;
  removeMolecule: (molecule: MoleculeData) => void;

  molecularPropertiesMap: Map<string, MolecularProperties>;
  setMolecularProperties: (name: string, properties: MolecularProperties) => void;

  navigationView: boolean;

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

  providedMolecularProperties: { [key: string]: MolecularProperties };
  getProvidedMolecularProperties: (name: string) => MolecularProperties;
  loadProvidedMolecularProperties: () => void;
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

          selectedFloatingWindow: null,

          projectState: ProjectUtil.createDefaultProjectState(),
          projectView: true,

          targetProteinData: undefined,
          testMoleculeData: undefined,
          updateTestMoleculeData() {
            immerSet((state: CommonStoreState) => {
              if (state.projectState.testMolecule) {
                const result = state.parsedResultsMap.get(state.projectState.testMolecule.name);
                if (result) {
                  const atoms: AtomTS[] = [];
                  for (let i = 0; i < result._atoms.length; i++) {
                    const atom = result._atoms[i] as AtomJS;
                    atoms.push({
                      elementSymbol: Util.capitalizeFirstLetter(atom.element.name),
                      position: (atom.position.clone() as Vector3).sub(
                        state.targetProteinData?.centerOffset ?? new Vector3(),
                      ),
                    } as AtomTS);
                  }
                  state.testMoleculeData = atoms;
                } else {
                  state.testMoleculeData = undefined;
                }
              } else {
                state.testMoleculeData = undefined;
              }
            });
          },

          projectStateToOpen: null,

          parsedResultsMap: new Map<string, Complex>(),
          setParsedResult(name: string, result: Complex) {
            immerSet((state: CommonStoreState) => {
              state.parsedResultsMap.set(name, result);
            });
          },

          addMolecule(molecule: MoleculeData) {
            let added = true;
            immerSet((state: CommonStoreState) => {
              for (const m of state.projectState.molecules) {
                if (m.name === molecule.name) {
                  added = false;
                  break;
                }
              }
              if (added) {
                state.projectState.molecules.push(molecule);
              }
            });
            return added;
          },
          removeMolecule(molecule: MoleculeData) {
            immerSet((state: CommonStoreState) => {
              for (const [i, m] of state.projectState.molecules.entries()) {
                if (m.name === molecule.name) {
                  state.projectState.molecules.splice(i, 1);
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

          navigationView: false,

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

          providedMolecularProperties: {},
          getProvidedMolecularProperties(name: string) {
            return get().providedMolecularProperties[name];
          },
          loadProvidedMolecularProperties() {
            Papa.parse(molecularPropertiesUrl, {
              download: true,
              complete: function (results) {
                for (const token of results.data) {
                  if (Array.isArray(token) && token.length > 1) {
                    if (token[0] !== 'Name') {
                      const molProp = {
                        formula: token[1].trim(),
                        molecularMass: parseFloat(token[2].trim()),
                        logP: parseFloat(token[3].trim()),
                        hydrogenBondDonorCount: parseInt(token[4].trim()),
                        hydrogenBondAcceptorCount: parseInt(token[5].trim()),
                        rotatableBondCount: parseInt(token[6].trim()),
                        polarSurfaceArea: parseFloat(token[7].trim()),
                        heavyAtomCount: parseFloat(token[8].trim()),
                        complexity: parseFloat(token[9].trim()),
                        density: token[10].trim() === 'NA' ? Number.NaN : parseFloat(token[10].trim()),
                        boilingPoint: token[11].trim() === 'NA' ? Number.NaN : parseFloat(token[11].trim()),
                        meltingPoint: token[12].trim() === 'NA' ? Number.NaN : parseFloat(token[12].trim()),
                      } as MolecularProperties;
                      immerSet((state: CommonStoreState) => {
                        state.providedMolecularProperties[token[0].trim()] = molProp;
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
          user: state.user,
          projectState: state.projectState,
          selectedFloatingWindow: state.selectedFloatingWindow,
        }),
      },
    ),
  ),
);
