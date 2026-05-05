<!-- src/components/StatusBadge.vue -->
<template>
  <div class="status-badge-wrapper">
    <button class="status-badge" :style="badgeStyle">
      <!-- 🔥 图标（始终显示） -->
      <Icon :name="status.icon" size="16" class="badge-icon" />

      <!-- 🔥 文字（悬停展开） -->
      <span class="badge-text">{{ status.text }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from './Icon.vue';

interface Status {
  text: string;
  icon: string;
}

interface Props {
  status: Status;
  color?: string;
  bg?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'var(--accent)',
  bg: 'rgba(59, 130, 246, 0.1)',
});

const badgeStyle = computed(() => ({
  '--badge-color': props.color,
  '--badge-bg': props.bg,
}));
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

.status-badge-wrapper {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  display: flex;
  align-items: center;
  padding: 0.4rem;
  border-radius: 8px 0 0 8px;
  background: var(--badge-bg, rgba(59, 130, 246, 0.1));
  border: 1px solid transparent;
  color: var(--badge-color, var(--accent));
  cursor: default;
  white-space: nowrap;
  overflow: hidden;
  width: 58px;
  animation: slide-in 1s forwards;
}

.status-badge:hover {
  width: auto;
  padding: 0.4rem 0.8rem;
  border-color: var(--badge-color, var(--accent));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.badge-icon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.status-badge:hover .badge-icon {
  transform: scale(1.1);
}

.badge-text {
  font-size: 0.8rem;
  font-weight: 500;
  opacity: 1;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    visibility 0s 0.2s;
  margin-left: 2px;
}

/* 🔥 悬停时显示文字 */
.status-badge:hover .badge-text {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition: opacity 0.2s ease, transform 0.2s ease;
  margin-left: 0.5rem;
}

/* 🔥 移动端：默认展开 */
@media (max-width: 768px) {
  .status-badge {
    width: auto;
    padding: 0.4rem 0.8rem;
  }

  .badge-text {
    opacity: 1;
    visibility: visible;
    transform: none;
    margin-left: 0.5rem;
  }
}
</style>