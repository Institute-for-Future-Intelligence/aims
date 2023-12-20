/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

export class AtomCounter {
  atomCount: number = 0;

  gotSome() {
    return this.atomCount > 0;
  }
}
