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

  private isDead_: boolean = false;

  constructor(
    private canvasHelper: CanvasHelper,
    private x: number,
    private y: number,
    private radius: number,
    private color: string
  ) {
    this.velocity = new Vector();
    this.gravity = 0.31;
    this.bounce = -0.5;
    this.isJumping = false;
    this.isDead_ = false;
    this.onPlatform = false;
    this.friction = 0.93;
  }

  draw() {
    this.canvasHelper.setFillColor(this.color);
    this.canvasHelper.drawCircle(this.x, this.y, this.radius);
  }

  resetPosition() {
    this.x = 100;
    this.y = this.canvasHelper.getHeight() - this.radius * 10;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.isJumping = false;
    this.onPlatform = false;
    this.isDead_ = false;
  }

  private checkPlatformCollisions(platforms: Array<Ground | Platform>) {
    platforms.forEach((platform) => {
      if (
        this.y + this.radius > platform.y &&
        this.y - this.radius < platform.y + platform.height &&
        this.x + this.radius > platform.x &&
        this.x - this.radius < platform.x + platform.width
      ) {
        // Определяем направление коллизии
        const fromTop = this.y - this.radius <= platform.y;

        if (fromTop) {
          this.y = platform.y - this.radius;
          this.velocity.y = 0;
          this.isJumping = false;
          this.onPlatform = true;
        }
      }
    });
  }

  update(platforms: Array<Ground | Platform>, lavas: Lava[], deltaTime: number) {
    for (const lava of lavas) {
      // Проверяем пересечение окружности с прямоугольником
      const closestX = Math.max(
        lava.getPosition().x,
        Math.min(this.x, lava.getPosition().x + lava.width)
      );
      const closestY = Math.max(
        lava.getPosition().y,
        Math.min(this.y, lava.getPosition().y + lava.height)
      );

      // Вычисляем расстояние от центра шарика до ближайшей точки прямоугольника
      const distanceX = this.x - closestX;
      const distanceY = this.y - closestY;
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;

      // Если расстояние меньше радиуса - есть коллизия
      if (distanceSquared <= this.radius * this.radius) {
        this.isDead_ = true;

        this.checkPlatformCollisions(platforms);
        return;
      }
    }

    const deltaSeconds = deltaTime / 20;

    this.velocity.y += (this.gravity * deltaSeconds) / 1.2;

    const prevX = this.x;
    const prevY = this.y;

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
        const fromLeft = prevX + this.radius <= platform.x;
        const fromRight = prevX - this.radius >= platform.x + platform.width;
        const fromTop = prevY + this.radius <= platform.y;
        const fromBottom = prevY - this.radius >= platform.y + platform.height;

        if (fromTop && this.velocity.y > 0) {
          this.y = platform.y - this.radius;
          this.velocity.y = 0;
          this.isJumping = false;
          this.onPlatform = true;
          this.velocity.x *= this.friction;

          if (Math.abs(this.velocity.x) < 0.001) {
            this.velocity.x = 0;
          }
        } else if (fromBottom && this.velocity.y < 0) {
          this.y = platform.y + platform.height + this.radius;
          this.velocity.y = 0;
        } else if (fromLeft && this.velocity.x > 0) {
          this.x = platform.x - this.radius;
          this.velocity.x = 0;
        } else if (fromRight && this.velocity.x < 0) {
          this.x = platform.x + platform.width + this.radius;
          this.velocity.x = 0;
        }
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
      this.velocity.y = -8;
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

  isDead(): boolean {
    return this.isDead_;
  }
}
