/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { ZERO_TOLERANCE } from '../constants.ts';

export class HeatBath {
  static readonly MAXIMUM_TEMPERATURE = 10000;

  enabled: boolean = false;
  temperature: number;

  constructor(temperature: number) {
    this.temperature = temperature;
  }

  increase(increment: number) {
    this.temperature += increment;
    this.temperature = Math.max(ZERO_TOLERANCE, this.temperature);
    this.temperature = Math.min(HeatBath.MAXIMUM_TEMPERATURE, this.temperature);
  }

  increaseByPercentage(percent: number) {
    this.temperature *= 1 + percent;
    this.temperature = Math.max(ZERO_TOLERANCE, this.temperature);
    this.temperature = Math.min(HeatBath.MAXIMUM_TEMPERATURE, this.temperature);
  }
}
