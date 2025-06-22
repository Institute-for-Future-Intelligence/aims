/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { MoleculeInterface } from '../types.ts';
import { MolecularViewerColoring, MolecularViewerMaterial, MolecularViewerStyle } from '../view/displayOptions.ts';
import * as Selector from '../stores/selector';
import { useStore } from '../stores/common.ts';
import React, { useMemo, useRef } from 'react';
import { DirectionalLight, Vector3 } from 'three';
import { DEFAULT_CAMERA_POSITION, DEFAULT_LIGHT_INTENSITY, LabelType } from '../constants.ts';
import { ProjectGalleryControls } from '../controls.tsx';
import { Html } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import GalleryViewer from '../view/galleryViewer.tsx';
import { useTranslation } from 'react-i18next';
import { message, Space } from 'antd';
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { setMessage } from '../helpers.tsx';

interface MolecularContainerProps {
  viewWidth: number;
  viewHeight: number;
  selected: boolean;
  molecule: MoleculeInterface | null;
  formula: string;
  smiles: string;
  inChI: string;
  style: MolecularViewerStyle;
  material: MolecularViewerMaterial;
  selector?: string;
  setLoading?: (loading: boolean) => void;
  scatterDataIndex: number;
  setScatterDataHoveredIndex: (index: number) => void;
}

const ScissorBox = React.memo(
  ({
    viewWidth,
    viewHeight,
    selected,
    molecule,
    formula,
    smiles,
    inChI,
    style,
    material,
    setLoading,
    scatterDataIndex,
    setScatterDataHoveredIndex,
  }: MolecularContainerProps) => {
    const setCommonStore = useStore(Selector.set);
    const language = useStore(Selector.language);
    const setChanged = usePrimitiveStore(Selector.setChanged);
    const cameraPositionVector = useMemo(() => new Vector3().fromArray(DEFAULT_CAMERA_POSITION), []);
    const labelType = useStore(Selector.labelType);
    const dragAndDropMolecule = usePrimitiveStore(Selector.dragAndDropMolecule);
    const xyPlaneVisible = useStore(Selector.xyPlaneVisible);
    const yzPlaneVisible = useStore(Selector.yzPlaneVisible);
    const xzPlaneVisible = useStore(Selector.xzPlaneVisible);

    const lightRef = useRef<DirectionalLight>(null);

    const { t } = useTranslation();
    const lang = useMemo(() => {
      return { lng: language };
    }, [language]);

    const onPointerOver = () => {
      usePrimitiveStore.getState().set((state) => {
        state.hoveredMolecule = molecule;
      });
      setScatterDataHoveredIndex(scatterDataIndex);
    };

    const onPointerLeave = () => {
      usePrimitiveStore.getState().set((state) => {
        state.hoveredMolecule = null;
      });
    };

    // also pass this to galleryViewer.tsx (otherwise clicking the molecule will not select the container)
    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      useStore.getState().set((state) => {
        state.projectState.selectedMolecule = molecule;
      });
      setChanged(true);
    };

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      useStore.getState().set((state) => {
        state.projectState.selectedMolecule = molecule;
      });
      setChanged(true);
    };

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
        <ProjectGalleryControls disabled={dragAndDropMolecule} lightRef={lightRef} />
        {molecule && (
          <GalleryViewer
            molecule={molecule}
            style={style}
            material={material}
            coloring={MolecularViewerColoring.Element}
            lightRef={lightRef}
            setLoading={setLoading}
            onPointerOver={onPointerOver}
            onPointerLeave={onPointerLeave}
            onPointerDown={onPointerDown}
          />
        )}
        <Html>
          <div
            style={{
              width: viewWidth,
              height: viewHeight,
            }}
            onPointerOver={onPointerOver}
            onPointerLeave={onPointerLeave}
            onMouseDown={onMouseDown}
            draggable={dragAndDropMolecule}
            onDragStart={() => {
              if (!xyPlaneVisible && !yzPlaneVisible && !xzPlaneVisible) {
                setMessage('info', t('message.TurnOnXYZPlanesForDroppingMolecule', lang), 1000);
              }
            }}
            onDragEnd={() => {
              if (!xyPlaneVisible && !yzPlaneVisible && !xzPlaneVisible) {
                message.destroy();
              }
            }}
          />
        </Html>
        <Html>
          <Space
            title={
              molecule?.name +
              ' (' +
              formula +
              ')' +
              '\n' +
              (smiles ? '\nSMILES: ' + smiles : '') +
              (inChI ? '\n\n' + inChI : '')
            }
            style={{
              position: 'relative',
              left: '4px',
              bottom: 26 - viewHeight + 'px',
              textAlign: 'left',
              color: 'gray',
              fontSize: labelType === LabelType.FORMULA ? '16px' : '11px',
              fontWeight: selected ? 'bold' : 'normal',
              width: viewWidth - 14 + 'px',
            }}
            onMouseDown={onMouseDown}
          >
            {labelType === LabelType.FORMULA ? formula ?? molecule?.name : molecule?.name}
          </Space>
          {molecule?.invisible ? (
            <MinusCircleOutlined
              style={{
                color: 'dimgray',
                position: 'absolute',
                right: '-6px',
                bottom: 28 - viewHeight + 'px',
                cursor: 'pointer',
              }}
              title={t('projectPanel.ClickToIncludeMolecule', lang)}
              onClick={() => {
                if (molecule) {
                  setCommonStore((state) => {
                    for (const m of state.projectState.molecules) {
                      if (m.name === molecule.name) {
                        m.invisible = false;
                        usePrimitiveStore.getState().set((state) => {
                          state.regressionAnalysis = false;
                        });
                        break;
                      }
                    }
                  });
                }
              }}
            />
          ) : (
            <CheckCircleOutlined
              style={{
                color: 'dimgray',
                position: 'absolute',
                right: '-6px',
                bottom: 28 - viewHeight + 'px',
                cursor: 'pointer',
              }}
              title={t('projectPanel.ClickToExcludeMolecule', lang)}
              onClick={() => {
                if (molecule) {
                  setCommonStore((state) => {
                    for (const m of state.projectState.molecules) {
                      if (m.name === molecule.name) {
                        m.invisible = true;
                        usePrimitiveStore.getState().set((state) => {
                          state.regressionAnalysis = false;
                        });
                        break;
                      }
                    }
                  });
                }
              }}
            />
          )}
        </Html>
      </>
    );
  },
);

export default ScissorBox;
