<script setup lang="ts">
import { onMounted } from 'vue';
import { CanvasHelper } from '@/shared/CanvasHelper';
import { Lava } from '@/entities/lava/lava';
import Player from '@/entities/player/Player';
import Platform from '@/entities/platform/Platform';

onMounted(() => {
  const canvasHelper = new CanvasHelper('gameCanvas');

  canvasHelper.clearCanvas();
  canvasHelper.setFillColor('red');
  canvasHelper.drawRectangle(10, 10, 100, 50);

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

  const ball = new Player(canvasHelper, 100, canvasHelper.getHeight() - 25, 25, 'blue');
  let lastTime = 0;
  const keys: { [key: string]: boolean } = {};

  document.addEventListener('keydown', (e) => {
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

  document.addEventListener('keyup', (e) => {
    keys[e.code] = false;

    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      ball.stop();
    }
  });

  animate(performance.now());

  window.addEventListener('resize', canvasHelper.resizeCanvas);
  canvasHelper.resizeCanvas();

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
});
</script>

<template>
  <canvas id="gameCanvas"></canvas>
</template>

<style scoped>
#gameCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
