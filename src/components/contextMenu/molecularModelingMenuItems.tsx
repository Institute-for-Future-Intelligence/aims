/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Matrix4, Vector3 } from 'three';
import { useStore } from '../../stores/common';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks';
import { Button, Checkbox, InputNumber, Radio, RadioChangeEvent, Space } from 'antd';
import { UndoableChange } from '../../undo/UndoableChange';
import { MenuItem } from '../menuItem';
import { UndoableCheck } from '../../undo/UndoableCheck';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
import { INDIVIDUAL_MOLECULE_STYLE_LABELS, MolecularViewerStyle } from '../../view/displayOptions';
import { useRefStore } from '../../stores/commonRef.ts';
import { Util } from '../../Util.ts';
import { Molecule } from '../../models/Molecule.ts';
import { useDataStore } from '../../stores/commonData.ts';
import { isCartoon } from '../../view/moleculeTools.ts';
import { Restraint } from '../../models/Restraint.ts';

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
    <MenuItem stayAfterClick={true} hasPadding={false}>
      <InputNumber
        addonBefore={t('experiment.Restraint', lang) + ':'}
        addonAfter={'eV/Å²'}
        min={0}
        max={100}
        precision={2}
        style={{ width: '250px' }}
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

export const DampAtomInputField = () => {
  const getAtomByIndex = useStore(Selector.getAtomByIndex);
  const dampAtomByIndex = useStore(Selector.dampAtomByIndex);
  const pickedIndex = usePrimitiveStore(Selector.pickedAtomIndex);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const updateViewer = usePrimitiveStore(Selector.updateViewer);
  const mdRef = useRefStore.getState().molecularDynamicsRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const [value, setValue] = useState<number>(0);

  const damp = useMemo(() => {
    if (pickedIndex !== -1) {
      const a = getAtomByIndex(pickedIndex);
      if (a) return a.damp ?? 0;
    }
    return 0;
  }, [pickedIndex]);

  useEffect(() => {
    setValue(damp);
  }, [damp]);

  const setDamp = (damp: number) => {
    if (pickedIndex !== -1) {
      dampAtomByIndex(pickedIndex, damp);
      setChanged(true);
      if (mdRef?.current) {
        const a = mdRef.current.atoms[pickedIndex];
        if (a) a.damp = damp;
      }
      updateViewer();
    }
  };

  return (
    <MenuItem stayAfterClick={true} hasPadding={false}>
      <InputNumber
        addonBefore={t('experiment.DampingCoefficient', lang) + ':'}
        addonAfter={'eV⋅fs/Å²'}
        min={0}
        max={5}
        precision={2}
        style={{ width: '250px' }}
        // make sure that we round up the number as toDegrees may cause things like .999999999
        value={parseFloat(value.toFixed(2))}
        step={0.01}
        onChange={(s) => {
          if (s === null) return;
          setValue(s);
          setDamp(s);
        }}
      />
    </MenuItem>
  );
};

export const ChargeAtomInputField = () => {
  const getAtomByIndex = useStore(Selector.getAtomByIndex);
  const chargeAtomByIndex = useStore(Selector.chargeAtomByIndex);
  const pickedIndex = usePrimitiveStore(Selector.pickedAtomIndex);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const updateViewer = usePrimitiveStore(Selector.updateViewer);
  const mdRef = useRefStore.getState().molecularDynamicsRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const [value, setValue] = useState<number>(0);

  const charge = useMemo(() => {
    if (pickedIndex !== -1) {
      const a = getAtomByIndex(pickedIndex);
      if (a) return a.charge ?? 0;
    }
    return 0;
  }, [pickedIndex]);

  useEffect(() => {
    setValue(charge);
  }, [charge]);

  const setCharge = (charge: number) => {
    if (pickedIndex !== -1) {
      chargeAtomByIndex(pickedIndex, charge);
      setChanged(true);
      if (mdRef?.current) {
        const a = mdRef.current.atoms[pickedIndex];
        if (a) a.charge = charge;
      }
      updateViewer();
    }
  };

  return (
    <MenuItem stayAfterClick={true} hasPadding={false}>
      <InputNumber
        addonBefore={t('experiment.ElectricCharge', lang) + ':'}
        addonAfter={'e'}
        min={-5}
        max={5}
        precision={2}
        style={{ width: '250px' }}
        // make sure that we round up the number as toDegrees may cause things like .999999999
        value={parseFloat(value.toFixed(2))}
        step={0.01}
        onChange={(s) => {
          if (s === null) return;
          setValue(s);
          setCharge(s);
        }}
      />
    </MenuItem>
  );
};

export const AtomEpsilonInputField = () => {
  const getAtomByIndex = useStore(Selector.getAtomByIndex);
  const setAtomEpsilonByIndex = useStore(Selector.setAtomEpsilonByIndex);
  const pickedIndex = usePrimitiveStore(Selector.pickedAtomIndex);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const mdRef = useRefStore.getState().molecularDynamicsRef;

  const { t } = useTranslation();
  const lang = useLanguage();

  const [value, setValue] = useState<number>(0);

  const epsilon = useMemo(() => {
    if (pickedIndex !== -1) {
      const a = getAtomByIndex(pickedIndex);
      if (a) return a.epsilon ?? 0.05;
    }
    return 0;
  }, [pickedIndex]);

  useEffect(() => {
    setValue(epsilon);
  }, [epsilon]);

  const setEpsilon = (epsilon: number) => {
    if (pickedIndex !== -1) {
      setAtomEpsilonByIndex(pickedIndex, epsilon);
      setChanged(true);
      if (mdRef?.current) {
        const a = mdRef.current.atoms[pickedIndex];
        if (a) a.epsilon = epsilon;
      }
    }
  };

  return (
    <MenuItem stayAfterClick={true} hasPadding={false}>
      <InputNumber
        addonBefore={t('experiment.CohesiveEnergy', lang) + ':'}
        addonAfter={'eV'}
        min={0}
        max={5}
        precision={3}
        style={{ width: '250px' }}
        // make sure that we round up the number as toDegrees may cause things like .999999999
        value={parseFloat(value.toFixed(3))}
        step={0.01}
        onChange={(s) => {
          if (s === null) return;
          setValue(s);
          setEpsilon(s);
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
