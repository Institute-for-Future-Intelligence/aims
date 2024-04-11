/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export class Ethanol {
  static angularBondDefinition = [
    // H-O-C
    { i: 8, j: 0, k: 1 },
    // CH2O group
    { i: 0, j: 1, k: 3 },
    { i: 0, j: 1, k: 4 },
    { i: 3, j: 1, k: 4 },
    // CH3 group
    { i: 5, j: 2, k: 6 },
    { i: 5, j: 2, k: 7 },
    { i: 6, j: 2, k: 7 },
    // O-C-C
    { i: 0, j: 1, k: 2 },
    // H-C-C
    { i: 4, j: 1, k: 2 },
    { i: 3, j: 1, k: 2 },
    // C-C-H
    { i: 1, j: 2, k: 5 },
    { i: 1, j: 2, k: 6 },
    { i: 1, j: 2, k: 7 },
  ];

  static torsionalBondDefinition = [
    // H-O-C-C
    { i: 8, j: 0, k: 1, l: 2 },
    // H-O-C-H
    { i: 8, j: 0, k: 1, l: 3 },
    // O-C-C-H
    { i: 0, j: 1, k: 2, l: 5 },
    { i: 0, j: 1, k: 2, l: 6 },
  ];
}
