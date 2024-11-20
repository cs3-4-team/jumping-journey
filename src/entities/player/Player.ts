import type { CanvasHelper } from '@/shared/canvas/CanvasHelper';
import { Vector } from '@/shared/vector/Vector';
import type { Lava } from '../lava';
import type { Platform } from '../platform';
import type { Ground } from '../ground';

export default class Player {
  private velocity: Vector;

  private gravity: number;

  private bounce: number;

  private isJumping: boolean;

  private onPlatform: boolean;

  private friction: number;

  constructor(
    private canvasHelper: CanvasHelper,
    private x: number,
    private y: number,
    private radius: number,
    private color: string
  ) {
    this.velocity = new Vector();
    this.gravity = 0.45;
    this.bounce = -0.4;
    this.isJumping = false;
    this.onPlatform = false;
    this.friction = 0.93;
  }

  draw() {
    this.canvasHelper.setFillColor(this.color);
    this.canvasHelper.drawCircle(this.x, this.y, this.radius);
  }

  update(platforms: Array<Ground | Platform>, lavas: Lava[], deltaTime: number) {
    const deltaSeconds = deltaTime / 20;

    this.velocity.y += (this.gravity * deltaSeconds) / 1.2;

    this.x += this.velocity.x * deltaSeconds;
    this.y += this.velocity.y * deltaSeconds;

    this.onPlatform = false;
    platforms.forEach((platform) => {
      if (
        this.y + this.radius > platform.y &&
        this.y - this.radius < platform.y + platform.height &&
        this.x + this.radius > platform.x &&
        this.x - this.radius < platform.x + platform.width
      ) {
        if (this.velocity.y > 0 && this.y - this.radius < platform.y) {
          this.y = platform.y - this.radius;
          this.velocity.y = 0;
          this.isJumping = false;
          this.onPlatform = true;
          this.velocity.x *= this.friction;

          if (Math.abs(this.velocity.x) < 0.001) {
            this.velocity.x = 0;
          }
        } else if (this.velocity.y < 0 && this.y + this.radius > platform.y + platform.height) {
          this.y = platform.y + platform.height + this.radius;
          this.velocity.y = 0;
        }
      }
    });

    if (this.y + this.radius > this.canvasHelper.getHeight()) {
      this.y = this.canvasHelper.getHeight() - this.radius;
      this.velocity.y *= this.bounce;
      this.isJumping = false;
      this.onPlatform = true;
    }

    lavas.forEach((lava) => {
      if (
        this.y + this.radius > lava.getPosition().y &&
        this.y - this.radius < lava.getPosition().y + lava.height &&
        this.x + this.radius > lava.getPosition().x &&
        this.x - this.radius < lava.getPosition().x + lava.width
      ) {
        this.resetPosition();
      }
    });

    if (this.y + this.radius > this.canvasHelper.getHeight()) {
      this.y = this.canvasHelper.getHeight() - this.radius;
      this.velocity.y *= this.bounce;
      this.isJumping = false;
      this.onPlatform = true;
    }

    if (this.x + this.radius > this.canvasHelper.getWidth()) {
      this.velocity.x = -this.velocity.x;
      this.x = this.canvasHelper.getWidth() - this.radius;
    } else if (this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x;
      this.x = this.radius;
    }

    if (!this.isJumping && this.onPlatform) {
      this.velocity.x *= this.friction;

      if (Math.abs(this.velocity.x) < 0.5) {
        this.velocity.x = 0;
      }
    }
  }

  jump() {
    if (this.onPlatform) {
      this.velocity.y = -10;
      this.isJumping = true;
    }
  }

  moveLeft() {
    if (!this.isJumping) {
      this.velocity.x = -5;
    }
  }

  moveRight() {
    if (!this.isJumping) {
      this.velocity.x = 5;
    }
  }

  stop() {
    if (!this.isJumping) {
      this.velocity.x = 0;
    }
  }

  setVelocityX(value: number) {
    this.velocity.x = value;
  }

  getVelocityX(): number {
    return this.velocity.x;
  }

  getIsJumping(): boolean {
    return this.isJumping;
  }

  private resetPosition() {
    this.x = 100;
    this.y = this.canvasHelper.getHeight() - 25;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.isJumping = false;
    this.onPlatform = false;
  }
}
