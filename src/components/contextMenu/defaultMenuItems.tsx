/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { Euler, Matrix4 } from 'three';
import { useStore } from '../../stores/common';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks';
import { Button, Checkbox, ColorPicker, InputNumber, Radio, RadioChangeEvent, Space } from 'antd';
import { UndoableChange } from '../../undo/UndoableChange';
import { LabelMark, MenuItem } from '../menuItem';
import { UndoableCheck } from '../../undo/UndoableCheck';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { screenshot, showError } from '../../helpers';
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
import {
  CHAMBER_COLORING_LABELS,
  CHAMBER_STYLE_LABELS,
  MATERIAL_LABELS,
  MolecularViewerColoring,
  MolecularViewerMaterial,
  MolecularViewerStyle,
} from '../../view/displayOptions';
import { SpaceshipDisplayMode } from '../../constants.ts';
import { useRefStore } from '../../stores/commonRef.ts';
import { MoleculeTransform } from '../../types.ts';
import { Util } from '../../Util.ts';
import { ModelUtil } from '../../models/ModelUtil.ts';

export const TranslateLigand = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);
  const pickedIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const molecularContainer = useStore(Selector.molecularContainer);
  const ligand = useStore(Selector.ligand);
  const ligandTransform = useStore(Selector.ligandTransform);
  const step = useStore(Selector.translationStep);

  const postTranslateLigand = () => {
    usePrimitiveStore.getState().set((state) => {
      state.updateViewerFlag = !state.updateViewerFlag;
    });
    setCommonStore((state) => {
      if (loggable) {
        state.actionInfo = {
          name: 'Translate Ligand',
          timestamp: new Date().getTime(),
        };
      }
    });
  };

  return (
    pickedIndex !== -1 &&
    ligand && (
      <Space direction={'vertical'} onClick={(e) => e.stopPropagation()}>
        <InputNumber
          style={{ width: '140px' }}
          addonBefore={'X'}
          addonAfter={'Å'}
          min={-molecularContainer.lx / 2}
          max={molecularContainer.lx / 2}
          value={ligandTransform.x}
          step={step}
          precision={1}
          onChange={(value) => {
            if (value === null) return;
            if (pickedIndex === -1 || !ligand) return;
            const displacement = value - ligandTransform.x;
            setCommonStore((state) => {
              state.projectState.ligandTransform.x += displacement;
            });
            postTranslateLigand();
          }}
        />
        <InputNumber
          style={{ width: '140px' }}
          addonBefore={'Y'}
          addonAfter={'Å'}
          min={-molecularContainer.ly / 2}
          max={molecularContainer.ly / 2}
          value={ligandTransform.y}
          step={step}
          precision={1}
          onChange={(value) => {
            if (value === null) return;
            if (pickedIndex === -1 || !ligand) return;
            const displacement = value - ligandTransform.y;
            setCommonStore((state) => {
              state.projectState.ligandTransform.y += displacement;
              postTranslateLigand();
            });
          }}
        />
        <InputNumber
          style={{ width: '140px' }}
          addonBefore={'Z'}
          addonAfter={'Å'}
          min={-molecularContainer.lz / 2}
          max={molecularContainer.lz / 2}
          value={ligandTransform.z}
          step={step}
          precision={1}
          onChange={(value) => {
            if (value === null) return;
            if (pickedIndex === -1 || !ligand) return;
            const displacement = value - ligandTransform.z;
            setCommonStore((state) => {
              state.projectState.ligandTransform.z += displacement;
              postTranslateLigand();
            });
          }}
        />
      </Space>
    )
  );
};

