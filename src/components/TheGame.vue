<script setup lang="ts">
import { onMounted } from 'vue';
import { CanvasHelper } from '@/shared/CanvasHelper';
import Player from '@/entities/player/Player';
import MapGenerator from '@/entities/mapGenerator/MapGenerator';

onMounted(() => {
  const mapData = [
    '.............................',
    '.............................',
    '.............................',
    '.............................',
    '....PP.......................',
    '.............................',
    '.......PPPP..................',
    '.............................',
    '..............PPG............',
    '..........PPP.................',
    '.....PPP.....................',
    'GGGGGGGGGGGLLLLGGGGLLLGGGGGGG'
  ];

  const canvasHelper = new CanvasHelper('gameCanvas');
  const generator = new MapGenerator(canvasHelper, mapData);
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
    ball.update(generator.platforms, generator.lavas, deltaTime);
    ball.draw();
    generator.generateMap();
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
