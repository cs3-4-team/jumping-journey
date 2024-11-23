import type { CanvasHelper } from '@/shared/canvas';
import { Vector } from '@/shared/vector';
import type { Lava } from '../lava';
import type { Platform } from '../platform';
import type { Ground } from '../ground';
import type { Coin } from '../coin';
import { PlayerState } from './enums';

export class Player {
  private width: number = 64;

  private height: number = 64;

  private state: PlayerState = PlayerState.IDLE;

  private sprites: { [key in PlayerState]: HTMLImageElement } = {} as any;

  private deathFrame: number = 0;

  private deathAnimationSpeed: number = 150; // ms

  private lastDeathFrameUpdate: number = 0;

  private isDeathAnimationComplete: boolean = false;

  private lastAnimationUpdate: number = 0;

  private walkAnimationSpeed: number = 150;

  private currentWalkFrame: number = 1;

  private direction: number = 1;

  private jumpFrame: number = 1;

  private jumpAnimationSpeed: number = 100;

  private lastJumpFrameUpdate: number = 0;

  private velocity: Vector;

  private gravity: number;

  private bounce: number;

  private isJumping: boolean;

  private onPlatform: boolean;

  private friction: number;

  private isDead_: boolean = false;

  private savedArea: ImageData | null = null;

  isDeathAnimationFinished(): boolean {
    return this.isDeathAnimationComplete;
  }

  constructor(
    private canvasHelper: CanvasHelper,
    private x: number,
    private y: number,
    private radius: number,
    private gameKeys: { [key: string]: boolean }
  ) {
    this.velocity = new Vector();
    this.gravity = 0.31;
    this.bounce = -0.5;
    this.isJumping = false;
    this.isDead_ = false;
    this.onPlatform = false;
    this.friction = 0.93;
    this.loadSprites();
  }

  private async loadSprites() {
    const states = Object.values(PlayerState);

    for (const state of states) {
      const sprite = new Image();

      sprite.src = `/sprites/player/${state}.png`;
      await new Promise((resolve) => {
        sprite.onload = resolve;
      });
      this.sprites[state] = sprite;
    }
  }

  public drawDebugInfo() {
    const ctx = this.canvasHelper.getContext();

    // Draw hitbox
    ctx.strokeStyle = 'rgba(0,255,0,0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw coordinates
    ctx.fillStyle = 'blue';
    ctx.font = '12px Arial';
    ctx.fillText(`x:${Math.round(this.x)},y:${Math.round(this.y)}`, this.x - 30, this.y - 20);
  }

  draw() {
    const currentSprite = this.sprites[this.state];

    if (this.isDead_ && !this.isDeathAnimationComplete) {
      const now = performance.now();

      if (now - this.lastDeathFrameUpdate > this.deathAnimationSpeed) {
        this.deathFrame++;
        this.lastDeathFrameUpdate = now;

        if (this.deathFrame <= 4) {
          const deathState = `DEAD_${this.deathFrame}` as keyof typeof PlayerState;

          this.state = PlayerState[deathState];
        } else {
          this.isDeathAnimationComplete = true;
        }
      }
    } else if (!this.isDead_) {
      // Movement animation
      if (Math.abs(this.velocity.x) > 0 && this.onPlatform) {
        const now = performance.now();

        if (now - this.lastAnimationUpdate > this.walkAnimationSpeed) {
          this.currentWalkFrame = (this.currentWalkFrame % 5) + 1;

          const walkState = `WALK_${this.currentWalkFrame}` as keyof typeof PlayerState;

          this.state = PlayerState[walkState];
          this.lastAnimationUpdate = now;
          this.direction = this.velocity.x > 0 ? 1 : -1;
        }
      } else if (this.isJumping || this.velocity.y > 2) {
        const now = performance.now();

        if (now - this.lastJumpFrameUpdate > this.jumpAnimationSpeed) {
          // At the beginning of the jump
          if (this.velocity.y < 0 && this.jumpFrame < 3) {
            this.jumpFrame++;
          }
          // At the top of the jump
          else if (this.velocity.y > -2 && this.velocity.y < 2 && this.jumpFrame < 4) {
            this.jumpFrame = 3;
          }
          // When falling
          else if (this.velocity.y > 2 && this.jumpFrame < 5) {
            this.jumpFrame = 4;
          }
          // With a rapid fall
          else if (this.velocity.y > 5) {
            this.jumpFrame = 5;
          }

          const jumpState = `JUMP_${this.jumpFrame}` as keyof typeof PlayerState;

          this.state = PlayerState[jumpState];
          this.lastJumpFrameUpdate = now;
        }
      } else {
        this.state = PlayerState.IDLE;
      }
    }

    if (currentSprite) {
      this.canvasHelper.clearCanvas();
      this.canvasHelper.saveState();
      this.canvasHelper.translateCanvas(this.x - this.width / 2, this.y - this.height / 2);

      if (this.direction === -1) {
        this.canvasHelper.scaleCanvas(-1, 1);
        this.canvasHelper.translateCanvas(-this.width, 0);
      } else {
        this.canvasHelper.scaleCanvas(1, 1);
      }

      this.canvasHelper.drawImage(currentSprite, 0, 0, this.width, this.height);
      this.canvasHelper.restoreState();
    }
  }

