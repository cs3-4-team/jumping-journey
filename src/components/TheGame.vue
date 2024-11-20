<script setup lang="ts">
import { onMounted } from 'vue';
import { CanvasHelper } from '@/shared/canvas/CanvasHelper';
import { MapGenerator, map1 } from '@/entities/mapGenerator';
import Player from '@/entities/player/Player';
import { ref } from 'vue';
import RestartView from '@/views/RestartView.vue';

const showRestartScreen = ref(false);
const ball = ref<Player | null>(null);
let animateFrame: number | null = null;
let lastTime = 0;
let canvasHelper: CanvasHelper;
let generator: MapGenerator;

function handleRestart() {
  showRestartScreen.value = false;
  ball.value?.resetPosition();
  lastTime = 0;

  ball.value?.update(generator.platforms, generator.lavas, 16.67);

  if (animateFrame) {
    cancelAnimationFrame(animateFrame);
  }

  animate(performance.now());
}

function animate(time: number) {
  if (lastTime === 0) {
    lastTime = time;
    requestAnimationFrame(animate);
    return;
  }

  if (ball.value?.isDead()) {
    showRestartScreen.value = true;
    return;
  }

  const deltaTime = time - lastTime;

  lastTime = time;
  canvasHelper.clearCanvas();
  ball.value?.update(generator.platforms, generator.lavas, deltaTime);
  ball.value?.draw();
  generator.generateMap();
  animateFrame = requestAnimationFrame(animate);
}

onMounted(() => {
  canvasHelper = new CanvasHelper('gameCanvas');

  generator = new MapGenerator(canvasHelper, map1);

  ball.value = new Player(canvasHelper, 100, canvasHelper.getHeight() - 100, 25, 'blue');

  const keys: { [key: string]: boolean } = {};

  addListeners();
  animate(performance.now());

  function addListeners() {
    document.addEventListener('keydown', (e) => {
      keys[e.code] = true;

      if (keys['ArrowUp'] && keys['ArrowLeft'] && !ball.value?.getIsJumping()) {
        ball.value?.setVelocityX(-5);
        ball.value?.jump();
      } else if (keys['ArrowUp'] && keys['ArrowRight'] && !ball.value?.getIsJumping()) {
        ball.value?.setVelocityX(5);
        ball.value?.jump();
      } else if (keys['ArrowLeft'] && !ball.value?.getIsJumping()) {
        ball.value?.moveLeft();
      } else if (keys['ArrowRight'] && !ball.value?.getIsJumping()) {
        ball.value?.moveRight();
      }
    });

    document.addEventListener('keyup', (e) => {
      keys[e.code] = false;

      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        ball.value?.stop();
      }
    });

    // window.addEventListener('resize', canvasHelper.resizeCanvas);
  }
});
</script>

<template>
  <canvas id="gameCanvas"></canvas>
  <RestartView v-if="showRestartScreen" :onRestart="handleRestart" />
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
