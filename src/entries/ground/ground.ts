import { AbstractCell } from '../abstractCell';

export class Ground extends AbstractCell {
  constructor(x: number, y: number) {
    super('Ground', true, x, y, 'brown');
  }

  interact(): void {}
}
