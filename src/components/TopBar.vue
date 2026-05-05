<template>
  <header class="top-bar" role="banner" :class="{
    'scrolled': isScrolled || !isHome,
    'home-page': isHome
  }">
    <div class="top-bar-left">
      <button class="mobile-menu-toggle" @click="handleMenuClick" aria-label="打开菜单">
        <Icon name="panel-left-open" size="20" />
      </button>

      <a :href="config.logo.href" class="logo-link" :aria-label="config.logo.ariaLabel">
        {{ config.logo.text }}
      </a>
    </div>

    <div class="top-bar-center">
      <Transition :name="config.tooltip.transitionName" :mode="config.tooltip.transitionMode">
        <div v-if="travellingMode" :key="'travelling'" class="center-text travelling-actions">
          <span class="travelling-text">{{ config.buttons.travelling.confirmText }}</span>
          <div class="travelling-buttons">
            <button class="btn-small btn-cancel" @click="cancelTravelling">
              {{ config.buttons.travelling.cancelText }}
            </button>
            <button class="btn-small btn-confirm" @click="confirmTravelling">
              {{ config.buttons.travelling.confirmBtnText }}
            </button>
          </div>
        </div>
        <span v-else :key="displayText" class="center-text" :class="{ 'tooltip': showTooltipFlag }">
          {{ displayText }}
        </span>
      </Transition>
    </div>

    <div class="top-bar-right">
      <div class="action-buttons">
        <button v-if="config.buttons.travelling.enabled" class="action-btn"
          @mouseenter="showTooltip(config.buttons.travelling.tooltip)" @mouseleave="hideTooltip"
          @click="handleTravelling" :aria-label="config.buttons.travelling.tooltip">
          <Icon :name="config.buttons.travelling.icon" size="18" />
        </button>
        <button v-if="config.buttons.randomPost.enabled" class="action-btn"
          @mouseenter="showTooltip(config.buttons.randomPost.tooltip)" @mouseleave="hideTooltip"
          @click="handleRandomPost" :aria-label="config.buttons.randomPost.tooltip">
          <Icon :name="config.buttons.randomPost.icon" size="18" />
        </button>
        <a v-if="config.buttons.rss.enabled" :href="config.buttons.rss.url" class="action-btn"
          :target="config.buttons.rss.external ? '_blank' : undefined"
          :rel="config.buttons.rss.external ? 'noopener noreferrer' : undefined"
          @mouseenter="showTooltip(config.buttons.rss.tooltip)" @mouseleave="hideTooltip"
          :aria-label="config.buttons.rss.tooltip">
          <Icon :name="config.buttons.rss.icon" size="18" />
        </a>
        <button v-if="config.buttons.themeToggle.enabled" class="action-btn lst-btn" @click="toggleTheme"
          @mouseenter="showTooltip(isDark ? config.buttons.themeToggle.tooltipDark : config.buttons.themeToggle.tooltipLight)"
          @mouseleave="hideTooltip"
          :aria-label="isDark ? config.buttons.themeToggle.ariaLabelDark : config.buttons.themeToggle.ariaLabelLight">
          <Icon
            :name="(isDark ? config.buttons.themeToggle.iconDark : config.buttons.themeToggle.iconLight).replace('fa-solid fa-', '')"
            size="18" />
        </button>
        <Transition :name="config.buttons.scrollTop.transitionName">
          <button
            v-if="config.buttons.scrollTop.enabled && scrollPercent > config.scroll.scrollTopThreshold && hasScrollbar"
            class="action-btn scroll-top-btn"
            @mouseenter="showTooltip(config.buttons.scrollTop.tooltip); showScrollArrowTemp = true"
            @mouseleave="hideTooltip(); showScrollArrowTemp = false" @click="handleScrollToTop" aria-label="返回顶部">
            <Icon v-if="showScrollArrowTemp || scrollPercent > config.buttons.scrollTop.showArrowThreshold"
              name="arrow-up" size="18" />
            <span v-else class="scroll-percent">{{ scrollPercent }}%</span>
          </button>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Icon from './Icon.vue';  /* 🔥 确保导入 Lucide Icon 组件 */

