/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Triple } from './Triple.ts';
import { Pentane } from './bonds/Pentane.ts';
import { Ethane } from './bonds/Ethane.ts';
import { Propane } from './bonds/Propane.ts';
import { Butane } from './bonds/Butane.ts';
import { Hexane } from './bonds/Hexane.ts';
import { Heptane } from './bonds/Heptane.ts';

export const getAngularBondDefinition = (name: string): Triple[] => {
  if (name === 'Water') return [{ i: 1, j: 0, k: 2 }];
  if (name === 'Carbon Dioxide') return [{ i: 0, j: 2, k: 1 }];
  if (name === 'Ozone') return [{ i: 1, j: 0, k: 2 }];
  if (name === 'Methane') {
    return [
      { i: 1, j: 0, k: 2 },
      { i: 2, j: 0, k: 3 },
      { i: 3, j: 0, k: 4 },
      { i: 4, j: 0, k: 1 },
    ];
  }

  if (name === 'Ethane') return Ethane.angularBondDefinition;
  if (name === 'Propane') return Propane.angularBondDefinition;
  if (name === 'Butane') return Butane.angularBondDefinition;
  if (name === 'Pentane') return Pentane.angularBondDefinition;
  if (name === 'Hexane') return Hexane.angularBondDefinition;
  if (name === 'Heptane') return Heptane.angularBondDefinition;

  return [];
};
