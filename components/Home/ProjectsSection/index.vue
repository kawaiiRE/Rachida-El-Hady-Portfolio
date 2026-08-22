<template>
  <section id="projects" class="projects">
    <div class="app-container section-content">
      <div class="header" data-motion>
        <div>
          <p class="section-label">Independent products</p>
          <h2 class="section-title">Ideas I took all the way to working software.</h2>
        </div>
      </div>
    </div>
    <div class="showcase section-content" data-motion>
      <div class="stage">
        <svg class="arc arc--desktop" viewBox="0 0 2400 852" preserveAspectRatio="none">
          <path class="arc-path" d="M 0 850 A 1335 1335 0 0 1 2400 850"></path>
        </svg>

        <svg class="arc arc--mobile" viewBox="0 0 3000 852" preserveAspectRatio="none">
          <path class="arc-path" d="M 700 850 A 800.5 800.5 0 0 1 2300 850"></path>
        </svg>

        <div
          ref="carouselRef"
          class="carousel"
          aria-label="Featured projects carousel"
          aria-roledescription="carousel"
          role="region"
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
            class="carousel-card"
            :class="carouselProject.state"
            :aria-label="`Focus ${carouselProject.project.title}`"
            :aria-current="carouselProject.state === 'is-active' ? 'true' : undefined"
            :aria-hidden="carouselProject.state === 'is-hidden' ? 'true' : undefined"
            :tabindex="carouselProject.state === 'is-active' ? 0 : -1"
            @click="selectProject(index)"
          >
            <img
              :src="carouselProject.project.logo"
              :alt="carouselProject.project.logoAlt"
              class="carousel-image"
            />
          </button>
        </div>
      </div>
      <div class="navigation">
        <button
          type="button"
          class="nav-button"
          aria-label="Previous project"
          @click="shiftProject(-1)"
        >
          <IconArrowLeft />
        </button>
        <span class="position" aria-live="polite">
          {{ currentPosition }} / {{ totalProjects }}
          <span class="visually-hidden">— {{ currentProject?.title }}</span>
        </span>
        <button type="button" class="nav-button" aria-label="Next project" @click="shiftProject(1)">
          <IconArrowRight />
        </button>
      </div>

      <div
        v-if="currentProject"
        :key="currentProject.id"
        class="panel"
        :style="{ '--project-background': currentProject.background }"
      >
        <div class="panel-copy">
          <h3 class="panel-title">{{ currentProject.title }}</h3>
          <p class="panel-summary">{{ currentProject.summary }}</p>
        </div>

        <div class="panel-tags" aria-label="Project overview">
          <span class="panel-tag panel-tag--category">
            {{ currentProject.category }}
          </span>
          <span
            v-for="technology in getPreviewStack(currentProject)"
            :key="technology"
            class="panel-tag"
          >
            {{ technology }}
          </span>
        </div>

        <div class="actions">
          <NuxtLink :to="getProjectPath(currentProject)" class="cta cta--primary">
            See Full Project
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
