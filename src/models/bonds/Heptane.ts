/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export class Heptane {
  static angularBondDefinition = [
    // backbone C-C-C
    { i: 6, j: 4, k: 2 },
    { i: 4, j: 2, k: 0 },
    { i: 2, j: 0, k: 1 },
    { i: 0, j: 1, k: 3 },
    { i: 1, j: 3, k: 5 },

    // CH3-1 terminal group
    { i: 20, j: 6, k: 21 },
    { i: 21, j: 6, k: 22 },
    { i: 22, j: 6, k: 20 },

    // CH2-1 group
    { i: 15, j: 4, k: 16 },

    // CH2-2 group
    { i: 11, j: 2, k: 12 },

    // CH2-3 group
    { i: 7, j: 0, k: 8 },

    // CH2-4 group
    { i: 9, j: 1, k: 10 },

    // CH2-5 group
    { i: 13, j: 3, k: 14 },

    // CH3-2 terminal group
    { i: 17, j: 5, k: 18 },
    { i: 18, j: 5, k: 19 },
    { i: 19, j: 5, k: 17 },

    // between CH3-1 and CH2-1
    // H-C-C
    { i: 20, j: 6, k: 4 },
    { i: 21, j: 6, k: 4 },
    { i: 22, j: 6, k: 4 },
    // C-C-H
    { i: 6, j: 4, k: 15 },
    { i: 6, j: 4, k: 16 },

    // between CH2-1 and CH2-2
    // H-C-C
    { i: 15, j: 4, k: 2 },
    { i: 16, j: 4, k: 2 },
    // C-C-H
    { i: 4, j: 2, k: 11 },
    { i: 4, j: 2, k: 12 },

    // between CH2-2 and CH2-3
    // H-C-C
    { i: 11, j: 2, k: 0 },
    { i: 12, j: 2, k: 0 },
    // C-C-H
    { i: 2, j: 0, k: 7 },
    { i: 2, j: 0, k: 8 },

    // between CH2-3 and CH2-4
    // H-C-C
    { i: 7, j: 0, k: 1 },
    { i: 8, j: 0, k: 1 },
    // C-C-H
    { i: 0, j: 1, k: 9 },
    { i: 0, j: 1, k: 10 },

    // between CH2-4 and CH2-5
    // H-C-C
    { i: 9, j: 1, k: 3 },
    { i: 10, j: 1, k: 3 },
    // C-C-H
    { i: 1, j: 3, k: 13 },
    { i: 1, j: 3, k: 14 },

    // between CH2-5 and CH3-2
    // H-C-C
    { i: 13, j: 3, k: 5 },
    { i: 14, j: 3, k: 5 },
    // C-C-H
    { i: 3, j: 5, k: 17 },
    { i: 3, j: 5, k: 18 },
    { i: 3, j: 5, k: 19 },
  ];

  static torsionalBondDefinition = [
    // C-C-C-C backbone
    { i: 6, j: 4, k: 2, l: 0 },
    { i: 4, j: 2, k: 0, l: 1 },
    { i: 2, j: 0, k: 1, l: 3 },
    { i: 0, j: 1, k: 3, l: 5 },

    // between CH3-1 and CH2-1
    // H-C-C-H
    { i: 20, j: 6, k: 4, l: 15 },
    { i: 20, j: 6, k: 4, l: 16 },
    { i: 21, j: 6, k: 4, l: 15 },
    { i: 21, j: 6, k: 4, l: 16 },

    // between CH2-1 and CH2-2
    // H-C-C-H
    { i: 15, j: 4, k: 2, l: 11 },
    { i: 15, j: 4, k: 2, l: 12 },
    { i: 16, j: 4, k: 2, l: 11 },
    { i: 16, j: 4, k: 2, l: 12 },

    // between CH2-2 and CH2-3
    // H-C-C-H
    { i: 11, j: 2, k: 0, l: 7 },
    { i: 11, j: 2, k: 0, l: 8 },
    { i: 12, j: 2, k: 0, l: 7 },
    { i: 12, j: 2, k: 0, l: 8 },

    // between CH2-3 and CH2-4
    // H-C-C-H
    { i: 7, j: 0, k: 1, l: 9 },
    { i: 7, j: 0, k: 1, l: 10 },
    { i: 8, j: 0, k: 1, l: 9 },
    { i: 8, j: 0, k: 1, l: 10 },

    // between CH2-4 and CH2-5
    // H-C-C-H
    { i: 9, j: 1, k: 3, l: 13 },
    { i: 9, j: 1, k: 3, l: 14 },
    { i: 10, j: 1, k: 3, l: 13 },
    { i: 10, j: 1, k: 3, l: 14 },

    // between CH2-5 and CH3-2
    // H-C-C-H
    { i: 13, j: 3, k: 5, l: 17 },
    { i: 14, j: 3, k: 5, l: 17 },
    { i: 13, j: 3, k: 5, l: 18 },
    { i: 14, j: 3, k: 5, l: 18 },
  ];
}
