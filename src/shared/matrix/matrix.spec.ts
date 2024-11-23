// @ts-ignore
import { equal, deepEqual } from 'node:assert';
import { Matrix } from './matrix';

const matrix = new Matrix(Int32Array, 2, 2, 2);

matrix.changeMapping(([x, y, z]) => {
  return [z, x, y];
});

matrix.set(0, 0, 0, 1);
matrix.set(0, 1, 0, 2);
matrix.set(0, 0, 1, 3);
matrix.set(0, 1, 1, 4);

matrix.set(1, 0, 0, 5);
matrix.set(1, 1, 0, 6);
matrix.set(1, 0, 1, 7);
matrix.set(1, 1, 1, 8);

equal(matrix.get(0, 0, 0), 1); // 1
equal(matrix.get(0, 1, 0), 2); // 2
equal(matrix.get(0, 0, 1), 3); // 3
equal(matrix.get(0, 1, 1), 4); // 4

equal(matrix.get(1, 0, 0), 5); // 5
equal(matrix.get(1, 1, 0), 6); // 6
equal(matrix.get(1, 0, 1), 7); // 7
equal(matrix.get(1, 1, 1), 8); // 8

deepEqual(Array.from(matrix.values()), [1, 2, 3, 4, 5, 6, 7, 8]);
