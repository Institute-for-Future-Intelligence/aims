/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import thermometer from '../assets/thermometer.png';
import {
  Col,
  Descriptions,
  DescriptionsProps,
  FloatButton,
  Image,
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
import { AimOutlined, ExperimentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { useRefStore } from '../stores/commonRef.ts';

const DynamicsSettings = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
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

  const mdRef = useRefStore.getState().molecularDynamicsRef;

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: t('experiment.Model', lang),
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
                    });
                    setChanged(true);
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ paddingBottom: '4px' }}>
              <Col span={12} style={{ paddingTop: '5px' }}>
                <span>{t('experiment.TimeStep', lang)}: </span>
              </Col>
              <Col span={12}>
                <InputNumber
                  addonAfter={t('experiment.Femtosecond', lang)}
                  min={0.1}
                  max={5}
                  style={{ width: '100%' }}
                  precision={1}
                  // make sure that we round up the number as toDegrees may cause things like .999999999
                  value={parseFloat(timeStep.toFixed(1))}
                  step={0.1}
                  onChange={(value) => {
                    if (value === null) return;
                    if (mdRef?.current) mdRef.current.timeStep = value;
                    setCommonStore((state) => {
                      state.projectState.timeStep = value;
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
        label: t('experiment.Display', lang),
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
                    });
                    setChanged(true);
                  }}
                />
              </Col>
            </Row>
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
      molecularContainer.lx,
      molecularContainer.ly,
      molecularContainer.lz,
      constantTemperature,
      temperature,
      vdwBondCutoffRelative,
      momentumScaleFactor,
      forceScaleFactor,
      kineticEnergyScaleFactor,
      timeStep,
      refreshInterval,
      collectInterval,
      mdRef,
    ],
  );

  const createContent = useMemo(() => {
    return <Tabs defaultActiveKey="1" items={items} />;
  }, [items]);

  const createThermometer = useMemo(() => {
    return (
      <Space direction={'horizontal'} style={{ width: '300px' }} onClick={(e) => e.stopPropagation()}>
        <span>{t('experiment.ConstantTemperature', lang)}: </span>
        <Switch
          checked={constantTemperature}
          onChange={(checked: boolean) => {
            setCommonStore((state) => {
              state.projectState.constantTemperature = checked;
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

  const createInfo = useMemo(() => {
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
        children: mdRef?.current?.moleculeCount,
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

  return (
    <>
      <Popover
        title={
          <div onClick={(e) => e.stopPropagation()}>
            <AimOutlined /> {t('experiment.ExperimentSettings', lang)}
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
            left: '6px',
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
            <InfoCircleOutlined /> {t('experiment.Information', lang)}
          </div>
        }
        content={createInfo}
      >
        <span
          style={{
            position: 'absolute',
            top: '14px',
            left: '56px',
            zIndex: 13,
            fontSize: '20px',
            userSelect: 'none',
            color: 'lightgray',
          }}
        >
          {t('experiment.Molecules', lang)}
        </span>
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
          <span>🕖 {(mdRef.current.indexOfStep * timeStep).toFixed(0) + 'fs'}</span>
        </Space>
      )}
    </>
  );
});

export default DynamicsSettings;
