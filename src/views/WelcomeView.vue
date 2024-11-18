<script setup lang="ts"></script>

<template>
  <div class="title">
    <div class="title__background"></div>
    <h1 class="title__text green">Jumping Journey</h1>
  </div>
</template>

<style scoped>
.title {
  position: relative;
}

.title__background {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(45deg, #00dc82, #36e4da, #0047e1);
  filter: blur(60px);
}

.title__text {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
  text-align: center;
}

h3 {
  font-size: 1.2rem;
}

@media (min-width: 1024px) {
  .title__text {
    text-align: left;
  }
}
</style>
