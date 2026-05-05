<!-- src/components/Sidebar.vue -->
<template>
  <aside class="sidebar">
    <div class="sidebar-inner">
      <!-- 头像 -->
      <a href="/">
        <div class="sidebar-avatar">
          <img :src="avatarSrc || '/fav.jpg'" :alt="avatarAlt || 'Avatar'" class="avatar-img"
            referrerpolicy="no-referrer" crossorigin="anonymous" />
        </div>
      </a>

      <!-- 导航链接（基于当前路径高亮） -->
      <nav class="sidebar-nav" aria-label="侧边导航">
        <a v-for="(item, index) in links" :key="index" :href="item.href" class="nav-link"
          :class="{ active: isActive(item.href) }" :aria-label="item.label" :title="item.label">
          <Icon :name="item.icon" size="20" class="nav-icon" />
          <!-- 高亮指示条（左侧边框） -->
          <span class="nav-indicator"></span>
        </a>
      </nav>

      <!-- 主题切换按钮 -->
      <button class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'">
        <Icon :name="isDark ? 'sun' : 'moon'" size="20" />
      </button>
    </div>
  </aside>
  <div class="sidebar-overlay" @click="closeSidebar" v-if="isOpen"></div>

  <aside class="mobile-sidebar" :class="{ 'sidebar-open': isOpen }">
    <div class="mobile-sidebar-inner">
      <!-- 头像 -->
      <div class="mobile-avatar">
        <img :src="avatarSrc || '/fav.jpg'" :alt="avatarAlt || 'Avatar'" class="avatar-img" />
      </div>

      <!-- 导航链接（图标 + 文字，一行一个） -->
      <nav class="mobile-nav">
        <a v-for="(item, index) in links" :key="index" :href="item.href" class="mobile-nav-link"
          :class="{ active: isActive(item.href) }" @click="$emit('close')">
          <Icon :name="item.icon" size="20" class="mobile-nav-icon" />
          <span class="mobile-nav-label">{{ item.label }}</span>
          <span class="mobile-nav-indicator"></span>
        </a>
      </nav>

      <!-- 主题切换 -->
      <button class="mobile-theme-toggle" @click="toggleTheme">
        <Icon :name="isDark ? 'sun' : 'moon'" size="20" />
        <span>{{ isDark ? '亮色模式' : '暗色模式' }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Icon from './Icon.vue';

export interface SidebarLink {
  href: string;
  icon: string;
  label: string;
}

interface Props {
  links: SidebarLink[];
  avatarSrc?: string;
  avatarAlt?: string;
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

// 🔥 关键修复：只定义一次 emit，放在脚本顶部
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const isOpenFromBody = ref(false);
const isOpen = computed(() => props.open || isOpenFromBody.value);

// 🔥 关闭侧边栏函数
const closeSidebar = () => {
  isOpenFromBody.value = false;
  if (typeof document !== 'undefined') {
    document.body.classList.remove('mobile-sidebar-open');
  }
};

// 🔥 更新路径状态
const currentPath = ref('');
const updateCurrentPath = () => {
  if (typeof window !== 'undefined') {
    let path = window.location.pathname;
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    currentPath.value = path;
  }
};

// 🔥 判断链接是否激活
const isActive = (href: string): boolean => {
  if (typeof window === 'undefined') return false;
  let targetPath = href;
  if (targetPath !== '/' && targetPath.endsWith('/')) {
    targetPath = targetPath.slice(0, -1);
  }
  if (targetPath === '/') {
    return currentPath.value === '' || currentPath.value === '/';
  }
  return currentPath.value === targetPath || currentPath.value.startsWith(targetPath + '/');
};

// 🔥 主题状态
const isDark = ref(false);
const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
    localStorage.setItem('asph-theme', isDark.value ? 'dark' : 'light');
  }
};
const initTheme = () => {
  if (typeof document === 'undefined') return;
  const saved = localStorage.getItem('asph-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDark.value = saved === 'dark' || (!saved && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  initTheme();
  updateCurrentPath();

  if (typeof document !== 'undefined') {
    // 初始化状态
    isOpenFromBody.value = document.body.classList.contains('mobile-sidebar-open');

    // 🔥 监听 body 类名变化（备用方案）
    const observer = new MutationObserver(() => {
      const isOpen = document.body.classList.contains('mobile-sidebar-open');
      isOpenFromBody.value = isOpen;
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // 🔥 新增：监听 window 全局事件（主要方案）
    const handleMenuClick = () => {
      isOpenFromBody.value = true;
      if (typeof document !== 'undefined') {
        document.body.classList.add('mobile-sidebar-open');
      }
    };

    window.addEventListener('asph:menu-click', handleMenuClick);

    onUnmounted(() => {
      observer.disconnect();
      window.removeEventListener('asph:menu-click', handleMenuClick);  // 🔥 清理事件监听
    });
  }

  window.addEventListener('popstate', updateCurrentPath);
  window.addEventListener('hashchange', updateCurrentPath);
});

onUnmounted(() => {
  window.removeEventListener('popstate', updateCurrentPath);
  window.removeEventListener('hashchange', updateCurrentPath);
});
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 102;
}

/* ========== 宽屏侧边栏 ========== */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 80px;
  height: 100vh;
  background: var(--sidebar-bg, transparent);
  display: flex;
  flex-direction: column;
  z-index: 50;
  border: none;
  animation: slide-in 1s forwards;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  /* 🔥 垂直居中：上下间距一致 */
  margin: auto 0;
  padding: 1rem 0;
  gap: 2rem;
}

