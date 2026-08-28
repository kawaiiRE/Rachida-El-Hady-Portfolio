<template>
  <section id="hero" ref="heroRef" class="hero">
    <div ref="backgroundRef" class="background" aria-hidden="true"></div>

    <div class="app-container section-content">
      <div class="content">
        <p class="eyebrow">
          <span>Frontend engineer</span>
          <span>Web &amp; mobile products</span>
        </p>

        <h1 class="title">
          <span>Rachida</span>
          <span>El Hady</span>
        </h1>

        <p class="subtitle">
          I build production React, Vue, Nuxt, and mobile products—then shape the architecture,
          delivery rhythm, and team clarity that help them scale.
        </p>

        <div class="actions">
          <NuxtLink :to="APP_ROUTES.PROJECTS" class="cta primary">See Projects</NuxtLink>
          <NuxtLink :to="APP_ROUTES.CONTACT" class="cta ghost">Get In Touch</NuxtLink>
          <a v-if="APP_LINKS.CV_DOWNLOAD" :href="APP_LINKS.CV_DOWNLOAD" class="cta ghost" download>
            Download CV
          </a>
        </div>
      </div>
    </div>

    <img
      ref="sittingImageRef"
      src="/images/char-sitting-with-laptop.avif"
      class="sitting-image"
      width="1352"
      height="1972"
      fetchpriority="high"
      alt="Illustrated character sitting with a laptop"
    />

    <div ref="scrollFlowerRef" class="scroll-flower" aria-hidden="true">
      <span
        v-for="petalIndex in 6"
        :key="petalIndex"
        class="scroll-flower-petal"
        :style="{ '--petal-index': petalIndex - 1 }"
      ></span>
      <span class="scroll-flower-core"></span>
    </div>

    <div class="boundary" aria-hidden="true">
      <span class="boundary-mark"></span>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
