import type { CanvasHelper } from '@/shared/canvas';
import { Ground } from '../ground';
import { Lava } from '../lava';
import { Platform } from '../platform';
import { Coin } from '../coin';
import { blockSize } from './mapGenerator.const';

export class MapGenerator {
  private canvasHelper;

  private tileSize = blockSize;

  private mapData;

  lavas: Array<Lava> = [];

  platforms: Array<Platform | Ground> = [];

  coins: Array<Coin> = [];

  constructor(canvasHelper: CanvasHelper, mapData: string[]) {
    this.canvasHelper = canvasHelper;
    // this.tileSize = this.calculateTileSize();
    this.mapData = this.normalizeeSchema(mapData);
  }

  private normalizeeSchema(schema: string[]) {
    if (!schema.length) return [];

    let normalizedSchema = [...schema];

    const canvasHeight = this.canvasHelper.getHeight();
    const canvasWidth = this.canvasHelper.getWidth();

    const canvasColBlocksCount = Math.ceil(canvasWidth / this.tileSize);
    const canvasRowBlocksCount = Math.floor(canvasHeight / this.tileSize);

    // First, normalize columns in schema
    for (let i = 0; i < normalizedSchema.length; i++) {
      if (normalizedSchema[i].length < canvasColBlocksCount) {
        const schemaColsToAdd = canvasColBlocksCount - normalizedSchema[i].length;
        const emptyBlocksToAdd =
          i === normalizedSchema.length - 1
            ? 'G'.repeat(schemaColsToAdd) // If the first row - draw ground
            : '.'.repeat(schemaColsToAdd); // Else - empty block '.'

        normalizedSchema[i] += emptyBlocksToAdd;
      } else if (normalizedSchema[i].length > canvasColBlocksCount) {
        normalizedSchema[i] = normalizedSchema[i].slice(0, canvasColBlocksCount - 1);
      }
    }

    const rowsToAdd = canvasRowBlocksCount - schema.length;

    if (rowsToAdd > 0) {
      const emptyBlocksToAdd = '.'.repeat(canvasColBlocksCount);
      const rowsArrToAdd = new Array(rowsToAdd).fill(emptyBlocksToAdd);

      normalizedSchema = [...rowsArrToAdd, ...normalizedSchema];
    }

    return normalizedSchema;
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

  stopAnimation() {
    this.coins.forEach((coin) => coin.stopAnimation());
  }

  private calculateTileSize(): number {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    const cols = this.mapData[0].length;
    const rows = this.mapData.length;

    const widthPerTile = canvasWidth / cols; // Width per tile
    const heightPerTile = canvasHeight / rows; // Height per tile

    // Return the smallest value to maintain aspect ratio
    return Math.max(widthPerTile, heightPerTile);
  }

  private drawTile(tile: string, x: number, y: number) {
    switch (tile) {
      case 'G': {
        const ground = new Ground(
          x,
          y + this.tileSize,
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
          y + this.tileSize,
          this.tileSize,
          this.tileSize,
          this.canvasHelper
        );

        this.lavas.push(lava);
        lava.draw();
        break;
      }

      case 'P': {
        const platform = new Platform(
          x,
          y + this.tileSize,
          this.tileSize,
          this.tileSize,
          this.canvasHelper
        );

        this.platforms.push(platform);
        platform.draw();
        break;
      }

      case 'C': {
        const coin = new Coin(
          x,
          y + this.tileSize,
          this.tileSize,
          this.tileSize,
          this.canvasHelper
        );

        this.coins.push(coin);
        coin.draw();
        break;
      }

      default:
        break; // Ignore empty tiles '.'
    }
  }
}
