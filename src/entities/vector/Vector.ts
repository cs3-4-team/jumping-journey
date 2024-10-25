export class Vector {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  add(vector: Vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  multiply(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
