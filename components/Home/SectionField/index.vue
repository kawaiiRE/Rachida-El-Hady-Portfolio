<template>
  <canvas
    ref="canvasRef"
    class="section-field"
    :class="{ 'is-hidden': isHero }"
    aria-hidden="true"
  ></canvas>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
