<!-- src/components/ProjectCard.vue -->
<template>
  <div class="project-card">
    <!-- 封面图 -->
    <img 
      :src="image" 
      :alt="`${title} 截图`" 
      class="project-img" 
      loading="lazy"
    />
    
    <div class="project-body">
      <h2 class="project-title">{{ title }}</h2>
      <p class="project-desc">{{ description }}</p>
      
      <!-- 维护中状态 -->
      <div v-if="status === 'maintenance'" class="status-alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
        抱歉，该项目正在维护中。
      </div>
      
      <!-- 按钮区 -->
      <div class="mt-auto">
        <div v-if="status === 'maintenance'" class="btn-group-custom">
          <span class="btn-sm btn-disabled" tabindex="-1" aria-disabled="true">
            <i class="fa-solid fa-wrench"></i> 维护中
          </span>
        </div>
        
        <div v-else class="btn-group-custom">
          <a 
            v-if="demoUrl" 
            :href="demoUrl" 
            target="_blank" 
            rel="noopener" 
            class="btn-sm btn-primary"
          >
            <i class="fa-solid fa-up-right-from-square"></i> 访问
          </a>
          <a 
            v-if="sourceUrl" 
            :href="sourceUrl" 
            target="_blank" 
            rel="noopener" 
            class="btn-sm btn-outline"
          >
            <i class="fa-brands fa-github"></i> 源码
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  image: string;
  status?: 'active' | 'maintenance';
  demoUrl?: string;
  sourceUrl?: string;
}>();
</script>