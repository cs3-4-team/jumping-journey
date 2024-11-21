import type { CanvasHelper } from '@/shared/canvas/CanvasHelper';
import { AbstractCell } from '../abstractCell';

export class Coin extends AbstractCell {
  public width: number;

  public height: number;

  private canvasHelper: CanvasHelper;

  private sprite: HTMLImageElement = new Image();

  constructor(x: number, y: number, width: number, height: number, canvasHelper: CanvasHelper) {
    super('Coin', true, x, y, 'red');
    this.width = width;
    this.height = height;
    this.canvasHelper = canvasHelper;
    this.loadSprite();
  }

  private async loadSprite() {
    this.sprite = new Image();
    // На данный момент нет спрайта Монеты
    // this.sprite.src = '/sprites/ground/coin.png';
    this.sprite.src = '/sprites/ground/ground.png';
    await new Promise((resolve) => {
      this.sprite.onload = resolve;
    });
  }

  interact(): void {}

  draw(): void {
    if (this.sprite) {
      this.canvasHelper
        .getContext()
        .drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      this.canvasHelper.setFillColor(this.color);
      this.canvasHelper.drawRectangle(this.x, this.y, this.width, this.height);
    }
  }
}