export const RotateLigand = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);
  const pickedIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const ligand = useStore(Selector.ligand);
  const ligandTransform = useStore(Selector.ligandTransform);
  const step = Util.toDegrees(useStore(Selector.rotationStep)) ?? 5;

  const { t } = useTranslation();
  const lang = useLanguage();

  const euler = useMemo(() => {
    if (pickedIndex === -1) return new Euler();
    const angles = ligandTransform.euler;
    if (!angles || angles.length !== 3) return new Euler();
    return new Euler(angles[0], angles[1], angles[2]);
  }, [ligandTransform, pickedIndex]);

  const rotateLigand = (axis: string, degrees: number) => {
    if (pickedIndex !== 1 || !ligand) return;
    let matrix: Matrix4;
    switch (axis) {
      case 'x':
        matrix = new Matrix4().makeRotationX(Util.toRadians(degrees));
        break;
      case 'y':
        matrix = new Matrix4().makeRotationY(Util.toRadians(degrees));
        break;
      default:
        matrix = new Matrix4().makeRotationZ(Util.toRadians(degrees));
        break;
    }
    setCommonStore((state) => {
      if (pickedIndex !== 1) return;
      const m = state.projectState.ligandTransform;
      if (m) {
        matrix.multiply(new Matrix4().makeRotationFromEuler(euler));
        const angle = new Euler().setFromRotationMatrix(matrix);
        m.euler = [angle.x, angle.y, angle.z];
      }
      if (loggable) {
        state.actionInfo = {
          name: 'Rotate Ligand',
          timestamp: new Date().getTime(),
        };
      }
    });
    usePrimitiveStore.getState().set((state) => {
      state.updateViewerFlag = !state.updateViewerFlag;
    });
  };

  return (
    pickedIndex !== -1 && (
      <Space direction={'vertical'} onClick={(e) => e.stopPropagation()}>
        <Space direction={'horizontal'}>
          <span>{t('molecularViewer.AboutXAxis', lang) + ':'}</span>
          <Button onClick={() => rotateLigand('x', step)}>
            <RotateLeftOutlined />
          </Button>
          <Button onClick={() => rotateLigand('x', -step)}>
            <RotateRightOutlined />
          </Button>
        </Space>
        <Space direction={'horizontal'}>
          <span>{t('molecularViewer.AboutYAxis', lang) + ':'}</span>
          <Button onClick={() => rotateLigand('y', step)}>
            <RotateLeftOutlined />
          </Button>
          <Button onClick={() => rotateLigand('y', -step)}>
            <RotateRightOutlined />
          </Button>
        </Space>
        <Space direction={'horizontal'}>
          <span>{t('molecularViewer.AboutZAxis', lang) + ':'}</span>
          <Button onClick={() => rotateLigand('z', step)}>
            <RotateLeftOutlined />
          </Button>
          <Button onClick={() => rotateLigand('z', -step)}>
            <RotateRightOutlined />
          </Button>
        </Space>
        <hr style={{ marginTop: '6px' }} />
        <Space direction={'horizontal'}>
          {t('molecularViewer.EulerAngle', lang) + ' (XYZ ' + t('molecularViewer.Order', lang) + '):'}
        </Space>
        <Space>
          {'(' + Util.toDegrees(euler.x).toFixed(0) + '°, '}
          {Util.toDegrees(euler.y).toFixed(0) + '°, '}
          {Util.toDegrees(euler.z).toFixed(0) + '°)'}
        </Space>
      </Space>
    )
  );
};

