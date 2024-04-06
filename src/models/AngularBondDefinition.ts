/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Triple } from './Triple.ts';

export const getAngularBondDefinition = (name: string): Triple[] => {
  if (name === 'Water') {
    return [{ i: 1, j: 0, k: 2 }];
  }

  if (name === 'Carbon Dioxide') {
    return [{ i: 0, j: 2, k: 1 }];
  }

  if (name === 'Ozone') {
    return [{ i: 1, j: 0, k: 2 }];
  }

  if (name === 'Methane') {
    return [
      { i: 1, j: 0, k: 2 },
      { i: 2, j: 0, k: 3 },
      { i: 3, j: 0, k: 4 },
      { i: 4, j: 0, k: 1 },
    ];
  }

  if (name === 'Ethane') {
    return [
      // left CH3 group
      { i: 2, j: 0, k: 3 },
      { i: 3, j: 0, k: 4 },
      { i: 4, j: 0, k: 2 },
      // right CH3 group
      { i: 5, j: 1, k: 6 },
      { i: 6, j: 1, k: 7 },
      { i: 7, j: 1, k: 5 },
      // H-C-C angles
      { i: 2, j: 0, k: 1 },
      { i: 3, j: 0, k: 1 },
      { i: 4, j: 0, k: 1 },
      // C-C-H angles
      { i: 0, j: 1, k: 5 },
      { i: 0, j: 1, k: 6 },
      { i: 0, j: 1, k: 7 },
    ];
  }

  if (name === 'Propane') {
    return [
      // C-C-C backbone
      { i: 1, j: 0, k: 2 },

      // CH3-1 terminal group
      { i: 5, j: 1, k: 6 },
      { i: 6, j: 1, k: 7 },
      { i: 7, j: 1, k: 5 },

      // CH2 group
      { i: 3, j: 0, k: 4 },

      // CH3-2 terminal group
      { i: 8, j: 2, k: 9 },
      { i: 9, j: 2, k: 10 },
      { i: 10, j: 2, k: 8 },

      // between CH3-1 and CH2
      // H-C-C
      { i: 5, j: 1, k: 0 },
      { i: 6, j: 1, k: 0 },
      { i: 7, j: 1, k: 0 },
      // C-C-H
      { i: 1, j: 0, k: 3 },
      { i: 1, j: 0, k: 4 },

      // between CH2 and CH3-2
      // C-C-H
      { i: 0, j: 2, k: 8 },
      { i: 0, j: 2, k: 9 },
      { i: 0, j: 2, k: 10 },
      // H-C-C
      { i: 3, j: 0, k: 2 },
      { i: 4, j: 0, k: 2 },
    ];
  }

  if (name === 'Butane') {
    return [
      // C-C-C backbone
      { i: 2, j: 0, k: 1 },
      { i: 0, j: 1, k: 3 },

      // CH3-1 terminal group
      { i: 8, j: 2, k: 9 },
      { i: 9, j: 2, k: 10 },
      { i: 10, j: 2, k: 8 },

      // CH2-1 group
      { i: 4, j: 0, k: 5 },

      // CH2-2 group
      { i: 7, j: 1, k: 6 },

      // CH3-2 group
      { i: 11, j: 3, k: 12 },
      { i: 12, j: 3, k: 13 },
      { i: 13, j: 3, k: 11 },

      // between CH3-1 to CH2-1
      // H-C-C
      { i: 8, j: 2, k: 0 },
      { i: 9, j: 2, k: 0 },
      { i: 10, j: 2, k: 0 },
      // C-C-H
      { i: 2, j: 0, k: 4 },
      { i: 2, j: 0, k: 5 },

      // between CH2-1 to CH2-2
      // H-C-C
      { i: 4, j: 0, k: 1 },
      { i: 5, j: 0, k: 1 },
      // C-C-H
      { i: 0, j: 1, k: 6 },
      { i: 0, j: 1, k: 7 },

      // between CH-2 to CH3-2
      // H-C-C
      { i: 6, j: 1, k: 3 },
      { i: 7, j: 1, k: 3 },
      // C-C-H
      { i: 1, j: 3, k: 11 },
      { i: 1, j: 3, k: 12 },
      { i: 1, j: 3, k: 13 },
    ];
  }

  if (name === 'Pentane') {
    return [
      // backbone C-C-C
      { i: 3, j: 1, k: 0 },
      { i: 1, j: 0, k: 2 },
      { i: 0, j: 2, k: 4 },

      // CH3-1 terminal group
      { i: 11, j: 3, k: 12 },
      { i: 12, j: 3, k: 13 },
      { i: 13, j: 3, k: 11 },

      // CH2-1 group
      { i: 7, j: 1, k: 8 },

      // CH2-2 group
      { i: 5, j: 0, k: 6 },

      // CH2-3 group
      { i: 9, j: 2, k: 10 },

      // CH3-2 terminal group
      { i: 14, j: 4, k: 15 },
      { i: 15, j: 4, k: 16 },
      { i: 16, j: 4, k: 14 },

      // between CH3-1 and CH2-1
      // H-C-C
      { i: 11, j: 3, k: 1 },
      { i: 12, j: 3, k: 1 },
      { i: 13, j: 3, k: 1 },
      // C-C-H
      { i: 3, j: 1, k: 7 },
      { i: 3, j: 1, k: 8 },

      // between CH2-1 and CH2-2
      // H-C-C
      { i: 7, j: 1, k: 0 },
      { i: 8, j: 1, k: 0 },
      // C-C-H
      { i: 1, j: 0, k: 5 },
      { i: 1, j: 0, k: 6 },

      // between CH2-2 and CH2-3
      // H-C-C
      { i: 5, j: 0, k: 2 },
      { i: 6, j: 0, k: 2 },
      // C-C-H
      { i: 0, j: 2, k: 9 },
      { i: 0, j: 2, k: 10 },

      // between CH2-3 and CH3-2
      // H-C-C
      { i: 9, j: 2, k: 4 },
      { i: 10, j: 2, k: 4 },
      // C-C-H
      { i: 2, j: 4, k: 14 },
      { i: 2, j: 4, k: 15 },
      { i: 2, j: 4, k: 16 },
    ];
  }
  return [];
};
