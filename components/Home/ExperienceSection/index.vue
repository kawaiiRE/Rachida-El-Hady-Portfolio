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
            <div class="details-heading">
              <span>Selected responsibilities and delivery</span>
              <span>{{ String(role.highlights?.length ?? 0).padStart(2, '0') }}</span>
            </div>

            <ol class="achievements">
              <li
                v-for="(highlight, index) in role.highlights ?? []"
                :key="highlight"
                class="achievement"
                data-motion
              >
                <span class="achievement-index">{{ String(index + 1).padStart(2, '0') }}</span>
                <p>{{ highlight }}</p>
              </li>
            </ol>

            <ul class="role-stack" :aria-label="`${role.company} technologies`">
              <li v-for="technology in role.technologies ?? []" :key="technology">
                {{ technology }}
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