export const TranslateMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);
  const pickedIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const testMoleculeTransforms = useStore(Selector.testMoleculeTransforms);
  const molecularContainer = useStore(Selector.molecularContainer);
  const moleculesRef = useRefStore.getState().moleculesRef;

  const postTranslateSelectedMolecule = () => {
    usePrimitiveStore.getState().set((state) => {
      state.updateViewerFlag = !state.updateViewerFlag;
    });
    setCommonStore((state) => {
      if (loggable) {
        state.actionInfo = {
          name: 'Translate Selected Molecule',
          timestamp: new Date().getTime(),
        };
      }
    });
  };

  return (
    pickedIndex !== -1 && (
      <Space direction={'vertical'} onClick={(e) => e.stopPropagation()}>
        <InputNumber
          style={{ width: '140px' }}
          addonBefore={'X'}
          addonAfter={'Å'}
          min={-molecularContainer.lx / 2}
          max={molecularContainer.lx / 2}
          value={testMoleculeTransforms[pickedIndex].x}
          step={0.1}
          precision={1}
          onChange={(value) => {
            if (value === null) return;
            if (pickedIndex === -1 || !moleculesRef?.current) return;
            const displacement = value - testMoleculeTransforms[pickedIndex].x;
            for (const [i, m] of moleculesRef.current.entries()) {
              if (i === pickedIndex) {
                for (const a of m.atoms) {
                  a.position.x += displacement;
                }
                break;
              }
            }
            setCommonStore((state) => {
              if (pickedIndex === -1) return;
              const m = state.projectState.testMoleculeTransforms[pickedIndex];
              if (m) m.x += displacement;
            });
            postTranslateSelectedMolecule();
          }}
        />
        <InputNumber
          style={{ width: '140px' }}
          addonBefore={'Y'}
          addonAfter={'Å'}
          min={-molecularContainer.ly / 2}
          max={molecularContainer.ly / 2}
          value={testMoleculeTransforms[pickedIndex].y}
          step={0.1}
          precision={1}
          onChange={(value) => {
            if (value === null) return;
            if (pickedIndex === -1 || !moleculesRef?.current) return;
            const displacement = value - testMoleculeTransforms[pickedIndex].y;
            for (const [i, m] of moleculesRef.current.entries()) {
              if (i === pickedIndex) {
                for (const a of m.atoms) {
                  a.position.y += displacement;
                }
                break;
              }
            }
            setCommonStore((state) => {
              if (pickedIndex === -1) return;
              const m = state.projectState.testMoleculeTransforms[pickedIndex];
              if (m) m.y += displacement;
            });
            postTranslateSelectedMolecule();
          }}
        />
        <InputNumber
          style={{ width: '140px' }}
          addonBefore={'Z'}
          addonAfter={'Å'}
          min={-molecularContainer.lz / 2}
          max={molecularContainer.lz / 2}
          value={testMoleculeTransforms[pickedIndex].z}
          step={0.1}
          precision={1}
          onChange={(value) => {
            if (value === null) return;
            if (pickedIndex === -1 || !moleculesRef?.current) return;
            const displacement = value - testMoleculeTransforms[pickedIndex].z;
            for (const [i, m] of moleculesRef.current.entries()) {
              if (i === pickedIndex) {
                for (const a of m.atoms) {
                  a.position.z += displacement;
                }
                break;
              }
            }
            setCommonStore((state) => {
              if (pickedIndex === -1) return;
              const m = state.projectState.testMoleculeTransforms[pickedIndex];
              if (m) m.z += displacement;
            });
            postTranslateSelectedMolecule();
          }}
        />
      </Space>
    )
  );
};

export const RotateMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);
  const pickedIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const testMoleculeTransforms = useStore(Selector.testMoleculeTransforms);
  const moleculesRef = useRefStore.getState().moleculesRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const euler = useMemo(() => {
    if (pickedIndex === -1) return new Euler();
    const angles = testMoleculeTransforms[pickedIndex].euler;
    if (!angles || angles.length !== 3) return new Euler();
    return new Euler(angles[0], angles[1], angles[2]);
  }, [testMoleculeTransforms, pickedIndex]);

  const rotateSelectedMolecule = (axis: string, degrees: number) => {
    if (pickedIndex === -1 || !moleculesRef?.current) return;
    let matrix: Matrix4;
    switch (axis) {
      case 'x':
        matrix = new Matrix4().makeRotationX(Util.toRadians(degrees));
        break;
      case 'y':
        matrix = new Matrix4().makeRotationY(Util.toRadians(degrees));
        break;
      default:
        matrix = new Matrix4().makeRotationZ(Util.toRadians(degrees));
        break;
    }
    for (const [i, m] of moleculesRef.current.entries()) {
      if (i === pickedIndex) {
        const c = ModelUtil.getMoleculeCenter(m);
        for (const a of m.atoms) {
          const p = a.position.clone().sub(c).applyMatrix4(matrix);
          a.position.copy(p).add(c);
        }
        break;
      }
    }
    setCommonStore((state) => {
      if (pickedIndex === -1) return;
      const m = state.projectState.testMoleculeTransforms[pickedIndex];
      if (m) {
        matrix.multiply(new Matrix4().makeRotationFromEuler(euler));
        const angle = new Euler().setFromRotationMatrix(matrix);
        m.euler = [angle.x, angle.y, angle.z];
      }
      if (loggable) {
        state.actionInfo = {
          name: 'Rotate Selected Molecule',
          timestamp: new Date().getTime(),
        };
      }
    });
    usePrimitiveStore.getState().set((state) => {
      state.updateViewerFlag = !state.updateViewerFlag;
    });
  };

  return (
    pickedIndex !== -1 && (
      <Space direction={'vertical'} onClick={(e) => e.stopPropagation()}>
        <Space direction={'horizontal'}>
          <span>{t('molecularViewer.AboutXAxis', lang) + ':'}</span>
          <Button onClick={() => rotateSelectedMolecule('x', 5)}>
            <RotateLeftOutlined />
          </Button>
          <Button onClick={() => rotateSelectedMolecule('x', -5)}>
            <RotateRightOutlined />
          </Button>
        </Space>
        <Space direction={'horizontal'}>
          <span>{t('molecularViewer.AboutYAxis', lang) + ':'}</span>
          <Button onClick={() => rotateSelectedMolecule('y', 5)}>
            <RotateLeftOutlined />
          </Button>
          <Button onClick={() => rotateSelectedMolecule('y', -5)}>
            <RotateRightOutlined />
          </Button>
        </Space>
        <Space direction={'horizontal'}>
          <span>{t('molecularViewer.AboutZAxis', lang) + ':'}</span>
          <Button onClick={() => rotateSelectedMolecule('z', 5)}>
            <RotateLeftOutlined />
          </Button>
          <Button onClick={() => rotateSelectedMolecule('z', -5)}>
            <RotateRightOutlined />
          </Button>
        </Space>
        <hr style={{ marginTop: '6px' }} />
        <Space direction={'horizontal'}>
          {t('molecularViewer.EulerAngle', lang) + ' (XYZ ' + t('molecularViewer.Order', lang) + '):'}
        </Space>
        <Space>
          {'(' + Util.toDegrees(euler.x).toFixed(0) + '°, '}
          {Util.toDegrees(euler.y).toFixed(0) + '°, '}
          {Util.toDegrees(euler.z).toFixed(0) + '°)'}
        </Space>
      </Space>
    )
  );
};

