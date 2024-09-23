import { AbstractCell } from '../abstractCell';

export class Lava extends AbstractCell {
  constructor(x: number, y: number) {
    super('Lava', false, x, y, 'red');
  }

  interact(): void {
    // player.takeDamage(10); // Наносим урон
    // console.log('Player has DAMAGE!');
  }
}
