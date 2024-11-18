type MatrixTypes =
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | BigUint64Array
  | BigInt64Array;

type TypedArray<T> = new (capacity: number) => T;

export class Matrix<T extends MatrixTypes> {
  readonly dimension: number[];

  mapping: number[];

  array: T;

  readonly TypedArray: TypedArray<T>;

  get buffer() {
    return this.array.buffer;
  }

  constructor(TypedArray: TypedArray<T>, ...dimension: number[]) {
    if (!dimension.every((value) => value > 1 || value % 1 === 0)) {
      throw new TypeError('Dimension values can only be positive integers');
    }

    this.dimension = dimension;

    this.mapping = dimension.map((_, i) => {
      return i === 0 ? 1 : dimension.slice(0, i).reduce((a, b) => a * b, 1);
    });

    this.TypedArray = TypedArray;
    this.array = new TypedArray(dimension.reduce((r, v) => r * v, 1));
  }

  changeMapping(fn: (mapping: this['mapping']) => this['mapping']) {
    this.mapping = fn(this.mapping);
  }

  get(...coords: number[]): T extends BigUint64Array | BigInt64Array ? bigint : number {
    const idx = this.#getIndex(coords);

    return this.array[idx] as any;
  }

  set(...args: [...number[], T extends BigUint64Array | BigInt64Array ? bigint : number]) {
    const idx = this.#getIndex(args.slice(0, -1) as number[]);

    this.array[idx] = args[args.length - 1] as any;
  }

  *values(): IterableIterator<T extends BigUint64Array | BigInt64Array ? bigint : number> {
    for (const value of this.array) {
      yield value as any;
    }
  }

  #getIndex(coords: number[]): number {
    if (coords.length !== this.dimension.length) {
      throw new TypeError('The passed coordinates do not match the matrix dimension');
    }

    return coords.reduce((res, value, i) => res + value * this.mapping[i], 0);
  }
}
