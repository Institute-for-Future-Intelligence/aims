/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Triple } from '../Triple.ts';
import { Pentane } from './Pentane.ts';
import { Ethane } from './Ethane.ts';
import { Propane } from './Propane.ts';
import { Butane } from './Butane.ts';
import { Hexane } from './Hexane.ts';
import { Heptane } from './Heptane.ts';
import { Octane } from './Octane.ts';
import { Nonane } from './Nonane.ts';
import { Decane } from './Decane.ts';
import { Benzene } from './Benzene.ts';
import { Buckminsterfullerene } from './Buckminsterfullerene.ts';
import { Ethanol } from './Ethanol.ts';

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

  // common molecules
  if (name === 'Ethanol') return Ethanol.angularBondDefinition;
  if (name === 'Buckminsterfullerene') return Buckminsterfullerene.angularBondDefinition;

  // hydrocarbons
  if (name === 'Benzene') return Benzene.angularBondDefinition;
  if (name === 'Ethane') return Ethane.angularBondDefinition;
  if (name === 'Propane') return Propane.angularBondDefinition;
  if (name === 'Butane') return Butane.angularBondDefinition;
  if (name === 'Pentane') return Pentane.angularBondDefinition;
  if (name === 'Hexane') return Hexane.angularBondDefinition;
  if (name === 'Heptane') return Heptane.angularBondDefinition;
  if (name === 'Octane') return Octane.angularBondDefinition;
  if (name === 'Nonane') return Nonane.angularBondDefinition;
  if (name === 'Decane') return Decane.angularBondDefinition;

  return [];
};
