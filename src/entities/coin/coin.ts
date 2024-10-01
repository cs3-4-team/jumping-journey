import { AbstractCell } from '../abstractCell';

export class Coin extends AbstractCell {
  constructor(x: number, y: number) {
    super('Coin', true, x, y, 'gold');
  }

  interact(): void {
    // player.addScore(1); // Здесь также предполагается, что player доступен
    // console.log('Coin collected!');
  }
}
