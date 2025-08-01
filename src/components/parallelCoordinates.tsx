/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { DatumEntry } from '../types';
import React, { useMemo } from 'react';
import VerticalAxis from './verticalAxis';
import { Filter } from '../Filter';

const MARGIN = { top: 30, right: 55, bottom: 36, left: 55 };

const COLORS = [
  '#e0ac2b',
  '#e85252',
  '#6689c6',
  '#9a6fb0',
  '#a53253',
  '#69b3a2',
  '#556b2f',
  '#8b008b',
  '#ff1493',
  '#d2691e',
  '#2f4f4f',
  '#dc143c',
];

type ParallelCoordinatesProps = {
  id: string;
  width: number;
  height: number;
  data: DatumEntry[];
  types: string[];
  minima: number[];
  maxima: number[];
  steps: number[];
  variables: string[];
  titles: string[];
  units: string[];
  digits: number[];
  tickIntegers: boolean[];
  filters: Filter[];
  hover: (i: number) => void;
  hoveredIndex: number;
  selectedIndex: number;
};

type YScale = d3Scale.ScaleLinear<number, number>;

const ParallelCoordinates = React.memo(
  ({
    id,
    width,
    height,
    data,
    types,
    minima,
    maxima,
    steps,
    variables,
    titles,
    units,
    digits,
    tickIntegers,
    filters,
    hover,
    hoveredIndex,
    selectedIndex,
  }: ParallelCoordinatesProps) => {
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const allGroups = [...new Set(data.map((d) => d.group as string))];

    // Compute a xScale: spread all Y axis along the chart width
    const xScale = useMemo(
      () => d3Scale.scalePoint<string>().range([0, boundsWidth]).domain(variables).padding(0),
      [variables, boundsWidth],
    );

    // Compute the yScales: 1 scale per variable
    const yScales: { [name: string]: YScale } = useMemo(() => {
      const tmp: { [name: string]: YScale } = {};
      variables.forEach((variable, index) => {
        tmp[variable] =
          minima[index] !== maxima[index]
            ? d3Scale
                .scaleLinear()
                .range([boundsHeight, 0])
                .domain([minima[index] ?? 0, maxima[index] ?? 1])
            : d3Scale
                .scaleLinear()
                .range([boundsHeight, 0])
                .domain([(minima[index] ?? 0) - 1, (maxima[index] ?? 1) + 1]);
      });
      return tmp;
    }, [variables, boundsHeight, minima, maxima]);

    // Color Scale
    const colorScale = d3Scale.scaleOrdinal<string>().domain(allGroups).range(COLORS);

    // Compute lines
    const lineGenerator = d3Shape.line();

    const allLines = useMemo(
      () =>
        data.map((e, i) => {
          if (e.invisible) return null;
          const allCoordinates = variables.map((v) => {
            const yScale = yScales[v];
            // I don't understand the type of scalePoint. IMO x cannot be undefined since I'm passing it something of type Variable.
            const x = xScale(v) ?? 0;
            const y = yScale(e[v] as number);
            return [x, y] as [number, number];
          });

          const d = lineGenerator(allCoordinates);
          if (!d) {
            return undefined;
          }

          return (
            <path
              onMouseOver={() => {
                if (hover) hover(i);
              }}
              key={i}
              d={d}
              cursor={e.hovered ? 'pointer' : 'default'}
              stroke={e.hovered ? 'red' : colorScale(e.group as string)}
              fill="none"
              strokeWidth={e.selected && !e.excluded ? 3 : e.excluded ? 0.5 : 1.5}
              strokeDasharray={e.hovered ? '3,3' : 'none'}
            />
          );
        }),
      [data, colorScale, variables, xScale, yScales],
    );

    // Compute Axes
    const allAxes = useMemo(
      () =>
        variables.map((variable, i) => {
          const yScale = yScales[variable];
          return (
            <g key={i} transform={'translate(' + xScale(variable) + ',0)'}>
              <VerticalAxis
                yScale={yScale}
                tickInterval={40}
                tickIntegers={tickIntegers[i]}
                type={types[i] ?? 'number'}
                variable={variables[i]}
                name={titles[i]}
                unit={units[i]}
                digits={digits[i]}
                min={minima[i] === maxima[i] ? minima[i] - 1 : minima[i]}
                max={maxima[i] === minima[i] ? maxima[i] + 1 : maxima[i]}
                step={steps[i]}
                filter={filters[i]}
                value={
                  hoveredIndex >= 0 && data[hoveredIndex] && !data[hoveredIndex]?.invisible
                    ? (data[hoveredIndex][variable] as number)
                    : selectedIndex >= 0 && data[selectedIndex] && !data[selectedIndex].invisible
                      ? (data[selectedIndex][variable] as number)
                      : undefined
                }
                hover={hover}
              />
            </g>
          );
        }),
      [
        variables,
        data,
        digits,
        filters,
        minima,
        maxima,
        steps,
        tickIntegers,
        titles,
        types,
        units,
        xScale,
        yScales,
        selectedIndex,
        hoveredIndex,
      ],
    );

    return (
      <svg
        id={id}
        width={width}
        height={height}
        onMouseLeave={() => {
          if (hover) hover(-1);
        }}
        onContextMenu={(event) => {
          event.stopPropagation();
        }}
      >
        <g width={boundsWidth} height={boundsHeight} transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}>
          {allLines}
          {allAxes}
        </g>
      </svg>
    );
  },
);

export default ParallelCoordinates;