  resetPosition() {
    this.x = 100;
    this.y = this.canvasHelper.getHeight() - 200;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.isJumping = false;
    this.onPlatform = false;
    this.isDead_ = false;
    this.deathFrame = 0;
    this.isDeathAnimationComplete = false;
    this.state = PlayerState.IDLE;
  }

  private checkPlatformCollisions(platforms: Array<Ground | Platform>) {
    platforms.forEach((platform) => {
      if (
        this.y + this.radius > platform.y &&
        this.y - this.radius < platform.y + platform.height &&
        this.x + this.radius > platform.x &&
        this.x - this.radius < platform.x + platform.width
      ) {
        // Determine the direction of the collision
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

  private checkCoinCollisions(coins: Array<Coin>): boolean {
    for (const coin of coins) {
      const distanceX = this.x - (coin.x + coin.width / 2);
      const distanceY = this.y - (coin.y + coin.height / 2);
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;

      if (distanceSquared <= this.radius * this.radius) {
        return true;
      }
    }

    return false;
  }

  update(
    platforms: Array<Ground | Platform>,
    lavas: Array<Lava>,
    coins: Array<Coin>,
    deltaTime: number
  ) {
    for (const lava of lavas) {
      // Check the intersection of the circle with the rectangle
      const closestX = Math.max(
        lava.getPosition().x,
        Math.min(this.x, lava.getPosition().x + lava.width)
      );
      const closestY = Math.max(
        lava.getPosition().y,
        Math.min(this.y, lava.getPosition().y + lava.height)
      );

      // Calculate the distance from the center of the ball to the nearest point of the rectangle
      const distanceX = this.x - closestX;
      const distanceY = this.y - closestY;
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;

      // If the distance is less than the radius, there is a collision
      if (distanceSquared <= this.radius * this.radius) {
        this.isDead_ = true;

        //this.checkPlatformCollisions(platforms);
        return;
      }
    }

    if (this.checkCoinCollisions(coins)) {
      return true; // Level passed
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
          // this.velocity.x *= this.friction;

          // if (Math.abs(this.velocity.x) < 0.001) {
          //   this.velocity.x = 0;
          // }
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
      if (!this.gameKeys['ArrowLeft'] && !this.gameKeys['ArrowRight']) {
        // Smooth deceleration
        const sign = Math.sign(this.velocity.x);
        const absVelocity = Math.abs(this.velocity.x);

        if (absVelocity > 0) {
          const newAbsVelocity = Math.max(0, absVelocity - 0.4);

          this.velocity.x = sign * newAbsVelocity;
        }
      }
    }
  }

  jump() {
    if (this.onPlatform) {
      this.velocity.y = -8;
      this.isJumping = true;
      this.jumpFrame = 1;
    }
  }

  setVelocityX(value: number) {
    this.velocity.x = value;

    if (value !== 0) {
      this.direction = value > 0 ? 1 : -1;
    }
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
