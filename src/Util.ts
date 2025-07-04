/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import platform from 'platform';
import { HOME_URL } from './constants.ts';

export class Util {
  static clamp(val: number, min: number, max: number) {
    return Math.max(Math.min(val, max), min);
  }

  static generateProjectLink(uid: string, title: string, callback: () => void) {
    const url = HOME_URL + '?userid=' + uid + '&project=' + encodeURIComponent(title);
    navigator.clipboard.writeText(url).then(callback);
  }

  static isOpenFromURL() {
    const params = new URLSearchParams(window.location.search);
    const userid = params.get('userid');
    const project = params.get('project');
    return !!(userid && project);
  }

  static getOS(): string | undefined {
    return platform.os?.family;
  }

  static isMac(): boolean {
    const os = Util.getOS();
    if (os) return os.includes('Mac') || os.includes('OS X');
    return false;
  }

  static isChrome(): boolean {
    const os = Util.getOS();
    if (os) return os.includes('Chrome');
    return false;
  }

  static getCelsius(kevin: number): number {
    return kevin - 273.15;
  }

  static getKevin(celsius: number): number {
    return celsius + 273.15;
  }

  static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  static decimalColorToRgb(value: number) {
    return Util.hexColorToRgb(value.toString(16));
  }

  static hexColorToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  static nearestNiceNumber(positiveNumber: number): number {
    // get the first larger power of 10
    let nice = Math.pow(10, Math.ceil(Math.log10(positiveNumber)));
    // scale the power to a "nice enough" value
    if (positiveNumber < 0.25 * nice) nice = 0.25 * nice;
    else if (positiveNumber < 0.5 * nice) nice = 0.5 * nice;
    return nice;
  }

  static capitalizeFirstLetter(s: string): string {
    if (s.length === 1) return s.toUpperCase();
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  static getSubscriptNumber(s: string): string {
    return s
      .replace(/1/g, '₁')
      .replace(/2/g, '₂')
      .replace(/3/g, '₃')
      .replace(/4/g, '₄')
      .replace(/5/g, '₅')
      .replace(/6/g, '₆')
      .replace(/7/g, '₇')
      .replace(/8/g, '₈')
      .replace(/9/g, '₉')
      .replace(/0/g, '₀');
  }
}
