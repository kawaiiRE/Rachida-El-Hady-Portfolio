<template>
  <header class="navbar" aria-label="Main navigation">
    <div class="navbar__inner app-container">
      <NuxtLink :to="APP_ROUTES.HOME" class="navbar__brand">
        <GlowingText text="{ R }" font-preset="oleo" />
      </NuxtLink>

      <div class="navbar__actions">
        <nav class="navbar__desktop" aria-label="Desktop navigation">
          <NuxtLink v-for="link in links" :key="link.id" :to="`${link.path}`" class="navbar__link">
            {{ link.label }}
          </NuxtLink>
        </nav>

        <button
          class="navbar__theme-toggle"
          :class="{ 'navbar__theme-toggle--dark': isDarkTheme }"
          type="button"
          :aria-label="themeToggleLabel"
          :aria-pressed="isDarkTheme"
          @click="toggleThemeMode"
        >
          <span class="navbar__theme-track" aria-hidden="true">
            <span class="navbar__theme-thumb"></span>
          </span>
          <span class="navbar__theme-text">{{ themeToggleText }}</span>
        </button>

        <button
          class="navbar__toggle"
          type="button"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-nav"
          @click="toggleMobileMenu"
        >
          {{ menuButtonLabel }}
        </button>
      </div>
    </div>

    <nav
      id="mobile-nav"
      class="navbar__mobile"
      :class="{ 'navbar__mobile--open': isMobileMenuOpen }"
      aria-label="Mobile navigation"
    >
      <NuxtLink
        v-for="link in links"
        :key="`mobile-${link.id}`"
        :to="`${link.path}`"
        class="navbar__mobile-link"
        @click="closeMobileMenu"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
