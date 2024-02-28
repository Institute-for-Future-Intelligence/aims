/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { Checkbox, Slider, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  updateHorizontalLinesScatterPlot,
  updateLineWidthScatterPlot,
  updateSymbolSizeScatterPlot,
  updateVerticalLinesScatterPlot,
} from '../cloudProjectUtil.ts';

interface GraphSettingsContentProps {
  xLines: boolean;
  yLines: boolean;
  dotSize: number;
  lineWidth: number;
  setXLines: (value: boolean) => void;
  setYLines: (value: boolean) => void;
  setDotSize: (value: number) => void;
  setLineWidth: (value: number) => void;
}

const GraphSettingsContent = React.memo(
  ({
    xLines,
    yLines,
    dotSize,
    lineWidth,
    setXLines,
    setYLines,
    setDotSize,
    setLineWidth,
  }: GraphSettingsContentProps) => {
    const setCommonStore = useStore(Selector.set);
    const language = useStore(Selector.language);
    const user = useStore(Selector.user);
    const setChanged = usePrimitiveStore(Selector.setChanged);
    const projectOwner = useStore(Selector.projectOwner);
    const projectTitle = useStore(Selector.projectTitle);

    const { t } = useTranslation();
    const lang = useMemo(() => {
      return { lng: language };
    }, [language]);
    const isOwner = user.uid === projectOwner;

    return (
      <div>
        <Space style={{ fontSize: '12px', paddingBottom: '8px' }}>
          <Space>{t('projectPanel.GridLines', lang) + ':'}</Space>
          <Checkbox
            onChange={(e) => {
              const checked = e.target.checked;
              setXLines(checked);
              if (isOwner) {
                if (user.uid && projectTitle) {
                  updateHorizontalLinesScatterPlot(user.uid, projectTitle, checked).then(() => {
                    setCommonStore((state) => {
                      state.projectState.xLinesScatterPlot = checked;
                    });
                  });
                }
              }
              setChanged(true);
            }}
            checked={xLines}
          >
            <span style={{ fontSize: '12px' }}>{t('projectPanel.HorizontalLines', lang)}</span>
          </Checkbox>
          <Checkbox
            onChange={(e) => {
              const checked = e.target.checked;
              setYLines(checked);
              if (isOwner) {
                if (user.uid && projectTitle) {
                  updateVerticalLinesScatterPlot(user.uid, projectTitle, checked).then(() => {
                    setCommonStore((state) => {
                      state.projectState.yLinesScatterPlot = checked;
                    });
                  });
                }
              }
              setChanged(true);
            }}
            checked={yLines}
          >
            <span style={{ fontSize: '12px' }}>{t('projectPanel.VerticalLines', lang)}</span>
          </Checkbox>
        </Space>
        <br />
        <Space style={{ fontSize: '12px' }}>
          <Space style={{ width: '80px' }}>{t('projectPanel.SymbolSize', lang) + ':'}</Space>
          <Slider
            style={{ width: '120px' }}
            min={0}
            max={10}
            value={dotSize}
            onChange={(v) => {
              setDotSize(v);
              if (isOwner) {
                if (user.uid && projectTitle) {
                  updateSymbolSizeScatterPlot(user.uid, projectTitle, v).then(() => {
                    setCommonStore((state) => {
                      state.projectState.dotSizeScatterPlot = v;
                    });
                  });
                }
              }
              setChanged(true);
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
            value={lineWidth}
            onChange={(v) => {
              setLineWidth(v);
              if (isOwner) {
                if (user.uid && projectTitle) {
                  updateLineWidthScatterPlot(user.uid, projectTitle, v).then(() => {
                    setCommonStore((state) => {
                      state.projectState.lineWidthScatterPlot = v;
                    });
                  });
                }
              }
              setChanged(true);
            }}
          />
        </Space>
      </div>
    );
  },
);

export default GraphSettingsContent;
