/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Quadruple } from './Quadruple.ts';

export const getTorsionalBondDefinition = (name: string): Quadruple[] => {
  if (name === 'Ethane') {
    return [
      // H-C-C-H
      { i1: 2, i2: 0, i3: 1, i4: 7 },
      { i1: 3, i2: 0, i3: 1, i4: 5 },
      { i1: 4, i2: 0, i3: 1, i4: 6 },
    ];
  }
  if (name === 'Propane') {
    return [
      // H-C-C-H from left to middle
      { i1: 5, i2: 1, i3: 0, i4: 3 },
      { i1: 5, i2: 1, i3: 0, i4: 4 },
      { i1: 6, i2: 1, i3: 0, i4: 3 },
      { i1: 6, i2: 1, i3: 0, i4: 4 },
      // H-C-C-C from left to right
      { i1: 5, i2: 1, i3: 0, i4: 2 },
      { i1: 6, i2: 1, i3: 0, i4: 2 },
      // H-C-C-H from middle to right
      { i1: 3, i2: 0, i3: 2, i4: 8 },
      { i1: 4, i2: 0, i3: 2, i4: 8 },
      { i1: 3, i2: 0, i3: 2, i4: 9 },
      { i1: 4, i2: 0, i3: 2, i4: 9 },
      // C-C-C-H from left to right
      { i1: 1, i2: 0, i3: 2, i4: 8 },
      { i1: 1, i2: 0, i3: 2, i4: 9 },
    ];
  }
  if (name === 'Butane') {
    return [
      // C-C-C-C
      { i1: 2, i2: 0, i3: 1, i4: 3 },
      // H-C-C-H from left to middle
      { i1: 8, i2: 2, i3: 0, i4: 4 },
      { i1: 8, i2: 2, i3: 0, i4: 5 },
      { i1: 9, i2: 2, i3: 0, i4: 4 },
      { i1: 9, i2: 2, i3: 0, i4: 5 },
      // H-C-C-C from left to right
      { i1: 8, i2: 2, i3: 0, i4: 1 },
      { i1: 9, i2: 2, i3: 0, i4: 1 },
      // H-C-C-H from middle to right
      { i1: 6, i2: 1, i3: 3, i4: 11 },
      { i1: 7, i2: 1, i3: 3, i4: 11 },
      { i1: 6, i2: 1, i3: 3, i4: 12 },
      { i1: 7, i2: 1, i3: 3, i4: 12 },
      // C-C-C-H from left to right
      { i1: 0, i2: 1, i3: 3, i4: 11 },
      { i1: 0, i2: 1, i3: 3, i4: 12 },
      // H-C-C-H from middle to middle
      { i1: 4, i2: 0, i3: 1, i4: 6 },
      { i1: 5, i2: 0, i3: 1, i4: 7 },
    ];
  }
  return [];
};
