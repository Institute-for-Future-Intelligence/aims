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
import { ActionInfo, MoleculeInterface, ProjectInfo, ProjectState } from '../types';
import { Locale } from 'antd/lib/locale';
import enUS from 'antd/lib/locale/en_US';
import elementsUrl from '../assets/elements.csv';
import molecularPropertiesUrl from '../assets/molecular-properties.csv';
import { ChemicalElement } from '../models/ChemicalElement';
import Papa from 'papaparse';
import { MolecularProperties, MolecularStructure } from '../models/MolecularProperties';
import { User } from '../User';
import { ProjectUtil } from '../project/ProjectUtil.ts';
import { Protein } from '../models/Protein.ts';
import { ModelUtil } from '../models/ModelUtil.ts';
import { Atom } from '../models/Atom.ts';
import { Restraint } from '../models/Restraint.ts';
import { Triple } from '../models/Triple.ts';
import { Quadruple } from '../models/Quadruple.ts';
import { usePrimitiveStore } from './commonPrimitive.ts';

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

  deleteAllAtoms: () => void;
  fixAtomByIndex: (index: number, fixed: boolean) => void;
  restrainAtomByIndex: (index: number, strength: number) => void;
  dampAtomByIndex: (index: number, damp: number) => void;
  chargeAtomByIndex: (index: number, charge: number) => void;
  setAtomEpsilonByIndex: (index: number, epsilon: number) => void;
  setAtomTrajectoryByIndex: (index: number, visible: boolean) => void;
  getAtomByIndex: (index: number) => Atom | null;

  // have to use objects as local storage does not accept maps
  angularBondsMap: { [key: string]: Triple[] };
  torsionalBondsMap: { [key: string]: Quadruple[] };

  proteinData: Protein | undefined;

  projectToOpen: ProjectInfo | null;

  addMolecule: (molecule: MoleculeInterface, index?: number) => boolean;
  addMolecules: (molecules: MoleculeInterface[]) => void;
  removeMolecule: (molecule: MoleculeInterface) => void;
  removeMoleculeByName: (name: string) => void;
  removeAllMolecules: () => void;

  molecularPropertiesMap: Map<string, MolecularProperties>;
  setMolecularProperties: (name: string, properties: MolecularProperties) => void;
  molecularStructureMap: Map<string, MolecularStructure>;
  setMolecularStructure: (name: string, structure: MolecularStructure) => void;

  navigationView: boolean;

  undoManager: UndoManager;
  addUndoable: (undoable: Undoable) => void;
  loggable: boolean;
  actionInfo: ActionInfo | undefined;
  logAction: (name: string) => void;
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

          deleteAllAtoms() {
            immerSet((state: CommonStoreState) => {
              state.projectState.testMolecules = [];
            });
            usePrimitiveStore.getState().set((state) => {
              state.pickedMoleculeIndex = -1;
              state.pickedAtomIndex = -1;
              state.startSimulation = false;
            });
          },
          fixAtomByIndex(index: number, fixed: boolean) {
            immerSet((state: CommonStoreState) => {
              let i = 0;
              loop1: for (const m of state.projectState.testMolecules) {
                for (const a of m.atoms) {
                  if (i === index) {
                    a.fixed = fixed;
                    break loop1;
                  }
                  i++;
                }
              }
            });
          },
          restrainAtomByIndex(index: number, strength: number) {
            immerSet((state: CommonStoreState) => {
              let i = 0;
              loop1: for (const m of state.projectState.testMolecules) {
                for (const a of m.atoms) {
                  if (i === index) {
                    if (a.restraint) {
                      if (strength > 0) {
                        a.restraint.strength = strength;
                      } else {
                        a.restraint = undefined;
                      }
                    } else {
                      if (strength > 0) {
                        a.restraint = new Restraint(strength, a.position.clone());
                      }
                    }
                    break loop1;
                  }
                  i++;
                }
              }
            });
          },
          dampAtomByIndex(index: number, damp: number) {
            immerSet((state: CommonStoreState) => {
              let i = 0;
              loop1: for (const m of state.projectState.testMolecules) {
                for (const a of m.atoms) {
                  if (i === index) {
                    a.damp = damp;
                    break loop1;
                  }
                  i++;
                }
              }
            });
          },
          chargeAtomByIndex(index: number, charge: number) {
            immerSet((state: CommonStoreState) => {
              let i = 0;
              loop1: for (const m of state.projectState.testMolecules) {
                for (const a of m.atoms) {
                  if (i === index) {
                    a.charge = charge;
                    break loop1;
                  }
                  i++;
                }
              }
            });
          },
          setAtomEpsilonByIndex(index: number, epsilon: number) {
            immerSet((state: CommonStoreState) => {
              let i = 0;
              loop1: for (const m of state.projectState.testMolecules) {
                for (const a of m.atoms) {
                  if (i === index) {
                    a.epsilon = epsilon;
                    break loop1;
                  }
                  i++;
                }
              }
            });
          },
          setAtomTrajectoryByIndex(index: number, visible: boolean) {
            immerSet((state: CommonStoreState) => {
              let i = 0;
              loop1: for (const m of state.projectState.testMolecules) {
                for (const a of m.atoms) {
                  if (i === index) {
                    a.trajectory = visible;
                    break loop1;
                  }
                  i++;
                }
              }
            });
          },
          getAtomByIndex(index: number) {
            let atom = null;
            immerSet((state: CommonStoreState) => {
              let i = 0;
              loop1: for (const m of state.projectState.testMolecules) {
                for (const a of m.atoms) {
                  if (i === index) {
                    atom = a;
                    break loop1;
                  }
                  i++;
                }
              }
            });
            return atom;
          },

          angularBondsMap: {},
          torsionalBondsMap: {},

          proteinData: undefined,

          projectToOpen: null,

          addMolecule(molecule: MoleculeInterface, index?: number) {
            let added = true;
            immerSet((state: CommonStoreState) => {
              for (const m of state.projectState.molecules) {
                if (m.name === molecule.name) {
                  added = false;
                  break;
                }
              }
              if (added) {
                if (index === undefined) {
                  state.projectState.molecules.push(molecule);
                } else {
                  if (index >= 0 && index <= state.projectState.molecules.length) {
                    state.projectState.molecules.splice(index, 0, molecule);
                  }
                }
              }
            });
            return added;
          },
          addMolecules(molecules: MoleculeInterface[]) {
            immerSet((state: CommonStoreState) => {
              const m2: MoleculeInterface[] = [];
              for (const molecule of molecules) {
                let included = false;
                for (const m of state.projectState.molecules) {
                  if (m.name === molecule.name) {
                    included = true;
                    break;
                  }
                }
                if (!included) {
                  m2.push(molecule);
                }
              }
              if (m2.length > 0) {
                state.projectState.molecules.push(...m2);
              }
            });
          },
          removeMolecule(molecule: MoleculeInterface) {
            immerSet((state: CommonStoreState) => {
              for (const [i, m] of state.projectState.molecules.entries()) {
                if (m.name === molecule.name) {
                  state.projectState.molecules.splice(i, 1);
                  break;
                }
              }
            });
          },
          removeMoleculeByName(name: string) {
            immerSet((state: CommonStoreState) => {
              for (const [i, m] of state.projectState.molecules.entries()) {
                if (m.name === name) {
                  state.projectState.molecules.splice(i, 1);
                  break;
                }
              }
            });
          },
          removeAllMolecules() {
            immerSet((state: CommonStoreState) => {
              state.projectState.molecules = [];
              state.projectState.selectedMolecule = null;
            });
          },

          molecularPropertiesMap: new Map<string, MolecularProperties>(),
          setMolecularProperties(name: string, properties: MolecularProperties) {
            immerSet((state: CommonStoreState) => {
              state.molecularPropertiesMap.set(name, properties);
            });
          },
          molecularStructureMap: new Map<string, MolecularStructure>(),
          setMolecularStructure(name: string, structure: MolecularStructure) {
            immerSet((state: CommonStoreState) => {
              state.molecularStructureMap.set(name, structure);
            });
          },

          navigationView: false,

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
          logAction(name: string) {
            immerSet((state: CommonStoreState) => {
              state.actionInfo = { name, timestamp: new Date().getTime() };
            });
          },
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
                        smiles: token[13]?.trim(),
                        inChI: token[14]?.trim(),
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
        partialize: (state) => {
          const ps = state.projectState;
          for (const m of ps.testMolecules) {
            m.radialBonds = [];
            m.angularBonds = [];
            m.torsionalBonds = [];
          }
          return {
            language: state.language,
            user: state.user,
            projectState: ps,
            selectedFloatingWindow: state.selectedFloatingWindow,
            angularBondsMap: state.angularBondsMap,
            torsionalBondsMap: state.torsionalBondsMap,
          };
        },
        merge: (persistedState: any, currentState: CommonStoreState) => {
          const state = { ...currentState, ...persistedState } as CommonStoreState;
          state.projectState.testMolecules = ModelUtil.reconstructMoleculesFromFirestore(
            state.projectState.testMolecules,
          );
          return state;
        },
      },
    ),
  ),
);
