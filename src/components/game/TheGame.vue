<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive, watch, computed } from 'vue';
import { CanvasHelper } from '@/shared/canvas';
import { MapGenerator, levels } from '@/entities/mapGenerator';
import { Player } from '@/entities/player';
import PauseWindow from '@/components/PauseWindow.vue';
import type { PauseWinData } from './interfaces';

const isDead = ref(false);
const isPaused = ref(false);
const isLevelCompleted = ref(false);
const player = ref<Player | null>(null);
const keys: { [key: string]: boolean } = {};
let animateFrame: number | null = null;
let generator: MapGenerator;
let lastTime = 0;
let pauseWinData: PauseWinData;
let sceneCanvasHelper: CanvasHelper;
let personCanvasHelper: CanvasHelper;
let level = 0;

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
        btnText: 'Try again'
      };
    } else if (state.isLevelCompleted) {
      pauseWinData = {
        msg: 'Well done, fren👏',
        handler: handleNewLevel,
        btnText: 'Next level'
      };

      if (level >= levels.length - 1) {
        level = 0;
      } else {
        level++;
      }
    }
  },
  { deep: true }
);

function handleRestart() {
  isDead.value = false;
  startLevel();
}

function handlePause() {
  isPaused.value = !isPaused.value;
}

function handleNewLevel() {
  isLevelCompleted.value = false;
  drawMap(sceneCanvasHelper);
  startLevel();
}

function startLevel() {
  player.value?.resetPosition();
  player.value?.update(generator.platforms, generator.lavas, generator.coins, 16.67);
  lastTime = 0;

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

  if (player.value?.isDead()) {
    if (player.value.isDeathAnimationFinished()) {
      isDead.value = true;
      return;
    }
  }

  const deltaTime = time - lastTime;

  lastTime = time;

  const levelComplete = player.value?.update(
    generator.platforms,
    generator.lavas,
    generator.coins,
    deltaTime
  );

  if (levelComplete) {
    isLevelCompleted.value = true;
    return;
  }

  player.value?.draw();
  // player.value?.drawDebugInfo();
  animateFrame = requestAnimationFrame(animate);
}

function handleKeydown(e: { key: string; code: string | number }) {
  if (e.key === 'Escape') {
    handlePause();
    return;
  }

  if (isGameStopped.value) return;

  keys[e.code] = true;

  if (keys['ArrowUp'] && !player.value?.getIsJumping()) {
    player.value?.jump();
    movePlayer();
  }

  updatePlayerMovement();
}

function handleKeyup(e: { code: string | number }) {
  keys[e.code] = false;
  updatePlayerMovement();
}

function updatePlayerMovement() {
  if (player.value?.getIsJumping()) return;

  movePlayer();
}

function movePlayer() {
  if (keys['ArrowLeft']) {
    player.value?.setVelocityX(-5);
  } else if (keys['ArrowRight']) {
    player.value?.setVelocityX(5);
  } else {
    player.value?.setVelocityX(0);
  }
}

function addListeners() {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);
  // window.addEventListener('resize', sceneCanvasHelper.resizeCanvas);
}

function removeListeners() {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('keyup', handleKeyup);
}

function drawMap(canvasHelper: CanvasHelper) {
  canvasHelper.clearCanvas();
  generator && generator.stopAnimation(); // It's nessesary, because started animations appear again
  generator = new MapGenerator(canvasHelper, levels[level]);
  generator.generateMap();
}

onMounted(() => {
  sceneCanvasHelper = new CanvasHelper('sceneCanvas');
  personCanvasHelper = new CanvasHelper('personCanvas');

  player.value = new Player(
    personCanvasHelper,
    100,
    personCanvasHelper.getHeight() - 200,
    25,
    keys
  );

  drawMap(sceneCanvasHelper);
  addListeners(); // Add keypress listeners
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
  background-image: url('/background.png');
  background-size: cover;
  z-index: 997;
}

#personCanvas {
  z-index: 998;
}
</style>
