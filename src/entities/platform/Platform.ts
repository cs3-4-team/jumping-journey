import { AbstractCell } from '../abstractCell';
import { CanvasHelper } from '@/shared/canvas/CanvasHelper';

export class Platform extends AbstractCell {
  public width: number;

  public height: number;

  private canvasHelper: CanvasHelper;

  private sprite: HTMLImageElement = new Image();

  constructor(x: number, y: number, width: number, height: number, canvasHelper: CanvasHelper) {
    super('Platform', false, x, y, 'gray');
    this.width = width;
    this.height = height;
    this.canvasHelper = canvasHelper;
    this.loadSprite();
  }

  private async loadSprite() {
    this.sprite = new Image();
    this.sprite.src = '/sprites/platform/platform.png';
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
