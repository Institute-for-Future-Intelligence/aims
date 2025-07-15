/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { MoleculeInterface } from '../types.ts';
import { MolecularViewerColoring, MolecularViewerMaterial, MolecularViewerStyle } from '../view/displayOptions.ts';
import * as Selector from '../stores/selector';
import { useStore } from '../stores/common.ts';
import React, { useMemo, useRef, useState } from 'react';
import { DirectionalLight, Vector3 } from 'three';
import { DEFAULT_CAMERA_POSITION, DEFAULT_LIGHT_INTENSITY, LabelType } from '../constants.ts';
import { ProjectGalleryControls } from '../controls.tsx';
import { Html } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import GalleryViewer from '../view/galleryViewer.tsx';
import { useTranslation } from 'react-i18next';
import { Button, Input, message, Popover, Space } from 'antd';
import { CheckCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { setMessage } from '../helpers.tsx';
import SparkImage from '../assets/spark.png';

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

const { TextArea } = Input;

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
    const [sdf, setSdf] = useState<string | undefined>(molecule?.data);

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
          <Popover
            content={
              <Space direction="vertical" style={{ width: '600px' }}>
                <Space style={{ fontWeight: 'bold' }}>{molecule?.name + (formula ? ' (' + formula + ')' : '')}</Space>
                {smiles && <Space>{'SMILES: ' + smiles}</Space>}
                {inChI && <Space>{inChI}</Space>}
                {molecule?.data && (
                  <TextArea
                    style={{ fontFamily: 'monospace', fontSize: '12px' }}
                    defaultValue={molecule.data}
                    rows={10}
                    onChange={(e) => {
                      setSdf(e.target.value);
                    }}
                  />
                )}
                {sdf && (
                  <Space style={{ float: 'right' }}>
                    {sdf !== molecule?.data && (
                      <Button
                        onClick={() => {
                          if (sdf && molecule?.name) {
                            setCommonStore((state) => {
                              state.setMoleculeData(molecule.name, sdf);
                            });
                          }
                        }}
                      >
                        {t('word.Overwrite', lang)}
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        if (sdf) {
                          navigator.clipboard.writeText(sdf).then(() => {
                            setMessage('success', t('projectPanel.DataInClipBoard', lang));
                          });
                        }
                      }}
                    >
                      {t('word.Copy', lang)}
                    </Button>
                  </Space>
                )}
              </Space>
            }
          >
            <Space
              style={{
                position: 'relative',
                left: '4px',
                bottom: 30 - viewHeight + 'px',
                textAlign: 'left',
                color: 'gray',
                fontSize: labelType === LabelType.FORMULA ? '16px' : '11px',
                fontWeight: selected ? 'bold' : 'normal',
                width: viewWidth - 14 + 'px',
              }}
              onMouseDown={onMouseDown}
            >
              {labelType === LabelType.FORMULA
                ? formula ??
                  molecule?.name.substring(0, Math.min(20, molecule?.name.length)) +
                    (molecule?.name && molecule.name.length > 20 ? '...' : '')
                : molecule?.name.substring(0, Math.min(20, molecule?.name.length)) +
                  (molecule?.name && molecule.name.length > 20 ? '...' : '')}
            </Space>
          </Popover>
          {molecule?.prompt && (
            <Popover
              content={
                <Space direction={'vertical'} style={{ width: '400px' }}>
                  <Space>{molecule.prompt}</Space>
                  <Button
                    style={{ float: 'right' }}
                    onClick={() => {
                      if (molecule?.prompt) {
                        navigator.clipboard.writeText(molecule?.prompt).then(() => {
                          setMessage('success', t('projectPanel.PromptInClipBoard', lang));
                        });
                      }
                    }}
                  >
                    {t('word.Copy', lang)}
                  </Button>
                </Space>
              }
              title={t('projectPanel.GenAIPrompt', lang)}
            >
              <img
                src={SparkImage}
                alt={'spark'}
                width={16}
                style={{
                  position: 'absolute',
                  right: '-6px',
                  top: '6px',
                  cursor: 'pointer',
                }}
              />
            </Popover>
          )}
          {molecule?.invisible ? (
            <MinusCircleOutlined
              style={{
                color: 'dimgray',
                position: 'absolute',
                right: '-6px',
                bottom: 34 - viewHeight + 'px',
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
                bottom: 34 - viewHeight + 'px',
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
