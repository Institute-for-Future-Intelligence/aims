/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
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

  const xLinesRef = useRef<boolean>(xLinesScatterPlot);
  const yLinesRef = useRef<boolean>(yLinesScatterPlot);
  const lineWidthRef = useRef<number>(lineWidthScatterPlot ?? 1);
  const dotSizeRef = useRef<number>(dotSizeScatterPlot ?? 4);

  useEffect(() => {
    if (xLinesScatterPlot) {
      xLinesRef.current = xLinesScatterPlot;
    }
  }, [xLinesScatterPlot]);

  useEffect(() => {
    if (yLinesScatterPlot) {
      yLinesRef.current = yLinesScatterPlot;
    }
  }, [yLinesScatterPlot]);

  useEffect(() => {
    if (dotSizeScatterPlot) {
      dotSizeRef.current = dotSizeScatterPlot;
    }
  }, [dotSizeScatterPlot]);

  useEffect(() => {
    if (lineWidthScatterPlot) {
      lineWidthRef.current = lineWidthScatterPlot;
    }
  }, [lineWidthScatterPlot]);

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
            xLinesRef.current = checked;
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
          checked={xLinesRef.current}
        >
          <span style={{ fontSize: '12px' }}>{t('projectPanel.HorizontalLines', lang)}</span>
        </Checkbox>
        <Checkbox
          onChange={(e) => {
            const checked = e.target.checked;
            yLinesRef.current = checked;
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
          checked={yLinesRef.current}
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
          value={dotSizeRef.current}
          onChange={(v) => {
            dotSizeRef.current = v;
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
          value={lineWidthRef.current}
          onChange={(v) => {
            lineWidthRef.current = v;
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
});

export default GraphSettingsContent;
