import { AbstractCell } from '../abstractCell';
import { CanvasHelper } from '@/shared/CanvasHelper';

export class Lava extends AbstractCell {
  public width: number;

  public height: number;

  private canvasHelper: CanvasHelper;

  constructor(x: number, y: number, width: number, height: number, canvasHelper: CanvasHelper) {
    super('Lava', false, x, y, 'orange');
    this.width = width;
    this.height = height;
    this.canvasHelper = canvasHelper;
  }

  interact(): void {
    // player.takeDamage(10); // Наносим урон
    // console.log('Player has DAMAGE!');
  }

  draw(): void {
    this.canvasHelper.setFillColor(this.color);
    this.canvasHelper.drawRectangle(this.x, this.y, this.width, this.height);
  }
}
