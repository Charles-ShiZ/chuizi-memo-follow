<style lang="scss">
:root {
  --step: calc(100% / 7.5);
  --side: 30vmin;
  --offset: 15vmin;
  --offset-neg: -15vmin;
  font-size: 16px;
}

body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 50px;
  perspective-origin: center center;
  overflow: hidden;
  background: #000;
}

.side,
.container {
  width: var(--side);
  height: var(--side);
}

.container {
  transform-style: preserve-3d;
  animation: rotate 10s infinite linear;

  &:hover {
    animation-play-state: paused;
  }
}

.side {
  position: absolute;
  transform-style: preserve-3d;
  background: conic-gradient(
    teal,
    purple,
    crimson,
    tomato,
    gold,
    yellowgreen,
    mediumaquamarine,
    teal
  );

  mask-image: repeating-radial-gradient(
    rgba(0, 0, 0, 0) 0,
    rgba(0, 0, 0, 0) calc(var(--step) * 1),
    black 0,
    black calc(var(--step) * 1.5),
    rgba(0, 0, 0, 0) 0
  );
  mask-size: 50% 50%;
  mask-position: center center;
}

.back {
  transform: translateZ(var(--offset-neg)) rotateY(180deg);
}

.left {
  transform: translateX(var(--offset-neg)) rotateY(90deg);
}

.right {
  transform: translateX(var(--offset)) rotateY(-90deg) rotateZ(90deg);
}

.top {
  transform: translateY(var(--offset-neg)) rotateX(90deg) rotateZ(-90deg);
}

.bottom {
  transform: translateY(var(--offset)) rotateX(90deg) rotateZ(90deg);
}

.front {
  transform: translateZ(var(--offset)) rotateZ(90deg);
}

@keyframes rotate {
  100% {
    transform: rotateX(360deg) rotateY(-360deg) rotateZ(360deg);
  }
}
</style>
<template>
  <div class="container">
    <div class="back side"></div>
    <div class="left side"></div>
    <div class="right side"></div>
    <div class="top side"></div>
    <div class="bottom side"></div>
    <div class="front side"></div>
  </div>
</template>
<script>

</script>
