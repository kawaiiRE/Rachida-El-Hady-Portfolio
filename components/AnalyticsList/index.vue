<template>
  <article class="analytics-list" :class="{ 'analytics-list--full': full }">
    <header class="analytics-list__header">
      <h2 class="analytics-list__title">{{ title }}</h2>
    </header>

    <div v-if="items.length" class="analytics-list__items">
      <div v-for="item in items" :key="item.label + item.meta" class="analytics-list__item">
        <div class="analytics-list__item-main">
          <span class="analytics-list__item-label">{{ item.label }}</span>
          <strong class="analytics-list__item-value">{{ item.value }}</strong>
        </div>
        <span v-if="item.meta" class="analytics-list__item-meta">{{ item.meta }}</span>
        <div class="analytics-list__bar-track" aria-hidden="true">
          <span class="analytics-list__bar" :style="{ width: `${item.percentage}%` }" />
        </div>
      </div>
    </div>

    <p v-else class="analytics-list__empty">{{ emptyLabel }}</p>
  </article>
</template>

<script lang="ts" setup>
interface AnalyticsListItem {
  label: string
  value: string
  meta?: string
  percentage: number
}

withDefaults(
  defineProps<{
    title: string
    items: AnalyticsListItem[]
    emptyLabel: string
    full?: boolean
  }>(),
  {
    full: false,
  },
)
</script>

<style lang="scss" scoped>
.analytics-list {
  min-width: 0;
  border: 1px solid rgba(var(--gray-scale-50-rgb), 0.1);
  border-radius: 0.5rem;
  background: rgba(var(--gray-scale-900-rgb), 0.74);
  box-shadow: 0 1rem 2rem rgba(var(--gray-scale-950-rgb), 0.2);
  overflow: hidden;
}

.analytics-list--full {
  width: 100%;
}

.analytics-list__header {
  padding: 1rem 1.1rem;
  border-bottom: 1px solid rgba(var(--gray-scale-50-rgb), 0.08);
}

.analytics-list__title {
  font-size: 0.98rem;
  line-height: 1.2;
  font-weight: 700;
  color: var(--gray-scale-50);
}

.analytics-list__items {
  display: grid;
}

.analytics-list__item {
  display: grid;
  gap: 0.45rem;
  padding: 0.95rem 1.1rem;
  border-bottom: 1px solid rgba(var(--gray-scale-50-rgb), 0.07);
}

.analytics-list__item:last-child {
  border-bottom: 0;
}

.analytics-list__item-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}

.analytics-list__item-label {
  overflow: hidden;
  color: rgba(var(--gray-scale-50-rgb), 0.9);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.analytics-list__item-value {
  color: var(--secondary-scale-300);
  font-size: 0.98rem;
  white-space: nowrap;
}

.analytics-list__item-meta {
  overflow: hidden;
  color: rgba(var(--gray-scale-50-rgb), 0.58);
  font-size: 0.78rem;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.analytics-list__bar-track {
  height: 0.42rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(var(--gray-scale-50-rgb), 0.08);
}

.analytics-list__bar {
  display: block;
  height: 100%;
  min-width: 0.2rem;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--primary-scale-400), var(--secondary-scale-300));
}

.analytics-list__empty {
  padding: 1rem 1.1rem;
  color: rgba(var(--gray-scale-50-rgb), 0.58);
  font-size: 0.9rem;
}
</style>
