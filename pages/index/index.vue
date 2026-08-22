<template>
  <div ref="homePageRef" class="home-page">
    <ClientOnly>
      <LazyHomeSectionField />
    </ClientOnly>
    <HomeHeroSection />
    <HomeAboutSection />
    <HomeExperienceSection />
    <HomeProjectsSection />
    <HomeFeaturedCaseStudy />
    <HomeEngineeringSection />
    <HomeVibeSection />
    <HomeContactSection />
  </div>
</template>
<script lang="ts" src="./script.ts" />

<style lang="scss" scoped src="./styles.scss" />
