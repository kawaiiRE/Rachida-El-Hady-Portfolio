<template>
  <div class="app-layout">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <AppHeader />
    <main id="main-content" class="default-layout" :class="layoutClasses" tabindex="-1">
      <slot />
    </main>
  </div>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
