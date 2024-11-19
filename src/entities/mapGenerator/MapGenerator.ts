import type { CanvasHelper } from '@/shared/CanvasHelper';
import { Ground } from '../ground';
import { Lava } from '../lava';
import { Platform } from '../platform';

export default class MapGenerator {
  private canvasHelper: CanvasHelper;

  private tileSize: number;

  lavas: Lava[] = [];

  platforms: Array<Platform | Ground> = [];

  constructor(
    canvasHelper: CanvasHelper,
    private mapData: string[]
  ) {
    this.canvasHelper = canvasHelper;
    this.tileSize = this.calculateTileSize();
  }

  generateMap() {
    this.mapData.forEach((row, rowIndex) => {
      [...row].forEach((tile, colIndex) => {
        const x = colIndex * this.tileSize;
        const y = rowIndex * this.tileSize;

        this.drawTile(tile, x, y);
      });
    });
  }

  private calculateTileSize(): number {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    const cols = this.mapData[0].length;
    const rows = this.mapData.length;

    const widthPerTile = canvasWidth / cols; // Width per tile
    const heightPerTile = canvasHeight / rows; // Height per tile

    // Return the smallest value to maintain aspect ratio
    return Math.min(widthPerTile, heightPerTile);
  }

  private drawTile(tile: string, x: number, y: number) {
    switch (tile) {
      case 'G': {
        const ground = new Ground(
          x,
          this.canvasHelper.getHeight() - this.tileSize,
          this.tileSize,
          this.tileSize,
          this.canvasHelper
        );

        this.platforms.push(ground);
        ground.draw();
        break;
      }

      case 'L': {
        const lava = new Lava(
          x,
          this.canvasHelper.getHeight() - this.tileSize,
          this.tileSize,
          this.tileSize,
          this.canvasHelper
        );

        this.lavas.push(lava);
        lava.draw();
        break;
      }

      case 'P': {
        const platform = new Platform(x, y, this.tileSize, this.tileSize, this.canvasHelper);

        this.platforms.push(platform);
        platform.draw();
        break;
      }

      default:
        break; // Ignore empty tiles '.'
    }
  }
}
