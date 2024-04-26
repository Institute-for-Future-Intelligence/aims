/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Euler, Matrix4, Vector3 } from 'three';
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
  INDIVIDUAL_MOLECULE_STYLE_LABELS,
  MATERIAL_LABELS,
  MolecularViewerColoring,
  MolecularViewerMaterial,
  MolecularViewerStyle,
} from '../../view/displayOptions';
import { SpaceshipDisplayMode } from '../../constants.ts';
import { useRefStore } from '../../stores/commonRef.ts';
import { Util } from '../../Util.ts';
import { Molecule } from '../../models/Molecule.ts';
import { useDataStore } from '../../stores/commonData.ts';
import { isCartoon } from '../../view/moleculeTools.ts';
import { Restraint } from '../../models/Restraint.ts';

export const TranslateLigand = () => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);
  const logAction = useStore(Selector.logAction);
  const updateViewer = usePrimitiveStore(Selector.updateViewer);
  const pickedIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const molecularContainer = useStore(Selector.molecularContainer);
  const ligand = useStore(Selector.ligand);
  const ligandTransform = useStore(Selector.ligandTransform);
  const step = useStore(Selector.translationStep);

  const postTranslateLigand = () => {
    updateViewer();
    if (loggable) logAction('Translate Ligand');
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
  const pickedIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const updateViewer = usePrimitiveStore(Selector.updateViewer);
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
      if (state.loggable) state.logAction('Rotate Ligand');
    });
    updateViewer();
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
  const updateViewer = usePrimitiveStore(Selector.updateViewer);
  const pickedIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const molecularContainer = useStore(Selector.molecularContainer);
  const moleculesRef = useRefStore.getState().moleculesRef;

  const [updateFlag, setUpdateFlag] = useState<boolean>(false);

  const center = useMemo(() => {
    if (moleculesRef?.current && pickedIndex >= 0) {
      const m = moleculesRef.current[pickedIndex];
      m.updateCenter();
      return m.center;
    }
    return new Vector3();
  }, [moleculesRef, pickedIndex, updateFlag]);

  const translateSelectedMolecule = (displacement: Vector3) => {
    if (pickedIndex === -1 || !moleculesRef?.current) return;
    const m = moleculesRef.current[pickedIndex];
    if (m) {
      for (const a of m.atoms) {
        a.position.add(displacement);
      }
      setCommonStore((state) => {
        const mol = state.projectState.testMolecules[pickedIndex];
        if (mol) {
          for (const a of mol.atoms) {
            a.position.x += displacement.x;
            a.position.y += displacement.y;
            a.position.z += displacement.z;
          }
        }
        if (state.loggable) state.logAction('Translate Selected Molecule');
      });
      setUpdateFlag(!updateFlag);
      updateViewer();
    }
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
          // make sure that we round up the number as calculation may cause things like .999999999
          value={parseFloat(center.x.toFixed(1))}
          step={0.1}
          precision={1}
          onChange={(value) => {
            if (value === null) return;
            translateSelectedMolecule(new Vector3(value - center.x, 0, 0));
          }}
        />
        <InputNumber
          style={{ width: '140px' }}
          addonBefore={'Y'}
          addonAfter={'Å'}
          min={-molecularContainer.ly / 2}
          max={molecularContainer.ly / 2}
          // make sure that we round up the number as calculation may cause things like .999999999
          value={parseFloat(center.y.toFixed(1))}
          step={0.1}
          precision={1}
          onChange={(value) => {
            if (value === null) return;
            translateSelectedMolecule(new Vector3(0, value - center.y, 0));
          }}
        />
        <InputNumber
          style={{ width: '140px' }}
          addonBefore={'Z'}
          addonAfter={'Å'}
          min={-molecularContainer.lz / 2}
          max={molecularContainer.lz / 2}
          // make sure that we round up the number as calculation may cause things like .999999999
          value={parseFloat(center.z.toFixed(1))}
          step={0.1}
          precision={1}
          onChange={(value) => {
            if (value === null) return;
            translateSelectedMolecule(new Vector3(0, 0, value - center.z));
          }}
        />
      </Space>
    )
  );
};

