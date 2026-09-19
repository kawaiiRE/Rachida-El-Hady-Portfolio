<template>
  <div ref="homePageRef" class="home-page" :style="MOTION_STYLE">
    <ClientOnly>
      <LazyHomeSectionField v-if="isMotionEnabled" />
    </ClientOnly>
    <HomeHeroSection />
    <HomeAboutSection />
    <HomeProjectsSection />
    <HomeExperienceSection />
    <HomeTypingChallengeSection />
    <HomeFeaturedProject />
    <HomeEngineeringSection />
    <HomeVibeSection />
    <HomeContactSection />
  </div>
</template>
<script lang="ts" src="./script.ts" />

<style lang="scss" scoped src="./styles.scss" />