export const CutMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);

  const { t } = useTranslation();
  const lang = useLanguage();

  const cutSelectedMolecule = () => {
    const pickedMoleculeIndex = usePrimitiveStore.getState().pickedMoleculeIndex;
    if (pickedMoleculeIndex === -1) return;
    usePrimitiveStore.getState().set((state) => {
      state.copiedMoleculeIndex = pickedMoleculeIndex;
      state.pickedMoleculeIndex = -1;
    });
    setCommonStore((state) => {
      state.projectState.testMolecules.splice(pickedMoleculeIndex, 1);
      state.projectState.testMoleculeTransforms.splice(pickedMoleculeIndex, 1);
      if (loggable) {
        state.actionInfo = {
          name: 'Cut Selected Molecule',
          timestamp: new Date().getTime(),
        };
      }
    });
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false} onClick={cutSelectedMolecule}>
      {t('word.Cut', lang)}
    </MenuItem>
  );
};

export const CopyMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);

  const { t } = useTranslation();
  const lang = useLanguage();

  const copySelectedMolecule = () => {
    const pickedMoleculeIndex = usePrimitiveStore.getState().pickedMoleculeIndex;
    if (pickedMoleculeIndex === -1) return;
    usePrimitiveStore.getState().set((state) => {
      state.copiedMoleculeIndex = state.pickedMoleculeIndex;
    });
    if (loggable) {
      setCommonStore((state) => {
        state.actionInfo = {
          name: 'Copy Selected Molecule',
          timestamp: new Date().getTime(),
        };
      });
    }
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false} onClick={copySelectedMolecule}>
      {t('word.Copy', lang)}
    </MenuItem>
  );
};

