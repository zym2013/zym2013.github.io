<!-- src/templates/src/components/Icon.vue -->
<template>
  <component 
    :is="iconComponent" 
    :size="size" 
    :color="color"
    :stroke-width="strokeWidth"
    class="lucide-icon"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as icons from 'lucide-vue-next';

interface Props {
  name: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  strokeWidth: 2,
});

// 将字符串名称转换为 Lucide 图标组件
const iconComponent = computed(() => {
  // 将 kebab-case 转为 PascalCase (如: arrow-down → ArrowDown)
  const iconName = props.name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  return (icons as any)[iconName] || icons.HelpCircle;
});
</script>

<style scoped>
.lucide-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>