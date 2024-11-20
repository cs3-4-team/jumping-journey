<script setup lang="ts">
import { onMounted } from 'vue';
import { CanvasHelper } from '@/shared/canvas/CanvasHelper';
import { MapGenerator, map1 } from '@/entities/mapGenerator';
import Player from '@/entities/player/Player';

onMounted(() => {
  const canvasHelper = new CanvasHelper('gameCanvas');
  const generator = new MapGenerator(canvasHelper, map1);
  const player = new Player(canvasHelper, 100, canvasHelper.getHeight() - 100, 25, 'blue');
  const keys: { [key: string]: boolean } = {};
  let lastTime = 0;

  addListeners();
  animate(performance.now());

  function animate(time: number) {
    if (lastTime === 0) {
      lastTime = time;
      requestAnimationFrame(animate);
      return;
    }

    const deltaTime = time - lastTime;

    lastTime = time;
    canvasHelper.clearCanvas();
    player.update(generator.platforms, generator.lavas, deltaTime);
    player.draw();
    generator.generateMap();
    requestAnimationFrame(animate);
  }

  function addListeners() {
    document.addEventListener('keydown', (e) => {
      keys[e.code] = true;

      if (keys['ArrowUp'] && keys['ArrowLeft'] && !player.getIsJumping()) {
        player.setVelocityX(-5);
        player.jump();
      } else if (keys['ArrowUp'] && keys['ArrowRight'] && !player.getIsJumping()) {
        player.setVelocityX(5);
        player.jump();
      } else if (keys['ArrowLeft'] && !player.getIsJumping()) {
        player.moveLeft();
      } else if (keys['ArrowRight'] && !player.getIsJumping()) {
        player.moveRight();
      }
    });

    document.addEventListener('keyup', (e) => {
      keys[e.code] = false;

      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        player.stop();
      }
    });

    // window.addEventListener('resize', canvasHelper.resizeCanvas);
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
