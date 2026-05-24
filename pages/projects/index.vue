<template>
  <div class="projects-page">
    <section class="projects-page__wrapper">
      <div class="projects-page__header">
        <h1 class="projects-page__title">My Projects</h1>
        <p class="projects-page__subtitle">
          A closer look at selected web and mobile builds, with the product thinking, visuals, and
          technical details behind each one.
        </p>
      </div>

      <div class="projects-page__list">
        <article
          v-for="(project, index) in projects"
          :id="project.id"
          :key="project.id"
          class="project-card"
          :style="{ '--project-background': project.background }"
        >
          <h2 class="project-card__title">{{ project.title }}</h2>

          <div class="project-card__layout">
            <div class="project-card__left">
              <div class="project-card__hero">
                <img
                  :src="project.bgImg"
                  :alt="project.imageAlt"
                  class="project-card__hero-image"
                />
              </div>

              <div class="project-card__info">
                <div class="project-card__actions">
                  <a
                    v-for="(projectLink, linkIndex) in getProjectLinks(project)"
                    :key="projectLink.id"
                    :href="projectLink.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="
                      linkIndex === 0 ? 'project-card__btn-primary' : 'project-card__btn-secondary'
                    "
                  >
                    {{ projectLink.label }}
                  </a>
                </div>

                <p class="project-card__description">{{ project.description }}</p>
              </div>
            </div>

            <div class="project-card__right">
              <button
                v-show="canScrollLeft(project.id)"
                class="carousel-nav carousel-nav--left"
                @click="scrollGallery(project.id, -1)"
                aria-label="Scroll left"
              >
                <IconArrowLeft />
              </button>

              <div
                :ref="(el) => setGalleryRef(el, project.id)"
                class="project-card__gallery"
                @scroll="handleScroll(project.id)"
              >
                <img
                  v-for="(image, imgIndex) in project.images"
                  :key="`${project.id}-img-${imgIndex}`"
                  :src="image"
                  :alt="`${project.title} screenshot ${imgIndex + 1}`"
                  class="project-card__gallery-image"
                />
              </div>

              <button
                v-show="canScrollRight(project.id)"
                class="carousel-nav carousel-nav--right"
                @click="scrollGallery(project.id, 1)"
                aria-label="Scroll right"
              >
                <IconArrowRight />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
