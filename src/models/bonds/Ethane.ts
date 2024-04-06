/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export class Ethane {
  static angularBondDefinition = [
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

  static torsionalBondDefinition = [
    // H-C-C-H
    { i: 2, j: 0, k: 1, l: 7 },
    { i: 3, j: 0, k: 1, l: 5 },
    { i: 4, j: 0, k: 1, l: 6 },
  ];
}
