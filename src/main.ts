import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Vector } from './entities/vector/Vector';

import App from './App.vue';
import router from './router';

import { CanvasHelper } from './shared/CanvasHelper';
import { Lava } from './entities/lava/lava';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

const canvasHelper = new CanvasHelper('myCanvas');

canvasHelper.clearCanvas();
canvasHelper.setFillColor('red');
canvasHelper.drawRectangle(10, 10, 100, 50);

class Ball {
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
    this.gravity = 0.64;
    this.bounce = -0.4;
    this.isJumping = false;
    this.onPlatform = false;
    this.friction = 0.93;
  }

  draw() {
    this.canvasHelper.setFillColor(this.color);
    this.canvasHelper.drawCircle(this.x, this.y, this.radius);
  }

  update(platforms: Platform[], lavas: Lava[], deltaTime: number) {
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

    if (this.x + this.radius > this.canvasHelper.getWidth() || this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x;
    }

    if (!this.isJumping && this.onPlatform) {
      this.velocity.x *= this.friction;

      if (Math.abs(this.velocity.x) < 0.5) {
        this.velocity.x = 0;
      }
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

    if (this.x + this.radius > this.canvasHelper.getWidth() || this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x;
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
  new Platform(canvasHelper, 600, 200, 100, 10),
  new Platform(canvasHelper, 0, canvasHelper.getHeight() - 10, canvasHelper.getWidth(), 10),
  new Platform(canvasHelper, 0, 0, canvasHelper.getWidth(), 10),
  new Platform(canvasHelper, 0, 0, 10, canvasHelper.getHeight()),
  new Platform(canvasHelper, canvasHelper.getWidth() - 10, 0, 10, canvasHelper.getHeight())
];

const lavas = [
  new Lava(250, 480, 50, 20, canvasHelper),
  new Lava(400, 380, 50, 20, canvasHelper),
  new Lava(550, 280, 50, 20, canvasHelper),
  new Lava(700, 180, 50, 20, canvasHelper)
];

let lastTime = 0;

function animate(time: number) {
  if (lastTime === 0) {
    lastTime = time;
    requestAnimationFrame(animate);
    return;
  }

  const deltaTime = time - lastTime;

  lastTime = time;
  canvasHelper.clearCanvas();
  ball.update(platforms, lavas, deltaTime);
  ball.draw();
  platforms.forEach((platform) => platform.draw());

  lavas.forEach((lava) => lava.draw());

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

animate(performance.now());
