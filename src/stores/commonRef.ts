/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import { RefObject } from 'react';
import { Group } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface RefStoreState {
  orbitControlsRef: RefObject<OrbitControls> | null;
  setEnableOrbitController: (b: boolean) => void;
  selectNone: () => void;
  contentRef: RefObject<Group> | null;
}

export const useRefStore = createWithEqualityFn<RefStoreState>()((set, get) => {
  return {
    orbitControlsRef: null,
    setEnableOrbitController: (b: boolean) => {
      set((state) => {
        if (state.orbitControlsRef?.current) {
          state.orbitControlsRef.current.enabled = b;
        }
        return state;
      });
    },
    selectNone: () => {},
    contentRef: null,
  };
});