.sidebar-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  margin-bottom: -0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

[data-theme="dark"] .sidebar-nav {
  border-top: 2px #666 solid;
  border-bottom: 2px #666 solid;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  border-top: 2px #ddd solid;
  border-bottom: 2px #ddd solid;
  padding-top: 15px;
  padding-bottom: 10px;
}

.nav-link {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: var(--nav-icon, #666);
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.nav-link:hover {
  color: var(--accent, #3b82f6);
  background: var(--nav-hover, rgba(0, 0, 0, 0.05));
}

.nav-link.active {
  color: var(--accent, #3b82f6);
}

.nav-indicator {
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: var(--accent, #3b82f6);
  border-radius: 0 2px 2px 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.nav-link.active .nav-indicator {
  opacity: 1;
}

.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: var(--nav-icon, #666);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  margin-top: -1.2rem;
}

.theme-toggle:hover {
  color: var(--accent, #3b82f6);
  background: var(--nav-hover, rgba(0, 0, 0, 0.05));
}

/* ========== 移动端抽屉侧边栏 ========== */
.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: var(--sidebar-bg, var(--background));
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 103;
  border-right: 1px solid var(--border, rgba(0, 0, 0, 0.1));
}

html[data-theme="dark"] .mobile-sidebar {
  border-color: rgba(255, 255, 255, 0.1);
}

.mobile-sidebar.sidebar-open {
  transform: translateX(0);
}

.mobile-sidebar-inner {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  height: 100%;
  gap: 2rem;
}

.mobile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: var(--nav-icon, #666);
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover {
  color: var(--accent, #3b82f6);
  background: var(--nav-hover, rgba(0, 0, 0, 0.05));
}

.mobile-nav-link.active {
  color: var(--accent, #3b82f6);
  background: var(--nav-active-bg, rgba(59, 130, 246, 0.1));
}

.mobile-nav-indicator {
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 3px;
  background: var(--accent, #3b82f6);
  border-radius: 0 2px 2px 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.mobile-nav-link.active .mobile-nav-indicator {
  opacity: 1;
}

.mobile-theme-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: var(--nav-icon, #666);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  margin-top: auto;
}

.mobile-theme-toggle:hover {
  color: var(--accent, #3b82f6);
  background: var(--nav-hover, rgba(0, 0, 0, 0.05));
}

/* ========== 响应式 ========== */
@media (min-width: 768px) {
  .mobile-sidebar {
    display: none;
  }
}

@media (max-width: 767px) {
  .sidebar {
    display: none;
  }
}
</style>