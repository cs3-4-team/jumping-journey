import { AbstractCell } from '../abstractCell';
import { CanvasHelper } from '@/shared/canvas';
import { lavaImageSrc } from './lava.const';

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

  draw(): void {
    this.canvasHelper.drawImage(
      `${this.imagesSrc}/${lavaImageSrc}`,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
