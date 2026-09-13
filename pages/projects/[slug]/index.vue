<template>
  <div class="project-detail" :style="{ '--project-background': project.background }">
    <div class="app-container container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink :to="APP_ROUTES.HOME">Home</NuxtLink><span aria-hidden="true">/</span>
        <NuxtLink :to="APP_ROUTES.PROJECTS">Projects</NuxtLink><span aria-hidden="true">/</span>
        <span aria-current="page">{{ project.title }}</span>
      </nav>

      <header class="header">
        <div class="meta">
          <span>{{ project.category }}</span>
          <span>Project {{ projectNumber }} / {{ projectCount }}</span>
        </div>

        <div class="intro">
          <h1>{{ project.title }}</h1>

          <div class="introduction">
            <p>{{ project.summary }}</p>
            <div v-if="hasProjectLinks" class="actions">
              <a
                v-for="projectLink in project.links"
                :key="projectLink.id"
                :href="projectLink.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ projectLink.label }} <span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <figure class="hero">
        <div class="hero-media">
          <img :src="project.bgImg" :alt="project.imageAlt" />
        </div>
        <figcaption>
          <span>{{ project.title }} / Platform previews</span>
          <span>{{ project.category }}</span>
        </figcaption>
      </figure>

      <section class="overview" aria-labelledby="project-overview-title">
        <div class="overview-copy">
          <p class="section-label">Project overview</p>
          <h2 id="project-overview-title">What I built</h2>
          <p>{{ project.description }}</p>
        </div>

        <dl class="metrics">
          <div v-for="(metric, index) in project.metrics" :key="metric.label">
            <dt>
              <span aria-hidden="true">{{ index + 1 }}</span>
              <span>{{ metric.label }}</span>
            </dt>
            <dd>{{ metric.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="technology" aria-labelledby="project-technology-title">
        <div class="section-heading">
          <div>
            <p class="section-label">Technology</p>
            <h2 id="project-technology-title">Tools behind {{ project.title }}</h2>
          </div>
          <p>{{ technologies.length }} tools</p>
        </div>

        <ol>
          <li v-for="technology in technologies" :key="technology">{{ technology }}</li>
        </ol>
      </section>

      <section class="gallery" aria-labelledby="project-gallery-title">
        <div class="section-heading">
          <div>
            <p class="section-label">Product views</p>
            <h2 id="project-gallery-title">Inside the experience</h2>
          </div>
          <p>{{ galleryCount }} views</p>
        </div>

        <div
          class="carousel"
          role="region"
          aria-roledescription="carousel"
          :aria-label="`${project.title} product screenshots`"
        >
          <div ref="galleryRef" class="track" tabindex="0">
            <figure
              v-for="(image, index) in project.images"
              :key="image"
              class="slide"
              role="group"
              :aria-label="`${project.title} screenshot ${index + 1}`"
            >
              <img
                :src="image"
                :alt="`${project.title} product screenshot ${index + 1}`"
                loading="lazy"
              />
              <figcaption>{{ project.title }} / View {{ index + 1 }}</figcaption>
            </figure>
          </div>

          <template v-if="galleryCount > 1">
            <button
              type="button"
              class="nav previous"
              aria-label="Previous screenshot"
              @click="scrollGallery(-1)"
            >
              <IconArrowLeft />
            </button>
            <button
              type="button"
              class="nav next"
              aria-label="Next screenshot"
              @click="scrollGallery(1)"
            >
              <IconArrowRight />
            </button>
          </template>
        </div>
      </section>

      <section class="related" aria-labelledby="related-projects-title">
        <div class="section-heading">
          <div>
            <p class="section-label">Keep exploring</p>
            <h2 id="related-projects-title">Next in the field guide</h2>
          </div>
          <NuxtLink :to="APP_ROUTES.PROJECTS">View all projects</NuxtLink>
        </div>

        <div class="related-list">
          <NuxtLink
            v-for="(relatedProject, index) in relatedProjects"
            :key="relatedProject.id"
            :to="relatedProject.path"
          >
            <span class="related-index">{{ index + 1 }}</span>
            <span class="related-category">{{ relatedProject.category }}</span>
            <strong>{{ relatedProject.title }}</strong>
            <span class="related-arrow" aria-hidden="true">&#8599;</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
