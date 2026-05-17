<template>
  <section id="projects" class="projects">
    <div class="app-container">
      <div class="projects__header">
        <div>
          <p class="section-label">Projects</p>
          <h2 class="section-title">Apps and websites with personality.</h2>
        </div>
        <p class="projects__lead">
          A few selected builds from the portfolio, shown in a more cinematic way here and expanded
          on the dedicated projects page.
        </p>
      </div>
    </div>
    <div class="projects__showcase">
      <div class="projects__stage">
        <svg
          class="projects__arc projects__arc--desktop"
          viewBox="0 0 2400 852"
          preserveAspectRatio="none"
        >
          <path class="projects__arc-path" d="M 0 850 A 1335 1335 0 0 1 2400 850"></path>
        </svg>

        <svg
          class="projects__arc projects__arc--mobile"
          viewBox="0 0 3000 852"
          preserveAspectRatio="none"
        >
          <path class="projects__arc-path" d="M 700 850 A 800.5 800.5 0 0 1 2300 850"></path>
        </svg>

        <div class="projects__carousel" aria-label="Featured projects carousel">
          <button
            v-for="(carouselProject, index) in carouselProjects"
            :key="carouselProject.project.id"
            type="button"
            class="projects__carousel-card"
            :class="carouselProject.state"
            :style="{ '--project-background': carouselProject.project.background }"
            :aria-label="`Focus ${carouselProject.project.title}`"
            @click="selectProject(index)"
          >
            <img
              :src="carouselProject.project.logo"
              :alt="carouselProject.project.logoAlt"
              class="projects__carousel-image"
            />
          </button>
        </div>
      </div>
      <div class="projects__navigation">
        <button
          type="button"
          class="projects__nav-button"
          aria-label="Previous project"
          @click="shiftProject(-1)"
        >
          <IconArrowLeft />
        </button>
        <button
          type="button"
          class="projects__nav-button"
          aria-label="Next project"
          @click="shiftProject(1)"
        >
          <IconArrowRight />
        </button>
      </div>

      <Transition name="projects-panel" mode="out-in">
        <div v-if="currentProject" :key="currentProject.id" class="projects__panel">
          <div class="projects__panel-copy">
            <h3 class="projects__panel-title">{{ currentProject.title }}</h3>
            <p class="projects__panel-summary">{{ currentProject.summary }}</p>
            <h4 class="projects__panel-meta">- {{ currentProject.category }}</h4>
          </div>

          <div class="projects__stats">
            <p v-for="metric in currentProject.metrics" :key="metric.label" class="projects__stat">
              <span>{{ metric.value }}</span>
              {{ metric.label }}
            </p>
          </div>

          <NuxtLink :to="APP_ROUTES.PROJECTS" class="projects__cta">See All Projects</NuxtLink>
        </div>
      </Transition>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
