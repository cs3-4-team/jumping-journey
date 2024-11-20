import { AbstractCell } from '../abstractCell';
import { CanvasHelper } from '@/shared/canvas/CanvasHelper';

export class Ground extends AbstractCell {
  public width: number;

  public height: number;

  private canvasHelper: CanvasHelper;

  constructor(x: number, y: number, width: number, height: number, canvasHelper: CanvasHelper) {
    super('Ground', true, x, y, 'green');
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