interface TopBarConfig {
  logo: { text: string; href: string; ariaLabel: string };
  defaultTitle: string;
  buttons: {
    travelling: {
      enabled: boolean;
      icon: string;
      tooltip: string;
      confirmText: string;
      cancelText: string;
      confirmBtnText: string;
      targetUrl: string;
    };
    randomPost: {
      enabled: boolean;
      icon: string;
      tooltip: string;
      fallbackUrl: string;
    };
    rss: {
      enabled: boolean;
      icon: string;
      tooltip: string;
      url: string;
      external: boolean;
    };
    themeToggle: {
      enabled: boolean;
      tooltipLight: string;
      tooltipDark: string;
      iconLight: string;
      iconDark: string;
      ariaLabelLight: string;
      ariaLabelDark: string;
    };
    scrollTop: {
      enabled: boolean;
      tooltip: string;
      showArrowThreshold: number;
      transitionName: string;
    };
  };
  tooltip: {
    transitionName: string;
    transitionMode: string;
    hideDelay: number;
  };
  scroll: {
    scrollTopThreshold: number;
    hasScrollbarThreshold: number;
  };
}

interface Props {
  pageTitle: string;
  allPosts?: Array<{ slug: string; title: string }>;
  config: TopBarConfig;
  isHome?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isHome: false,
});

const handleMenuClick = () => {  
  // 🔥 触发全局自定义事件
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('asph:menu-click'));
  }
};

const config = computed(() => ({
  ...(props.config || {})
}));

/* 🔥 新增：滚动状态用于边框渐变 */
const isScrolled = ref(false);

const isDark = ref(false);
const scrollPercent = ref(0);
const hasScrollbar = ref(true);
const showScrollArrowTemp = ref(false);
const showTooltipFlag = ref(false);
const tooltipMessage = ref('');
const travellingMode = ref(false);

const displayText = computed(() => {
  if (travellingMode.value) return '';
  if (showTooltipFlag.value && tooltipMessage.value) return tooltipMessage.value;
  return props.pageTitle || config.value.defaultTitle;
});

const showTooltip = (msg: string) => {
  if (travellingMode.value) return;
  tooltipMessage.value = msg;
  showTooltipFlag.value = true;
};

const hideTooltip = () => {
  if (travellingMode.value) return;
  showTooltipFlag.value = false;
  setTimeout(() => {
    if (!showTooltipFlag.value) tooltipMessage.value = '';
  }, config.value.tooltip.hideDelay);
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  const theme = isDark.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

const handleTravelling = () => {
  if (!config.value.buttons.travelling.enabled) return;
  travellingMode.value = true;
  showTooltipFlag.value = false;
  tooltipMessage.value = '';
};

const cancelTravelling = () => {
  travellingMode.value = false;
  tooltipMessage.value = '';
  showTooltipFlag.value = false;
};

const confirmTravelling = () => {
  window.open(config.value.buttons.travelling.targetUrl, '_blank', 'noopener,noreferrer');
  cancelTravelling();
};

const handleRandomPost = async () => {
  if (!config.value.buttons.randomPost.enabled) return;
  try {
    let posts = props.allPosts;
    if (!posts || posts.length === 0) {
      const res = await fetch('/blog/');
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('a[href^="/blog/"]:not([href="/blog/"])');
      if (links.length > 0) {
        const randomLink = links[Math.floor(Math.random() * links.length)];
        const href = randomLink.getAttribute('href');
        if (href) { window.location.href = href; return; }
      }
    }
    if (posts && posts.length > 0) {
      const random = posts[Math.floor(Math.random() * posts.length)];
      window.location.href = `/blog/${random.slug}/`;
      return;
    }
    window.location.href = config.value.buttons.randomPost.fallbackUrl;
  } catch (e) {
    console.error('Random post error:', e);
    window.location.href = config.value.buttons.randomPost.fallbackUrl;
  }
};

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* 🔥 修改：滚动处理同时更新边框状态 */
const handleScroll = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight;
  const winHeight = window.innerHeight;
  const scrollable = docHeight - winHeight;
  const percent = scrollable > 0 ? Math.round((scrollTop / scrollable) * 100) : 0;

  scrollPercent.value = percent;
  hasScrollbar.value = scrollable > config.value.scroll.hasScrollbarThreshold;

  /* 🔥 新增：首页滚动检测 */
  if (props.isHome) {
    // 滚动超过 100px 或页面可滚动时显示边框
    isScrolled.value = scrollTop > 100 || scrollable > 200;
  } else {
    // 非首页始终显示边框
    isScrolled.value = true;
  }
};

onMounted(() => {
  /* 🔥 初始化主题 */
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDark.value = saved === 'dark' || (!saved && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');

  /* 🔥 初始化滚动状态 */
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0);
  }
}

