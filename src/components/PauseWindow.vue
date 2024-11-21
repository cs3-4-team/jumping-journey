<script setup lang="ts">
import type { PauseWinData } from '@/components/game/interfaces';

defineProps<{
  data: PauseWinData;
}>();
</script>

<template>
  <div class="restartScreen">
    <div class="restartScreen__background"></div>
    <div class="restartScreen__content">
      <h2 class="restartScreen__title">{{ data.msg }}</h2>
      <div class="restartScreen__button-container">
        <RouterLink class="restartScreen__button" to="/">🏃‍♂️Back to menu</RouterLink>
        <a class="restartScreen__button" @click="data.handler">🎮{{ data.btnText }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.restartScreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.restartScreen__background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--color-background);
  opacity: 0.9;
}

.restartScreen__content {
  position: relative;
  text-align: center;
}

.restartScreen__title {
  font-size: 2.6rem;
  margin-bottom: 2rem;
  color: var(--color-text);
}

.restartScreen__button-container {
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
}

.restartScreen__button {
  display: inline-block;
  padding: 1rem 4rem;
  font-size: 1.2rem;
}
</style>
