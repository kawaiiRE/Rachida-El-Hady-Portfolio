<template>
  <section id="case-study" class="case-study">
    <div class="app-container section-content">
      <header class="header" data-motion>
        <div>
          <p class="section-label">Featured independent product</p>
          <h2 class="section-title">One system.<br />Every surface.</h2>
        </div>
        <p class="lede">{{ project.description }}</p>
      </header>

      <div class="visual" data-motion>
        <img :src="project.images[0]" :alt="project.imageAlt" loading="lazy" />
        <img :src="mobileProject.images[0]" :alt="mobileProject.imageAlt" loading="lazy" />
        <span class="field field--primary" aria-hidden="true"></span>
        <span class="field field--secondary" aria-hidden="true"></span>
      </div>

      <div class="details" data-motion>
        <div v-for="metric in project.metrics" :key="metric.label" class="metric">
          <strong>{{ metric.value }}</strong
          ><span>{{ metric.label }}</span>
        </div>
        <div class="stack">
          <span v-for="technology in project.stack.slice(0, 6)" :key="technology">{{
            technology
          }}</span>
        </div>
        <NuxtLink :to="project.path" class="link">Explore TrackPal <span>↗</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
