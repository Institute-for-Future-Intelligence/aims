/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Triple } from './Triple.ts';

export const getAngularBondDefinition = (name: string): Triple[] => {
  if (name === 'Water') {
    return [{ i1: 1, i2: 0, i3: 2 }];
  }
  if (name === 'Carbon Dioxide') {
    return [{ i1: 0, i2: 2, i3: 1 }];
  }
  if (name === 'Ozone') {
    return [{ i1: 1, i2: 0, i3: 2 }];
  }
  if (name === 'Methane') {
    return [
      { i1: 1, i2: 0, i3: 2 },
      { i1: 2, i2: 0, i3: 3 },
      { i1: 3, i2: 0, i3: 4 },
      { i1: 4, i2: 0, i3: 1 },
    ];
  }
  if (name === 'Ethane') {
    return [
      // left CH3 group
      { i1: 2, i2: 0, i3: 3 },
      { i1: 3, i2: 0, i3: 4 },
      { i1: 4, i2: 0, i3: 2 },
      // right CH3 group
      { i1: 5, i2: 1, i3: 6 },
      { i1: 6, i2: 1, i3: 7 },
      { i1: 7, i2: 1, i3: 5 },
      // H-C-C angles
      { i1: 2, i2: 0, i3: 1 },
      { i1: 3, i2: 0, i3: 1 },
      { i1: 4, i2: 0, i3: 1 },
      // C-C-H angles
      { i1: 0, i2: 1, i3: 5 },
      { i1: 0, i2: 1, i3: 6 },
      { i1: 0, i2: 1, i3: 7 },
    ];
  }
  if (name === 'Propane') {
    return [
      // C-C-C angles
      { i1: 1, i2: 0, i3: 2 },
      // left CH3 group
      { i1: 5, i2: 1, i3: 6 },
      { i1: 6, i2: 1, i3: 7 },
      { i1: 7, i2: 1, i3: 5 },
      // middle CH2 group
      { i1: 3, i2: 0, i3: 4 },
      // right CH3 group
      { i1: 8, i2: 2, i3: 9 },
      { i1: 9, i2: 2, i3: 10 },
      { i1: 10, i2: 2, i3: 8 },
      // H-C-C angles from left to middle
      { i1: 5, i2: 1, i3: 0 },
      { i1: 6, i2: 1, i3: 0 },
      { i1: 7, i2: 1, i3: 0 },
      // C-C-H angles from middle to right
      { i1: 0, i2: 2, i3: 8 },
      { i1: 0, i2: 2, i3: 9 },
      { i1: 0, i2: 2, i3: 10 },
      // C-C-H angles from left to middle
      { i1: 1, i2: 0, i3: 3 },
      { i1: 1, i2: 0, i3: 4 },
      // H-C-C angles from middle to right
      { i1: 3, i2: 0, i3: 2 },
      { i1: 4, i2: 0, i3: 2 },
    ];
  }
  if (name === 'Butane') {
    return [
      // C-C-C angles
      { i1: 2, i2: 0, i3: 1 },
      { i1: 0, i2: 1, i3: 3 },
      // left CH3 group
      { i1: 8, i2: 2, i3: 9 },
      { i1: 9, i2: 2, i3: 10 },
      { i1: 10, i2: 2, i3: 8 },
      // middle CH2 group
      { i1: 4, i2: 0, i3: 5 },
      // middle CH2 group
      { i1: 7, i2: 1, i3: 6 },
      // right CH3 group
      { i1: 11, i2: 3, i3: 12 },
      { i1: 12, i2: 3, i3: 13 },
      { i1: 13, i2: 3, i3: 11 },
      // H-C-C angles from left to middle
      { i1: 8, i2: 2, i3: 0 },
      { i1: 9, i2: 2, i3: 0 },
      { i1: 10, i2: 2, i3: 0 },
      // C-C-H angles from middle to right
      { i1: 1, i2: 3, i3: 11 },
      { i1: 1, i2: 3, i3: 12 },
      { i1: 1, i2: 3, i3: 13 },
      // C-C-H angles from left to middle
      { i1: 2, i2: 0, i3: 4 },
      { i1: 2, i2: 0, i3: 5 },
      // H-C-C angles from middle to right
      { i1: 6, i2: 1, i3: 3 },
      { i1: 7, i2: 1, i3: 3 },
      // C-C-H angles from middle to middle
      { i1: 0, i2: 1, i3: 6 },
      { i1: 0, i2: 1, i3: 7 },
      // H-C-C angles from middle to middle
      { i1: 4, i2: 0, i3: 1 },
      { i1: 5, i2: 0, i3: 1 },
    ];
  }
  return [];
};
