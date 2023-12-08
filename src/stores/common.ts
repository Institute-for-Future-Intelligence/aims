/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import produce, { enableMapSet } from 'immer';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import {Util} from "../Util";
import {VERSION} from "../constants";

enableMapSet();

export interface CommonStoreState {
    set: (fn: (state: CommonStoreState) => void) => void;

    // only the following properties are persisted (see the whitelist at the end)
    version: string | undefined;
    language: string;
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
                }),
            },
        ),
    ),
);
