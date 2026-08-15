<template>
  <main class="project-detail" :style="{ '--project-background': project.background }">
    <div class="app-container project-detail__container">
      <nav class="project-detail__breadcrumb" aria-label="Breadcrumb">
        <NuxtLink :to="APP_ROUTES.HOME">Home</NuxtLink><span aria-hidden="true">/</span>
        <NuxtLink :to="APP_ROUTES.PROJECTS">Projects</NuxtLink><span aria-hidden="true">/</span>
        <span aria-current="page">{{ project.title }}</span>
      </nav>

      <header class="project-detail__header">
        <div class="project-detail__meta">
          <span>{{ project.category }}</span>
          <span>Case {{ projectIndexLabel }} / {{ projectCountLabel }}</span>
        </div>

        <div class="project-detail__intro">
          <h1>{{ project.title }}</h1>

          <div class="project-detail__introduction">
            <p>{{ project.summary }}</p>
            <div v-if="projectLinks.length" class="project-detail__actions">
              <a
                v-for="projectLink in projectLinks"
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

      <figure class="project-detail__hero">
        <img :src="project.bgImg" :alt="project.imageAlt" />
        <figcaption>
          <span>{{ project.title }} / Primary view</span>
          <span>{{ project.category }}</span>
        </figcaption>
      </figure>

      <section class="project-detail__overview" aria-labelledby="project-overview-title">
        <div class="project-detail__overview-copy">
          <p class="section-label">Project overview</p>
          <h2 id="project-overview-title">What I built</h2>
          <p>{{ project.description }}</p>
        </div>

        <dl class="project-detail__metrics">
          <div v-for="(metric, index) in project.metrics" :key="metric.label">
            <span aria-hidden="true">{{ formatIndex(index) }}</span>
            <dt>{{ metric.label }}</dt>
            <dd>{{ metric.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="project-detail__technology" aria-labelledby="project-technology-title">
        <div class="project-detail__section-heading">
          <div>
            <p class="section-label">Technology</p>
            <h2 id="project-technology-title">Tools behind {{ project.title }}</h2>
          </div>
          <p>{{ technologyCountLabel }}</p>
        </div>

        <ol>
          <li v-for="technology in project.stack" :key="technology">{{ technology }}</li>
        </ol>
      </section>

      <section class="project-detail__gallery" aria-labelledby="project-gallery-title">
        <div class="project-detail__section-heading">
          <div>
            <p class="section-label">Product views</p>
            <h2 id="project-gallery-title">Inside the experience</h2>
          </div>
          <p>{{ galleryCountLabel }}</p>
        </div>

        <div class="project-detail__gallery-grid">
          <figure
            v-for="(image, index) in project.images"
            :key="image"
            :class="`project-detail__gallery-item--${getGalleryItemSize(index)}`"
          >
            <img
              :src="image"
              :alt="`${project.title} product screenshot ${index + 1}`"
              loading="lazy"
            />
            <figcaption>View {{ formatIndex(index) }}</figcaption>
          </figure>
        </div>
      </section>

      <section class="project-detail__related" aria-labelledby="related-projects-title">
        <div class="project-detail__section-heading">
          <div>
            <p class="section-label">Keep exploring</p>
            <h2 id="related-projects-title">Next in the field guide</h2>
          </div>
          <NuxtLink :to="APP_ROUTES.PROJECTS">View all projects</NuxtLink>
        </div>

        <div class="project-detail__related-list">
          <NuxtLink
            v-for="(relatedProject, index) in relatedProjects"
            :key="relatedProject.id"
            :to="relatedProject.path"
          >
            <span class="project-detail__related-index">{{ formatIndex(index) }}</span>
            <span class="project-detail__related-category">{{ relatedProject.category }}</span>
            <strong>{{ relatedProject.title }}</strong>
            <span class="project-detail__related-arrow" aria-hidden="true">&#8599;</span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </main>
</template>
<script lang="ts">
import ProjectDetailPage from './script'

export default ProjectDetailPage
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
