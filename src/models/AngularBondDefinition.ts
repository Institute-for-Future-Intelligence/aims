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
  return [];
};
