<template>
  <section id="contact" class="contact app-container">
    <div class="contact__wrapper section-content">
      <div class="contact__header">
        <div>
          <p class="section-label">Contact / 08</p>
          <h2 class="section-title">Tell me what you’re building.</h2>
        </div>
        <p class="contact__intro">
          A rough idea is enough. Send the context, the constraint, or the problem you want to
          solve.
        </p>

        <!-- Contact items -->
        <ul class="contact__list" v-if="contactItems && contactItems.length">
          <!-- Text Items -->
          <li
            v-for="item in contactItems.filter((i) => !i.isIcon)"
            :key="item.id"
            class="contact__item contact__item--text"
          >
            <span class="contact__label">{{ item.label }}</span>
            <NuxtLink :to="item.href" class="contact__value">{{ item.value }}</NuxtLink>
          </li>

          <!-- Icon Items -->
          <li class="contact__item contact__item--icons">
            <NuxtLink
              v-for="item in contactItems.filter((i) => i.isIcon)"
              :key="item.id"
              :to="item.href"
              :title="item.label"
              class="contact__icon"
              target="_blank"
              rel="noopener noreferrer"
              :style="{ '--icon-hover-color': item.color || 'var(--primary-scale-400)' }"
            >
              <IconGithub v-if="item.id === 'github'" />
              <IconLinkedin v-else-if="item.id === 'linkedin'" />
              <IconWhatsapp v-else-if="item.id === 'whatsapp'" />
              <IconPhone v-else-if="item.id === 'phone'" />
            </NuxtLink>
          </li>
        </ul>

        <a
          v-if="APP_LINKS.CV_DOWNLOAD"
          :href="APP_LINKS.CV_DOWNLOAD"
          class="contact__cv-link"
          download
        >
          Download CV
        </a>
      </div>

      <!-- Contact form -->
      <form class="contact__form" @submit.prevent="sendMessage">
        <p class="contact__form-intro">Start with the essentials.</p>
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
        <div v-if="errorMessage" class="form-message form-message--error">
          {{ errorMessage }}
        </div>

        <!-- Success message -->
        <div v-if="successMessage" class="form-message form-message--success">
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
