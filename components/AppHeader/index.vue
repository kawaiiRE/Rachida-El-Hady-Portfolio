<template>
  <header class="navbar" aria-label="Main navigation">
    <div class="inner app-container">
      <NuxtLink :to="APP_ROUTES.HOME" class="brand">
        <GlowingText text="{ R }" font-preset="oleo" />
      </NuxtLink>

      <div class="actions">
        <nav class="desktop" aria-label="Desktop navigation">
          <NuxtLink v-for="link in links" :key="link.id" :to="`${link.path}`" class="link">
            {{ link.label }}
          </NuxtLink>
        </nav>

        <button
          class="theme-toggle"
          :class="{ 'theme-toggle--dark': isDarkTheme }"
          type="button"
          :aria-label="themeToggleLabel"
          :aria-pressed="isDarkTheme"
          @click="toggleThemeMode"
        >
          <span class="theme-track" aria-hidden="true">
            <span class="theme-thumb"></span>
          </span>
        </button>

        <button
          class="toggle"
          type="button"
          :aria-label="menuButtonLabel"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-nav"
          @click="toggleMobileMenu"
        >
          <span class="toggle-icon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </div>

    <nav
      id="mobile-nav"
      class="mobile"
      :class="{ 'mobile--open': isMobileMenuOpen }"
      :aria-hidden="!isMobileMenuOpen"
      :inert="!isMobileMenuOpen"
      aria-label="Mobile navigation"
    >
      <NuxtLink
        v-for="link in links"
        :key="`mobile-${link.id}`"
        :to="`${link.path}`"
        class="mobile-link"
        @click="closeMobileMenu"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>

    <span class="progress" aria-hidden="true">
      <span :style="scrollProgressStyle"></span>
    </span>
  </header>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
