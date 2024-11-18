import type { CanvasHelper } from '@/shared/CanvasHelper';

export default class Platform {
  constructor(
    private canvasHelper: CanvasHelper,
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  draw() {
    this.canvasHelper.setFillColor('green');
    this.canvasHelper.drawRectangle(this.x, this.y, this.width, this.height);
  }
}
