<template>
  <section id="hero" class="hero">
    <div ref="heroBackgroundRef" class="hero__background" aria-hidden="true"></div>
    <div class="app-container">
      <div class="hero__content">
        <h1 class="hero__title">Rachida El Hady</h1>
        <p class="hero__subtitle">
          Focused on writing structured code and architecting reliable systems that scale seamlessly
          in production.
        </p>

        <div class="hero__actions">
          <NuxtLink :to="APP_ROUTES.PROJECTS" class="hero__cta hero__cta--primary"
            >See Projects</NuxtLink
          >
          <NuxtLink :to="APP_ROUTES.CONTACT" class="hero__cta hero__cta--ghost"
            >Get In Touch</NuxtLink
          >
        </div>
      </div>
    </div>
    <img
      src="/images/char-sitting-with-laptop.avif"
      class="sitting-image"
      alt="Character sitting with a laptop"
    />
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
