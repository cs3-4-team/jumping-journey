<script setup lang="ts">
defineProps<{
  onRestart: () => void;
}>();
</script>

<template>
  <div class="restart-screen">
    <div class="restart-screen__background"></div>
    <div class="restart-screen__content">
      <h2 class="restart-screen__title">Game Over</h2>
      <button class="restart-screen__button" @click="onRestart">Начать заново</button>
    </div>
  </div>
</template>

<style scoped>
.restart-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.restart-screen__background {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(45deg, #00dc82, #36e4da, #0047e1);
  filter: blur(60px);
  opacity: 0.9;
}

.restart-screen__content {
  position: relative;
  text-align: center;
}

.restart-screen__title {
  font-size: 2.6rem;
  margin-bottom: 2rem;
  color: white;
}

.restart-screen__button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.restart-screen__button:hover {
  transform: scale(1.1);
}
</style>
