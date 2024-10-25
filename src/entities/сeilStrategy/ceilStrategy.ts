import { Lava } from '../lava/lava';
import { Ground } from '../ground/ground';
import { Coin } from '../coin/coin';
import { AbstractCell } from '../abstractCell/abstractCell';

export class CellStrategy {
  static createCell(symbol: string, x: number, y: number): AbstractCell {
    switch (symbol) {
      case '*':
        return new Lava(x, y);
      case '$':
        return new Coin(x, y);
      case '.':
        return new Ground(x, y);
      default:
        throw new Error('Unknown cell type');
    }
  }
}
