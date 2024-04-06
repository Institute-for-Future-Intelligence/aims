/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export class Hexane {
  static angularBondDefinition = [
    // backbone C-C-C
    { i: 4, j: 2, k: 0 },
    { i: 2, j: 0, k: 1 },
    { i: 0, j: 1, k: 3 },
    { i: 1, j: 3, k: 5 },

    // CH3-1 terminal group
    { i: 14, j: 4, k: 15 },
    { i: 15, j: 4, k: 16 },
    { i: 16, j: 4, k: 14 },

    // CH2-1 group
    { i: 11, j: 2, k: 10 },

    // CH2-2 group
    { i: 6, j: 0, k: 7 },

    // CH2-3 group
    { i: 8, j: 1, k: 9 },

    // CH2-4 group
    { i: 12, j: 3, k: 13 },

    // CH3-2 terminal group
    { i: 17, j: 5, k: 18 },
    { i: 18, j: 5, k: 19 },
    { i: 19, j: 5, k: 17 },

    // between CH3-1 and CH2-1
    // H-C-C
    { i: 14, j: 4, k: 2 },
    { i: 15, j: 4, k: 2 },
    { i: 16, j: 4, k: 2 },
    // C-C-H
    { i: 4, j: 2, k: 10 },
    { i: 4, j: 2, k: 11 },

    // between CH2-1 and CH2-2
    // H-C-C
    { i: 10, j: 2, k: 0 },
    { i: 11, j: 2, k: 0 },
    // C-C-H
    { i: 2, j: 0, k: 6 },
    { i: 2, j: 0, k: 7 },

    // between CH2-2 and CH2-3
    // H-C-C
    { i: 6, j: 0, k: 1 },
    { i: 7, j: 0, k: 1 },
    // C-C-H
    { i: 0, j: 1, k: 8 },
    { i: 0, j: 1, k: 9 },

    // between CH2-3 and CH2-4
    // H-C-C
    { i: 8, j: 1, k: 3 },
    { i: 9, j: 1, k: 3 },
    // C-C-H
    { i: 1, j: 3, k: 12 },
    { i: 1, j: 3, k: 13 },

    // between CH2-4 and CH3-2
    // H-C-C
    { i: 12, j: 3, k: 5 },
    { i: 13, j: 3, k: 5 },
    // C-C-H
    { i: 3, j: 5, k: 17 },
    { i: 3, j: 5, k: 18 },
    { i: 3, j: 5, k: 19 },
  ];

  static torsionalBondDefinition = [
    // C-C-C-C backbone
    { i: 4, j: 2, k: 0, l: 1 },
    { i: 2, j: 0, k: 1, l: 3 },
    { i: 0, j: 1, k: 3, l: 5 },

    // between CH3-1 and CH2-1
    // H-C-C-H
    { i: 14, j: 4, k: 2, l: 10 },
    { i: 14, j: 4, k: 2, l: 11 },
    { i: 15, j: 4, k: 2, l: 10 },
    { i: 15, j: 4, k: 2, l: 11 },

    // between CH2-1 and CH2-2
    // H-C-C-H
    { i: 10, j: 2, k: 0, l: 6 },
    { i: 10, j: 2, k: 0, l: 7 },
    { i: 11, j: 2, k: 0, l: 6 },
    { i: 11, j: 2, k: 0, l: 7 },

    // between CH2-2 and CH2-3
    // H-C-C-H
    { i: 6, j: 0, k: 1, l: 8 },
    { i: 6, j: 0, k: 1, l: 9 },
    { i: 7, j: 0, k: 1, l: 8 },
    { i: 7, j: 0, k: 1, l: 9 },

    // between CH2-3 and CH2-4
    // H-C-C-H
    { i: 8, j: 1, k: 3, l: 12 },
    { i: 8, j: 1, k: 3, l: 13 },
    { i: 9, j: 1, k: 3, l: 12 },
    { i: 9, j: 1, k: 3, l: 13 },

    // between CH2-4 and CH3-2
    // H-C-C-H
    { i: 12, j: 3, k: 5, l: 17 },
    { i: 13, j: 3, k: 5, l: 17 },
    { i: 12, j: 3, k: 5, l: 18 },
    { i: 13, j: 3, k: 5, l: 18 },
  ];
}
