<template>
  <div class="app-layout">
    <AppHeader />
    <main class="default-layout" :class="layoutClasses">
      <slot />
    </main>
  </div>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
