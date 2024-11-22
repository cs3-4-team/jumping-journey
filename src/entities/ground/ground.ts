import { AbstractCell } from '../abstractCell';
import { CanvasHelper } from '@/shared/canvas';
import { groundImageSrc } from './ground.const';

export class Ground extends AbstractCell {
  public width: number;

  public height: number;

  private canvasHelper: CanvasHelper;

  constructor(x: number, y: number, width: number, height: number, canvasHelper: CanvasHelper) {
    super('ground', true, x, y, 'green');

    this.width = width;
    this.height = height;
    this.canvasHelper = canvasHelper;
  }

  draw(): void {
    this.canvasHelper.drawImage(
      `${this.imagesSrc}/${groundImageSrc}`,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