.top-bar {
  position: fixed;
  top: 20px;
  left: 85px;
  right: 40px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: var(--background-2);
  border: 1px solid var(--border);
  z-index: 101;
  backdrop-filter: blur(4px);
  border-radius: 20px;
  transition: border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  animation: slide-in 0.7s forwards;
}

.top-bar-left {
  display: flex;
}

@media (max-width: 768px) {
  .lst-btn {
    margin-right: 0 !important;
  }
}

.top-bar.home-page:not(.scrolled) {
  border-color: transparent;
  background: transparent;
  box-shadow: none;
}

.top-bar.scrolled {
  border-color: var(--border, rgba(0, 0, 0, 0.1));
  background: var(--background-2, rgba(255, 255, 255, 0.95));
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.08);
}

html[data-theme="dark"] .top-bar.scrolled {
  background: rgba(20, 20, 20, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

/* 🔥 默认：宽屏隐藏 */
.mobile-menu-toggle {
  display: none;
  /* 宽屏不显示 */
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--foreground);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  transition: background 0.2s;
}

/* 🔥 窄屏：显示按钮 */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
    /* ✅ 窄屏显示 */
  }
}

.mobile-menu-toggle:hover {
  background: var(--muted);
}

/* 窄屏显示菜单按钮 */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .top-bar {
    padding: 0 1rem;
    height: 50px;
    left: 16px;
    right: 16px;
    border-radius: 16px;
  }

  .top-bar-center {
    display: none;
  }

  .action-buttons {
    gap: 0.25rem;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}

.logo-link {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--foreground);
  text-decoration: none;
  transition: opacity 0.2s;
}

.logo-link:hover {
  opacity: 0.8;
}

.action-buttons {
  display: flex;
  gap: 0.1rem;
}

.action-btn {
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--foreground);
  font-size: 0.9rem;
  transition: background 0.2s, transform 0.2s, color 0.2s;
}

.action-btn:hover {
  background: var(--muted);
  color: var(--accent);
  transform: scale(1.1);
}

.scroll-percent {
  font-size: 0.8rem;
  font-weight: 1000;
  min-width: 24px;
  text-align: center;
  line-height: 1;
  font-family: LXGW WenKai Screen R;
}

.top-bar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.center-text {
  font-size: 0.95rem;
  color: var(--foreground);
  transition: opacity 0.25s ease, transform 0.25s ease, color 0.25s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60vw;
  min-height: 1.2em;
  display: flex;
  align-items: center;
}

.center-text.tooltip {
  color: var(--accent);
  font-weight: 500;
  transform: translateY(-2px);
}

.travelling-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  pointer-events: auto;
}

.travelling-text {
  font-size: 0.9rem;
  color: var(--accent);
  font-weight: 500;
}

.travelling-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  pointer-events: auto;
}

.btn-small:hover {
  transform: scale(1.05);
}

.btn-cancel {
  background: var(--muted);
  color: var(--foreground);
}

.btn-confirm {
  background: var(--accent);
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.top-bar-right {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .top-bar {
    padding: 0 1rem;
    height: 50px;
  }

  .top-bar-center {
    display: none;
  }

  .action-buttons {
    gap: 0.25rem;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}

.scroll-percent {
  font-size: 0.8rem;
  font-weight: 700;
  min-width: 24px;
  text-align: center;
  line-height: 1;
}

.slide-fade-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
  transform: translateX(0);
  opacity: 1;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.action-buttons {
  display: flex;
  overflow: visible;
}

.action-btn {
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--foreground);
  font-size: 0.9rem;
  transition: background 0.2s, transform 0.2s, color 0.2s;
  margin-right: 0.5rem;
  transition: margin 0.25s ease, opacity 0.25s ease, transform 0.25s ease;
}

.action-btn:last-child {
  margin-right: 0;
}

.action-btn:hover {
  background: var(--muted);
  color: var(--accent);
  transform: scale(1.1);
}

.scroll-percent {
  font-size: 0.8rem;
  font-weight: 700;
  min-width: 24px;
  text-align: center;
  line-height: 1;
}

.scroll-top-btn.slide-out {
  opacity: 0;
  transform: translateX(-20px);
  margin-right: -36px !important;
  pointer-events: none;
}

.travelling-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  pointer-events: auto;
}

@media (max-width: 768px) {
  .scroll-top-btn {
    display: none !important;
  }
}
</style>