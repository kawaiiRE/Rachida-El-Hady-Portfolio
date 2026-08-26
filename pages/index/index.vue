<template>
  <div ref="homePageRef" class="home-page">
    <ClientOnly>
      <LazyHomeSectionField />
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
