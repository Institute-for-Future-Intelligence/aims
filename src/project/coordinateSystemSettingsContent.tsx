/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { Col, InputNumber, Row, Select } from 'antd';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { useTranslation } from 'react-i18next';
import { UndoableChange } from '../undo/UndoableChange.ts';

interface CoordinateSystemSettingsContentProps {
  xAxisNameScatterPlot: string | null;
  yAxisNameScatterPlot: string | null;
  xFormula: string | null;
  yFormula: string | null;
  xMinScatterPlot: number;
  xMaxScatterPlot: number;
  yMinScatterPlot: number;
  yMaxScatterPlot: number;
}

const CoordinateSystemSettingsContent = React.memo(
  ({
    xAxisNameScatterPlot,
    yAxisNameScatterPlot,
    xFormula,
    yFormula,
    xMinScatterPlot,
    xMaxScatterPlot,
    yMinScatterPlot,
    yMaxScatterPlot,
  }: CoordinateSystemSettingsContentProps) => {
    const setCommonStore = useStore(Selector.set);
    const language = useStore(Selector.language);
    const setChanged = usePrimitiveStore(Selector.setChanged);
    const addUndoable = useStore(Selector.addUndoable);
    const loggable = useStore(Selector.loggable);
    const logAction = useStore(Selector.logAction);

    const { Option } = Select;

    const { t } = useTranslation();
    const lang = useMemo(() => {
      return { lng: language };
    }, [language]);

    // const [xFormulaTemp, setXFormulaTemp] = useState<string | null>(xFormula);
    // const [yFormulaTemp, setYFormulaTemp] = useState<string | null>(yFormula);
    //
    // useEffect(() => {
    //   setXFormulaTemp(xFormula);
    // }, [xFormula]);
    //
    // useEffect(() => {
    //   setYFormulaTemp(yFormula);
    // }, [yFormula]);

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

    const undoableSelectXAxis = (value: any) => {
      const undoable = {
        name: 'Select X Axis',
        timestamp: Date.now(),
        oldValue: xAxisNameScatterPlot,
        newValue: value,
        undo: () => {
          setCommonStore((state) => {
            state.projectState.xAxisNameScatterPlot = undoable.oldValue as string;
          });
        },
        redo: () => {
          setCommonStore((state) => {
            state.projectState.xAxisNameScatterPlot = undoable.newValue as string;
          });
        },
      } as UndoableChange;
      addUndoable(undoable);
      setCommonStore((state) => {
        state.projectState.xAxisNameScatterPlot = value;
      });
    };

    const undoableSelectYAxis = (value: any) => {
      const undoable = {
        name: 'Select Y Axis',
        timestamp: Date.now(),
        oldValue: yAxisNameScatterPlot,
        newValue: value,
        undo: () => {
          setCommonStore((state) => {
            state.projectState.yAxisNameScatterPlot = undoable.oldValue as string;
          });
        },
        redo: () => {
          setCommonStore((state) => {
            state.projectState.yAxisNameScatterPlot = undoable.newValue as string;
          });
        },
      } as UndoableChange;
      addUndoable(undoable);
      setCommonStore((state) => {
        state.projectState.yAxisNameScatterPlot = value;
      });
    };

    const undoableSetMinX = (value: number) => {
      const undoable = {
        name: 'Set Minimum X',
        timestamp: Date.now(),
        oldValue: xMinScatterPlot,
        newValue: value,
        undo: () => {
          setCommonStore((state) => {
            state.projectState.xMinScatterPlot = undoable.oldValue as number;
          });
        },
        redo: () => {
          setCommonStore((state) => {
            state.projectState.xMinScatterPlot = undoable.newValue as number;
          });
        },
      } as UndoableChange;
      addUndoable(undoable);
      setCommonStore((state) => {
        state.projectState.xMinScatterPlot = value;
      });
    };

    const undoableSetMaxX = (value: number) => {
      const undoable = {
        name: 'Set Maximum X',
        timestamp: Date.now(),
        oldValue: xMaxScatterPlot,
        newValue: value,
        undo: () => {
          setCommonStore((state) => {
            state.projectState.xMaxScatterPlot = undoable.oldValue as number;
          });
        },
        redo: () => {
          setCommonStore((state) => {
            state.projectState.xMaxScatterPlot = undoable.newValue as number;
          });
        },
      } as UndoableChange;
      addUndoable(undoable);
      setCommonStore((state) => {
        state.projectState.xMaxScatterPlot = value;
      });
    };

    const undoableSetMinY = (value: number) => {
      const undoable = {
        name: 'Set Minimum Y',
        timestamp: Date.now(),
        oldValue: yMinScatterPlot,
        newValue: value,
        undo: () => {
          setCommonStore((state) => {
            state.projectState.yMinScatterPlot = undoable.oldValue as number;
          });
        },
        redo: () => {
          setCommonStore((state) => {
            state.projectState.yMinScatterPlot = undoable.newValue as number;
          });
        },
      } as UndoableChange;
      addUndoable(undoable);
      setCommonStore((state) => {
        state.projectState.yMinScatterPlot = value;
      });
    };

    const undoableSetMaxY = (value: number) => {
      const undoable = {
        name: 'Set Maximum Y',
        timestamp: Date.now(),
        oldValue: yMaxScatterPlot,
        newValue: value,
        undo: () => {
          setCommonStore((state) => {
            state.projectState.yMaxScatterPlot = undoable.oldValue as number;
          });
        },
        redo: () => {
          setCommonStore((state) => {
            state.projectState.yMaxScatterPlot = undoable.newValue as number;
          });
        },
      } as UndoableChange;
      addUndoable(undoable);
      setCommonStore((state) => {
        state.projectState.yMaxScatterPlot = value;
      });
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
              title={t('tooltip.' + xAxisNameScatterPlot, lang)}
              value={xAxisNameScatterPlot}
              onChange={(value) => {
                undoableSelectXAxis(value);
                setChanged(true);
                if (loggable) logAction('Select X Axis');
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
              title={t('tooltip.' + yAxisNameScatterPlot, lang)}
              onChange={(value) => {
                undoableSelectYAxis(value);
                setChanged(true);
                if (loggable) logAction('Select Y Axis');
              }}
            >
              {createAxisOptions()}
            </Select>
          </Col>
        </Row>
        {/*<Row>*/}
        {/*  <Col span={8} style={{ paddingTop: '5px' }}>*/}
        {/*    <span style={{ fontSize: '12px' }}>{t('projectPanel.XFormula', lang)}: </span>*/}
        {/*  </Col>*/}
        {/*  <Col span={16}>*/}
        {/*    <Input*/}
        {/*      style={{ width: '100%' }}*/}
        {/*      value={xFormulaTemp ?? 'x'}*/}
        {/*      onChange={(e) => {*/}
        {/*        setXFormulaTemp(e.target.value);*/}
        {/*      }}*/}
        {/*      onPressEnter={() => {*/}
        {/*        setCommonStore((state) => {*/}
        {/*          state.projectState.xFormula = xFormulaTemp;*/}
        {/*        });*/}
        {/*          setChanged(true);*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        {/*<Row>*/}
        {/*  <Col span={8} style={{ paddingTop: '5px' }}>*/}
        {/*    <span style={{ fontSize: '12px' }}>{t('projectPanel.YFormula', lang)}: </span>*/}
        {/*  </Col>*/}
        {/*  <Col span={16}>*/}
        {/*    <Input*/}
        {/*      style={{ width: '100%' }}*/}
        {/*      value={yFormulaTemp ?? 'y'}*/}
        {/*      onChange={(e) => {*/}
        {/*        setYFormulaTemp(e.target.value);*/}
        {/*      }}*/}
        {/*      onPressEnter={() => {*/}
        {/*        setCommonStore((state) => {*/}
        {/*          state.projectState.yFormula = yFormulaTemp;*/}
        {/*        });*/}
        {/*          setChanged(true);*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </Col>*/}
        {/*</Row>*/}
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
                undoableSetMinX(value);
                setChanged(true);
                if (loggable) logAction('Set Minimum X');
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
                undoableSetMaxX(value);
                setChanged(true);
                if (loggable) logAction('Set Maximum X');
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
                undoableSetMinY(value);
                setChanged(true);
                if (loggable) logAction('Set Minimum Y');
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
                undoableSetMaxY(value);
                setChanged(true);
                if (loggable) logAction('Set Maximum Y');
              }}
            />
          </Col>
        </Row>
      </div>
    );
  },
);

export default CoordinateSystemSettingsContent;
