<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive, watch } from 'vue';
import { CanvasHelper } from '@/shared/canvas/CanvasHelper';
import { MapGenerator, map1 } from '@/entities/mapGenerator';
import type { PauseWinData } from './interfaces';
import Player from '@/entities/player/Player';
import PauseWindow from '@/components/PauseWindow.vue';

const isDead = ref(false);
const isPaused = ref(false);
const player = ref<Player | null>(null);
const keys: { [key: string]: boolean } = {};
let animateFrame: number | null = null;
let canvasHelper: CanvasHelper;
let generator: MapGenerator;
let lastTime = 0;
let pauseWinData: PauseWinData;

const gameState = reactive({
  isPaused,
  isDead
});

watch(
  () => gameState,
  (state) => {
    if (state.isPaused) {
      pauseWinData = {
        msg: 'Pause',
        handler: handlePause,
        btnText: 'Continue'
      };
    } else if (state.isDead) {
      pauseWinData = {
        msg: 'Oooops...',
        handler: handleRestart,
        btnText: 'Restart'
      };
    }
  },
  { deep: true }
);

function handleRestart() {
  isDead.value = false;
  player.value?.resetPosition();
  lastTime = 0;

  player.value?.update(generator.platforms, generator.lavas, 16.67);

  if (animateFrame) {
    cancelAnimationFrame(animateFrame);
  }

  animate(performance.now());
}

function handlePause() {
  isPaused.value = !isPaused.value;
}

function animate(time: number) {
  if (lastTime === 0) {
    lastTime = time;
    requestAnimationFrame(animate);
    return;
  }

  if (player.value?.isDead()) {
    if (player.value.isDeathAnimationFinished()) {
      isDead.value = true;
      return;
    }
  }

  const deltaTime = time - lastTime;

  lastTime = time;
  canvasHelper.clearCanvas();
  player.value?.update(generator.platforms, generator.lavas, deltaTime);
  player.value?.draw();
  generator.generateMap();
  animateFrame = requestAnimationFrame(animate);
}

function handleKeydown(e: { key: string; code: string | number }) {
  if (e.key === 'Escape') {
    handlePause();
    return;
  }

  keys[e.code] = true;

  if (keys['ArrowUp'] && keys['ArrowLeft'] && !player.value?.getIsJumping()) {
    player.value?.setVelocityX(-5);
    player.value?.jump();
  } else if (keys['ArrowUp'] && keys['ArrowRight'] && !player.value?.getIsJumping()) {
    player.value?.setVelocityX(5);
    player.value?.jump();
  } else if (keys['ArrowLeft'] && !player.value?.getIsJumping()) {
    player.value?.moveLeft();
  } else if (keys['ArrowRight'] && !player.value?.getIsJumping()) {
    player.value?.moveRight();
  }
}

function handleKeyup(e: { code: string | number }) {
  keys[e.code] = false;

  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    player.value?.stop();
  }
}

onMounted(() => {
  canvasHelper = new CanvasHelper('gameCanvas');

  generator = new MapGenerator(canvasHelper, map1);

  player.value = new Player(canvasHelper, 100, canvasHelper.getHeight() - 100, 25);

  addListeners();
  animate(performance.now());

  function addListeners() {
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
    // window.addEventListener('resize', canvasHelper.resizeCanvas);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('keydown', handleKeyup);
});
</script>

<template>
  <div class="gameContainer">
    <canvas id="gameCanvas"></canvas>
    <transition name="fade">
      <PauseWindow v-if="isDead || isPaused" :data="pauseWinData" />
    </transition>
  </div>
</template>

<style scoped>
#gameCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* background-image: url('src/assets/background.png');
  background-repeat: no-repeat; */
}
</style>
