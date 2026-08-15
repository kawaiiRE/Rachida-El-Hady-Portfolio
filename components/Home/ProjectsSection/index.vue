<template>
  <section id="projects" class="projects">
    <div class="app-container section-content">
      <div class="projects__header">
        <div>
          <p class="section-label">Projects</p>
          <h2 class="section-title">Apps and websites with personality.</h2>
        </div>
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

        <div
          ref="carouselRef"
          class="projects__carousel"
          aria-label="Featured projects carousel"
          tabindex="0"
          @keydown.left.prevent="shiftProject(-1)"
          @keydown.right.prevent="shiftProject(1)"
          @pointerdown="startDrag"
          @pointerup="finishDrag"
          @pointercancel="cancelDrag"
        >
          <button
            v-for="(carouselProject, index) in carouselProjects"
            :key="carouselProject.project.id"
            type="button"
            class="projects__carousel-card"
            :class="carouselProject.state"
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
        <span class="projects__position" aria-live="polite">
          {{ currentPosition }} / {{ totalProjects }}
        </span>
        <button
          type="button"
          class="projects__nav-button"
          aria-label="Next project"
          @click="shiftProject(1)"
        >
          <IconArrowRight />
        </button>
      </div>

      <div
        v-if="currentProject"
        :key="currentProject.id"
        class="projects__panel"
        :style="{ '--project-background': currentProject.background }"
      >
        <div class="projects__panel-copy">
          <h3 class="projects__panel-title">{{ currentProject.title }}</h3>
          <p class="projects__panel-summary">{{ currentProject.summary }}</p>
        </div>

        <div class="projects__panel-tags" aria-label="Project overview">
          <span class="projects__panel-tag projects__panel-tag--category">
            {{ currentProject.category }}
          </span>
          <span
            v-for="technology in getPreviewStack(currentProject)"
            :key="technology"
            class="projects__panel-tag"
          >
            {{ technology }}
          </span>
        </div>

        <div class="projects__actions">
          <NuxtLink
            :to="getProjectPath(currentProject)"
            class="projects__cta projects__cta--primary"
          >
            See Full Project
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
