<template>
  <div class="home-page">
    <HomeHeroSection />
    <HomeAboutSection />
    <HomeVibeSection />
    <HomeProjectsSection :projects="projects" />
    <HomeContactSection />
  </div>
</template>

<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
