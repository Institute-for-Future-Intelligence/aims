/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { Checkbox, InputNumber, Radio, Slider, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { UndoableChange } from '../undo/UndoableChange.ts';
import { UndoableCheck } from '../undo/UndoableCheck.ts';

const GraphSettingsContent = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const addUndoable = useStore(Selector.addUndoable);
  const loggable = useStore(Selector.loggable);
  const logAction = useStore(Selector.logAction);
  const xLinesScatterPlot = useStore(Selector.xLinesScatterPlot);
  const yLinesScatterPlot = useStore(Selector.yLinesScatterPlot);
  const dotSizeScatterPlot = useStore(Selector.dotSizeScatterPlot);
  const lineWidthScatterPlot = useStore(Selector.lineWidthScatterPlot);
  const sortDataScatterPlot = useStore(Selector.sortDataScatterPlot) ?? 'None';
  const xAxisNameScatterPlot = useStore(Selector.xAxisNameScatterPlot) ?? 'atomCount';
  const yAxisNameScatterPlot = useStore(Selector.yAxisNameScatterPlot) ?? 'bondCount';
  const regressionDegree = useStore(Selector.regressionDegree) ?? 1;

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const undoableSetSortData = (value: any) => {
    const undoable = {
      name: 'Sort Data for Scatter Plot',
      timestamp: Date.now(),
      oldValue: sortDataScatterPlot,
      newValue: value,
      undo: () => setSortData(undoable.oldValue),
      redo: () => setSortData(undoable.newValue),
    } as UndoableChange;
    addUndoable(undoable);
    setSortData(value);
  };

  const setSortData = (value: any) => {
    setCommonStore((state) => {
      state.projectState.sortDataScatterPlot = value;
      switch (state.projectState.sortDataScatterPlot) {
        case 'None':
          state.projectState.selectedProperty = null;
          state.projectState.sortDescending = false;
          break;
        case 'X':
          state.projectState.selectedProperty = xAxisNameScatterPlot;
          state.projectState.sortDescending = true;
          break;
        case 'Y':
          state.projectState.selectedProperty = yAxisNameScatterPlot;
          state.projectState.sortDescending = true;
          break;
      }
    });
  };

  const undoableSetHorizontalLines = (checked: boolean) => {
    const undoable = {
      name: checked ? 'Show Horizontal Lines' : 'Hide Horizontal Lines',
      timestamp: Date.now(),
      checked,
      undo: () => {
        setCommonStore((state) => {
          state.projectState.xLinesScatterPlot = !undoable.checked;
        });
      },
      redo: () => {
        setCommonStore((state) => {
          state.projectState.xLinesScatterPlot = undoable.checked;
        });
      },
    } as UndoableCheck;
    addUndoable(undoable);
    setCommonStore((state) => {
      state.projectState.xLinesScatterPlot = checked;
    });
  };

  const undoableSetVerticalLines = (checked: boolean) => {
    const undoable = {
      name: checked ? 'Show Vertical Lines' : 'Hide Vertical Lines',
      timestamp: Date.now(),
      checked,
      undo: () => {
        setCommonStore((state) => {
          state.projectState.yLinesScatterPlot = !undoable.checked;
        });
      },
      redo: () => {
        setCommonStore((state) => {
          state.projectState.yLinesScatterPlot = undoable.checked;
        });
      },
    } as UndoableCheck;
    addUndoable(undoable);
    setCommonStore((state) => {
      state.projectState.yLinesScatterPlot = checked;
    });
  };

  const undoableSetRegressionDegree = (value: number) => {
    const undoable = {
      name: 'Change Regression Degree',
      timestamp: Date.now(),
      oldValue: regressionDegree,
      newValue: value,
      undo: () => {
        setCommonStore((state) => {
          state.projectState.regressionDegree = undoable.oldValue as number;
        });
      },
      redo: () => {
        setCommonStore((state) => {
          state.projectState.regressionDegree = undoable.newValue as number;
        });
      },
    } as UndoableChange;
    addUndoable(undoable);
    setCommonStore((state) => {
      state.projectState.regressionDegree = value;
    });
  };

  const undoableSetSymbolSize = (value: number) => {
    const undoable = {
      name: 'Change Symbol Size',
      timestamp: Date.now(),
      oldValue: dotSizeScatterPlot,
      newValue: value,
      undo: () => {
        setCommonStore((state) => {
          state.projectState.dotSizeScatterPlot = undoable.oldValue as number;
        });
      },
      redo: () => {
        setCommonStore((state) => {
          state.projectState.dotSizeScatterPlot = undoable.newValue as number;
        });
      },
    } as UndoableChange;
    addUndoable(undoable);
    setCommonStore((state) => {
      state.projectState.dotSizeScatterPlot = value;
    });
  };

  const undoableSetLineWidth = (value: number) => {
    const undoable = {
      name: 'Change Line Width',
      timestamp: Date.now(),
      oldValue: lineWidthScatterPlot,
      newValue: value,
      undo: () => {
        setCommonStore((state) => {
          state.projectState.lineWidthScatterPlot = undoable.oldValue as number;
        });
      },
      redo: () => {
        setCommonStore((state) => {
          state.projectState.lineWidthScatterPlot = undoable.newValue as number;
        });
      },
    } as UndoableChange;
    addUndoable(undoable);
    setCommonStore((state) => {
      state.projectState.lineWidthScatterPlot = value;
    });
  };

  return (
    <div>
      <Space style={{ fontSize: '12px', paddingTop: '8px', paddingBottom: '8px' }}>
        <Space>{t('projectPanel.SortScatterPlotData', lang) + ':'}</Space>
        <Radio.Group
          value={sortDataScatterPlot}
          onChange={(e) => {
            undoableSetSortData(e.target.value);
            setChanged(true);
            if (loggable) logAction('Sort Scatter Plot Data');
          }}
        >
          <Radio value={'None'}>
            <span style={{ fontSize: '12px' }}>{t('word.None', lang)}</span>
          </Radio>
          <Radio value={'X'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.SortDataByXValue', lang)}</span>
          </Radio>
          <Radio value={'Y'}>
            <span style={{ fontSize: '12px' }}>{t('projectPanel.SortDataByYValue', lang)}</span>
          </Radio>
        </Radio.Group>
      </Space>
      <br />
      <Space style={{ fontSize: '12px', paddingBottom: '8px' }}>
        <Space>{t('projectPanel.GridLines', lang) + ':'}</Space>
        <Checkbox
          style={{ width: '100%' }}
          onChange={(e) => {
            undoableSetHorizontalLines(e.target.checked);
            setChanged(true);
            if (loggable) logAction('Show/Hide Horizontal Lines');
          }}
          checked={xLinesScatterPlot}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.HorizontalLines', lang)}</span>
        </Checkbox>
        <Checkbox
          style={{ width: '100%' }}
          onChange={(e) => {
            undoableSetVerticalLines(e.target.checked);
            setChanged(true);
            if (loggable) logAction('Show/Hide Vertical Lines');
          }}
          checked={yLinesScatterPlot}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.VerticalLines', lang)}</span>
        </Checkbox>
      </Space>
      <br />
      <Space style={{ fontSize: '12px' }}>
        <Space>{t('projectPanel.PolynomialRegressionDegree', lang) + ':'}</Space>
        <InputNumber
          style={{ width: '60px' }}
          min={1}
          max={10}
          step={1}
          value={regressionDegree}
          onChange={(value) => {
            if (value === null) return;
            undoableSetRegressionDegree(value);
            setChanged(true);
            if (loggable) logAction('Set Regression Degree');
          }}
        />
      </Space>
      <br />
      <Space style={{ fontSize: '12px' }}>
        <Space style={{ width: '80px' }}>{t('projectPanel.SymbolSize', lang) + ':'}</Space>
        <Slider
          style={{ width: '120px' }}
          min={0}
          max={10}
          value={dotSizeScatterPlot}
          onChange={(v) => {
            undoableSetSymbolSize(v);
            setChanged(true);
            if (loggable) logAction('Set Symbol Size');
          }}
        />
      </Space>
      <br />
      <Space style={{ fontSize: '12px' }}>
        <Space style={{ width: '80px' }}>{t('projectPanel.LineWidth', lang) + ':'}</Space>
        <Slider
          style={{ width: '120px' }}
          min={0}
          max={6}
          value={lineWidthScatterPlot}
          onChange={(v) => {
            undoableSetLineWidth(v);
            setChanged(true);
            if (loggable) logAction('Set Line Width');
          }}
        />
      </Space>
    </div>
  );
});

export default GraphSettingsContent;
