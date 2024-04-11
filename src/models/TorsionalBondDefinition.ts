/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { Quadruple } from './Quadruple.ts';
import { Pentane } from './bonds/Pentane.ts';
import { Ethane } from './bonds/Ethane.ts';
import { Propane } from './bonds/Propane.ts';
import { Butane } from './bonds/Butane.ts';
import { Hexane } from './bonds/Hexane.ts';
import { Heptane } from './bonds/Heptane.ts';
import { Octane } from './bonds/Octane.ts';
import { Nonane } from './bonds/Nonane.ts';
import { Decane } from './bonds/Decane.ts';
import { Benzene } from './bonds/Benzene.ts';
import { Buckminsterfullerene } from './bonds/Buckminsterfullerene.ts';
import { Ethanol } from './bonds/Ethanol.ts';

export const getTorsionalBondDefinition = (name: string): Quadruple[] => {
  // common molecules
  if (name === 'Ethanol') return Ethanol.torsionalBondDefinition;
  if (name === 'Buckminsterfullerene') return Buckminsterfullerene.torsionalBondDefinition;

  // hydrocarbons
  if (name === 'Benzene') return Benzene.torsionalBondDefinition;
  if (name === 'Ethane') return Ethane.torsionalBondDefinition;
  if (name === 'Propane') return Propane.torsionalBondDefinition;
  if (name === 'Butane') return Butane.torsionalBondDefinition;
  if (name === 'Pentane') return Pentane.torsionalBondDefinition;
  if (name === 'Hexane') return Hexane.torsionalBondDefinition;
  if (name === 'Heptane') return Heptane.torsionalBondDefinition;
  if (name === 'Octane') return Octane.torsionalBondDefinition;
  if (name === 'Nonane') return Nonane.torsionalBondDefinition;
  if (name === 'Decane') return Decane.torsionalBondDefinition;

  return [];
};
