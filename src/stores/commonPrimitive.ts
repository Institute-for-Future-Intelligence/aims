/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import produce from 'immer';
import { MoleculeData, ObjectType } from '../types';

// avoid using undefined value in the store for now.
export interface PrimitiveStoreState {
  changed: boolean;
  setChanged: (b: boolean) => void;

  hoveredMolecule: MoleculeData | null;

  waiting: boolean;

  contextMenuObjectType: ObjectType | null;
  contextMenuFlag: boolean;
  updateContextMenu: () => void;

  updateProjectsFlag: boolean;

  set: (fn: (state: PrimitiveStoreState) => void) => void;
  setPrimitiveStore: <K extends keyof PrimitiveStoreState, V extends PrimitiveStoreState[K]>(key: K, val: V) => void;
}

export const usePrimitiveStore = createWithEqualityFn<PrimitiveStoreState>()((set, get) => {
  const immerSet: PrimitiveStoreState['set'] = (fn) => set(produce(fn));

  return {
    set: (fn) => {
      try {
        immerSet(fn);
      } catch (e) {
        console.log(e);
      }
    },

    setPrimitiveStore(key, val) {
      immerSet((state) => {
        if (state[key] !== undefined) {
          state[key] = val;
        } else {
          console.error(`key ${key} is not defined in PrimitiveStoreState`);
        }
      });
    },

    changed: false,
    setChanged(b) {
      immerSet((state: PrimitiveStoreState) => {
        state.changed = b;
      });
    },

    hoveredMolecule: null,

    waiting: false,

    contextMenuObjectType: null,
    contextMenuFlag: false,
    updateContextMenu() {
      immerSet((state) => {
        state.contextMenuFlag = !state.contextMenuFlag;
      });
    },

    updateProjectsFlag: false,
  };
});
