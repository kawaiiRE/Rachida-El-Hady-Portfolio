<template>
  <div ref="projectsPageRef" class="projects-page" data-page="projects-index">
    <section class="wrapper app-container">
      <header class="header">
        <div class="meta">
          <span>Independent work</span>
          <span>{{ projectCountLabel }} products / Web + mobile</span>
        </div>

        <div class="intro">
          <h1>Work, in the <em>wild.</em></h1>
          <div class="intro-copy">
            <p>Products shaped from first system decisions to the details people actually touch.</p>
            <span class="browse-hint">
              <span class="browse-hint--desktop">Hover to browse</span>
              <span class="browse-hint--mobile">Scroll to browse</span>
              <span aria-hidden="true">&#8595;</span>
            </span>
          </div>
        </div>
      </header>

      <div class="projects-browser">
        <aside
          v-if="isDesktopViewport"
          class="stage"
          :style="{
            '--project-background':
              activeProject.background ?? activeProjectPreviews[0]?.background,
          }"
        >
          <div class="signal" aria-hidden="true"></div>

          <Transition name="project-stage">
            <div :key="activeProject.id" class="stage-content">
              <NuxtLink
                :to="activeProject.path"
                class="preview"
                :aria-label="`View the ${activeProject.title} project`"
              >
                <span
                  class="preview-media"
                  :class="{ 'is-multiple': activeProjectPreviews.length > 1 }"
                >
                  <img
                    v-for="preview in activeProjectPreviews"
                    :key="preview.id"
                    :src="preview.bgImg"
                    :alt="preview.imageAlt"
                    width="1600"
                    height="900"
                    decoding="async"
                  />
                </span>
                <span class="preview-index">
                  {{ activeProjectIndexLabel }} / {{ projectCountLabel }}
                </span>
                <span class="preview-action">
                  Open project <span aria-hidden="true">&#8599;</span>
                </span>
              </NuxtLink>

              <div class="caption">
                <div class="identity">
                  <p>{{ activeProject.category }}</p>
                  <h2>{{ activeProject.title }}</h2>
                </div>
                <p class="summary">{{ activeProject.summary }}</p>
              </div>

              <div class="footer">
                <ul aria-label="Featured technologies">
                  <li v-for="technology in activeProjectStack" :key="technology">
                    {{ technology }}
                  </li>
                </ul>

                <div class="links">
                  <NuxtLink :to="activeProject.path">View project</NuxtLink>
                  <a
                    v-for="projectLink in activeProjectLinks"
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
          </Transition>
        </aside>

        <ol class="index" aria-label="Projects">
          <li
            v-for="(project, index) in projects"
            :id="project.id"
            :key="project.id"
            :class="{ 'item--active': index === activeProjectIndex }"
            class="item"
            :style="{
              '--project-background':
                project.background ?? getProjectPreviews(project)[0]?.background,
            }"
          >
            <NuxtLink
              :to="project.path"
              class="item-link"
              @mouseenter="setActiveProject(index)"
              @focus="setActiveProject(index)"
            >
              <span class="item-index">{{ formatProjectIndex(index) }}</span>

              <span class="item-copy">
                <h2>{{ project.title }}</h2>
                <small>{{ project.category }}</small>
              </span>

              <span class="item-arrow" aria-hidden="true">&#8599;</span>

              <span
                v-if="!isDesktopViewport"
                class="mobile-preview"
                :class="{ 'is-multiple': getProjectPreviews(project).length > 1 }"
              >
                <img
                  v-for="preview in getProjectPreviews(project)"
                  :key="preview.id"
                  :src="preview.bgImg"
                  :alt="preview.imageAlt"
                  width="1600"
                  height="900"
                  loading="lazy"
                  decoding="async"
                />
              </span>

              <span class="mobile-summary">{{ project.summary }}</span>
            </NuxtLink>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
