/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import { RefObject } from 'react';
import { Group, PerspectiveCamera, Raycaster, Vector2, Vector3, WebGLRenderer } from 'three';
import { Molecule } from '../models/Molecule.ts';
import { Camera, invalidate } from '@react-three/fiber';
import { VdwBond } from '../models/VdwBond.ts';
import { MolecularDynamics } from '../models/MolecularDynamics.ts';
import { MAXIMUM_NUMBER_OF_ATOMS_FOR_SIMULATION } from '../constants.ts';
import i18n from '../i18n/i18n';
import { useStore } from './common.ts';
import { MyTrackballControls } from '../js/MyTrackballControls';
import { setMessage } from '../helpers.tsx';

export interface RefStoreState {
  selectNone: () => void;
  dashboardDivRef: RefObject<HTMLDivElement> | null;
  controlsRef: RefObject<MyTrackballControls> | null;
  cameraRef: RefObject<Camera | undefined> | null;
  raycasterRef: RefObject<Raycaster | undefined> | null;
  planeXYRef: RefObject<any> | null;
  planeYZRef: RefObject<any> | null;
  planeXZRef: RefObject<any> | null;
  ligandRef: RefObject<Group> | null;
  moleculesRef: RefObject<Molecule[]> | null;
  vdwBondsRef: RefObject<VdwBond[]> | null;
  clickPointRef: RefObject<Vector3> | null;
  molecularDynamicsRef: RefObject<MolecularDynamics> | null;
  chamberViewerCanvas: { gl: WebGLRenderer; camera: PerspectiveCamera } | null;
  galleryViewerCanvas: { gl: WebGLRenderer } | null;
  resizeCanvases: (percentWidth: number) => void;
  warnIfTooManyAtoms: (addition: number) => void;
}

export const useRefStore = createWithEqualityFn<RefStoreState>()((set, get) => {
  return {
    selectNone: () => {},
    controlsRef: null,
    cameraRef: null,
    raycasterRef: null,
    planeXYRef: null,
    planeYZRef: null,
    planeXZRef: null,
    ligandRef: null,
    moleculesRef: null,
    vdwBondsRef: null,
    clickPointRef: null,
    molecularDynamicsRef: null,
    chamberViewerCanvas: null,
    galleryViewerCanvas: null,
    dashboardDivRef: null,

    resizeCanvases(percentWidth) {
      const chamberViewerCanvas = get().chamberViewerCanvas;
      const galleryViewerCanvas = get().galleryViewerCanvas;
      const v = new Vector2();

      if (chamberViewerCanvas) {
        const { gl, camera } = chamberViewerCanvas;
        const newWidth = ((100 - percentWidth) * window.innerWidth) / 100;
        gl.getSize(v);
        gl.setSize(newWidth, v.y);
        camera.aspect = newWidth / v.y;
        camera.updateProjectionMatrix();
        invalidate();
      }
      if (galleryViewerCanvas) {
        const { gl } = galleryViewerCanvas;
        const newWidth = (percentWidth * window.innerWidth) / 100;
        gl.getSize(v);
        gl.setSize(newWidth, v.y);
      }
    },

    warnIfTooManyAtoms(addition: number) {
      const mdRef = get().molecularDynamicsRef;
      const atomCount = (mdRef?.current?.atoms.length ?? 0) + addition;
      if (atomCount > MAXIMUM_NUMBER_OF_ATOMS_FOR_SIMULATION) {
        const lang = { lng: useStore.getState().language };
        setMessage(
          'warning',
          i18n.t('message.TooManyAtomsMayCauseSimulationToRunSlowly', lang) +
            ' (' +
            atomCount +
            ' ' +
            i18n.t('word.AtomsLowerCasePlural', lang) +
            ').',
        );
      }
    },
  };
});
