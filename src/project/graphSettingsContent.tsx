/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { Checkbox, InputNumber, Radio, Slider, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  updateHorizontalLinesScatterPlot,
  updateLineWidthScatterPlot,
  updateSymbolSizeScatterPlot,
  updateVerticalLinesScatterPlot,
} from '../cloudProjectUtil.ts';

const GraphSettingsContent = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const user = useStore(Selector.user);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const projectOwner = useStore(Selector.projectOwner);
  const projectTitle = useStore(Selector.projectTitle);
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
  const isOwner = user.uid === projectOwner;

  return (
    <div>
      <Space style={{ fontSize: '12px', paddingTop: '8px', paddingBottom: '8px' }}>
        <Space>{t('projectPanel.SortScatterPlotData', lang) + ':'}</Space>
        <Radio.Group
          value={sortDataScatterPlot}
          onChange={(e) => {
            setCommonStore((state) => {
              state.projectState.sortDataScatterPlot = e.target.value;
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
            const checked = e.target.checked;
            setCommonStore((state) => {
              state.projectState.xLinesScatterPlot = checked;
            });
            if (isOwner) {
              if (user.uid && projectTitle) {
                updateHorizontalLinesScatterPlot(user.uid, projectTitle, checked).then(() => {
                  setChanged(true);
                });
              }
            }
          }}
          checked={xLinesScatterPlot}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.HorizontalLines', lang)}</span>
        </Checkbox>
        <Checkbox
          style={{ width: '100%' }}
          onChange={(e) => {
            const checked = e.target.checked;
            setCommonStore((state) => {
              state.projectState.yLinesScatterPlot = checked;
            });
            if (isOwner) {
              if (user.uid && projectTitle) {
                updateVerticalLinesScatterPlot(user.uid, projectTitle, checked).then(() => {
                  setChanged(true);
                });
              }
            }
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
            setCommonStore((state) => {
              state.projectState.regressionDegree = value;
            });
            setChanged(true);
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
            setCommonStore((state) => {
              state.projectState.dotSizeScatterPlot = v;
            });
            if (isOwner) {
              if (user.uid && projectTitle) {
                updateSymbolSizeScatterPlot(user.uid, projectTitle, v).then(() => {
                  setChanged(true);
                });
              }
            }
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
            setCommonStore((state) => {
              state.projectState.lineWidthScatterPlot = v;
            });
            if (isOwner) {
              if (user.uid && projectTitle) {
                updateLineWidthScatterPlot(user.uid, projectTitle, v).then(() => {
                  setChanged(true);
                });
              }
            }
          }}
        />
      </Space>
    </div>
  );
});

export default GraphSettingsContent;
