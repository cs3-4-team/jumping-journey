import { AbstractCell } from '../abstractCell';
import { CanvasHelper } from '@/shared/CanvasHelper';

export class Platform extends AbstractCell {
  public width: number;

  public height: number;

  private canvasHelper: CanvasHelper;

  constructor(x: number, y: number, width: number, height: number, canvasHelper: CanvasHelper) {
    super('Platform', false, x, y, 'gray');
    this.width = width;
    this.height = height;
    this.canvasHelper = canvasHelper;
  }

  interact(): void {}

  draw(): void {
    this.canvasHelper.setFillColor(this.color);
    this.canvasHelper.drawRectangle(this.x, this.y, this.width, this.height);
  }
}
