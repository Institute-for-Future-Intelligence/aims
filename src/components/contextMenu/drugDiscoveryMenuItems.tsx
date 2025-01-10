/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { Euler, Matrix4 } from 'three';
import { useStore } from '../../stores/common';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks';
import { Button, InputNumber, Radio, RadioChangeEvent, Space } from 'antd';
import { UndoableChange } from '../../undo/UndoableChange';
import { MenuItem } from '../menuItem';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
import { SpaceshipDisplayMode } from '../../constants.ts';
import { Util } from '../../Util.ts';

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
