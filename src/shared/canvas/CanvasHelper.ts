export class CanvasHelper {
  private canvas: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
    this.resizeCanvas();
  }

  clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getWidth(): number {
    return this.canvas.width;
  }

  getHeight(): number {
    return this.canvas.height;
  }

  setFillColor(color: string): void {
    this.context.fillStyle = color;
  }

  setStrokeColor(color: string): void {
    this.context.strokeStyle = color;
  }

  setLineWidth(width: number): void {
    this.context.lineWidth = width;
  }

  drawRectangle(x: number, y: number, width: number, height: number): void {
    this.context.fillRect(x, y, width, height);
  }

  drawCircle(x: number, y: number, radius: number): void {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.fill();
    this.context.closePath();
  }

  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
    this.context.closePath();
  }

  drawText(
    text: string,
    x: number,
    y: number,
    font: string = '16px Arial',
    color: string = 'black'
  ): void {
    this.context.font = font;
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
  }

  drawImage(
    image: string | HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const isSrc = typeof image === 'string';

    if (isSrc) {
      const newImage = new Image();

      newImage.src = image;

      newImage.onload = () => {
        this.context.drawImage(newImage, x, y, width, height);
      };
    } else {
      this.context.drawImage(image, x, y, width, height);
    }
  }

  saveState(): void {
    this.context.save();
  }

  restoreState(): void {
    this.context.restore();
  }

  rotateCanvas(angle: number): void {
    this.context.rotate(angle);
  }

  translateCanvas(x: number, y: number): void {
    this.context.translate(x, y);
  }

  scaleCanvas(x: number, y: number): void {
    this.context.scale(x, y);
  }

  resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  getContext(): CanvasRenderingContext2D {
    return this.context;
  }
}
