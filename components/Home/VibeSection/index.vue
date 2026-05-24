<template>
  <section id="vibe" class="vibe">
    <div class="app-container">
      <div class="vibe__banner">
        <div class="vibe__marquee" aria-label="Animated list of design and frontend vibes">
          <div class="vibe__row" :class="{ 'vibe__row--reverse': false }">
            <template v-for="copyIndex in ROW_REPEAT_COUNT" :key="`row1-copy-${copyIndex}`">
              <div
                v-for="(label, itemIndex) in vibeRows[0]"
                :key="`row1-${copyIndex}-${itemIndex}`"
                class="vibe__item"
                :aria-hidden="copyIndex > 0 ? 'true' : undefined"
              >
                <span class="vibe__text">{{ label }}</span>
                <span class="vibe__dot" aria-hidden="true">.</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="vibe__image-wrapper">
        <div class="vibe__player" :class="{ 'vibe__player--active': isPlaying }">
          <div class="vibe__player-bars" :class="{ 'vibe__player-bars--active': isPlaying }">
            <span class="vibe__player-bar"></span>
            <span class="vibe__player-bar"></span>
            <span class="vibe__player-bar"></span>
            <span class="vibe__player-bar"></span>
          </div>

          <div class="vibe__player-copy">
            <p class="vibe__player-title">{{ track.title }}</p>
            <p class="vibe__player-subtitle">{{ track.subtitle }}</p>
          </div>

          <button
            type="button"
            class="vibe__player-button"
            :class="{ 'vibe__player-button--active': isPlaying }"
            :aria-pressed="isPlaying ? 'true' : 'false'"
            :aria-label="isPlaying ? 'Pause vibe track' : 'Play vibe track'"
            @click="togglePlayback"
          >
            <span
              class="vibe__player-button-icon"
              :class="{
                'vibe__player-button-icon--pause': isPlaying,
                'vibe__player-button-icon--play': !isPlaying,
              }"
              aria-hidden="true"
            ></span>
          </button>

          <audio
            ref="audioRef"
            class="vibe__audio"
            :src="track.src"
            preload="metadata"
            loop
            @play="handleAudioPlay"
            @pause="handleAudioPause"
          ></audio>
        </div>

        <img
          src="/images/working-on-the-desk.avif"
          alt="Abstract geometric shapes in soft colors, representing the vibe of the portfolio."
          class="vibe__image"
        />

        <img
          src="/images/with-headphones.avif"
          alt="Abstract geometric shapes in soft colors, representing the vibe of the portfolio."
          class="vibe__image headphones"
          :class="{ 'vibe__image--visible': isPlaying }"
        />
      </div>

      <div class="vibe__banner">
        <div class="vibe__marquee" aria-label="Animated list of design and frontend vibes">
          <div class="vibe__row" :class="{ 'vibe__row--reverse': true }">
            <template v-for="copyIndex in ROW_REPEAT_COUNT" :key="`row2-copy-${copyIndex}`">
              <div
                v-for="(label, itemIndex) in vibeRows[1]"
                :key="`row2-${copyIndex}-${itemIndex}`"
                class="vibe__item"
                :aria-hidden="copyIndex > 0 ? 'true' : undefined"
              >
                <span class="vibe__text">{{ label }}</span>
                <span class="vibe__dot" aria-hidden="true">.</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" src="./script.ts" />
<style lang="scss" scoped src="./styles.scss" />
