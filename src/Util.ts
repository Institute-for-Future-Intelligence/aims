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
  static correctSdf(input: string) {
    const lines = input.split('\n');
    let result = '';
    let lineIndex = 0;
    let stop = false;
    let atomNumber = 0;
    let bondNumber = 0;
    let atomCount = 0;
    let bondCount = 0;
    let firstBond = false;
    const atomCoordinates = [];
    let bondCountPosition = -1;
    for (const a of lines) {
      if (a.trim() === '$$$$') break; // we do not support multiple molecules in a single SDF for now
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
          const s = a.trim().split(/\s+/);
          atomNumber = parseInt(s[0]);
          if (atomNumber > 999) {
            // this means there is no space to the next three characters (bond number)
            const ss = s[0];
            s[0] = ss.substring(0, 3);
            s[1] = ss.substring(3, 6);
            atomNumber = parseInt(s[0]);
            bondNumber = parseInt(s[1]);
            bondCountPosition = result.length + 3;
            result += a.trim() + '\n';
          } else {
            bondNumber = parseInt(s[1]);
            if (atomNumber < 10) {
              const index = a.trim().indexOf(s[1], 3);
              const rest = a.trim().substring(index + 3);
              result += '  ' + atomNumber + '  ' + bondNumber + rest + '\n';
            } else if (atomNumber < 100) {
              const index = a.trim().indexOf(s[1], 3);
              const rest = a.trim().substring(index + 3);
              result += ' ' + atomNumber + ' ' + bondNumber + rest + '\n';
            } else {
              if (bondNumber > 99) {
                // no space between atom and bond numbers if the bond number has three digits
                let rest = '';
                const indexOfRest = a.trim().indexOf(s[2]);
                if (indexOfRest > -1) rest = a.trim().substring(indexOfRest);
                result += atomNumber + '' + bondNumber + ' ' + rest + '\n';
              } else {
                result += a.trim() + '\n';
              }
            }
          }
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
            const ss = s.split(/\s+/);
            if (ss.length >= 2) {
              const b1 = ss[0];
              const b2 = ss[1];
              const k1 = parseInt(b1) - 1; // SDF bond index starts from 1
              const k2 = parseInt(b2) - 1;
              if (k1 >= 0 && k2 >= 0 && k1 < atomCoordinates.length && k2 < atomCoordinates.length) {
                const dx = atomCoordinates[k1][0] - atomCoordinates[k2][0];
                const dy = atomCoordinates[k1][1] - atomCoordinates[k2][1];
                const dz = atomCoordinates[k1][2] - atomCoordinates[k2][2];
                // only keep bonds shorter than 5 angstrom
                if (dx * dx + dy * dy + dz * dz < 25) {
                  if (b1.length === 1) {
                    result += '  ' + b1;
                  } else if (b1.length === 2) {
                    result += ' ' + b1;
                  } else {
                    result += b1;
                  }
                  if (b2.length === 1) {
                    result += '  ' + b2;
                  } else if (b2.length === 2) {
                    result += ' ' + b2;
                  } else {
                    result += b2;
                  }
                  if (ss.length >= 3) {
                    const b3 = ss[2];
                    if (b3.length === 1) {
                      result += '  ' + b3;
                    } else if (b3.length === 2) {
                      result += ' ' + b3;
                    } else {
                      result += b3;
                    }
                  }
                  result += '\n';
                  bondCount++;
                }
              }
            }
          } else {
            // atom block: three space indent or spacing if negative and four space indent or spacing if positive
            const s = a.trim();
            const n = Util.findFirstAlphabeticalCharacterIndex(s);
            const s1 = s.substring(0, n).trim();
            const s2 = s.substring(n);
            const c1 = s1.split(/\s+/);
            const v = [];
            for (let i = 0; i < c1.length; i++) {
              const x = c1[i].trim();
              const n1 = x.substring(0, x.indexOf('.'));
              const n2 = x.substring(x.indexOf('.') + 1);
              const numberOfDigits1 = n1.toString().length;
              const numberOfSpaces1 = Math.max(0, 5 - numberOfDigits1);
              const numberOfDigits2 = n2.toString().length;
              const numberOfSpaces2 = Math.max(0, 4 - numberOfDigits2);
              result += ' '.repeat(numberOfSpaces1) + n1 + '.' + n2 + '0'.repeat(numberOfSpaces2);
              if (i < 3) v.push(parseFloat(x));
            }
            atomCoordinates.push(v);
            // the element symbol is expected to start from position 31
            const d2 = s2.split(/\s+/);
            for (let i = 0; i < d2.length; i++) {
              const x = d2[i].trim();
              if (x === '') continue;
              if (i === 0) {
                // this is the element symbol
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
    const r1 = result.substring(0, bondCountPosition);
    const r2 = result.substring(bondCountPosition + 3);
    if (bondCount > 99) {
      result = r1 + bondCount + r2;
    } else {
      result = r1 + ' '.repeat(3 - bondCount.toString().length) + bondCount + r2;
    }
    result = result.trim();
    if (!result.endsWith('$$$$')) result += '\n\n$$$$';
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
