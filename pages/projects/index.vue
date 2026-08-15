<template>
  <main class="projects-page" data-page="projects-index">
    <section class="projects-page__wrapper app-container">
      <header class="projects-page__header">
        <div class="projects-page__meta">
          <span>Selected work</span>
          <span>{{ projectCountLabel }} case studies / Web + mobile</span>
        </div>

        <div class="projects-page__intro">
          <h1>Work, in the <em>wild.</em></h1>
          <div class="projects-page__intro-copy">
            <p>Products shaped from first system decisions to the details people actually touch.</p>
            <span class="projects-page__browse-hint">
              <span class="projects-page__browse-hint--desktop">Hover to browse</span>
              <span class="projects-page__browse-hint--mobile">Scroll to browse</span>
              <span aria-hidden="true">&#8595;</span>
            </span>
          </div>
        </div>
      </header>

      <div class="projects-browser">
        <aside
          class="projects-browser__stage"
          :style="{ '--project-background': activeProject.background }"
        >
          <div class="projects-browser__signal" aria-hidden="true"></div>

          <Transition name="project-stage" mode="out-in">
            <div :key="activeProject.id" class="projects-browser__stage-content">
              <NuxtLink
                :to="activeProject.path"
                class="projects-browser__preview"
                :aria-label="`Read the ${activeProject.title} case study`"
              >
                <img :src="activeProject.bgImg" :alt="activeProject.imageAlt" />
                <span class="projects-browser__preview-index">
                  {{ activeProjectIndexLabel }} / {{ projectCountLabel }}
                </span>
                <span class="projects-browser__preview-action">
                  Open case study <span aria-hidden="true">&#8599;</span>
                </span>
              </NuxtLink>

              <div class="projects-browser__caption">
                <div class="projects-browser__identity">
                  <p>{{ activeProject.category }}</p>
                  <h2>{{ activeProject.title }}</h2>
                </div>
                <p class="projects-browser__summary">{{ activeProject.summary }}</p>
              </div>

              <div class="projects-browser__footer">
                <ul aria-label="Featured technologies">
                  <li v-for="technology in activeProjectStack" :key="technology">
                    {{ technology }}
                  </li>
                </ul>

                <div class="projects-browser__links">
                  <NuxtLink :to="activeProject.path">Read case study</NuxtLink>
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

        <ol class="projects-browser__index" aria-label="Project case studies">
          <li
            v-for="(project, index) in projects"
            :id="project.id"
            :key="project.id"
            :class="{ 'projects-browser__item--active': index === activeProjectIndex }"
            class="projects-browser__item"
          >
            <NuxtLink
              :to="project.path"
              class="projects-browser__item-link"
              @mouseenter="setActiveProject(index)"
              @focus="setActiveProject(index)"
            >
              <span class="projects-browser__item-index">{{ formatProjectIndex(index) }}</span>

              <span class="projects-browser__item-copy">
                <strong>{{ project.title }}</strong>
                <small>{{ project.category }}</small>
              </span>

              <span class="projects-browser__item-arrow" aria-hidden="true">&#8599;</span>

              <span class="projects-browser__mobile-preview">
                <img :src="project.bgImg" :alt="project.imageAlt" loading="lazy" />
              </span>

              <span class="projects-browser__mobile-summary">{{ project.summary }}</span>
            </NuxtLink>
          </li>
        </ol>
      </div>
    </section>
  </main>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
