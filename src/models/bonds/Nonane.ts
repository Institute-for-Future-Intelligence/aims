/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export class Nonane {
  static angularBondDefinition = [
    // backbone C-C-C
    { i: 7, j: 5, k: 3 },
    { i: 5, j: 3, k: 1 },
    { i: 3, j: 1, k: 0 },
    { i: 1, j: 0, k: 2 },
    { i: 0, j: 2, k: 4 },
    { i: 2, j: 4, k: 6 },
    { i: 4, j: 6, k: 8 },

    // CH3-1 terminal group
    { i: 23, j: 7, k: 24 },
    { i: 24, j: 7, k: 25 },
    { i: 25, j: 7, k: 23 },

    // CH2-1 group
    { i: 19, j: 5, k: 20 },

    // CH2-2 group
    { i: 15, j: 3, k: 16 },

    // CH2-3 group
    { i: 11, j: 1, k: 12 },

    // CH2-4 group
    { i: 9, j: 0, k: 10 },

    // CH2-5 group
    { i: 13, j: 2, k: 14 },

    // CH2-6 group
    { i: 17, j: 4, k: 18 },

    // CH2-7 group
    { i: 22, j: 6, k: 24 },

    // CH3-2 terminal group
    { i: 26, j: 8, k: 27 },
    { i: 27, j: 8, k: 28 },
    { i: 28, j: 8, k: 26 },

    // between CH3-1 and CH2-1
    // H-C-C
    { i: 23, j: 7, k: 5 },
    { i: 24, j: 7, k: 5 },
    { i: 25, j: 7, k: 5 },
    // C-C-H
    { i: 7, j: 5, k: 19 },
    { i: 7, j: 5, k: 20 },

    // between CH2-1 and CH2-2
    // H-C-C
    { i: 19, j: 5, k: 3 },
    { i: 20, j: 5, k: 3 },
    // C-C-H
    { i: 5, j: 3, k: 15 },
    { i: 5, j: 3, k: 16 },

    // between CH2-2 and CH2-3
    // H-C-C
    { i: 15, j: 3, k: 1 },
    { i: 16, j: 3, k: 1 },
    // C-C-H
    { i: 3, j: 1, k: 11 },
    { i: 3, j: 1, k: 12 },

    // between CH2-3 and CH2-4
    // H-C-C
    { i: 11, j: 1, k: 0 },
    { i: 12, j: 1, k: 0 },
    // C-C-H
    { i: 1, j: 0, k: 9 },
    { i: 1, j: 0, k: 10 },

    // between CH2-4 and CH2-5
    // H-C-C
    { i: 9, j: 0, k: 2 },
    { i: 10, j: 0, k: 2 },
    // C-C-H
    { i: 0, j: 2, k: 13 },
    { i: 0, j: 2, k: 14 },

    // between CH2-5 and CH2-6
    // H-C-C
    { i: 13, j: 2, k: 4 },
    { i: 14, j: 2, k: 4 },
    // C-C-H
    { i: 2, j: 4, k: 17 },
    { i: 2, j: 4, k: 18 },

    // between CH2-6 and CH2-7
    // H-C-C
    { i: 17, j: 4, k: 6 },
    { i: 18, j: 4, k: 6 },
    // C-C-H
    { i: 4, j: 6, k: 21 },
    { i: 4, j: 6, k: 22 },

    // between CH2-6 and CH3-2
    // H-C-C
    { i: 21, j: 6, k: 8 },
    { i: 22, j: 6, k: 8 },
    // C-C-H
    { i: 6, j: 8, k: 26 },
    { i: 6, j: 8, k: 27 },
    { i: 6, j: 8, k: 28 },
  ];

  static torsionalBondDefinition = [
    // C-C-C-C backbone
    { i: 7, j: 5, k: 3, l: 1 },
    { i: 5, j: 3, k: 1, l: 0 },
    { i: 3, j: 1, k: 0, l: 2 },
    { i: 1, j: 0, k: 2, l: 4 },
    { i: 0, j: 2, k: 4, l: 6 },
    { i: 2, j: 4, k: 6, l: 8 },

    // between CH3-1 and CH2-1
    // H-C-C-H
    { i: 23, j: 7, k: 5, l: 19 },
    { i: 23, j: 7, k: 5, l: 20 },
    { i: 24, j: 7, k: 5, l: 19 },
    { i: 24, j: 7, k: 5, l: 20 },

    // between CH2-1 and CH2-2
    // H-C-C-H
    { i: 19, j: 5, k: 3, l: 15 },
    { i: 19, j: 5, k: 3, l: 16 },
    { i: 20, j: 5, k: 3, l: 15 },
    { i: 20, j: 5, k: 3, l: 16 },

    // between CH2-2 and CH2-3
    // H-C-C-H
    { i: 15, j: 3, k: 1, l: 11 },
    { i: 15, j: 3, k: 1, l: 12 },
    { i: 16, j: 3, k: 1, l: 11 },
    { i: 16, j: 3, k: 1, l: 12 },

    // between CH2-3 and CH2-4
    // H-C-C-H
    { i: 11, j: 1, k: 0, l: 9 },
    { i: 11, j: 1, k: 0, l: 10 },
    { i: 12, j: 1, k: 0, l: 9 },
    { i: 12, j: 1, k: 0, l: 10 },

    // between CH2-4 and CH2-5
    // H-C-C-H
    { i: 9, j: 0, k: 2, l: 13 },
    { i: 9, j: 0, k: 2, l: 14 },
    { i: 10, j: 0, k: 2, l: 13 },
    { i: 10, j: 0, k: 2, l: 14 },

    // between CH2-5 and CH2-6
    // H-C-C-H
    { i: 13, j: 2, k: 4, l: 17 },
    { i: 13, j: 2, k: 4, l: 18 },
    { i: 14, j: 2, k: 4, l: 17 },
    { i: 14, j: 2, k: 4, l: 18 },

    // between CH2-6 and CH2-7
    // H-C-C-H
    { i: 17, j: 4, k: 6, l: 21 },
    { i: 17, j: 4, k: 6, l: 22 },
    { i: 18, j: 4, k: 6, l: 21 },
    { i: 18, j: 4, k: 6, l: 22 },

    // between CH2-7 and CH3-2
    // H-C-C-H
    { i: 21, j: 6, k: 8, l: 26 },
    { i: 22, j: 6, k: 8, l: 26 },
    { i: 21, j: 6, k: 8, l: 27 },
    { i: 22, j: 6, k: 8, l: 27 },
  ];
}
