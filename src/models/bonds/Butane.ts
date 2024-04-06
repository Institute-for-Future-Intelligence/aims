/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export class Butane {
  static angularBondDefinition = [
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

  static torsionalBondDefinition = [
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
