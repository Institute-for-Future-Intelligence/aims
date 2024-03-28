/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { Col, Descriptions, DescriptionsProps, FloatButton, InputNumber, Popover, Row } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { AimOutlined, ExperimentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Molecule } from '../models/Molecule.ts';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { useRefStore } from '../stores/commonRef.ts';

const DynamicsSettings = React.memo(({ molecules }: { molecules: Molecule[] | undefined | null }) => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const testMolecules = useStore(Selector.testMolecules);
  const molecularContainer = useStore(Selector.molecularContainer);
  const vdwBondCutoffRelative = useStore(Selector.vdwBondCutoffRelative) ?? 0.5;
  const temperature = useStore(Selector.temperature) ?? 300;
  const pressure = useStore(Selector.pressure) ?? 1;
  const timeStep = useStore(Selector.timeStep) ?? 0.5;

  const mdRef = useRefStore.getState().molecularDynamicsRef;

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const createContent = useMemo(() => {
    return (
      <div style={{ width: '360px', paddingTop: '10px' }} onClick={(e) => e.stopPropagation()}>
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
              min={10}
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
            <span>{t('experiment.VdwBondCutoffRelative', lang)}: </span>
          </Col>
          <Col span={12}>
            <InputNumber
              addonAfter={t('word.Relative', lang)}
              min={0.2}
              max={1}
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
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={12} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.Temperature', lang)}: </span>
          </Col>
          <Col span={12}>
            <InputNumber
              addonAfter={'K'}
              min={10}
              max={1000}
              style={{ width: '100%' }}
              precision={1}
              // make sure that we round up the number as toDegrees may cause things like .999999999
              value={parseFloat(temperature.toFixed(1))}
              step={1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.temperature = value;
                });
                setChanged(true);
              }}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingBottom: '4px' }}>
          <Col span={12} style={{ paddingTop: '5px' }}>
            <span>{t('experiment.Pressure', lang)}: </span>
          </Col>
          <Col span={12}>
            <InputNumber
              addonAfter={'atm'}
              min={0.01}
              max={100}
              style={{ width: '100%' }}
              precision={2}
              // make sure that we round up the number as toDegrees may cause things like .999999999
              value={parseFloat(pressure.toFixed(2))}
              step={0.1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.pressure = value;
                });
                setChanged(true);
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }, [
    lang,
    molecularContainer.lx,
    molecularContainer.ly,
    molecularContainer.lz,
    temperature,
    pressure,
    vdwBondCutoffRelative,
    timeStep,
  ]);

  const createInfo = useMemo(() => {
    let atomCount = 0;
    let bondCount = 0;
    const elements: string[] = [];
    if (molecules) {
      for (const m of molecules) {
        atomCount += m.atoms.length;
        if (m.atoms.length > 1) {
          // prevent auto bond
          bondCount += m.bonds.length;
        }
        for (const a of m.atoms) {
          if (!elements.includes(a.elementSymbol)) elements.push(a.elementSymbol);
        }
      }
    }
    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: t('projectPanel.MoleculeCount', lang),
        children: testMolecules.length,
      },
      {
        key: '2',
        label: t('projectPanel.AtomCount', lang),
        children: atomCount,
      },
      {
        key: '3',
        label: t('projectPanel.CovalentBondCount', lang),
        children: bondCount,
      },
      {
        key: '4',
        label: t('projectPanel.ChemicalElements', lang),
        children: elements.join(', '),
      },
    ];
    return (
      <div style={{ width: '200px' }}>
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
  }, [lang, testMolecules, molecules]);

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
    </>
  );
});

export default DynamicsSettings;
