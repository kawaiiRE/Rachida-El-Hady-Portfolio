<template>
  <section id="about" class="about">
    <div class="app-container">
      <!-- <div ref="textCanvasRef" class="about__visual" aria-hidden="true"></div> -->

      <p class="section-label">About</p>
      <h2 class="section-title">Frontend engineering with style and substance.</h2>

      <ul class="about__list">
        <li v-for="item in items" :key="item" class="about__item">
          {{ item }}
        </li>
      </ul>

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

        <div class="skills__beyond">
          <div class="skills__beyond-header">
            <div>
              <p class="section-label">Beyond Coding</p>
              <h2 class="section-title">How I Work With Teams</h2>
            </div>

            <p class="skills__description">
              I don't only focus on writing code. I also support teammates, review work, and help
              projects move forward with clearer structure and better quality.
            </p>
          </div>

          <div class="skills__highlights">
            <article
              v-for="highlight in highlights"
              :key="highlight.id"
              class="skills__highlight-card"
            >
              <h3 class="skills__highlight-title">
                {{ highlight.title }}
              </h3>

              <p class="skills__highlight-description">
                {{ highlight.description }}
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
