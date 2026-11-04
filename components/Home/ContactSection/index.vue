<template>
  <section id="contact" class="contact app-container">
    <div class="wrapper section-content" data-motion>
      <div class="header">
        <div>
          <p class="section-label">Contact / 09</p>
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
      <form class="form" novalidate @submit.prevent="sendMessage" @focusin="onFormFocus">
        <p class="form-intro">Start with the essentials.</p>
        <div class="form-group">
          <label class="form-label" for="contact-name">Name</label>
          <input
            id="contact-name"
            v-model="fields.name"
            type="text"
            name="name"
            autocomplete="name"
            placeholder="Your name"
            class="form-input"
            :maxlength="limits.nameMax"
            :aria-invalid="Boolean(fieldErrors.name)"
            :aria-describedby="fieldErrors.name ? 'contact-name-error' : undefined"
            required
          />
          <p v-if="fieldErrors.name" id="contact-name-error" class="field-error">
            {{ fieldErrors.name }}
          </p>
        </div>

        <div class="form-group">
          <label class="form-label" for="contact-email">Email</label>
          <input
            id="contact-email"
            v-model="fields.email"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="form-input"
            :maxlength="limits.emailMax"
            :aria-invalid="Boolean(fieldErrors.email)"
            :aria-describedby="fieldErrors.email ? 'contact-email-error' : undefined"
            required
          />
          <p v-if="fieldErrors.email" id="contact-email-error" class="field-error">
            {{ fieldErrors.email }}
          </p>
        </div>

        <div class="form-group">
          <label class="form-label" for="contact-subject">
            Subject <span class="optional">(optional)</span>
          </label>
          <input
            id="contact-subject"
            v-model="fields.subject"
            type="text"
            name="subject"
            autocomplete="off"
            placeholder="What it is about"
            class="form-input"
            :maxlength="limits.subjectMax"
            :aria-invalid="Boolean(fieldErrors.subject)"
            :aria-describedby="fieldErrors.subject ? 'contact-subject-error' : undefined"
          />
          <p v-if="fieldErrors.subject" id="contact-subject-error" class="field-error">
            {{ fieldErrors.subject }}
          </p>
        </div>

        <div class="form-group">
          <label class="form-label" for="contact-message">Message</label>
          <textarea
            id="contact-message"
            v-model="fields.message"
            name="message"
            placeholder="What are you working on?"
            class="form-textarea"
            rows="6"
            :maxlength="limits.messageMax"
            :aria-invalid="Boolean(fieldErrors.message)"
            :aria-describedby="fieldErrors.message ? 'contact-message-error' : undefined"
            required
          />
          <p v-if="fieldErrors.message" id="contact-message-error" class="field-error">
            {{ fieldErrors.message }}
          </p>
        </div>

        <!--
          Honeypot. Removed from the accessibility tree and the tab order, and never
          visible, so only a script fills it in. The server discards any submission that
          carries a value here.
        -->
        <div class="honeypot" aria-hidden="true">
          <label :for="`contact-${honeypotField}`">Website</label>
          <input
            :id="`contact-${honeypotField}`"
            v-model="fields.website"
            :name="honeypotField"
            type="text"
            tabindex="-1"
            autocomplete="off"
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
        <button type="submit" class="form-button" :disabled="isSubmitting">
          <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
          <span class="arrow" aria-hidden="true">↗</span>
        </button>
      </form>
    </div>
  </section>
</template>

<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
