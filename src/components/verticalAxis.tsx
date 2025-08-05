/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScaleLinear } from 'd3-scale';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { ConfigProvider, InputNumber, Popover, Slider, Space } from 'antd';
import { Range } from '../types';
import { useTranslation } from 'react-i18next';
import { Filter, FilterType } from '../Filter';
import { ProjectUtil } from '../project/ProjectUtil.ts';
import { UndoableChange } from '../undo/UndoableChange.ts';
import { Undoable } from '../undo/Undoable.ts';
import { openInNewTab } from '../helpers.tsx';

type VerticalAxisProps = {
  variable: string;
  name: string;
  unit: string;
  yScale: ScaleLinear<number, number>;
  tickInterval: number;
  tickIntegers: boolean;
  type: string;
  digits: number;
  min: number;
  max: number;
  step: number;
  value?: number;
  filter?: Filter;
  hover?: (i: number) => void;
};

const DEFAULT_TICK_LENGTH = 8;

const VerticalAxis = React.memo(
  ({
    yScale,
    tickInterval,
    tickIntegers,
    variable,
    name,
    unit,
    type,
    digits,
    min,
    max,
    step,
    value,
    filter,
    hover,
  }: VerticalAxisProps) => {
    const setCommonStore = useStore(Selector.set);
    const language = useStore(Selector.language);
    const selectedProperty = useStore(Selector.selectedProperty);
    const setChanged = usePrimitiveStore(Selector.setChanged);
    const addUndoable = useStore(Selector.addUndoable);
    const hiddenProperties = useStore(Selector.hiddenProperties);
    const enableFilters = !!useStore(Selector.enableFilters);

    const [updateFlag, setUpdateFlag] = useState<boolean>(false);
    const minRef = useRef<number>(min);
    const maxRef = useRef<number>(max);

    useEffect(() => {
      minRef.current = min;
    }, [min]);

    useEffect(() => {
      maxRef.current = max;
    }, [max]);

    const { t } = useTranslation();
    const lang = { lng: language };
    const range = yScale.range();
    const areaHeight = yScale(min) - yScale(max);
    const areaWidth = 40;

    const ticks = useMemo(() => {
      const height = range[0] - range[1];
      const numberOfTicks = type === 'number' ? Math.floor(height / tickInterval) : 1;
      const ticks = tickIntegers
        ? yScale.ticks(numberOfTicks).filter((tick) => Number.isInteger(tick))
        : yScale.ticks(numberOfTicks);
      return ticks.map((value) => ({
        value,
        yOffset: yScale(value),
      }));
    }, [yScale, tickInterval, type, tickIntegers]);

    const select = () => {
      const undoable = {
        name: (selectedProperty === variable ? 'Deselect' : 'Select') + ' Property: ' + variable,
        timestamp: Date.now(),
        undo: () => {
          toggleSelect();
        },
        redo: () => {
          toggleSelect();
        },
      } as Undoable;
      addUndoable(undoable);
      toggleSelect();
    };

    const toggleSelect = () => {
      setCommonStore((state) => {
        state.projectState.selectedProperty = state.projectState.selectedProperty !== variable ? variable : null;
      });
      usePrimitiveStore.getState().set((state) => {
        state.updateProjectsFlag = true;
      });
      setChanged(true);
    };

    const createLabel = (text: string, width: number) => {
      return <span style={{ display: 'block', width: width + 'px' }}>{text}</span>;
    };

    const createTitle = () => {
      return (
        <text
          onClick={select}
          x={0}
          y={-20}
          style={{
            fontSize: '10px',
            textAnchor: 'middle',
            fill: 'dimgray',
            cursor: 'pointer',
            fontWeight: selectedProperty === variable ? 'bold' : 'normal',
          }}
        >
          {name}
        </text>
      );
    };

    const getMin = () => {
      if (
        variable === 'molecularMass' ||
        variable === 'atomCount' ||
        variable === 'bondCount' ||
        variable === 'hydrogenBondDonorCount' ||
        variable === 'hydrogenBondAcceptorCount' ||
        variable === 'rotatableBondCount' ||
        variable === 'polarSurfaceArea' ||
        variable === 'heavyAtomCount' ||
        variable === 'complexity' ||
        variable === 'density'
      )
        return 0;
      return Number.MIN_SAFE_INTEGER;
    };

    const setMin = (newValue: number | null) => {
      if (newValue === null) return;
      const oldValue = minRef.current;
      const undoableChange = {
        name: 'Set Minimum: ' + name,
        timestamp: Date.now(),
        oldValue,
        newValue,
        undo: () => {
          setRangeMinimum(oldValue);
        },
        redo: () => {
          setRangeMinimum(newValue);
        },
      } as UndoableChange;
      addUndoable(undoableChange);
      setRangeMinimum(newValue);
    };

    const setRangeMinimum = (value: number) => {
      setCommonStore((state) => {
        if (state.projectState.ranges) {
          let index = -1;
          let range = null;
          for (const [i, r] of state.projectState.ranges.entries()) {
            if (r.variable === variable) {
              index = i;
              range = r;
              break;
            }
          }
          if (index >= 0 && range) {
            state.projectState.ranges[index] = {
              variable: range.variable,
              minimum: value,
              maximum: range.maximum,
            } as Range;
          } else {
            const r = { variable, minimum: value, maximum: max } as Range;
            state.projectState.ranges.push(r);
          }
        } else {
          const r = { variable, minimum: value, maximum: max } as Range;
          state.projectState.ranges = [r];
        }
      });
      minRef.current = Number(value);
      setUpdateFlag(!updateFlag);
      setChanged(true);
    };

    const getMax = () => {
      return Number.MAX_SAFE_INTEGER;
    };

    const setMax = (newValue: number | null) => {
      if (newValue === null) return;
      const oldValue = maxRef.current;
      const undoableChange = {
        name: 'Set Maximum: ' + name,
        timestamp: Date.now(),
        oldValue,
        newValue,
        undo: () => {
          setRangeMaximum(oldValue);
        },
        redo: () => {
          setRangeMaximum(newValue);
        },
      } as UndoableChange;
      addUndoable(undoableChange);
      setRangeMaximum(newValue);
    };

    const setRangeMaximum = (value: number) => {
      setCommonStore((state) => {
        if (state.projectState.ranges) {
          let index = -1;
          let range = null;
          for (const [i, r] of state.projectState.ranges.entries()) {
            if (r.variable === variable) {
              index = i;
              range = r;
              break;
            }
          }
          if (index >= 0 && range) {
            state.projectState.ranges[index] = {
              variable: range.variable,
              minimum: range.minimum,
              maximum: value,
            } as Range;
          } else {
            const r = { variable, minimum: min, maximum: value } as Range;
            state.projectState.ranges.push(r);
          }
        } else {
          const r = { variable, minimum: min, maximum: value } as Range;
          state.projectState.ranges = [r];
        }
      });
      maxRef.current = Number(value);
      setUpdateFlag(!updateFlag);
      setChanged(true);
    };

    const changeFilter = (values: number[]) => {
      if (!filter) return;
      const oldValue = [filter.lowerBound, filter.upperBound] as number[];
      const undoableChange = {
        name: 'Set Filter: ' + name,
        timestamp: Date.now(),
        oldValue,
        newValue: values,
        undo: () => {
          setFilterBounds(oldValue);
        },
        redo: () => {
          setFilterBounds(values);
        },
      } as UndoableChange;
      addUndoable(undoableChange);
      setFilterBounds(values);
    };

    const setFilterBounds = (values: number[]) => {
      if (filter) {
        filter.lowerBound = values[0];
        filter.upperBound = values[1];
        if (hover) hover(-1);
        usePrimitiveStore.getState().set((state) => {
          state.hoveredMolecule = null;
        });
        setCommonStore((state) => {
          if (state.projectState.filters) {
            let index = -1;
            for (const [i, f] of state.projectState.filters.entries()) {
              if (f.variable === variable) {
                index = i;
                break;
              }
            }
            if (index >= 0) {
              state.projectState.filters[index] = {
                variable: filter.variable,
                type: filter.type,
                lowerBound: filter.lowerBound,
                upperBound: filter.upperBound,
              } as Filter;
            } else {
              const f = {
                variable,
                type: filter.type,
                lowerBound: filter.lowerBound,
                upperBound: filter.upperBound,
              } as Filter;
              state.projectState.filters.push(f);
            }
            for (const m of state.projectState.molecules) {
              const p = state.molecularPropertiesMap.get(m.name);
              if (p) {
                m.excluded = ProjectUtil.isExcluded(state.projectState.filters, p, hiddenProperties ?? []);
              }
            }
          }
        });
        setUpdateFlag(!updateFlag);
        setChanged(true);
      }
    };

    const url = t('url.' + variable, lang);

    return (
      <>
        {/* Title */}
        <Popover
          content={
            <div>
              <Space
                direction={'vertical'}
                style={{
                  padding: '8px',
                  fontSize: '13px',
                  width: '240px',
                  border: '1px solid lightgray',
                  borderRadius: '6px',
                }}
              >
                <Space>{t('tooltip.' + variable, lang)}</Space>
                {url !== '' && (
                  <Space
                    style={{
                      color: 'blueviolet',
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: 'end',
                      paddingRight: '8px',
                    }}
                    title={url}
                    onClick={() => openInNewTab(url)}
                  >
                    {t('word.MoreInformation', lang) + '...'}
                  </Space>
                )}
              </Space>
              <br />
              <InputNumber
                style={{ paddingTop: '4px', width: '240px' }}
                addonBefore={createLabel(t('word.Minimum', lang), 80)}
                addonAfter={unit}
                min={getMin()}
                max={maxRef.current - step}
                step={step}
                value={minRef.current}
                onPressEnter={(e) => setMin(Number.parseFloat((e.target as HTMLInputElement).value))}
                onStep={(value) => setMin(value)}
              />
              <br />
              <InputNumber
                style={{ width: '240px' }}
                addonBefore={createLabel(t('word.Maximum', lang), 80)}
                addonAfter={unit}
                min={minRef.current + step}
                max={getMax()}
                step={step}
                value={maxRef.current}
                onPressEnter={(e) => setMax(Number.parseFloat((e.target as HTMLInputElement).value))}
                onStep={(value) => setMax(value)}
              />
            </div>
          }
        >
          {createTitle()}
        </Popover>
        {value !== undefined && value !== null && (
          <text
            x={0}
            y={-8}
            style={{
              fontSize: '9px',
              textAnchor: 'middle',
              fill: 'dimgray',
            }}
          >
            {value.toFixed(digits) + (unit !== '' ? unit : '')}
          </text>
        )}

        {/* filter track */}
        {filter && filter.type === FilterType.Between && (
          <rect
            x={-5}
            y={yScale(filter.upperBound ?? max)}
            width={10}
            height={yScale(filter?.lowerBound ?? min) - yScale(filter?.upperBound ?? max)}
            fill={'lightgray'}
          />
        )}

        <rect
          x={-areaWidth / 2}
          y={0}
          width={areaWidth}
          height={areaHeight}
          fill="gold"
          fillOpacity={selectedProperty === variable ? 0.25 : 0}
        />

        {/* Ticks and labels */}
        {ticks.map(({ value, yOffset }) => (
          <g key={value} transform={`translate(0, ${yOffset})`} shapeRendering={'crispEdges'}>
            <line x1={-DEFAULT_TICK_LENGTH} x2={0} stroke="black" strokeWidth={1} />
            <text
              key={value}
              style={{
                fontSize: '10px',
                textAnchor: 'start',
                alignmentBaseline: 'central',
                transform: 'translateX(-30px)',
              }}
            >
              {value}
            </text>
          </g>
        ))}

        <line x1={0} x2={0} y1={yScale(min)} y2={yScale(max)} stroke="black" strokeWidth={2} />

        {enableFilters && filter && filter.type === FilterType.Between && (
          <foreignObject x={-areaWidth / 2} y={-4} width={areaWidth} height={(areaHeight ?? 3) - 3}>
            <ConfigProvider
              theme={{
                components: {
                  Slider: {
                    railBg: 'black',
                    railSize: 0,
                    handleSize: 8,
                  },
                },
              }}
            >
              <Slider
                style={{ marginLeft: areaWidth / 2 + 'px' }}
                min={min}
                max={max}
                step={(max - min) / 100}
                value={[filter.lowerBound ?? min, filter.upperBound ?? max]}
                onChange={(values) => setFilterBounds(values)}
                onChangeComplete={(values) => changeFilter(values)}
                range={true}
                vertical
              />
            </ConfigProvider>
          </foreignObject>
        )}
      </>
    );
  },
);

export default VerticalAxis;
