<template>
  <section id="experience" class="experience">
    <div class="app-container section-content">
      <header class="header" data-motion>
        <div>
          <p class="section-label">Professional experience</p>
          <h2 class="section-title">Production work, with ownership attached.</h2>
        </div>
        <p>
          The through-line is hands-on frontend engineering: build the system, clarify the work,
          help the team ship it, and stay close enough to production to know what actually works.
        </p>
      </header>

      <div class="roles">
        <article v-for="role in roles" :key="role.id" class="role" data-motion>
          <aside class="role-intro">
            <span class="role-index">Role {{ role.index }}</span>
            <p class="period">
              <time :datetime="role.startDate">{{ role.startLabel }}</time>
              <span aria-hidden="true">—</span>
              <time :datetime="role.endDate">{{ role.endLabel }}</time>
            </p>
            <h3>{{ role.company }}</h3>
            <p class="role-title">{{ role.title }}</p>
            <p class="role-summary">{{ role.summary }}</p>
          </aside>

          <div class="role-body">
            <ul class="highlights" aria-label="Role highlights">
              <li v-for="highlight in role.highlights" :key="highlight">
                {{ highlight }}
              </li>
            </ul>

            <div class="projects-heading">
              <span>Selected client delivery — product names withheld</span>
              <span>{{ String(role.projects.length).padStart(2, '0') }}</span>
            </div>

            <ol class="projects">
              <li v-for="project in role.projects" :key="project.id" class="project" data-motion>
                <span class="project-index">{{ project.index }}</span>

                <div class="project-copy">
                  <p>{{ project.context }}</p>
                  <h4>{{ project.title }}</h4>
                  <p>{{ project.description }}</p>
                </div>

                <ul class="project-stack" :aria-label="`${project.title} technologies`">
                  <li v-for="technology in project.technologies" :key="technology">
                    {{ technology }}
                  </li>
                </ul>
              </li>
            </ol>

            <p v-if="role.additional" class="additional">
              <span>More shipped work</span>
              {{ role.additional }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
