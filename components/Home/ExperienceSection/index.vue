<template>
  <section id="experience" class="experience">
    <div class="app-container section-content">
      <header class="experience__header" data-motion>
        <p class="section-label">Experience in practice</p>
        <h2 class="section-title">From interface craft to team momentum.</h2>
      </header>
      <div class="experience__track">
        <article
          v-for="chapter in chapters"
          :key="chapter.id"
          class="experience__chapter"
          data-motion
        >
          <span class="experience__index">{{ chapter.index }}</span>
          <div>
            <h3>{{ chapter.title }}</h3>
            <p>{{ chapter.description }}</p>
          </div>
          <span class="experience__detail">{{ chapter.detail }}</span>
        </article>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