export const RotateMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const updateViewer = usePrimitiveStore(Selector.updateViewer);
  const pickedIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const moleculesRef = useRefStore.getState().moleculesRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const rotateSelectedMolecule = (axis: string, degrees: number) => {
    if (pickedIndex === -1 || !moleculesRef?.current) return;
    const m = moleculesRef.current[pickedIndex];
    if (m) {
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
      m.updateCenter();
      for (const a of m.atoms) {
        const p = a.position.clone().sub(m.center).applyMatrix4(matrix);
        a.position.copy(p).add(m.center);
      }
      setCommonStore((state) => {
        const mol = state.projectState.testMolecules[pickedIndex];
        if (mol) {
          for (const [i, a] of mol.atoms.entries()) {
            a.position.x = m.atoms[i].position.x;
            a.position.y = m.atoms[i].position.y;
            a.position.z = m.atoms[i].position.z;
          }
        }
        if (state.loggable) state.logAction('Rotate Selected Molecule');
      });
      updateViewer();
    }
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
      </Space>
    )
  );
};

export const CutMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const testMolecules = useStore(Selector.testMolecules);

  const { t } = useTranslation();
  const lang = useLanguage();

  const cutSelectedMolecule = () => {
    const pickedMoleculeIndex = usePrimitiveStore.getState().pickedMoleculeIndex;
    if (pickedMoleculeIndex === -1) return;
    usePrimitiveStore.getState().set((state) => {
      const m = testMolecules[pickedMoleculeIndex];
      state.cutMolecule = Molecule.clone(m);
      state.pickedMoleculeIndex = -1;
      state.copiedMoleculeIndex = -1;
    });
    setCommonStore((state) => {
      state.projectState.testMolecules.splice(pickedMoleculeIndex, 1);
      if (state.loggable) state.logAction('Cut Selected Molecule');
    });
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false} onClick={cutSelectedMolecule}>
      {t('word.Cut', lang)}
    </MenuItem>
  );
};

export const CopyMolecule = () => {
  const loggable = useStore(Selector.loggable);
  const logAction = useStore(Selector.logAction);

  const { t } = useTranslation();
  const lang = useLanguage();

  const copySelectedMolecule = () => {
    const pickedMoleculeIndex = usePrimitiveStore.getState().pickedMoleculeIndex;
    if (pickedMoleculeIndex === -1) return;
    usePrimitiveStore.getState().set((state) => {
      state.copiedMoleculeIndex = state.pickedMoleculeIndex;
      state.cutMolecule = null;
    });
    if (loggable) logAction('Copy Selected Molecule');
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false} onClick={copySelectedMolecule}>
      {t('word.Copy', lang)}
    </MenuItem>
  );
};

export const PasteMolecule = () => {
  const setCommonStore = useStore(Selector.set);
  const testMolecules = useStore(Selector.testMolecules);
  const copiedMoleculeIndex = usePrimitiveStore(Selector.copiedMoleculeIndex);
  const cutMolecule = usePrimitiveStore(Selector.cutMolecule);
  const clickPointRef = useRefStore.getState().clickPointRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const pasteSelectedMolecule = () => {
    const p = clickPointRef?.current;
    if (!p) return;
    if (copiedMoleculeIndex !== -1) {
      setCommonStore((state) => {
        const m = Molecule.clone(testMolecules[copiedMoleculeIndex]);
        m.setCenter(p);
        state.projectState.testMolecules.push(m);
        if (state.loggable) state.logAction('Paste Copied Molecule');
      });
    } else if (cutMolecule) {
      setCommonStore((state) => {
        const m = Molecule.clone(cutMolecule);
        m.setCenter(p);
        state.projectState.testMolecules.push(m);
        if (state.loggable) state.logAction('Paste Cut Molecule');
      });
    }
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={true} onClick={pasteSelectedMolecule}>
      {t('word.Paste', lang) +
        (cutMolecule
          ? ' ' + cutMolecule.name
          : copiedMoleculeIndex !== -1
            ? ' ' + testMolecules[copiedMoleculeIndex]?.name
            : '')}
    </MenuItem>
  );
};

