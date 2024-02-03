/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import { RefObject } from 'react';
import { Group } from 'three';

export interface RefStoreState {
  selectNone: () => void;
  contentRef: RefObject<Group> | null;
  testMoleculeRef: RefObject<Group> | null;
}

export const useRefStore = createWithEqualityFn<RefStoreState>()((set, get) => {
  return {
    selectNone: () => {},
    contentRef: null,
    testMoleculeRef: null,
  };
});
