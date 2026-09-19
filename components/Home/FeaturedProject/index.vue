<template>
  <section id="featured-project" ref="sectionRef" class="featured-project">
    <div class="app-container section-content">
      <header class="header">
        <div>
          <p class="section-label" data-motion>Featured independent product</p>
          <h2 class="section-title">
            <span class="mask"><span class="reveal">One system.</span></span
            ><br />
            <span class="mask"><span class="reveal">Every surface.</span></span>
          </h2>
        </div>
        <p class="lede" data-motion>{{ project.description }}</p>
      </header>

      <div class="visual">
        <div
          v-for="(image, index) in images"
          :key="image.src"
          class="media"
          :class="{ mobile: index === 1 }"
        >
          <div class="depth">
            <img
              :src="image.src"
              :width="image.width"
              :height="image.height"
              :alt="image.alt"
              loading="lazy"
            />
          </div>
        </div>
        <span class="field primary" aria-hidden="true"></span>
        <span class="field secondary" aria-hidden="true"></span>
      </div>

      <div class="details" data-motion>
        <div v-for="metric in metrics" :key="metric.label" class="metric">
          <strong>{{ metric.value }}</strong
          ><span>{{ metric.label }}</span>
        </div>
        <div class="stack">
          <span v-for="technology in technologies" :key="technology">{{ technology }}</span>
        </div>
        <NuxtLink :to="project.path" class="link"
          >Explore TrackPal <span class="arrow" aria-hidden="true">↗</span></NuxtLink
        >
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