export const PasteMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);
  const testMolecules = useStore(Selector.testMolecules);
  const testMoleculeTransforms = useStore(Selector.testMoleculeTransforms);
  const copiedMoleculeIndex = usePrimitiveStore(Selector.copiedMoleculeIndex);
  const clickPointRef = useRefStore.getState().clickPointRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const pasteSelectedMolecule = () => {
    const p = clickPointRef?.current;
    if (p && copiedMoleculeIndex !== -1) {
      setCommonStore((state) => {
        const m = { ...testMolecules[copiedMoleculeIndex] };
        const t = testMoleculeTransforms[copiedMoleculeIndex];
        state.projectState.testMolecules.push(m);
        state.projectState.testMoleculeTransforms.push({
          x: p.x,
          y: p.y,
          z: p.z,
          euler: t.euler ? [...t.euler] : [0, 0, 0],
        } as MoleculeTransform);
      });
      if (loggable) {
        setCommonStore((state) => {
          state.actionInfo = {
            name: 'Paste Selected Molecule',
            timestamp: new Date().getTime(),
          };
        });
      }
    }
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={true} onClick={pasteSelectedMolecule}>
      {t('word.Paste', lang) + (copiedMoleculeIndex !== -1 ? ' ' + testMolecules[copiedMoleculeIndex]?.name : '')}
    </MenuItem>
  );
};

export const AutoRotateCheckBox = ({ isMac }: { isMac?: boolean }) => {
  const autoRotate = usePrimitiveStore(Selector.autoRotate);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setAutoRotate = (checked: boolean) => {
    usePrimitiveStore.getState().set((state) => {
      state.autoRotate = checked;
      state.changed = true;
    });
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        checked={autoRotate}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Auto Rotate',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              setAutoRotate(!undoableCheck.checked);
            },
            redo: () => {
              setAutoRotate(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          setAutoRotate(checked);
        }}
      >
        {t('menu.view.AutoRotate', lang)}
        {isMac !== undefined && <LabelMark>({isMac ? '⌘' : 'Ctrl'}+M)</LabelMark>}
      </Checkbox>
    </MenuItem>
  );
};

export const Screenshot = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore.getState().loggable;
  const { t } = useTranslation();
  const lang = useLanguage();

  const takeScreenshot = () => {
    screenshot('reaction-chamber')
      .then(() => {
        if (loggable) {
          setCommonStore((state) => {
            state.actionInfo = {
              name: 'Take Screenshot of Reaction Chamber',
              timestamp: new Date().getTime(),
            };
          });
        }
      })
      .catch((reason) => {
        showError(reason);
      });
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={true} onClick={takeScreenshot}>
      {t('molecularViewer.TakeScreenshot', lang)}
    </MenuItem>
  );
};

