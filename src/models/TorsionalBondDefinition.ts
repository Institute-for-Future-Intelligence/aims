/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Quadruple } from './Quadruple.ts';

export const getTorsionalBondDefinition = (name: string): Quadruple[] => {
  if (name === 'Ethane') {
    return [
      // H-C-C-H
      { i1: 2, i2: 0, i3: 1, i4: 7 },
      { i1: 3, i2: 0, i3: 1, i4: 5 },
      { i1: 4, i2: 0, i3: 1, i4: 6 },
    ];
  }
  return [];
};
