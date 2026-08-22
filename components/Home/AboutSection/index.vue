<template>
  <section id="leadership" class="about">
    <div class="app-container section-content">
      <!-- <div ref="textCanvasRef" class="visual" aria-hidden="true"></div> -->

      <p class="section-label">Leadership, with receipts</p>
      <h2 class="section-title">Hands on the product. Eyes on the whole delivery.</h2>

      <p class="intro">
        I grew from owning frontend tickets to coordinating delivery, reviewing implementation,
        unblocking developers, and keeping product, design, and backend decisions connected.
      </p>

      <div class="highlights">
        <article
          v-for="highlight in leadershipHighlights"
          :key="highlight.id"
          class="card"
          data-motion
        >
          <strong class="card-value">{{ highlight.value }}</strong>
          <h3 class="card-title">
            {{ highlight.label }}
          </h3>

          <p class="card-description">
            {{ highlight.description }}
          </p>
        </article>
      </div>

      <div id="skills" class="skills skills">
        <div class="header">
          <div>
            <p class="section-label">Skills</p>
            <h2 class="section-title">Depth first. Range when the product needs it.</h2>
          </div>
          <p class="description">
            My strongest recent depth is Vue and Nuxt, backed by production React experience and
            cross-platform React Native work. The constant is scalable frontend architecture.
          </p>
        </div>

        <div class="details">
          <div v-for="group in skillGroups" :key="group.id" class="detail-row">
            <h3 class="detail-title">{{ group.title }}:</h3>

            <p class="detail-text">
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
