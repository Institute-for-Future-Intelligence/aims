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

export const getTorsionalBondDefinition = (name: string): Quadruple[] => {
  if (name === 'Ethane') return Ethane.torsionalBondDefinition;
  if (name === 'Propane') return Propane.torsionalBondDefinition;
  if (name === 'Butane') return Butane.torsionalBondDefinition;
  if (name === 'Pentane') return Pentane.torsionalBondDefinition;
  if (name === 'Hexane') return Hexane.torsionalBondDefinition;
  if (name === 'Heptane') return Heptane.torsionalBondDefinition;

  return [];
};
