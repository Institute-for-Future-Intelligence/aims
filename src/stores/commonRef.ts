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

const v = new Vector2();

export interface RefStoreState {
  selectNone: () => void;
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
}

export const useRefStore = createWithEqualityFn<RefStoreState>()((set, get) => {
  return {
    selectNone: () => {},
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
    resizeCanvases(percentWidth) {
      const chamberViewerCanvas = get().chamberViewerCanvas;
      const galleryViewerCanvas = get().galleryViewerCanvas;

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
  };
});
