/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 */

// Coulomb's constant times the square of electron charge (ke^2), in eV*angstrom.
// see http://hyperphysics.phy-astr.gsu.edu/hbase/electric/elefor.html
export const COULOMB_CONSTANT = 14.4;

// converts energy gradient unit into force unit:
// 1.6E-19 [J] / ( E-10 [m] x E-3 / 6E23 [kg] ) / ( E-10 / ( E-15 ) ^2 ) [m/s^2]
export const GF_CONVERSION_CONSTANT = 0.0096;

export const SIX_TIMES_UNIT_FORCE = 6 * GF_CONVERSION_CONSTANT;

export const MIN_SIN_THETA = 0.001;

// convert mvv into eV: ( E-3 / 6E23 ) [kg] x ( E-10 / E-15 )^2 [m^2/s^2] / 1.6E-19 [J]
export const EV_CONVERTER = 100 / (1.6 * 0.6);

// converts electron volt into kelvin
export const UNIT_EV_OVER_KB = 16000 / 1.38;

// converts kelvin into angstrom/femtosecond
export const VT_CONVERSION_CONSTANT = 0.00002882;
