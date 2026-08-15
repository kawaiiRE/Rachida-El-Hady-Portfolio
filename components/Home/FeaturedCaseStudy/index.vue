<template>
  <section id="case-study" class="case-study">
    <div class="app-container section-content">
      <header class="case-study__header" data-motion>
        <div>
          <p class="section-label">Featured case study</p>
          <h2 class="section-title">One product.<br />Two platforms.</h2>
        </div>
        <p class="case-study__lede">{{ project.description }}</p>
      </header>

      <div class="case-study__visual" data-motion>
        <img :src="project.images[0]" :alt="project.imageAlt" loading="lazy" />
        <img :src="mobileProject.images[0]" :alt="mobileProject.imageAlt" loading="lazy" />
        <span class="case-study__orb" aria-hidden="true"></span>
      </div>

      <div class="case-study__details" data-motion>
        <div v-for="metric in project.metrics" :key="metric.label" class="case-study__metric">
          <strong>{{ metric.value }}</strong
          ><span>{{ metric.label }}</span>
        </div>
        <div class="case-study__stack">
          <span v-for="technology in project.stack.slice(0, 6)" :key="technology">{{
            technology
          }}</span>
        </div>
        <NuxtLink :to="project.path" class="case-study__link"
          >Explore TrackPal <span>↗</span></NuxtLink
        >
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