export const AxesCheckBox = () => {
  const axes = useStore(Selector.chamberViewerAxes);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setAxes = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerAxes = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        checked={axes}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Axes',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              setAxes(!undoableCheck.checked);
            },
            redo: () => {
              setAxes(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          setAxes(checked);
        }}
      >
        {t('molecularViewer.Axes', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const ContainerCheckBox = () => {
  const visible = useStore(Selector.molecularContainerVisible);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setVisible = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.molecularContainerVisible = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        checked={visible}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Container',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              setVisible(!undoableCheck.checked);
            },
            redo: () => {
              setVisible(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          setVisible(checked);
        }}
      >
        {t('molecularViewer.Container', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const FogCheckBox = () => {
  const foggy = useStore(Selector.chamberViewerFoggy);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setFoggy = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerFoggy = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        checked={foggy}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Fog',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              setFoggy(!undoableCheck.checked);
            },
            redo: () => {
              setFoggy(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          setFoggy(checked);
        }}
      >
        {t('molecularViewer.Fog', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const BackgroundColor = () => {
  const color = useStore(Selector.chamberViewerBackground);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setColor = (color: string) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerBackground = color;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={true}>
      <ColorPicker
        trigger={'hover'}
        value={color}
        onChange={(value, hex) => {
          const selectedColor = hex;
          const undoableChange = {
            name: 'Change Background Color',
            timestamp: Date.now(),
            oldValue: color,
            newValue: selectedColor,
            undo: () => {
              setColor(undoableChange.oldValue as string);
            },
            redo: () => {
              setColor(undoableChange.newValue as string);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setColor(selectedColor);
        }}
      >
        {t('molecularViewer.BackgroundColor', lang)}
      </ColorPicker>
    </MenuItem>
  );
};

export const StyleRadioGroup = () => {
  const molecularViewerStyle = useStore(Selector.chamberViewerStyle);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setStyle = (style: MolecularViewerStyle) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerStyle = style;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Radio.Group
        value={molecularViewerStyle}
        onChange={(e: RadioChangeEvent) => {
          const oldValue = molecularViewerStyle;
          const newValue = e.target.value;
          const undoableChange = {
            name: 'Select Molecular Viewer Style',
            timestamp: Date.now(),
            oldValue: oldValue,
            newValue: newValue,
            undo: () => {
              setStyle(undoableChange.oldValue as MolecularViewerStyle);
            },
            redo: () => {
              setStyle(undoableChange.newValue as MolecularViewerStyle);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setStyle(newValue);
        }}
      >
        <Space direction="vertical">
          {CHAMBER_STYLE_LABELS.map((radio, idx) => (
            <Radio key={`${idx}-${radio.value}`} value={radio.value}>
              {t(radio.label, lang)}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};

export const MaterialRadioGroup = () => {
  const molecularViewerMaterial = useStore(Selector.chamberViewerMaterial);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setMaterial = (material: MolecularViewerMaterial) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerMaterial = material;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Radio.Group
        value={molecularViewerMaterial}
        onChange={(e: RadioChangeEvent) => {
          const oldValue = molecularViewerMaterial;
          const newValue = e.target.value;
          const undoableChange = {
            name: 'Select Molecular Viewer Material',
            timestamp: Date.now(),
            oldValue: oldValue,
            newValue: newValue,
            undo: () => {
              setMaterial(undoableChange.oldValue as MolecularViewerMaterial);
            },
            redo: () => {
              setMaterial(undoableChange.newValue as MolecularViewerMaterial);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setMaterial(newValue);
        }}
      >
        <Space direction="vertical">
          {MATERIAL_LABELS.map((radio, idx) => (
            <Radio key={`${idx}-${radio.value}`} value={radio.value}>
              {t(radio.label, lang)}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};

export const ColoringRadioGroup = () => {
  const molecularViewerColoring = useStore(Selector.chamberViewerColoring);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setColoring = (coloring: MolecularViewerColoring) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerColoring = coloring;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Radio.Group
        value={molecularViewerColoring}
        onChange={(e: RadioChangeEvent) => {
          const oldValue = molecularViewerColoring;
          const newValue = e.target.value;
          const undoableChange = {
            name: 'Select Molecular Viewer Coloring',
            timestamp: Date.now(),
            oldValue: oldValue,
            newValue: newValue,
            undo: () => {
              setColoring(undoableChange.oldValue as MolecularViewerColoring);
            },
            redo: () => {
              setColoring(undoableChange.newValue as MolecularViewerColoring);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setColoring(newValue);
        }}
      >
        <Space direction="vertical">
          {CHAMBER_COLORING_LABELS.map((radio, idx) => (
            <Radio key={`${idx}-${radio.value}`} value={radio.value}>
              {t(radio.label, lang)}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};

export const SpaceshipDisplayModeRadioGroup = () => {
  const mode = useStore(Selector.spaceshipDisplayMode) ?? SpaceshipDisplayMode.NONE;
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setMode = (mode: SpaceshipDisplayMode) => {
    useStore.getState().set((state) => {
      state.projectState.spaceshipDisplayMode = mode;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Radio.Group
        value={mode}
        onChange={(e: RadioChangeEvent) => {
          const oldValue = mode;
          const newValue = e.target.value;
          const undoableChange = {
            name: 'Select Spaceship Mode',
            timestamp: Date.now(),
            oldValue: oldValue,
            newValue: newValue,
            undo: () => {
              setMode(undoableChange.oldValue as SpaceshipDisplayMode);
            },
            redo: () => {
              setMode(undoableChange.newValue as SpaceshipDisplayMode);
            },
          } as UndoableChange;
          useStore.getState().addUndoable(undoableChange);
          setMode(newValue);
        }}
      >
        <Space direction="vertical">
          <Radio key={SpaceshipDisplayMode.NONE} value={SpaceshipDisplayMode.NONE}>
            {t('word.None', lang)}
          </Radio>
          <Radio key={SpaceshipDisplayMode.OUTSIDE_VIEW} value={SpaceshipDisplayMode.OUTSIDE_VIEW}>
            {t('spaceship.OutsideView', lang)}
          </Radio>
          <Radio key={SpaceshipDisplayMode.INSIDE_VIEW} value={SpaceshipDisplayMode.INSIDE_VIEW}>
            {t('spaceship.InsideView', lang)}
          </Radio>
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};
