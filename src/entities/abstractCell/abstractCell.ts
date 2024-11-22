import { imagesSrc } from './abstractCell.const';

export abstract class AbstractCell {
  protected type: string;

  protected isPermeability: boolean;

  protected imagesSrc: string = imagesSrc;

  protected color: string;

  x: number;

  y: number;

  constructor(type: string, isPermeability: boolean, x: number, y: number, color: string) {
    this.type = type;
    this.isPermeability = isPermeability;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  getType(): string {
    return this.type;
  }

  isCellPermeabilty(): boolean {
    return this.isPermeability;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
