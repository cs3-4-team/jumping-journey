import { AbstractCell } from '../abstractCell';
import { CanvasHelper } from '@/shared/canvas';
import { coinImagesSrc } from './coin.const';

export class Coin extends AbstractCell {
  public width: number;

  public height: number;

  private canvasHelper: CanvasHelper;

  private coinImages: Array<HTMLImageElement> = [];

  private frameRate = 200; // ms between frames

  private currentFrame = 0;

  private lastFrameTime = 0;

  private requestAnimationId = 0;

  constructor(x: number, y: number, width: number, height: number, canvasHelper: CanvasHelper) {
    super('coin', false, x, y, 'gold');

    this.width = width;
    this.height = height;
    this.canvasHelper = canvasHelper;
  }

  private startAnimation() {
    this.requestAnimationId = requestAnimationFrame(this.animate.bind(this));
  }

  private animate(timestamp: number) {
    if (timestamp - this.lastFrameTime >= this.frameRate) {
      const totalFrames = coinImagesSrc.length;

      this.canvasHelper.getContext().clearRect(this.x, this.y, this.width, this.height);
      this.canvasHelper.drawImage(
        this.coinImages[this.currentFrame],
        this.x,
        this.y,
        this.width,
        this.height
      );

      this.currentFrame = (this.currentFrame + 1) % totalFrames;
      this.lastFrameTime = timestamp;
    }

    this.requestAnimationId = requestAnimationFrame(this.animate.bind(this));
  }

  draw() {
    const totalFrames = coinImagesSrc.length;

    coinImagesSrc.forEach((coinSrc, i) => {
      const img = new Image();

      img.src = `${this.imagesSrc}/${coinSrc}`;

      img.onload = () => {
        this.coinImages[i] = img;

        if (this.coinImages.length === totalFrames) {
          this.startAnimation();
        }
      };
    });
  }

  stopAnimation() {
    if (this.requestAnimationId) {
      cancelAnimationFrame(this.requestAnimationId);
    }
  }
}
