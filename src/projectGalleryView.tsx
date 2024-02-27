/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { usePrimitiveStore } from './stores/commonPrimitive';
import { MoleculeData } from './types';
import { MolecularViewerColoring, MolecularViewerMaterial, MolecularViewerStyle } from './view/displayOptions';
import MolecularViewer from './view/molecularViewer';
import * as Selector from './stores/selector';
import { useStore } from './stores/common';
import { useMemo, useRef } from 'react';
import { DirectionalLight, Vector3 } from 'three';
import { DEFAULT_CAMERA_POSITION, DEFAULT_LIGHT_INTENSITY } from './constants';
import { ProjectGalleryControls } from './controls';

interface ProjectGalleryViewProps {
  moleculeData: MoleculeData | null;
  style: MolecularViewerStyle;
  material: MolecularViewerMaterial;
  selector?: string;
  setLoading?: (loading: boolean) => void;
  updateFlag: () => void;
}

const ProjectGalleryView = ({ moleculeData, style, material, setLoading, updateFlag }: ProjectGalleryViewProps) => {
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const cameraPositionVector = useMemo(() => new Vector3().fromArray(DEFAULT_CAMERA_POSITION), []);

  const lightRef = useRef<DirectionalLight>(null);

  return (
    <>
      <directionalLight
        name={'Directional Light'}
        ref={lightRef}
        color="white"
        position={cameraPositionVector}
        intensity={DEFAULT_LIGHT_INTENSITY}
        castShadow={false}
      />
      <ProjectGalleryControls lightRef={lightRef} />
      <MolecularViewer
        moleculeData={moleculeData}
        style={style}
        material={material}
        coloring={MolecularViewerColoring.Element}
        chamber={false}
        lightRef={lightRef}
        setLoading={setLoading}
        onPointerOver={() => {
          usePrimitiveStore.getState().set((state) => {
            state.hoveredMolecule = moleculeData;
          });
          updateFlag();
        }}
        onPointerLeave={() => {
          usePrimitiveStore.getState().set((state) => {
            state.hoveredMolecule = null;
          });
        }}
        onClick={() => {
          usePrimitiveStore.getState().set((state) => {
            state.clickedMolecule = moleculeData;
          });
          // FIXME: Not sure why this doesn't cause the view to update. So we use the above for now.
          useStore.getState().set((state) => {
            state.projectState.selectedMolecule = moleculeData;
          });
          updateFlag();
          setChanged(true);
        }}
      />
    </>
  );
};

export default ProjectGalleryView;
