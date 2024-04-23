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
import { screenshot, showError } from '../helpers.ts';

const DynamicsSettings = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const loggable = useStore.getState().loggable;
  const logAction = useStore.getState().logAction;
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const molecularContainer = useStore(Selector.molecularContainer);
  const vdwBondCutoffRelative = useStore(Selector.vdwBondCutoffRelative) ?? 0.5;
  const momentumScaleFactor = useStore(Selector.momentumScaleFactor) ?? 1;
  const forceScaleFactor = useStore(Selector.forceScaleFactor) ?? 1;
  const kineticEnergyScaleFactor = useStore(Selector.kineticEnergyScaleFactor) ?? 1;
  const constantTemperature = useStore(Selector.constantTemperature) ?? false;
  const temperature = useStore(Selector.temperature) ?? 300;
  const timeStep = useStore(Selector.timeStep) ?? 0.5;
  const refreshInterval = useStore(Selector.refreshInterval) ?? 20;
  const collectInterval = useStore(Selector.collectInterval) ?? 100;
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
    });
  };

  const openGallery = () => {
    const undoable = {
      name: 'Show Gallery',
      timestamp: Date.now(),
      undo: () => showGallery(false),
      redo: () => showGallery(true),
    } as Undoable;
    useStore.getState().addUndoable(undoable);
    showGallery(true);
    if (loggable) logAction('Show Gallery');
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
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={parseFloat(molecularContainer.lx.toFixed(1))}
                  step={1}
                  onChange={(value) => {
                    if (value === null) return;
                    if (mdRef?.current) mdRef.current.container.lx = value;
                    setCommonStore((state) => {
                      state.projectState.molecularContainer.lx = value;
                      if (state.loggable) state.logAction('Set Container Lx to ' + value.toFixed(1));
                    });
                    setChanged(true);
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
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={parseFloat(molecularContainer.ly.toFixed(1))}
                  step={1}
                  onChange={(value) => {
                    if (value === null) return;
                    if (mdRef?.current) mdRef.current.container.ly = value;
                    setCommonStore((state) => {
                      state.projectState.molecularContainer.ly = value;
                      if (state.loggable) state.logAction('Set Container Ly to ' + value.toFixed(1));
                    });
                    setChanged(true);
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
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={parseFloat(molecularContainer.lz.toFixed(1))}
                  step={1}
                  onChange={(value) => {
                    if (value === null) return;
                    if (mdRef?.current) mdRef.current.container.lz = value;
                    setCommonStore((state) => {
                      state.projectState.molecularContainer.lz = value;
                      if (state.loggable) state.logAction('Set Container Lz to ' + value.toFixed(1));
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
    [lang, molecularContainer.lx, molecularContainer.ly, molecularContainer.lz, mdRef],
  );

  const createModelSettings = useMemo(() => {
    return <Tabs defaultActiveKey="1" items={modelItems} />;
  }, [modelItems]);

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
                    setCommonStore((state) => {
                      state.projectState.vdwBondCutoffRelative = value;
                      if (state.loggable) state.logAction('Set VDW Bond Cutoff to ' + value.toFixed(2));
                    });
                    setChanged(true);
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
                    setCommonStore((state) => {
                      state.projectState.momentumScaleFactor = value;
                      if (state.loggable) state.logAction('Set Momentum Scale Factor to ' + value.toFixed(1));
                    });
                    setChanged(true);
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
                    setCommonStore((state) => {
                      state.projectState.forceScaleFactor = value;
                      if (state.loggable) state.logAction('Set Force Scale Factor to ' + value.toFixed(1));
                    });
                    setChanged(true);
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
                    setCommonStore((state) => {
                      state.projectState.kineticEnergyScaleFactor = value;
                      if (state.loggable) state.logAction('Set Kinetic Energy Scale Factor to ' + value.toFixed(1));
                    });
                    setChanged(true);
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
          <div style={{ width: '360px' }} onClick={(e) => e.stopPropagation()}>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.RefreshingInterval', lang)}: </span>
              </Col>
              <Col span={12}>
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
              <Col span={12}>
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
        tooltip={t('molecularViewer.TakeScreenshot', lang)}
        onClick={() => {
          screenshot('reaction-chamber')
            .then(() => {
              if (loggable) logAction('Take Screenshot of Reaction Chamber');
            })
            .catch((reason) => {
              showError(reason);
            });
        }}
      />
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
        </Space>
      )}
    </>
  );
});

export default DynamicsSettings;
