<template>
  <section id="contact" class="contact app-container">
    <div class="wrapper section-content" data-motion>
      <div class="header">
        <div>
          <p class="section-label">Contact / 08</p>
          <h2 class="section-title">Tell me what you’re building.</h2>
        </div>
        <p class="intro">
          A rough idea is enough. Send the context, the constraint, or the problem you want to
          solve.
        </p>

        <!-- Contact items -->
        <ul class="list" v-if="contactItems && contactItems.length">
          <!-- Text Items -->
          <li
            v-for="item in contactItems.filter((i) => !i.isIcon)"
            :key="item.id"
            class="item item--text"
          >
            <span class="label">{{ item.label }}</span>
            <a :href="item.href" class="value">{{ item.value }}</a>
          </li>

          <!-- Icon Items -->
          <li class="item item--icons">
            <a
              v-for="item in contactItems.filter((i) => i.isIcon)"
              :key="item.id"
              :href="item.href"
              :title="item.label"
              :aria-label="item.label"
              class="icon"
              :target="item.href.startsWith('http') ? '_blank' : undefined"
              :rel="item.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              :style="{ '--icon-hover-color': item.color || 'var(--primary-scale-400)' }"
            >
              <IconGithub v-if="item.id === 'github'" />
              <IconLinkedin v-else-if="item.id === 'linkedin'" />
              <IconWhatsapp v-else-if="item.id === 'whatsapp'" />
              <IconPhone v-else-if="item.id === 'phone'" />
            </a>
          </li>
        </ul>

        <a v-if="APP_LINKS.CV_DOWNLOAD" :href="APP_LINKS.CV_DOWNLOAD" class="cv-link" download>
          Download CV
        </a>
      </div>

      <!-- Contact form -->
      <form class="form" @submit.prevent="sendMessage">
        <p class="form-intro">Start with the essentials.</p>
        <div class="form-group">
          <label class="form-label" for="contact-name">Name</label>
          <input
            id="contact-name"
            v-model="formData.name"
            type="text"
            name="name"
            autocomplete="name"
            placeholder="Your name"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="contact-email">Email</label>
          <input
            id="contact-email"
            v-model="formData.email"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="contact-message">Message</label>
          <textarea
            id="contact-message"
            v-model="formData.message"
            name="message"
            placeholder="What are you working on?"
            class="form-textarea"
            rows="6"
            required
          />
        </div>

        <!-- Error message -->
        <div v-if="errorMessage" class="form-message form-message--error" role="alert">
          {{ errorMessage }}
        </div>

        <!-- Success message -->
        <div
          v-if="successMessage"
          class="form-message form-message--success"
          role="status"
          aria-live="polite"
        >
          {{ successMessage }}
        </div>

        <!-- Submit button -->
        <button type="submit" class="form-button" :disabled="isLoading">
          <span>{{ isLoading ? 'Sending...' : 'Send Message' }}</span>
          <span aria-hidden="true">↗</span>
        </button>
      </form>
    </div>
  </section>
</template>

<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
