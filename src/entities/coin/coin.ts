import { AbstractCell } from '../abstractCell';
import { CanvasHelper } from '@/shared/canvas';

export class Coin extends AbstractCell {
  public width: number;

  public height: number;

  private canvasHelper: CanvasHelper;

  private images: Array<HTMLImageElement> = [];

  private imageSources: Array<string> = ['coin1', 'coin2', 'coin3', 'coin4', 'coin5', 'coin6'];

  private frameRate = 200; // ms between frames

  private currentFrame = 0;

  private lastFrameTime = 0;

  constructor(x: number, y: number, width: number, height: number, canvasHelper: CanvasHelper) {
    super('Coin', false, x, y, 'gold');

    this.width = width;
    this.height = height;
    this.canvasHelper = canvasHelper;
  }

  private startAnimation() {
    requestAnimationFrame(this.animate.bind(this));
  }

  private animate(timestamp: number) {
    if (timestamp - this.lastFrameTime >= this.frameRate) {
      const totalFrames = this.imageSources.length;

      this.canvasHelper.getContext().clearRect(this.x, this.y, this.width, this.height);
      this.canvasHelper
        .getContext()
        .drawImage(this.images[this.currentFrame], this.x, this.y, this.width, this.height);

      this.currentFrame = (this.currentFrame + 1) % totalFrames;
      this.lastFrameTime = timestamp;
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  interact(): void {}

  draw() {
    const totalFrames = this.imageSources.length;

    this.imageSources.forEach((name, i) => {
      const img = new Image();

      img.src = `src/assets/sprites/coin/${name}.png`;

      img.onload = () => {
        this.images[i] = img;

        if (this.images.length === totalFrames) {
          this.startAnimation();
        }
      };
    });
  }
}
