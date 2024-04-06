/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Quadruple } from './Quadruple.ts';

export const getTorsionalBondDefinition = (name: string): Quadruple[] => {
  if (name === 'Ethane') {
    return [
      // H-C-C-H
      { i: 2, j: 0, k: 1, l: 7 },
      { i: 3, j: 0, k: 1, l: 5 },
      { i: 4, j: 0, k: 1, l: 6 },
    ];
  }

  if (name === 'Propane') {
    return [
      // between CH3-1 and CH2
      // H-C-C-H
      { i: 5, j: 1, k: 0, l: 3 },
      { i: 5, j: 1, k: 0, l: 4 },
      { i: 6, j: 1, k: 0, l: 3 },
      { i: 6, j: 1, k: 0, l: 4 },

      // between CH2 and CH3-2
      // H-C-C-H
      { i: 3, j: 0, k: 2, l: 8 },
      { i: 4, j: 0, k: 2, l: 8 },
      { i: 3, j: 0, k: 2, l: 9 },
      { i: 4, j: 0, k: 2, l: 9 },
    ];
  }

  if (name === 'Butane') {
    return [
      // C-C-C-C backbone
      { i: 2, j: 0, k: 1, l: 3 },

      // between CH3-1 and CH2-1
      // H-C-C-H
      { i: 8, j: 2, k: 0, l: 4 },
      { i: 8, j: 2, k: 0, l: 5 },
      { i: 9, j: 2, k: 0, l: 4 },
      { i: 9, j: 2, k: 0, l: 5 },

      // between CH2-1 and CH2-2
      // H-C-C-H
      { i: 4, j: 0, k: 1, l: 6 },
      { i: 4, j: 0, k: 1, l: 7 },
      { i: 5, j: 0, k: 1, l: 6 },
      { i: 5, j: 0, k: 1, l: 7 },

      // between CH2-2 and CH3-2
      // H-C-C-H
      { i: 6, j: 1, k: 3, l: 11 },
      { i: 7, j: 1, k: 3, l: 11 },
      { i: 6, j: 1, k: 3, l: 12 },
      { i: 7, j: 1, k: 3, l: 12 },
    ];
  }

  if (name === 'Pentane') {
    return [
      // C-C-C-C backbone
      { i: 3, j: 1, k: 0, l: 2 },
      { i: 1, j: 0, k: 2, l: 4 },

      // between CH3-1 and CH2-1
      // H-C-C-H
      { i: 11, j: 3, k: 1, l: 7 },
      { i: 11, j: 3, k: 1, l: 8 },
      { i: 12, j: 3, k: 1, l: 7 },
      { i: 12, j: 3, k: 1, l: 8 },

      // between CH2-1 and CH2-2
      // H-C-C-H
      { i: 7, j: 1, k: 0, l: 5 },
      { i: 7, j: 1, k: 0, l: 6 },
      { i: 8, j: 1, k: 0, l: 5 },
      { i: 8, j: 1, k: 0, l: 6 },

      // between CH2-2 and CH2-3
      // H-C-C-H
      { i: 5, j: 0, k: 2, l: 9 },
      { i: 5, j: 0, k: 2, l: 10 },
      { i: 6, j: 0, k: 2, l: 9 },
      { i: 6, j: 0, k: 2, l: 10 },

      // between CH2-3 and CH3-2
      // H-C-C-H
      { i: 9, j: 2, k: 4, l: 14 },
      { i: 10, j: 2, k: 4, l: 14 },
      { i: 9, j: 2, k: 4, l: 15 },
      { i: 10, j: 2, k: 4, l: 15 },
    ];
  }
  return [];
};
