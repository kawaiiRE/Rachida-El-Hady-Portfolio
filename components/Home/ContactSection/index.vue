<template>
  <section id="contact" class="contact app-container">
    <div class="app-container contact__wrapper">
      <div class="contact__header">
        <p class="section-label">Contact</p>
        <h2 class="section-title">You can reach me via:</h2>

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

        <div class="contact__divider">
          <span>or</span>
        </div>

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
        <div class="form-group">
          <input
            v-model="formData.name"
            type="text"
            placeholder="Your Name"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <input
            v-model="formData.email"
            type="email"
            placeholder="Your Email"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <textarea
            v-model="formData.message"
            placeholder="Your Message"
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
          {{ isLoading ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
