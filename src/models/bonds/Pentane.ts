/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export class Pentane {
  static angularBondDefinition = [
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

  static torsionalBondDefinition = [
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
