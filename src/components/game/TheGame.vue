<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive, watch, computed } from 'vue';
import { CanvasHelper } from '@/shared/canvas';
import { MapGenerator, map1, map2 } from '@/entities/mapGenerator';
import { Player } from '@/entities/player';
import PauseWindow from '@/components/PauseWindow.vue';
import type { PauseWinData } from './interfaces';

const isDead = ref(false);
const isPaused = ref(false);
const isLevelCompleted = ref(false);
const level = ref(map1);
const player = ref<Player | null>(null);
const keys: { [key: string]: boolean } = {};
let animateFrame: number | null = null;
let generator: MapGenerator;
let lastTime = 0;
let pauseWinData: PauseWinData;

const isGameStopped = computed(() => isDead.value || isPaused.value || isLevelCompleted.value);

const gameState = reactive({
  isPaused,
  isDead,
  isLevelCompleted
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
    } else if (state.isLevelCompleted) {
      pauseWinData = {
        msg: 'Well done, fren👏',
        handler: handleRestart,
        btnText: 'Next level'
      };
    }
  },
  { deep: true }
);

function handleRestart() {
  isDead.value = false;
  player.value?.resetPosition();
  lastTime = 0;

  player.value?.update(generator.platforms, generator.lavas, generator.coins, 16.67);

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
  player.value?.update(generator.platforms, generator.lavas, generator.coins, deltaTime);
  player.value?.draw();
  animateFrame = requestAnimationFrame(animate);
}

function handleKeydown(e: { key: string; code: string | number }) {
  if (e.key === 'Escape') {
    handlePause();
    return;
  }

  if (isGameStopped.value) return;

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

function addListeners() {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);
  // window.addEventListener('resize', sceneCanvasHelper.resizeCanvas);
}

function removeListeners() {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('keydown', handleKeyup);
}

onMounted(() => {
  const sceneCanvasHelper = new CanvasHelper('sceneCanvas');
  const personCanvasHelper = new CanvasHelper('personCanvas');

  // Draw map
  generator = new MapGenerator(sceneCanvasHelper, level.value);
  generator.generateMap();

  player.value = new Player(personCanvasHelper, 100, personCanvasHelper.getHeight() - 200, 25);

  // Add keypress listeners
  addListeners();
  animate(performance.now());
});

onBeforeUnmount(removeListeners);
</script>

<template>
  <div class="gameContainer">
    <canvas id="sceneCanvas"></canvas>
    <canvas id="personCanvas"></canvas>
    <transition name="fade">
      <PauseWindow v-if="isGameStopped" :data="pauseWinData" />
    </transition>
  </div>
</template>

<style scoped>
.gameContainer canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

#sceneCanvas {
  background-image: url('src/assets/background.png');
  background-size: cover;
  z-index: 997;
}

#personCanvas {
  z-index: 998;
}
</style>
