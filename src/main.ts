import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { CanvasHelper } from './shared/CanvasHelper';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

const canvasHelper = new CanvasHelper('myCanvas');

canvasHelper.clearCanvas();
canvasHelper.setFillColor('red');
canvasHelper.drawRectangle(10, 10, 100, 50);

class Ball {
  private vx: number;

  private vy: number;

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
    this.vx = 0;
    this.vy = 0;
    this.gravity = 0.5;
    this.bounce = -0.3;
    this.isJumping = false;
    this.onPlatform = false;
    this.friction = 0.95;
  }

  draw() {
    this.canvasHelper.setFillColor(this.color);
    this.canvasHelper.drawCircle(this.x, this.y, this.radius);
  }

  update(platforms: Platform[]) {
    this.vy += this.gravity;
    this.y += this.vy;
    this.x += this.vx;

    this.onPlatform = false;
    platforms.forEach((platform) => {
      if (
        this.y + this.radius > platform.y &&
        this.y - this.radius < platform.y + platform.height &&
        this.x + this.radius > platform.x &&
        this.x - this.radius < platform.x + platform.width
      ) {
        if (this.vy > 0 && this.y - this.radius < platform.y) {
          this.y = platform.y - this.radius;
          this.vy = 0;
          this.isJumping = false;
          this.onPlatform = true;
          this.vx = 0;
        } else if (this.vy < 0 && this.y + this.radius > platform.y + platform.height) {
          this.y = platform.y + platform.height + this.radius;
          this.vy = 0;
        }
      }
    });

    if (this.y + this.radius > this.canvasHelper.getHeight()) {
      this.y = this.canvasHelper.getHeight() - this.radius;
      this.vy *= this.bounce;
      this.isJumping = false;
      this.onPlatform = true;
    }

    if (this.x + this.radius > this.canvasHelper.getWidth() || this.x - this.radius < 0) {
      this.vx = -this.vx;
    }

    if (!this.isJumping && this.onPlatform) {
      this.vx *= this.friction;

      if (Math.abs(this.vx) < 0.1) {
        this.vx = 0;
      }
    }
  }

  jump() {
    if (this.onPlatform) {
      this.vy = -10;
      this.isJumping = true;
    }
  }

  moveLeft() {
    if (!this.isJumping) {
      this.vx = -5;
    }
  }

  moveRight() {
    if (!this.isJumping) {
      this.vx = 5;
    }
  }

  stop() {
    if (!this.isJumping) {
      this.vx = 0;
    }
  }

  setVelocityX(value: number) {
    this.vx = value;
  }

  getVelocityX(): number {
    return this.vx;
  }

  getIsJumping(): boolean {
    return this.isJumping;
  }
}

class Platform {
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

const ball = new Ball(canvasHelper, 100, canvasHelper.getHeight() - 25, 25, 'blue');

const platforms = [
  new Platform(canvasHelper, 150, 500, 100, 10),
  new Platform(canvasHelper, 300, 400, 100, 10),
  new Platform(canvasHelper, 450, 300, 100, 10),
  new Platform(canvasHelper, 600, 200, 100, 10)
];

function animate() {
  canvasHelper.clearCanvas();
  ball.update(platforms);
  ball.draw();
  platforms.forEach((platform) => platform.draw());
  requestAnimationFrame(animate);
}

const keys: { [key: string]: boolean } = {};

document.addEventListener('keydown', function (e) {
  keys[e.code] = true;

  if (keys['ArrowUp'] && keys['ArrowLeft'] && !ball.getIsJumping()) {
    ball.setVelocityX(-5);
    ball.jump();
  } else if (keys['ArrowUp'] && keys['ArrowRight'] && !ball.getIsJumping()) {
    ball.setVelocityX(5);
    ball.jump();
  } else if (keys['ArrowLeft'] && !ball.getIsJumping()) {
    ball.moveLeft();
  } else if (keys['ArrowRight'] && !ball.getIsJumping()) {
    ball.moveRight();
  }
});

document.addEventListener('keyup', function (e) {
  keys[e.code] = false;

  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    ball.stop();
  }
});

animate();
