/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export class Propane {
  static angularBondDefinition = [
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
    // H-C-C
    { i: 3, j: 0, k: 2 },
    { i: 4, j: 0, k: 2 },
    // C-C-H
    { i: 0, j: 2, k: 8 },
    { i: 0, j: 2, k: 9 },
    { i: 0, j: 2, k: 10 },
  ];

  static torsionalBondDefinition = [
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
