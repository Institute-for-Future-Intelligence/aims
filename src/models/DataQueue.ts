/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 *
 * A data queue that maintains a maximum number of items
 *
 */

export class DataQueue<T> {
  readonly array: Array<T>;

  private readonly limit: number;

  constructor(limit: number) {
    this.array = new Array<T>();
    this.limit = limit;
  }

  add(item: T): void {
    if (this.isFull()) {
      this.array.shift();
    }
    this.array.push(item);
  }

  clear(): void {
    this.array.length = 0;
  }

  isEmpty(): boolean {
    return this.array.length === 0;
  }

  isFull(): boolean {
    return this.array.length == this.limit;
  }

  size(): number {
    return this.array.length;
  }
}
