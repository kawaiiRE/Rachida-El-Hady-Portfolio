<template>
  <section id="approach" class="engineering">
    <div class="app-container section-content">
      <header class="engineering__header" data-motion>
        <p class="section-label">Engineering approach</p>
        <h2 class="section-title">The thinking behind the pixels.</h2>
      </header>
      <div class="engineering__grid">
        <article
          v-for="principle in principles"
          :key="principle.id"
          class="engineering__card"
          data-motion
        >
          <span>{{ principle.signal }}</span>
          <h3>{{ principle.title }}</h3>
          <p>{{ principle.description }}</p>
          <i aria-hidden="true"></i>
        </article>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
