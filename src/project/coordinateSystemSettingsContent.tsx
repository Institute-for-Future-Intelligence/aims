/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { Col, InputNumber, Row, Select } from 'antd';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { useTranslation } from 'react-i18next';
import {
  updateXAxisNameScatterPlot,
  updateXMaxScatterPlot,
  updateXMinScatterPlot,
  updateYAxisNameScatterPlot,
  updateYMaxScatterPlot,
  updateYMinScatterPlot,
} from '../cloudProjectUtil.ts';

interface CoordinateSystemSettingsContentProps {
  xMinScatterPlot: number;
  xMaxScatterPlot: number;
  yMinScatterPlot: number;
  yMaxScatterPlot: number;
}

const CoordinateSystemSettingsContent = React.memo(
  ({ xMinScatterPlot, xMaxScatterPlot, yMinScatterPlot, yMaxScatterPlot }: CoordinateSystemSettingsContentProps) => {
    const setCommonStore = useStore(Selector.set);
    const language = useStore(Selector.language);
    const user = useStore(Selector.user);
    const setChanged = usePrimitiveStore(Selector.setChanged);
    const projectOwner = useStore(Selector.projectOwner);
    const projectTitle = useStore(Selector.projectTitle);
    const xAxisNameScatterPlot = useStore(Selector.xAxisNameScatterPlot);
    const yAxisNameScatterPlot = useStore(Selector.yAxisNameScatterPlot);

    const { Option } = Select;

    const { t } = useTranslation();
    const lang = useMemo(() => {
      return { lng: language };
    }, [language]);
    const isOwner = user.uid === projectOwner;

    const createAxisOptions = () => {
      return (
        <>
          <Option key={'atomCount'} value={'atomCount'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.AtomCount', lang)}</span>
          </Option>
          <Option key={'bondCount'} value={'bondCount'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.BondCount', lang)}</span>
          </Option>
          <Option key={'molecularMass'} value={'molecularMass'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.MolecularMass', lang)}</span>
          </Option>
          <Option key={'logP'} value={'logP'}>
            <span style={{ fontSize: '12px' }}>logP</span>
          </Option>
          <Option key={'hydrogenBondDonorCount'} value={'hydrogenBondDonorCount'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.HydrogenBondDonorCount', lang)}</span>
          </Option>
          <Option key={'hydrogenBondAcceptorCount'} value={'hydrogenBondAcceptorCount'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.HydrogenBondAcceptorCount', lang)}</span>
          </Option>
          <Option key={'rotatableBondCount'} value={'rotatableBondCount'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.RotatableBondCount', lang)}</span>
          </Option>
          <Option key={'polarSurfaceArea'} value={'polarSurfaceArea'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.PolarSurfaceArea', lang)}</span>
          </Option>
          <Option key={'heavyAtomCount'} value={'heavyAtomCount'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.HeavyAtomCount', lang)}</span>
          </Option>
          <Option key={'complexity'} value={'complexity'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.Complexity', lang)}</span>
          </Option>
          <Option key={'density'} value={'density'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.Density', lang)}</span>
          </Option>
          <Option key={'boilingPoint'} value={'boilingPoint'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.BoilingPoint', lang)}</span>
          </Option>
          <Option key={'meltingPoint'} value={'meltingPoint'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.MeltingPoint', lang)}</span>
          </Option>
        </>
      );
    };

    return (
      <div style={{ width: '280px' }}>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.SelectXAxis', lang)}: </span>
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '100%' }}
              value={xAxisNameScatterPlot}
              onChange={(value) => {
                setCommonStore((state) => {
                  state.projectState.xAxisNameScatterPlot = value;
                });
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateXAxisNameScatterPlot(user.uid, projectTitle, value).then(() => {
                      setChanged(true);
                    });
                  }
                }
              }}
            >
              {createAxisOptions()}
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '8px' }}>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.SelectYAxis', lang)}: </span>
          </Col>
          <Col span={16}>
            <Select
              style={{ width: '100%' }}
              value={yAxisNameScatterPlot}
              onChange={(value) => {
                setCommonStore((state) => {
                  state.projectState.yAxisNameScatterPlot = value;
                });
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateYAxisNameScatterPlot(user.uid, projectTitle, value).then(() => {
                      setChanged(true);
                    });
                  }
                }
              }}
            >
              {createAxisOptions()}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.MinimumX', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              style={{ width: '100%' }}
              step={1}
              value={xMinScatterPlot}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.xMinScatterPlot = value;
                });
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateXMinScatterPlot(user.uid, projectTitle, value).then(() => {
                      setChanged(true);
                    });
                  }
                }
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.MaximumX', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              style={{ width: '100%' }}
              step={1}
              value={xMaxScatterPlot}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.xMaxScatterPlot = value;
                });
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateXMaxScatterPlot(user.uid, projectTitle, value).then(() => {
                      setChanged(true);
                    });
                  }
                }
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.MinimumY', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              style={{ width: '100%' }}
              step={1}
              value={yMinScatterPlot}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.yMinScatterPlot = value;
                });
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateYMinScatterPlot(user.uid, projectTitle, value).then(() => {
                      setChanged(true);
                    });
                  }
                }
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8} style={{ paddingTop: '5px' }}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.MaximumY', lang)}: </span>
          </Col>
          <Col span={16}>
            <InputNumber
              style={{ width: '100%' }}
              step={1}
              value={yMaxScatterPlot}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.yMaxScatterPlot = value;
                });
                if (isOwner) {
                  if (user.uid && projectTitle) {
                    updateYMaxScatterPlot(user.uid, projectTitle, value).then(() => {
                      setChanged(true);
                    });
                  }
                }
              }}
            />
          </Col>
        </Row>
      </div>
    );
  },
);

export default CoordinateSystemSettingsContent;
