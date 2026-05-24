<template>
  <section id="leadership" class="about">
    <div class="app-container">
      <!-- <div ref="textCanvasRef" class="about__visual" aria-hidden="true"></div> -->

      <p class="section-label">Leadership</p>
      <h2 class="section-title">How I help teams move with clarity.</h2>

      <div class="leadership__highlights">
        <article
          v-for="highlight in leadershipHighlights"
          :key="highlight.id"
          class="leadership__card"
        >
          <h3 class="leadership__card-title">
            {{ highlight.title }}
          </h3>

          <p class="leadership__card-description">
            {{ highlight.description }}
          </p>
        </article>
      </div>

      <div id="skills" class="about__skills skills">
        <div class="skills__header">
          <div>
            <p class="section-label">Skills</p>
            <h2 class="section-title">Tools I Build With</h2>
          </div>
          <p class="skills__description">
            I work across web and mobile interfaces, focusing on clean UI, reusable components, and
            practical features that are easy to maintain.
          </p>
        </div>

        <div class="skills__details">
          <div v-for="group in skillGroups" :key="group.id" class="skills__detail-row">
            <h3 class="skills__detail-title">{{ group.title }}:</h3>

            <p class="skills__detail-text">
              {{ group.skills.join(', ') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
