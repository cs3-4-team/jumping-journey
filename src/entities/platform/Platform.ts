import { AbstractCell } from '../abstractCell';
import { CanvasHelper } from '@/shared/canvas';
import { platformImageSrc } from './platform.const';

export class Platform extends AbstractCell {
  public width: number;

  public height: number;

  private canvasHelper: CanvasHelper;

  constructor(x: number, y: number, width: number, height: number, canvasHelper: CanvasHelper) {
    super('platform', true, x, y, 'gray');

    this.width = width;
    this.height = height;
    this.canvasHelper = canvasHelper;
  }

  draw(): void {
    this.canvasHelper.drawImage(
      `${this.imagesSrc}/${platformImageSrc}`,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  interact(): void {}
}
