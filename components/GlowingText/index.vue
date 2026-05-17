<template>
  <svg
    :key="`${symbolId}-${fontRenderKey}`"
    viewBox="0 0 250 200"
    preserveAspectRatio="xMidYMid meet"
    class="text-svg"
  >
    <symbol class="text-symbol" :id="symbolId">
      <text
        text-anchor="middle"
        x="50%"
        y="50%"
        dy=".35em"
        :fill="fill"
        :font-family="resolvedFontFamily"
        :style="{ fontFamily: resolvedFontFamily }"
        class="main-text"
      >
        {{ text }}
      </text>
    </symbol>

    <use :xlink:href="`#${symbolId}`" class="text-glow"></use>

    <use :xlink:href="`#${symbolId}`" class="text-border white" x="-0.5" y="0.5"></use>

    <use :xlink:href="`#${symbolId}`" class="text-border"></use>
  </svg>
</template>

<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
