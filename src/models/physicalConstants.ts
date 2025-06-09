/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 *
 */

export const KINETIC_ENERGY_COLOR = '#FFA07A';

export const POTENTIAL_ENERGY_COLOR = '#00BFFF';

export const TOTAL_ENERGY_COLOR = '#00FF7F';

export const VAN_DER_WAALS_COLOR = '#FFFFFF';

export const DATA_QUEUE_LENGTH = 100;

export const LJ_SIGMA_CONVERTER = 2 / Math.sqrt(Math.cbrt(2));

// Coulomb's constant times the square of electron charge (ke^2), in eV*angstrom.
// see http://hyperphysics.phy-astr.gsu.edu/hbase/electric/elefor.html
export const COULOMB_CONSTANT = 8.99 * 1.6;

// converts energy gradient unit into force unit:
// 1.6E-19 [J] / ( E-10 [m] x E-3 / 6E23 [kg] ) / ( E-10 / ( E-15 ) ^2 ) [m/s^2]
export const GF_CONVERSION_CONSTANT = 0.0096;

export const SIX_TIMES_UNIT_FORCE = 6 * GF_CONVERSION_CONSTANT;

export const MIN_SIN_THETA = 0.001;

// convert mvv into eV: ( E-3 / 6E23 ) [kg] x ( E-10 / E-15 )^2 [m^2/s^2] / 1.6E-19 [J]
export const EV_CONVERTER = 1000 / (1.6 * 6);

// converts electron volt into kelvin
export const UNIT_EV_OVER_KB = 16000 / 1.38;

// converts kelvin into angstrom/femtosecond
export const VT_CONVERSION_CONSTANT = 0.00002882;

// convert m/s^2 to angstrom / fs^2
export const GRAVITY_CONVERSION_CONSTANT = 1e-20;

// Boltzmann constant 1.380649 × 10-23 m^2kg/s^2/K / 10-30 m^3 = 1.38*10^7 kg/m/K/s^2 = 1.38*10^7 Pa/K
export const PRESSURE_CONVERSION_CONSTANT = 1.38e7;

// au/A^3 -> kg/m^3 (0.001/6.022E^23*10^30)
export const DENSITY_CONVERSION_CONSTANT = 10000 / 6.022;

// A/fs -> m/s
export const SPEED_CONVERTER = 100000;

// how many bins do we want in the speed distribution graph
export const SPEED_BIN_NUMBER = 20;
