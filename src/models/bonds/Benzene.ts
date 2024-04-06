/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export class Benzene {
  static angularBondDefinition = [
    // C-C-C
    { i: 1, j: 2, k: 4 },
    { i: 2, j: 4, k: 6 },
    { i: 4, j: 6, k: 8 },
    { i: 6, j: 8, k: 10 },
    { i: 8, j: 10, k: 1 },
    { i: 10, j: 1, k: 2 },
    // H-C-C
    { i: 0, j: 1, k: 2 },
    { i: 3, j: 2, k: 4 },
    { i: 5, j: 4, k: 6 },
    { i: 7, j: 6, k: 8 },
    { i: 9, j: 8, k: 10 },
    { i: 11, j: 10, k: 1 },
  ];

  static torsionalBondDefinition = [
    // H-C-C-H
    { i: 0, j: 1, k: 2, l: 3 },
    { i: 3, j: 2, k: 4, l: 5 },
    { i: 5, j: 4, k: 6, l: 7 },
    { i: 7, j: 6, k: 8, l: 9 },
    { i: 9, j: 8, k: 10, l: 11 },
    { i: 11, j: 10, k: 1, l: 0 },
  ];
}
