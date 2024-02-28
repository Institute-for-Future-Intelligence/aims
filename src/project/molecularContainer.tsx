/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { MoleculeData } from '../types.ts';
import { MolecularViewerColoring, MolecularViewerMaterial, MolecularViewerStyle } from '../view/displayOptions.ts';
import MolecularViewer from '../view/molecularViewer.tsx';
import * as Selector from '../stores/selector';
import { useStore } from '../stores/common.ts';
import React, { useMemo, useRef } from 'react';
import { DirectionalLight, Vector3 } from 'three';
import { DEFAULT_CAMERA_POSITION, DEFAULT_LIGHT_INTENSITY, LabelType } from '../constants.ts';
import { ProjectGalleryControls } from '../controls.tsx';
import { Html } from '@react-three/drei';

interface MolecularContainerProps {
  viewWidth: number;
  viewHeight: number;
  selected: boolean;
  moleculeData: MoleculeData | null;
  formula: string;
  style: MolecularViewerStyle;
  material: MolecularViewerMaterial;
  selector?: string;
  setLoading?: (loading: boolean) => void;
  updateFlag: () => void;
}

const MolecularContainer = React.memo(
  ({
    viewWidth,
    viewHeight,
    selected,
    moleculeData,
    formula,
    style,
    material,
    setLoading,
    updateFlag,
  }: MolecularContainerProps) => {
    const setChanged = usePrimitiveStore(Selector.setChanged);
    const cameraPositionVector = useMemo(() => new Vector3().fromArray(DEFAULT_CAMERA_POSITION), []);
    const labelType = useStore(Selector.labelType);

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
        />
        <Html>
          <div
            style={{
              position: 'relative',
              left: -viewWidth / 2,
              top: -viewHeight / 2,
              width: viewWidth,
              height: viewHeight,
            }}
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
            onMouseDown={() => {
              useStore.getState().set((state) => {
                state.projectState.selectedMolecule = moleculeData;
              });
              updateFlag();
              setChanged(true);
            }}
          ></div>
        </Html>
        <Html>
          <div
            style={{
              position: 'relative',
              left: 4 - viewWidth / 2 + 'px',
              textAlign: 'left',
              bottom: (labelType === LabelType.FORMULA ? 26 : 16) - viewHeight / 2 + 'px',
              color: 'gray',
              fontSize: labelType === LabelType.FORMULA ? '14px' : '10px',
              fontWeight: selected ? 'bold' : 'normal',
              width: 'calc(100% - 14px)',
            }}
          >
            {labelType === LabelType.FORMULA ? formula ?? moleculeData?.name : moleculeData?.name}
          </div>
        </Html>
      </>
    );
  },
);

export default MolecularContainer;
