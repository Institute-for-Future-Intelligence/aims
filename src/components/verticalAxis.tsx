/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScaleLinear } from 'd3-scale';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { ConfigProvider, InputNumber, Popover, Slider } from 'antd';
import { Range } from '../types';
import { useTranslation } from 'react-i18next';
import { Filter, FilterType } from '../Filter';
import { ProjectUtil } from '../ProjectUtil';

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
};

const DEFAULT_TICK_LENGTH = 8;

const VerticalAxis = ({
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
}: VerticalAxisProps) => {
  const setCommonStore = useStore(Selector.set);
  const user = useStore(Selector.user);
  const language = useStore(Selector.language);
  const projectState = useStore(Selector.projectState);

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
  const isOwner = user.uid === projectState.owner;
  const range = yScale.range();
  const areaHeight = yScale(min) - yScale(max);
  const areaWidth = 40;

  const updateSelectedProperty = async (userid: string, projectTitle: string, selectedProperty: string | null) => {
    // TODO Firestore
  };

  const addRange = async (userid: string, projectTitle: string, range: Range) => {
    // TODO Firestore
  };

  const updateRanges = async (userid: string, projectTitle: string, ranges: Range[]) => {
    // TODO Firestore
  };

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

  const localSelect = () => {
    setCommonStore((state) => {
      state.projectState.selectedProperty = state.projectState.selectedProperty !== variable ? variable : null;
    });
    usePrimitiveStore.getState().set((state) => {
      state.updateProjectsFlag = true;
    });
  };

  const select = () => {
    if (isOwner && projectState.owner && projectState.title) {
      updateSelectedProperty(
        projectState.owner,
        projectState.title,
        projectState.selectedProperty !== variable ? variable : null,
      ).then(() => {
        localSelect();
      });
    } else {
      localSelect();
    }
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
          fontWeight: projectState.selectedProperty === variable ? 'bold' : 'normal',
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
      variable === 'polarSurfaceArea'
    )
      return 0;
    return Number.MIN_SAFE_INTEGER;
  };

  const getMax = () => {
    return Number.MAX_SAFE_INTEGER;
  };

  return (
    <>
      {/* Title */}
      <Popover
        content={
          <div>
            <InputNumber
              style={{ width: '240px' }}
              addonBefore={createLabel(t('word.Minimum', lang), 80)}
              addonAfter={unit}
              min={getMin()}
              max={maxRef.current - step}
              step={step}
              value={minRef.current}
              onChange={(value) => {
                if (value === null) return;
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
                      if (user.uid && projectState.title) {
                        updateRanges(user.uid, projectState.title, state.projectState.ranges);
                      }
                    } else {
                      const r = { variable, minimum: value, maximum: max } as Range;
                      state.projectState.ranges.push(r);
                      if (user.uid && projectState.title) {
                        addRange(user.uid, projectState.title, r);
                      }
                    }
                  } else {
                    const r = { variable, minimum: value, maximum: max } as Range;
                    state.projectState.ranges = [r];
                    if (user.uid && projectState.title) {
                      addRange(user.uid, projectState.title, r);
                    }
                  }
                });
                minRef.current = Number(value);
                setUpdateFlag(!updateFlag);
              }}
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
              onChange={(value) => {
                if (value === null) return;
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
                      if (user.uid && projectState.title) {
                        updateRanges(user.uid, projectState.title, state.projectState.ranges);
                      }
                    } else {
                      const r = { variable, minimum: min, maximum: value } as Range;
                      state.projectState.ranges.push(r);
                      if (user.uid && projectState.title) {
                        addRange(user.uid, projectState.title, r);
                      }
                    }
                  } else {
                    const r = { variable, minimum: min, maximum: value } as Range;
                    state.projectState.ranges = [r];
                    if (user.uid && projectState.title) {
                      addRange(user.uid, projectState.title, r);
                    }
                  }
                });
                maxRef.current = Number(value);
                setUpdateFlag(!updateFlag);
              }}
            />
          </div>
        }
      >
        {createTitle()}
      </Popover>
      {value !== undefined && (
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
        fillOpacity={projectState.selectedProperty === variable ? 0.25 : 0}
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

      {filter && filter.type === FilterType.Between && (
        <foreignObject x={-areaWidth / 2} y={-5} width={areaWidth} height={areaHeight - 3}>
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
              value={[filter.lowerBound ?? min, filter.upperBound ?? max]}
              onChange={(values) => {
                if (filter) {
                  filter.lowerBound = values[0];
                  filter.upperBound = values[1];
                  usePrimitiveStore.getState().set((state) => {
                    state.hoveredMolecule = null;
                  });
                  setCommonStore((state) => {
                    state.selectedMolecule = null;
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
                          m.excluded = ProjectUtil.isExcluded(state.projectState.filters, p);
                        }
                      }
                    }
                  });
                  setUpdateFlag(!updateFlag);
                }
              }}
              range={true}
              vertical
            />
          </ConfigProvider>
        </foreignObject>
      )}
    </>
  );
};

export default React.memo(VerticalAxis);