export const RestrainMoleculeInputField = () => {
  const setCommonStore = useStore(Selector.set);
  const testMolecules = useStore(Selector.testMolecules);
  const pickedIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const moleculesRef = useRefStore.getState().moleculesRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const [value, setValue] = useState<number>(0);

  const restraint = useMemo(() => {
    if (pickedIndex !== -1) return testMolecules[pickedIndex].atoms[0].restraint;
    return null;
  }, [pickedIndex, testMolecules]);

  useEffect(() => {
    setValue(restraint?.strength ?? 0);
  }, [restraint]);

  const setRestraint = (value: number) => {
    const mol = moleculesRef?.current ? moleculesRef.current[pickedIndex] : null;
    if (restraint) {
      if (value > 0) {
        setCommonStore((state) => {
          if (mol === null) return;
          const testMolecule = state.projectState.testMolecules[pickedIndex];
          if (testMolecule) {
            for (let i = 0; i < testMolecule.atoms.length; i++) {
              if (testMolecule.atoms[i].restraint) (testMolecule.atoms[i].restraint as Restraint).strength = value;
              if (mol.atoms[i].restraint) (mol.atoms[i].restraint as Restraint).strength = value;
            }
          }
        });
      } else {
        setCommonStore((state) => {
          if (mol === null) return;
          const testMolecule = state.projectState.testMolecules[pickedIndex];
          if (testMolecule) {
            for (let i = 0; i < testMolecule.atoms.length; i++) {
              testMolecule.atoms[i].restraint = undefined;
              mol.atoms[i].restraint = undefined;
            }
          }
        });
      }
    } else {
      setCommonStore((state) => {
        if (mol === null) return;
        const testMolecule = state.projectState.testMolecules[pickedIndex];
        if (testMolecule) {
          for (let i = 0; i < testMolecule.atoms.length; i++) {
            const r = new Restraint(value, mol.atoms[i].position.clone());
            testMolecule.atoms[i].restraint = r;
            mol.atoms[i].restraint = r;
          }
        }
      });
    }
  };

  return (
    <MenuItem stayAfterClick={true}>
      <span style={{ paddingRight: '10px' }}>{t('experiment.Restraint', lang) + ': '}</span>
      <InputNumber
        addonAfter={'eV/Å²'}
        min={0}
        max={100}
        precision={2}
        // make sure that we round up the number as toDegrees may cause things like .999999999
        value={parseFloat(value.toFixed(2))}
        step={0.01}
        onChange={(s) => {
          if (s === null) return;
          setValue(s);
          setRestraint(s);
        }}
      />
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
        style={{ width: '100%' }}
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
  const loggable = useStore.getState().loggable;
  const logAction = useStore.getState().logAction;
  const { t } = useTranslation();
  const lang = useLanguage();

  const takeScreenshot = () => {
    screenshot('reaction-chamber')
      .then(() => {
        if (loggable) logAction('Take Screenshot of Reaction Chamber');
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
        style={{ width: '100%' }}
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
        style={{ width: '100%' }}
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

export const TrajectoryCheckBox = () => {
  const pickedAtomIndex = usePrimitiveStore(Selector.pickedAtomIndex);
  const getAtomByIndex = useStore(Selector.getAtomByIndex);
  const updateViewer = usePrimitiveStore(Selector.updateViewer);
  const setAtomTrajectoryByIndex = useStore(Selector.setAtomTrajectoryByIndex);
  const positionTimeSeriesMap = useDataStore(Selector.positionTimeSeriesMap);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const mdRef = useRefStore.getState().molecularDynamicsRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const setTrajectory = (checked: boolean) => {
    if (pickedAtomIndex === -1) return;
    setAtomTrajectoryByIndex(pickedAtomIndex, checked);
    if (mdRef?.current) {
      mdRef.current.atoms[pickedAtomIndex].trajectory = checked;
    }
    if (positionTimeSeriesMap) {
      positionTimeSeriesMap.delete(pickedAtomIndex);
      updateViewer();
    }
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        style={{ width: '100%' }}
        checked={!!getAtomByIndex(pickedAtomIndex)?.trajectory}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Trajectory',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              setTrajectory(!undoableCheck.checked);
            },
            redo: () => {
              setTrajectory(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          setTrajectory(checked);
        }}
      >
        {t('molecularViewer.Trajectory', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const FixAtomCheckBox = () => {
  const updateViewer = usePrimitiveStore(Selector.updateViewer);
  const getAtomByIndex = useStore(Selector.getAtomByIndex);
  const fixAtomByIndex = useStore(Selector.fixAtomByIndex);
  const pickedAtomIndex = usePrimitiveStore(Selector.pickedAtomIndex);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const mdRef = useRefStore.getState().molecularDynamicsRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const setFixed = (checked: boolean) => {
    if (pickedAtomIndex !== -1) {
      fixAtomByIndex(pickedAtomIndex, checked);
      setChanged(true);
      if (mdRef?.current) {
        mdRef.current.atoms[pickedAtomIndex].fixed = checked;
      }
      updateViewer();
    }
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        style={{ width: '100%' }}
        checked={!!getAtomByIndex(pickedAtomIndex)?.fixed}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Fix Picked Atom',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              setFixed(!undoableCheck.checked);
            },
            redo: () => {
              setFixed(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          setFixed(checked);
        }}
      >
        {t('experiment.FixAtom', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const RestrainAtomInputField = () => {
  const getAtomByIndex = useStore(Selector.getAtomByIndex);
  const restrainAtomByIndex = useStore(Selector.restrainAtomByIndex);
  const pickedIndex = usePrimitiveStore(Selector.pickedAtomIndex);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const updateViewer = usePrimitiveStore(Selector.updateViewer);
  const mdRef = useRefStore.getState().molecularDynamicsRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const [value, setValue] = useState<number>(0);

  const restraint = useMemo(() => {
    if (pickedIndex !== -1) {
      const a = getAtomByIndex(pickedIndex);
      if (a) return a.restraint;
    }
    return null;
  }, [pickedIndex]);

  useEffect(() => {
    setValue(restraint?.strength ?? 0);
  }, [restraint]);

  const setStrength = (strength: number) => {
    if (pickedIndex !== -1) {
      restrainAtomByIndex(pickedIndex, strength);
      setChanged(true);
      if (mdRef?.current) {
        const a = mdRef.current.atoms[pickedIndex];
        if (a) {
          if (a.restraint) {
            if (strength > 0) {
              a.restraint.strength = strength;
            } else {
              a.restraint = undefined;
            }
          } else {
            if (strength > 0) {
              a.restraint = new Restraint(strength, a.position.clone());
            }
          }
        }
      }
      updateViewer();
    }
  };

  return (
    <MenuItem stayAfterClick={true} hasPadding={true}>
      <span style={{ paddingRight: '10px' }}>{t('experiment.Restraint', lang) + ': '}</span>
      <InputNumber
        addonAfter={'eV/Å²'}
        min={0}
        max={100}
        precision={2}
        // make sure that we round up the number as toDegrees may cause things like .999999999
        value={parseFloat(value.toFixed(2))}
        step={0.01}
        onChange={(s) => {
          if (s === null) return;
          setValue(s);
          setStrength(s);
        }}
      />
    </MenuItem>
  );
};

export const VdwBondsCheckBox = () => {
  const visible = useStore(Selector.vdwBondsVisible);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setVisible = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.vdwBondsVisible = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        style={{ width: '100%' }}
        checked={visible}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Van der Waals Bonds',
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
        {t('molecularViewer.VanDerWaalsBonds', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const AngularBondsCheckBox = () => {
  const visible = useStore(Selector.angularBondsVisible);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setVisible = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.angularBondsVisible = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        style={{ width: '100%' }}
        checked={visible}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Angular Bonds',
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
        {t('molecularViewer.AngularBonds', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const TorsionalBondsCheckBox = () => {
  const visible = useStore(Selector.torsionalBondsVisible);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setVisible = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.torsionalBondsVisible = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        style={{ width: '100%' }}
        checked={visible}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Torsional Bonds',
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
        {t('molecularViewer.TorsionalBonds', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const MomentumVectorCheckBox = () => {
  const visible = useStore(Selector.momentumVisible);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setVisible = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.momentumVisible = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        style={{ width: '100%' }}
        checked={visible}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Momentum Vectors',
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
        {t('molecularViewer.MomentumVectors', lang)}
      </Checkbox>
    </MenuItem>
  );
};

export const ForceVectorCheckBox = () => {
  const visible = useStore(Selector.forceVisible);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setVisible = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.forceVisible = checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        style={{ width: '100%' }}
        checked={visible}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show Force Vectors',
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
        {t('molecularViewer.ForceVectors', lang)}
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
        style={{ width: '100%' }}
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

export const GalleryCheckBox = () => {
  const hideGallery = useStore(Selector.hideGallery);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const showGallery = (checked: boolean) => {
    useStore.getState().set((state) => {
      state.projectState.hideGallery = !checked;
    });
    setChanged(true);
  };

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Checkbox
        style={{ width: '100%' }}
        checked={!hideGallery}
        onChange={(e: CheckboxChangeEvent) => {
          const checked = e.target.checked;
          const undoableCheck = {
            name: 'Show/Hide Gallery',
            timestamp: Date.now(),
            checked: checked,
            undo: () => {
              showGallery(!undoableCheck.checked);
            },
            redo: () => {
              showGallery(undoableCheck.checked);
            },
          } as UndoableCheck;
          useStore.getState().addUndoable(undoableCheck);
          showGallery(checked);
        }}
      >
        {t('menu.view.ShowGallery', lang)}
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

export const IndividualMoleculeStyleRadioGroup = () => {
  const testMolecules = useStore(Selector.testMolecules);
  const molecularViewerStyle = useStore(Selector.chamberViewerStyle);
  const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setStyle = (style: MolecularViewerStyle) => {
    useStore.getState().set((state) => {
      if (pickedMoleculeIndex !== -1) {
        state.projectState.testMolecules[pickedMoleculeIndex].style = style;
      }
    });
    usePrimitiveStore.getState().updateViewer();
    setChanged(true);
  };

  const multipleResidues = useMemo(() => {
    return !!testMolecules[pickedMoleculeIndex]?.multipleResidues;
  }, [testMolecules, pickedMoleculeIndex]);

  return (
    <MenuItem stayAfterClick={false} hasPadding={false}>
      <Radio.Group
        value={testMolecules[pickedMoleculeIndex]?.style ?? molecularViewerStyle}
        onChange={(e: RadioChangeEvent) => {
          const oldValue = molecularViewerStyle;
          const newValue = e.target.value;
          const undoableChange = {
            name: 'Select Style for Selected Molecule',
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
          {INDIVIDUAL_MOLECULE_STYLE_LABELS.map((radio, idx) => {
            if (!multipleResidues && isCartoon(radio.value)) return null;
            return (
              <Radio key={`${idx}-${radio.value}`} value={radio.value} style={{ width: '100%' }}>
                {t(radio.label, lang)}
              </Radio>
            );
          })}
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};

export const GlobalStyleRadioGroup = () => {
  const testMolecules = useStore(Selector.testMolecules);
  const molecularViewerStyle = useStore(Selector.chamberViewerStyle);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const { t } = useTranslation();
  const lang = useLanguage();

  const setStyle = (style: MolecularViewerStyle) => {
    useStore.getState().set((state) => {
      state.projectState.chamberViewerStyle = style;
      for (const m of state.projectState.testMolecules) {
        m.style = style;
      }
    });
    setChanged(true);
  };

  const multipleResidues = useMemo(() => {
    for (const m of testMolecules) {
      if (m.multipleResidues) return true;
    }
    return false;
  }, [testMolecules]);

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
          {CHAMBER_STYLE_LABELS.map((radio, idx) => {
            if (!multipleResidues && isCartoon(radio.value)) return null;
            return (
              <Radio key={`${idx}-${radio.value}`} value={radio.value} style={{ width: '100%' }}>
                {t(radio.label, lang)}
              </Radio>
            );
          })}
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
            <Radio key={`${idx}-${radio.value}`} value={radio.value} style={{ width: '100%' }}>
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
            <Radio key={`${idx}-${radio.value}`} value={radio.value} style={{ width: '100%' }}>
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
          <Radio key={SpaceshipDisplayMode.NONE} value={SpaceshipDisplayMode.NONE} style={{ width: '100%' }}>
            {t('word.None', lang)}
          </Radio>
          <Radio
            key={SpaceshipDisplayMode.OUTSIDE_VIEW}
            value={SpaceshipDisplayMode.OUTSIDE_VIEW}
            style={{ width: '100%' }}
          >
            {t('spaceship.OutsideView', lang)}
          </Radio>
          <Radio
            key={SpaceshipDisplayMode.INSIDE_VIEW}
            value={SpaceshipDisplayMode.INSIDE_VIEW}
            style={{ width: '100%' }}
          >
            {t('spaceship.InsideView', lang)}
          </Radio>
        </Space>
      </Radio.Group>
    </MenuItem>
  );
};
