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

  static isNumericAndWhitespaceOnly(str: string) {
    return /^[\d\s]*$/.test(str);
  }

  static findFirstAlphabeticalCharacterIndex(str: string) {
    const regex = /[a-zA-Z]/; // Regular expression to match any letter (a-z or A-Z)
    return str.search(regex); // Returns the index of the first match, or -1 if no match
  }

  // https://en.wikipedia.org/wiki/Chemical_table_file
  static ensureSdf(input: string) {
    const lines = input.trim().split('\n');
    let result = '';
    let lineIndex = 0;
    let stop = false;
    let atomNumber = 0;
    let bondNumber = 0;
    let atomCount = 0;
    let bondCount = 0;
    let firstBond = false;
    for (const a of lines) {
      if (a.trim() === 'M  END') stop = true;
      if (stop) {
        // no need to do anything with other info
        result += a + '\n';
      } else {
        if (lineIndex < 3) {
          // header has three lines: title line, program line, and comment line
          result += a + '\n';
        } else if (lineIndex === 3) {
          // counts line: only one space indent
          const s = a.trim().split(' ');
          atomNumber = parseInt(s[0]);
          bondNumber = parseInt(s[1]);
          result += ' ' + a.trim() + '\n';
        } else {
          if (Util.isNumericAndWhitespaceOnly(a)) {
            if (!firstBond) {
              firstBond = true;
              // just add more lines to validate sdf if the actual atom count is less than the specified number of atoms
              // so that users have a visual cue that shows the sdf is incorrect
              if (atomCount < atomNumber) {
                result += '    0.0000    0.0000    0.0000  X  0  0  0  0  0  0  0  0  0  0\n'.repeat(
                  atomNumber - atomCount,
                );
              }
            }
            // bond block: two space indent if the first number is one digit, one space indent if the first number is two digits
            const s = a.trim();
            const first = s.split(' ')[0];
            if (first.length === 1) {
              result += '  ' + s;
            } else if (first.length === 2) {
              result += ' ' + s;
            } else {
              result += s;
            }
            result += '\n';
            bondCount++;
          } else {
            // atom block: three space indent or spacing if negative and four space indent or spacing if positive
            const s = a.trim();
            const n = Util.findFirstAlphabeticalCharacterIndex(s);
            const s1 = s.substring(0, n).trim();
            const s2 = s.substring(n);
            const c1 = s1.split(' ');
            let countLetter = 0;
            for (let i = 0; i < c1.length; i++) {
              const x = c1[i].trim();
              if (x === '') continue;
              if (x.startsWith('-')) {
                result += '   ' + x;
                countLetter += x.length + 3;
              } else {
                result += '    ' + x;
                countLetter += x.length + 4;
              }
            }
            // the element symbol is expected to start from position 31
            const extraSpaces = countLetter < 31 ? 31 - countLetter : 0;
            const d2 = s2.split(' ');
            for (let i = 0; i < d2.length; i++) {
              const x = d2[i].trim();
              if (x === '') continue;
              if (i === 0) {
                // this is the element symbol
                if (extraSpaces > 0) result += ' '.repeat(extraSpaces);
                if (x.length === 1) {
                  // if the element symbol has one letter
                  result += ' ' + x + '  ';
                } else {
                  // if the element symbol has two letters
                  result += ' ' + x + ' ';
                }
              } else {
                // other data of the atom are separated by two spaces
                result += x + '  ';
              }
            }
            result += '\n';
            atomCount++;
          }
        }
        lineIndex++;
      }
    }
    // console.log(result);
    return result;
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
