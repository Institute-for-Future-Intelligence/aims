/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import {
  Col,
  Descriptions,
  DescriptionsProps,
  FloatButton,
  InputNumber,
  Popover,
  Row,
  Space,
  Switch,
  Tabs,
  TabsProps,
} from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { CameraOutlined, ExperimentOutlined, EyeOutlined, ProfileOutlined, RightOutlined } from '@ant-design/icons';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { useRefStore } from '../stores/commonRef.ts';
import { Undoable } from '../undo/Undoable.ts';
import ScreenshotPanel from './screenshotPanel.tsx';
import { UndoableChange } from '../undo/UndoableChange.ts';
import { SPEED_BIN_NUMBER } from '../models/physicalConstants.ts';
import { ExternalFieldType } from '../models/ExternalField.ts';
import { GravitationalField } from '../models/GravitationalField.ts';

const DynamicsSettings = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const addUndoable = useStore(Selector.addUndoable);
  const loggable = useStore.getState().loggable;
  const logAction = useStore.getState().logAction;
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const molecularContainer = useStore(Selector.molecularContainer);
  const gravitationalAcceleration = useStore(Selector.gravitationalAcceleration) ?? 0;
  const vdwBondCutoffRelative = useStore(Selector.vdwBondCutoffRelative) ?? 0.5;
  const momentumScaleFactor = useStore(Selector.momentumScaleFactor) ?? 1;
  const forceScaleFactor = useStore(Selector.forceScaleFactor) ?? 1;
  const kineticEnergyScaleFactor = useStore(Selector.kineticEnergyScaleFactor) ?? 1;
  const constantTemperature = useStore(Selector.constantTemperature) ?? false;
  const temperature = useStore(Selector.temperature) ?? 300;
  const timeStep = useStore(Selector.timeStep) ?? 0.5;
  const refreshInterval = useStore(Selector.refreshInterval) ?? 20;
  const collectInterval = useStore(Selector.collectInterval) ?? 100;
  const speedGraphBinNumber = useStore(Selector.speedGraphBinNumber) ?? SPEED_BIN_NUMBER;
  const updateInfoFlag = usePrimitiveStore(Selector.updateInfoFlag);
  const currentTemperature = usePrimitiveStore(Selector.currentTemperature);
  const hideGallery = useStore(Selector.hideGallery);

  const mdRef = useRefStore.getState().molecularDynamicsRef;

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const showGallery = (show: boolean) => {
    setCommonStore((state) => {
      state.projectState.hideGallery = !show;
      state.projectState.chamberViewerPercentWidth = show ? 50 : 100;
    });
  };

  const openGallery = () => {
    const undoable = {
      name: 'Show Gallery',
      timestamp: Date.now(),
      undo: () => showGallery(false),
      redo: () => showGallery(true),
    } as Undoable;
    addUndoable(undoable);
    showGallery(true);
    if (loggable) logAction('Show Gallery');
  };

  const changeGravitationalAcceleration = (newValue: number) => {
    const undoable = {
      name: 'Change Gravitational Acceleration',
      timestamp: Date.now(),
      oldValue: gravitationalAcceleration,
      newValue,
      undo: () => {
        setGravitationalAcceleration(undoable.oldValue as number);
      },
      redo: () => {
        setGravitationalAcceleration(undoable.newValue as number);
      },
    } as UndoableChange;
    addUndoable(undoable);
    setGravitationalAcceleration(newValue);
  };

  const setGravitationalAcceleration = (value: number) => {
    if (mdRef?.current) {
      let found = false;
      for (const f of mdRef.current.externalFields) {
        if (f.type === ExternalFieldType.Gravitational) {
          f.intensity = value;
          found = true;
          break;
        }
      }
      if (!found) {
        const f = new GravitationalField(value);
        mdRef.current.externalFields.push(f);
      }
    }
    setCommonStore((state) => {
      state.projectState.gravitationalAcceleration = value;
    });
  };

  const changeContainerLx = (newValue: number) => {
    const undoable = {
      name: 'Change Container Lx',
      timestamp: Date.now(),
      oldValue: molecularContainer.lx,
      newValue,
      undo: () => {
        setContainerLx(undoable.oldValue as number);
      },
      redo: () => {
        setContainerLx(undoable.newValue as number);
      },
    } as UndoableChange;
    addUndoable(undoable);
    setContainerLx(newValue);
  };

  const setContainerLx = (value: number) => {
    if (mdRef?.current) mdRef.current.container.lx = value;
    setCommonStore((state) => {
      state.projectState.molecularContainer.lx = value;
    });
  };

  const changeContainerLy = (newValue: number) => {
    const undoable = {
      name: 'Change Container Ly',
      timestamp: Date.now(),
      oldValue: molecularContainer.ly,
      newValue,
      undo: () => {
        setContainerLy(undoable.oldValue as number);
      },
      redo: () => {
        setContainerLy(undoable.newValue as number);
      },
    } as UndoableChange;
    addUndoable(undoable);
    setContainerLy(newValue);
  };

  const setContainerLy = (value: number) => {
    if (mdRef?.current) mdRef.current.container.ly = value;
    setCommonStore((state) => {
      state.projectState.molecularContainer.ly = value;
    });
  };

  const changeContainerLz = (newValue: number) => {
    const undoable = {
      name: 'Change Container Lz',
      timestamp: Date.now(),
      oldValue: molecularContainer.lz,
      newValue,
      undo: () => {
        setContainerLz(undoable.oldValue as number);
      },
      redo: () => {
        setContainerLz(undoable.newValue as number);
      },
    } as UndoableChange;
    addUndoable(undoable);
    setContainerLz(newValue);
  };

  const setContainerLz = (value: number) => {
    if (mdRef?.current) mdRef.current.container.lz = value;
    setCommonStore((state) => {
      state.projectState.molecularContainer.lz = value;
    });
  };

  const modelItems: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: t('experiment.Boundary', lang),
        children: (
          <div style={{ width: '360px' }} onClick={(e) => e.stopPropagation()}>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.ContainerLx', lang)}: </span>
              </Col>
              <Col span={12}>
                <InputNumber
                  addonAfter={'Å'}
                  min={10}
                  max={100}
                  style={{ width: '100%' }}
                  precision={1}
                  value={parseFloat(molecularContainer.lx.toFixed(1))}
                  step={1}
                  onChange={(value) => {
                    if (value === null) return;
                    changeContainerLx(value);
                    setChanged(true);
                    if (loggable) logAction('Set Container Lx to ' + value.toFixed(1));
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.ContainerLy', lang)}: </span>
              </Col>
              <Col span={12}>
                <InputNumber
                  addonAfter={'Å'}
                  min={10}
                  max={100}
                  style={{ width: '100%' }}
                  precision={1}
                  value={parseFloat(molecularContainer.ly.toFixed(1))}
                  step={1}
                  onChange={(value) => {
                    if (value === null) return;
                    changeContainerLy(value);
                    setChanged(true);
                    if (loggable) logAction('Set Container Ly to ' + value.toFixed(1));
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.ContainerLz', lang)}: </span>
              </Col>
              <Col span={12}>
                <InputNumber
                  addonAfter={'Å'}
                  min={2}
                  max={100}
                  style={{ width: '100%' }}
                  precision={1}
                  value={parseFloat(molecularContainer.lz.toFixed(1))}
                  step={1}
                  onChange={(value) => {
                    if (value === null) return;
                    changeContainerLz(value);
                    setChanged(true);
                    if (loggable) logAction('Set Container Lz to ' + value.toFixed(1));
                  }}
                />
              </Col>
            </Row>
          </div>
        ),
      },
      {
        key: '2',
        label: t('experiment.ExternalField', lang),
        children: (
          <div style={{ width: '360px' }} onClick={(e) => e.stopPropagation()}>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.GravitationalField', lang)}: </span>
              </Col>
              <Col span={12}>
                <InputNumber
                  addonAfter={'10¹² m/s²'}
                  min={0}
                  max={500}
                  style={{ width: '100%' }}
                  precision={0}
                  value={gravitationalAcceleration}
                  step={1}
                  onChange={(value) => {
                    if (value === null) return;
                    changeGravitationalAcceleration(value);
                    setChanged(true);
                    if (loggable) logAction('Set Gravitational Acceleration to ' + value);
                  }}
                />
              </Col>
            </Row>
          </div>
        ),
      },
    ],
    [lang, molecularContainer.lx, molecularContainer.ly, molecularContainer.lz, gravitationalAcceleration, mdRef],
  );

  const createModelSettings = useMemo(() => {
    return <Tabs defaultActiveKey="1" items={modelItems} />;
  }, [modelItems]);

  const changeVdwCutoff = (newValue: number) => {
    const undoable = {
      name: 'Change Van der Waals Bond Cutoff',
      timestamp: Date.now(),
      oldValue: vdwBondCutoffRelative,
      newValue,
      undo: () => {
        setVdwCutoff(undoable.oldValue as number);
      },
      redo: () => {
        setVdwCutoff(undoable.newValue as number);
      },
    } as UndoableChange;
    addUndoable(undoable);
    setVdwCutoff(newValue);
  };

  const setVdwCutoff = (value: number) => {
    setCommonStore((state) => {
      state.projectState.vdwBondCutoffRelative = value;
    });
  };

  const changeMomentumScaleFactor = (newValue: number) => {
    const undoable = {
      name: 'Change Momentum Scale Factor',
      timestamp: Date.now(),
      oldValue: momentumScaleFactor,
      newValue,
      undo: () => {
        setMomentumScaleFactor(undoable.oldValue as number);
      },
      redo: () => {
        setMomentumScaleFactor(undoable.newValue as number);
      },
    } as UndoableChange;
    addUndoable(undoable);
    setMomentumScaleFactor(newValue);
  };

  const setMomentumScaleFactor = (value: number) => {
    setCommonStore((state) => {
      state.projectState.momentumScaleFactor = value;
    });
  };

  const changeForceScaleFactor = (newValue: number) => {
    const undoable = {
      name: 'Change Force Scale Factor',
      timestamp: Date.now(),
      oldValue: forceScaleFactor,
      newValue,
      undo: () => {
        setForceScaleFactor(undoable.oldValue as number);
      },
      redo: () => {
        setForceScaleFactor(undoable.newValue as number);
      },
    } as UndoableChange;
    addUndoable(undoable);
    setForceScaleFactor(newValue);
  };

  const setForceScaleFactor = (value: number) => {
    setCommonStore((state) => {
      state.projectState.forceScaleFactor = value;
    });
  };

  const changeKineticEnergyScaleFactor = (newValue: number) => {
    const undoable = {
      name: 'Change Kinetic Energy Scale Factor',
      timestamp: Date.now(),
      oldValue: kineticEnergyScaleFactor,
      newValue,
      undo: () => {
        setKineticEnergyScaleFactor(undoable.oldValue as number);
      },
      redo: () => {
        setKineticEnergyScaleFactor(undoable.newValue as number);
      },
    } as UndoableChange;
    addUndoable(undoable);
    setKineticEnergyScaleFactor(newValue);
  };

  const setKineticEnergyScaleFactor = (value: number) => {
    setCommonStore((state) => {
      state.projectState.kineticEnergyScaleFactor = value;
    });
  };

  const displayItems: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: t('molecularViewer.Mechanics', lang),
        children: (
          <div style={{ width: '360px' }} onClick={(e) => e.stopPropagation()}>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.VdwBondCutoffRelative', lang)}: </span>
              </Col>
              <Col span={12}>
                <InputNumber
                  addonAfter={t('word.Relative', lang)}
                  min={0.2}
                  max={2}
                  style={{ width: '100%' }}
                  precision={2}
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={parseFloat(vdwBondCutoffRelative.toFixed(2))}
                  step={0.1}
                  onChange={(value) => {
                    if (value === null) return;
                    changeVdwCutoff(value);
                    setChanged(true);
                    if (loggable) logAction('Set VDW Bond Cutoff to ' + value.toFixed(2));
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.MomentumScaleFactor', lang)}: </span>
              </Col>
              <Col span={12}>
                <InputNumber
                  addonAfter={t('word.Dimensionless', lang)}
                  min={0.1}
                  max={10}
                  style={{ width: '100%' }}
                  precision={1}
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={parseFloat(momentumScaleFactor.toFixed(1))}
                  step={0.1}
                  onChange={(value) => {
                    if (value === null) return;
                    changeMomentumScaleFactor(value);
                    setChanged(true);
                    if (loggable) logAction('Set Momentum Scale Factor to ' + value.toFixed(1));
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.ForceScaleFactor', lang)}: </span>
              </Col>
              <Col span={12}>
                <InputNumber
                  addonAfter={t('word.Dimensionless', lang)}
                  min={0.1}
                  max={10}
                  style={{ width: '100%' }}
                  precision={1}
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={parseFloat(forceScaleFactor.toFixed(1))}
                  step={0.1}
                  onChange={(value) => {
                    if (value === null) return;
                    changeForceScaleFactor(value);
                    setChanged(true);
                    if (loggable) logAction('Set Force Scale Factor to ' + value.toFixed(1));
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.KineticEnergyScaleFactor', lang)}: </span>
              </Col>
              <Col span={12}>
                <InputNumber
                  addonAfter={t('word.Dimensionless', lang)}
                  min={0.1}
                  max={10}
                  style={{ width: '100%' }}
                  precision={1}
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={parseFloat(kineticEnergyScaleFactor.toFixed(1))}
                  step={0.1}
                  onChange={(value) => {
                    if (value === null) return;
                    changeKineticEnergyScaleFactor(value);
                    setChanged(true);
                    if (loggable) logAction('Set Kinetic Energy Scale Factor to ' + value.toFixed(1));
                  }}
                />
              </Col>
            </Row>
          </div>
        ),
      },
      {
        key: '2',
        label: t('experiment.Intervals', lang),
        children: (
          <div style={{ width: '420px' }} onClick={(e) => e.stopPropagation()}>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.RefreshingInterval', lang)}: </span>
              </Col>
              <Col span={10}>
                <InputNumber
                  addonAfter={t('experiment.Steps', lang)}
                  min={1}
                  max={50}
                  style={{ width: '100%' }}
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={Math.round(refreshInterval)}
                  step={1}
                  onChange={(value) => {
                    if (value === null) return;
                    setCommonStore((state) => {
                      state.projectState.refreshInterval = value;
                      if (state.loggable) state.logAction('Set Refresh Interval to ' + value.toFixed(0));
                    });
                    setChanged(true);
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.CollectionInterval', lang)}: </span>
              </Col>
              <Col span={10}>
                <InputNumber
                  addonAfter={t('experiment.Steps', lang)}
                  min={10}
                  max={200}
                  style={{ width: '100%' }}
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={Math.round(collectInterval)}
                  step={1}
                  onChange={(value) => {
                    if (value === null) return;
                    setCommonStore((state) => {
                      state.projectState.collectInterval = value;
                      if (state.loggable) state.logAction('Set Collection Interval to ' + value.toFixed(0));
                    });
                    setChanged(true);
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.SpeedGraphBins', lang)}: </span>
              </Col>
              <Col span={10}>
                <InputNumber
                  addonAfter={t('word.Dimensionless', lang)}
                  min={10}
                  max={50}
                  style={{ width: '100%' }}
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={Math.round(speedGraphBinNumber)}
                  step={1}
                  onChange={(value) => {
                    if (value === null) return;
                    setCommonStore((state) => {
                      state.projectState.speedGraphBinNumber = value;
                      if (state.loggable) state.logAction('Set Speed Graph Bin Number to ' + value.toFixed(0));
                    });
                    usePrimitiveStore.getState().set((state) => {
                      state.updateDataFlag = !state.updateDataFlag;
                    });
                    setChanged(true);
                  }}
                />
              </Col>
            </Row>
          </div>
        ),
      },
    ],
    [
      lang,
      vdwBondCutoffRelative,
      momentumScaleFactor,
      forceScaleFactor,
      kineticEnergyScaleFactor,
      refreshInterval,
      collectInterval,
      speedGraphBinNumber,
      mdRef,
    ],
  );

  const createDisplaySettings = useMemo(() => {
    return <Tabs defaultActiveKey="1" items={displayItems} />;
  }, [displayItems]);

  const createThermometer = useMemo(() => {
    return (
      <Space direction={'horizontal'} style={{ width: '300px' }} onClick={(e) => e.stopPropagation()}>
        <span>{t('experiment.ConstantTemperature', lang)}: </span>
        <Switch
          checked={constantTemperature}
          onChange={(checked: boolean) => {
            setCommonStore((state) => {
              state.projectState.constantTemperature = checked;
              if (state.loggable) state.logAction('Set Constant Temperature to ' + checked);
            });
          }}
        />
        {constantTemperature && (
          <InputNumber
            addonAfter={'K'}
            min={10}
            max={5000}
            style={{ width: '100px' }}
            precision={1}
            // make sure that we round up the number as toDegrees may cause things like .999999999
            value={parseFloat(temperature.toFixed(1))}
            step={1}
            onChange={(value) => {
              if (value === null) return;
              setCommonStore((state) => {
                state.projectState.temperature = value;
                if (state.loggable) state.logAction('Set Temperature to ' + value.toFixed(1));
              });
              if (mdRef?.current) {
                mdRef.current.setTemperature(value);
                mdRef.current.heatBath.temperature = value;
              }
              setChanged(true);
            }}
          />
        )}
      </Space>
    );
  }, [temperature, constantTemperature, lang, mdRef]);

  const createClock = useMemo(() => {
    return (
      <Space direction={'horizontal'} style={{ width: '280px' }} onClick={(e) => e.stopPropagation()}>
        <span>{t('experiment.TimeStep', lang)}: </span>
        <InputNumber
          addonAfter={t('experiment.Femtosecond', lang)}
          min={0.1}
          max={5}
          style={{ width: '200px' }}
          precision={1}
          // make sure that we round up the number as toDegrees may cause things like .999999999
          value={parseFloat(timeStep.toFixed(1))}
          step={0.1}
          onChange={(value) => {
            if (value === null) return;
            if (mdRef?.current) mdRef.current.timeStep = value;
            setCommonStore((state) => {
              state.projectState.timeStep = value;
              if (state.loggable) state.logAction('Set Time Step to ' + value.toFixed(1));
            });
            setChanged(true);
          }}
        />
      </Space>
    );
  }, [timeStep, lang, mdRef]);

  const createContent = useMemo(() => {
    let atomCount = 0;
    let radialBondCount = 0;
    let angularBondCount = 0;
    let torsionalBondCount = 0;
    let elementString: string = '';
    let compositionString: string = '';
    const elements: Map<string, number> = new Map<string, number>();
    if (mdRef?.current) {
      atomCount = mdRef.current.atoms.length;
      radialBondCount = mdRef.current.radialBonds.length;
      angularBondCount = mdRef.current.angularBonds.length;
      torsionalBondCount = mdRef.current.torsionalBonds.length;
      for (const a of mdRef.current.atoms) {
        let count = elements.get(a.elementSymbol);
        if (count === undefined) {
          count = 1;
        } else {
          count++;
        }
        elements.set(a.elementSymbol, count);
      }
      for (const e of elements.keys()) {
        const elementCount = elements.get(e);
        if (elementCount) {
          elementString += e + '(' + elementCount + '), ';
          compositionString += e + '(' + Math.round((100 * elementCount) / atomCount) + '%), ';
        }
      }
      if (elementString.length > 2) elementString = elementString.substring(0, elementString.length - 2);
      if (compositionString.length > 2)
        compositionString = compositionString.substring(0, compositionString.length - 2);
    }
    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: t('projectPanel.MoleculeCount', lang),
        children: mdRef?.current?.moleculeCount ?? 0,
      },
      {
        key: '2',
        label: t('projectPanel.AtomCount', lang),
        children: atomCount,
      },
      {
        key: '3',
        label: t('projectPanel.RadialBondCount', lang),
        children: radialBondCount,
      },
      {
        key: '4',
        label: t('projectPanel.AngularBondCount', lang),
        children: angularBondCount,
      },
      {
        key: '5',
        label: t('projectPanel.TorsionalBondCount', lang),
        children: torsionalBondCount,
      },
      {
        key: '6',
        label: t('projectPanel.ChemicalElements', lang),
        children: elementString,
      },
      {
        key: '7',
        label: t('projectPanel.ChemicalComposition', lang),
        children: compositionString,
      },
    ];
    return (
      <div style={{ width: '300px' }}>
        <Descriptions
          style={{ paddingTop: '10px' }}
          contentStyle={{ fontSize: '12px' }}
          labelStyle={{ fontSize: '12px' }}
          column={1}
          items={items}
          size={'default'}
        />
      </div>
    );
  }, [lang, mdRef, updateInfoFlag]);

  const leftIndent = hideGallery ? 50 : 8;

  return (
    <>
      {hideGallery && (
        <FloatButton
          shape="square"
          style={{
            position: 'absolute',
            top: '8px',
            left: '6px',
            height: '20px',
            zIndex: 13,
          }}
          tooltip={t('menu.view.ShowGallery', lang)}
          onClick={() => openGallery()}
          description={
            <span style={{ fontSize: '20px' }}>
              <RightOutlined />
            </span>
          }
        />
      )}
      <Popover
        title={
          <div onClick={(e) => e.stopPropagation()}>
            <ExperimentOutlined /> {t('experiment.ExperimentSettings', lang)}
          </div>
        }
        content={createModelSettings}
      >
        <FloatButton
          shape="square"
          type="primary"
          style={{
            position: 'absolute',
            top: '8px',
            left: leftIndent + 'px',
            height: '20px',
            zIndex: 13,
          }}
          description={
            <span style={{ fontSize: '20px' }}>
              <ExperimentOutlined />
            </span>
          }
        />
      </Popover>
      <Popover
        title={
          <div onClick={(e) => e.stopPropagation()}>
            <EyeOutlined /> {t('experiment.DisplaySettings', lang)}
          </div>
        }
        content={createDisplaySettings}
      >
        <FloatButton
          shape="square"
          type="primary"
          style={{
            position: 'absolute',
            top: '8px',
            left: leftIndent + 44 + 'px',
            height: '20px',
            zIndex: 13,
          }}
          description={
            <span style={{ fontSize: '20px' }}>
              <EyeOutlined />
            </span>
          }
        />
      </Popover>
      <Popover
        title={
          <div onClick={(e) => e.stopPropagation()}>
            <ProfileOutlined /> {t('experiment.Content', lang)}
          </div>
        }
        content={createContent}
      >
        <FloatButton
          shape="square"
          type="primary"
          style={{
            position: 'absolute',
            top: '8px',
            left: leftIndent + 88 + 'px',
            height: '20px',
            zIndex: 13,
          }}
          description={
            <span style={{ fontSize: '20px' }}>
              <ProfileOutlined />
            </span>
          }
        />
      </Popover>
      <Popover
        title={
          <div onClick={(e) => e.stopPropagation()}>
            <CameraOutlined /> {t('molecularViewer.TakeScreenshot', lang)}
          </div>
        }
        content={<ScreenshotPanel />}
      >
        <FloatButton
          shape="square"
          type="primary"
          style={{
            position: 'absolute',
            top: '8px',
            left: leftIndent + 132 + 'px',
            height: '20px',
            zIndex: 13,
          }}
          description={
            <span style={{ fontSize: '20px' }}>
              <CameraOutlined />
            </span>
          }
        />
      </Popover>
      {mdRef?.current && (
        <Space
          direction={'horizontal'}
          style={{
            position: 'absolute',
            top: '14px',
            left: 'calc(50% - 40px)',
            zIndex: 13,
            fontSize: '14px',
            userSelect: 'none',
            color: 'lightgray',
          }}
        >
          <Popover
            title={<div onClick={(e) => e.stopPropagation()}>🌡 {t('experiment.Temperature', lang)}</div>}
            content={createThermometer}
          >
            <span>🌡 {Math.round(constantTemperature ? temperature : currentTemperature) + 'K'}</span>
          </Popover>
          <Popover
            title={<div onClick={(e) => e.stopPropagation()}>🕙 {t('word.Time', lang)}</div>}
            content={createClock}
          >
            <span>🕖 {(mdRef.current.indexOfStep * timeStep).toFixed(0) + 'fs'}</span>
          </Popover>
          <Popover
            title={<div onClick={(e) => e.stopPropagation()}>⚛ {t('projectPanel.AtomCount', lang)}</div>}
            content={<Space style={{ width: '300px' }}>{t('projectPanel.TotalNumberOfAtomsInModel', lang)}</Space>}
          >
            <span style={{ color: mdRef.current.atoms.length > 200 ? 'red' : 'lightgray' }}>
              ⚛ {mdRef.current.atoms.length}
            </span>
          </Popover>
          {gravitationalAcceleration > 0 && (
            <Popover
              title={<div onClick={(e) => e.stopPropagation()}>↓ {t('projectPanel.Gravity', lang)}</div>}
              content={<Space style={{ width: '300px' }}>{t('projectPanel.GravityNote', lang)}</Space>}
            >
              <span>↓ G</span>
            </Popover>
          )}
        </Space>
      )}
    </>
  );
});

export default DynamicsSettings;
