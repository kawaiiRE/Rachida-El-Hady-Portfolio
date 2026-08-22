<template>
  <section id="vibe" class="vibe">
    <div class="app-container section-content">
      <header class="header" data-motion>
        <p class="section-label">Human signal</p>
        <h2 class="section-title">Good systems still need a pulse.</h2>
      </header>

      <div class="banner">
        <div class="marquee" aria-label="Animated list of design and frontend vibes">
          <div class="row" :class="{ 'row--reverse': false }">
            <template v-for="copyIndex in ROW_REPEAT_COUNT" :key="`row1-copy-${copyIndex}`">
              <div
                v-for="(label, itemIndex) in vibeRows[0]"
                :key="`row1-${copyIndex}-${itemIndex}`"
                class="item"
                :aria-hidden="copyIndex > 0 ? 'true' : undefined"
              >
                <span class="text">{{ label }}</span>
                <span class="dot" aria-hidden="true">.</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="image-wrapper">
        <div class="player" :class="{ 'player--active': isPlaying }">
          <div class="player-bars" :class="{ 'player-bars--active': isPlaying }">
            <span class="player-bar"></span>
            <span class="player-bar"></span>
            <span class="player-bar"></span>
            <span class="player-bar"></span>
          </div>

          <div class="player-copy">
            <p class="player-title">{{ track.title }}</p>
            <p class="player-subtitle">{{ track.subtitle }}</p>
          </div>

          <button
            type="button"
            class="player-button"
            :class="{ 'player-button--active': isPlaying }"
            :aria-pressed="isPlaying ? 'true' : 'false'"
            :aria-label="isPlaying ? 'Pause vibe track' : 'Play vibe track'"
            @click="togglePlayback"
          >
            <span
              class="player-button-icon"
              :class="{
                'player-button-icon--pause': isPlaying,
                'player-button-icon--play': !isPlaying,
              }"
              aria-hidden="true"
            ></span>
          </button>

          <audio
            ref="audioRef"
            class="audio"
            :src="track.src"
            preload="metadata"
            loop
            @play="handleAudioPlay"
            @pause="handleAudioPause"
          ></audio>
        </div>

        <div class="stage">
          <img
            src="/images/working-on-the-desk.avif"
            alt="Illustrated developer working at a desk"
            class="image"
            width="2814"
            height="1536"
            loading="lazy"
          />

          <img
            v-if="isPlaying"
            src="/images/with-headphones.avif"
            alt="Illustrated developer wearing headphones while working"
            class="image headphones"
            :class="{ 'image--visible': isPlaying }"
            width="2814"
            height="1536"
          />
        </div>
      </div>

      <div class="banner">
        <div class="marquee" aria-label="Animated list of design and frontend vibes">
          <div class="row" :class="{ 'row--reverse': true }">
            <template v-for="copyIndex in ROW_REPEAT_COUNT" :key="`row2-copy-${copyIndex}`">
              <div
                v-for="(label, itemIndex) in vibeRows[1]"
                :key="`row2-${copyIndex}-${itemIndex}`"
                class="item"
                :aria-hidden="copyIndex > 0 ? 'true' : undefined"
              >
                <span class="text">{{ label }}</span>
                <span class="dot" aria-hidden="true">.</span>
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
