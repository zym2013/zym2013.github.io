<template>
  <div class="home-page">
    <!-- 🔥 页面内容区域（不再包含侧边栏/顶栏） -->
    <div class="pages-wrapper" :style="{ transform: `translateY(-${currentPage * 100}vh)` }" 
         @wheel="handleWheel" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      
      <!-- 第 1 页：首页英雄区域 -->
      <section class="page page-home" ref="homePageRef">
        <div class="center-wrap">
          <main class="card" role="main" aria-labelledby="site-title">
            <div class="header-group">
              <h1 id="site-title">
                <span class="typed-container">
                  <span ref="typedEl"></span>
                </span>
              </h1>
            </div>
            <nav class="links" :class="{ show: typedDone }" aria-label="主要链接">
              <template v-for="(item, index) in config?.home?.navigation || []" :key="index">
                <a class="link" :href="item.href" :target="item.external ? '_blank' : undefined"
                  :rel="item.external ? 'noopener' : undefined">
                  {{ item.text }}
                </a>
                <span v-if="index < (config?.home?.navigation?.length || 0) - 1" class="sep">｜</span>
              </template>
            </nav>
            <footer>
              <div class="text-muted small" :class="{ show: typedDone }">
                Copyright ©
                <a :href="config?.home?.footer?.github" target="_blank" rel="noopener" class="text-decoration-none">
                  {{ config?.home?.footer?.copyright }}
                </a>
                {{ config?.home?.footer?.year }}. All rights reserved.
              </div>
            </footer>
          </main>
        </div>
      </section>

      <!-- 第 2 页：关于 -->
      <section class="page page-about">
        <div class="about-content">
          <div class="about-section section-intro">
            <div class="intro-avatar">
              <img :src="config?.about?.avatar?.src" :alt="config?.about?.avatar?.alt || 'zym2013'"
                class="avatar-rounded" referrerpolicy="no-referrer" crossorigin="anonymous" />
            </div>
            <div class="intro-text">
              <div class="name-row">
                <span class="name-main">{{ config?.about?.name?.main }}</span>
                <span class="name-sub">{{ config?.about?.name?.sub }}</span>
              </div>
              <p class="one-liner" ref="oneLinerEl" v-if="config?.about?.oneLiner?.enabled !== false">
                {{ config?.about?.oneLiner?.text }}
              </p>
            </div>
          </div>
          <div class="about-section section-quote">
            <blockquote class="quote-en">{{ config?.about?.quote?.en }}</blockquote>
            <p class="quote-cn">{{ config?.about?.quote?.cn }}</p>
          </div>
          <div class="about-section section-social">
            <a v-for="(link, index) in (config?.about?.socialLinks || [])" :key="index" :href="link.url"
              :target="link.external ? '_blank' : undefined" :rel="link.external ? 'noopener noreferrer' : undefined"
              class="social-link">
              <Icon :name="getSocialIcon(link.icon)" size="18" /> {{ link.name }}
            </a>
          </div>
        </div>
      </section>

      <!-- 第 3 页：预留 -->
      <section class="page page-reserved">
        <div class="reserved-content">
          <h2>{{ config?.reserved?.title }}</h2>
          <p>{{ config?.reserved?.description }}</p>
        </div>
      </section>
    </div>

    <!-- 页面指示器（宽屏显示） -->
    <div class="page-indicator desktop-only">
      <button v-for="index in totalPages" :key="index" class="indicator-dot"
        :class="{ active: currentPage === index - 1 }" @click="goToPage(index - 1)" :aria-label="`跳转到第 ${index} 页`">
        <span class="dot-inner"></span>
      </button>
    </div>

    <!-- 页面切换器（宽屏显示） -->
    <div class="page-switcher desktop-only">
      <button class="switch-btn prev" @click="prevPage" :disabled="currentPage === 0" aria-label="上一页">
        <Icon name="chevron-up" size="16" />
      </button>
      <div class="page-info">
        <span class="page-current">{{ currentPage + 1 }}</span>
        <span class="page-sep">/</span>
        <span class="page-total">{{ totalPages }}</span>
      </div>
      <button class="switch-btn next" @click="nextPage" :disabled="currentPage === totalPages - 1" aria-label="下一页">
        <Icon name="chevron-down" size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import Icon from './Icon.vue';

interface NavItem { text: string; href: string; external?: boolean; }
interface SocialLink { name: string; url: string; icon: string; external?: boolean; }
interface Config {
  home: {
    typedName: string;
    navigation: NavItem[];
    footer: { copyright: string; year: number; github: string };
  };
  about: {
    avatar: { src: string; alt: string };
    name: { main: string; sub: string };
    oneLiner: { enabled?: boolean; text: string; typeSpeed?: number; showCursor?: boolean };
    quote: { en: string; cn: string };
    socialLinks: SocialLink[];
  };
  reserved: { title: string; description: string };
  pageSwitcher: { totalPages?: number; scrollThreshold?: number; scrollCooldown?: number };
}

const props = defineProps<{ name?: string; config?: Config }>();
const cfg = computed(() => ({ ...(props.config || {}) }));

// 页面状态
const currentPage = ref(0);
const totalPages = computed(() => cfg.value.pageSwitcher?.totalPages || 3);
const isScrolling = ref(false);
const touchStartY = ref(0);
const scrollThreshold = computed(() => cfg.value.pageSwitcher?.scrollThreshold || 50);
const scrollCooldown = computed(() => cfg.value.pageSwitcher?.scrollCooldown || 600);

// 🔥 滚动状态（用于顶栏边框渐变）
const isScrolled = ref(false);
const homePageRef = ref<HTMLElement | null>(null);

// 🔥 移动端侧边栏状态
const mobileSidebarOpen = ref(false);

// 🔥 主题状态
const isDark = ref(false);

// 打字机
const typedEl = ref<HTMLElement | null>(null);
const typedDone = ref(false);

// 页面导航
const goToPage = (index: number) => {
  if (isScrolling.value) return;
  currentPage.value = Math.max(0, Math.min(index, totalPages.value - 1));
  mobileSidebarOpen.value = false;
};
const nextPage = () => goToPage(currentPage.value + 1);
const prevPage = () => goToPage(currentPage.value - 1);

// 滚动/触摸处理
const handleWheel = (e: WheelEvent) => {
  if (isScrolling.value) return;
  e.preventDefault();
  const delta = e.deltaY;
  if (delta > scrollThreshold.value) nextPage();
  else if (delta < -scrollThreshold.value) prevPage();
  isScrolling.value = true;
  setTimeout(() => { isScrolling.value = false; }, scrollCooldown.value);
};

const handleTouchStart = (e: TouchEvent) => { touchStartY.value = e.touches[0].clientY; };
const handleTouchEnd = (e: TouchEvent) => {
  if (isScrolling.value) return;
  const diff = touchStartY.value - e.changedTouches[0].clientY;
  if (diff > scrollThreshold.value) nextPage();
  else if (diff < -scrollThreshold.value) prevPage();
  isScrolling.value = true;
  setTimeout(() => { isScrolling.value = false; }, scrollCooldown.value);
};

// 🔥 监听页面滚动（用于顶栏边框）
const handlePageScroll = () => {
  if (typeof window === 'undefined') return;

  // 只在首页需要检测滚动
  if (currentPage.value !== 0) {
    isScrolled.value = true;
    return;
  }

  const homePage = homePageRef.value;
  if (!homePage) return;

  // 计算首页内容的滚动位置
  const scrollTop = window.scrollY || window.pageYOffset;
  const homeHeight = homePage.offsetHeight;

  // 当滚动超过首页高度的 80% 时，认为已"下滑"
  isScrolled.value = scrollTop > homeHeight * 0.8;
};

// 键盘导航
const handleKeydown = (e: KeyboardEvent) => {
  if (isScrolling.value) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); nextPage(); }
  else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); prevPage(); }
};

// 🔥 主题切换
const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
    localStorage.setItem('asph-theme', isDark.value ? 'dark' : 'light');
  }
};

// 初始化主题
const initTheme = () => {
  if (typeof document === 'undefined') return;
  const saved = localStorage.getItem('asph-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDark.value = saved === 'dark' || (!saved && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
};

// 社交图标映射
const getSocialIcon = (iconName: string) => {
  const map: Record<string, string> = {
    github: 'github', email: 'mail', twitter: 'twitter', x: 'x',
    weibo: 'weibo', telegram: 'send', discord: 'message-circle',
    linkedin: 'linkedin', instagram: 'instagram', default: 'link',
  };
  return map[iconName] || map.default;
};

onMounted(() => {
  initTheme();

  // 打字机初始化
  const loadTyped = () => {
    if (!(window as any).Typed) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js';
      script.onload = initTyped;
      document.head.appendChild(script);
    } else initTyped();
  };

  const initTyped = () => {
    const Typed = (window as any).Typed;
    if (!typedEl.value) return;
    new Typed(typedEl.value, {
      strings: [cfg.value.home?.typedName || props.name || 'zym2013'],
      typeSpeed: 80, backSpeed: 0, startDelay: 300,
      showCursor: true, cursorChar: '|', loop: false,
      onComplete: () => setTimeout(() => { typedDone.value = true; }, 500)
    });
  };
  loadTyped();

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('scroll', handlePageScroll, { passive: true });

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) mobileSidebarOpen.value = false;
  });

  // 初始化滚动状态
  handlePageScroll();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('scroll', handlePageScroll);
});
</script>

<style scoped>
.center-wrap {
  margin-top: 0;
}

@media (min-width: 900px) and (max-width: 1200px) {
  section {
    margin-left: 3rem;
    margin-right: 1rem;
  }
}

.page-about, .page-reserved {
  margin-top: 4rem;
}

.home-page {
  overflow: hidden;
}

/* ========== 🔥 左侧边栏（宽屏） ========== */
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
  box-shadow: none;
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

/* 头像 */
.sidebar-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 导航链接 */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
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

/* 🔥 高亮指示条（左侧边框） */
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

/* 主题切换按钮 */
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
}

.theme-toggle:hover {
  color: var(--accent, #3b82f6);
  background: var(--nav-hover, rgba(0, 0, 0, 0.05));
}

/* ========== 🔥 移动端顶栏（始终固定） ========== */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  gap: 1rem;
  z-index: 100;
  /* 🔥 最高层级，确保不被覆盖 */
  transition: border-bottom-color 0.3s ease, box-shadow 0.3s ease;
  /* 🔥 首页初始无边框 */
  border-bottom: 1px solid transparent;
  background: transparent;
}

/* 🔥 滚动/非首页时渐变出边框 */
.mobile-header.scrolled {
  border-bottom-color: var(--border, rgba(0, 0, 0, 0.1));
  background: var(--header-bg, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

html[data-theme="dark"] .mobile-header.scrolled {
  background: rgba(20, 20, 20, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

.menu-toggle {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: transparent;
  border: none;
  color: var(--foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  padding: 0;
}

.menu-toggle:hover {
  background: var(--nav-hover, rgba(0, 0, 0, 0.05));
}

.header-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--foreground);
}

.header-spacer {
  flex: 1;
}

/* ========== 🔥 移动端侧边栏抽屉（不覆盖顶栏） ========== */
.mobile-sidebar {
  position: fixed;
  top: 56px;
  /* 🔥 从顶栏下方开始，不覆盖顶栏 */
  left: 0;
  width: 260px;
  height: calc(100vh - 56px);
  /* 🔥 高度减去顶栏高度 */
  background: var(--sidebar-bg, var(--background));
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 90;
  /* 🔥 低于顶栏 (100)，高于内容 (50) */
  border-right: 1px solid var(--border, rgba(0, 0, 0, 0.1));
  border-top: 1px solid var(--border, rgba(0, 0, 0, 0.1));
}

.mobile-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
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

/* 遮罩层 */
.sidebar-overlay {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  /* 🔥 从顶栏下方开始 */
  background: rgba(0, 0, 0, 0.5);
  z-index: 85;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* 移动端导航（图标 + 文字，一行一个） */
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

.mobile-nav-icon {
  flex-shrink: 0;
}

.mobile-nav-label {
  flex: 1;
}

/* 移动端高亮指示条 */
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

/* 移动端主题切换 */
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

/* ========== 响应式断点 ========== */

/* 宽屏 (≥768px)：显示侧边栏，隐藏移动端组件 */
@media (min-width: 768px) {

  .mobile-header,
  .mobile-sidebar,
  .sidebar-overlay {
    display: none;
  }

  .sidebar {
    display: flex;
  }
}

/* 窄屏 (<768px)：隐藏宽屏侧边栏，显示移动端组件 */
@media (max-width: 767px) {

  .sidebar,
  .desktop-only {
    display: none;
  }

  .mobile-header {
    display: flex;
  }

  /* 页面内容下移，避免被顶栏遮挡 */
  /* .pages-wrapper {
    padding-top: 56px;
  }
  
  .page {
    min-height: calc(100vh - 56px);
    padding-top: 1rem;
    padding-bottom: 1rem;
  } */
}
</style>
<style scoped>
.home-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--background);
  color: var(--foreground);
}

.pages-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.page {
  flex: 0 0 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
}

.header-group {
  display: flex;
  /* align-items: center; */
  gap: 1.5rem;
  margin-bottom: .5rem;
}

@media (max-width: 768px) {
  .header-group {
    margin-top: 2rem;
  }
}

.avatar-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  pointer-events: none;
  user-select: none;
  background: var(--background);
}

#site-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.sep {
  color: var(--border);
}

.text-muted.small.show {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s, transform 0.5s;
}

.text-muted.small.show {
  opacity: 1;
  transform: translateY(0);
}

.page-about {
  align-items: flex-start;
  justify-content: center;
}

.about-content {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
}

.section-intro {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.intro-avatar {
  flex-shrink: 0;
}

.avatar-rounded {
  width: 150px;
  height: 150px;
  border-radius: 24px;
  object-fit: cover;
  display: block;
  border: 3px #eee solid;
}

.intro-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name-row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.name-main {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--foreground);
}

.name-sub {
  font-size: 2rem;
  color: var(--vp-c-text-2);
  font-weight: 400;
}

.one-liner {
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
  font-style: italic;
  margin: 0;
}

.section-quote {
  border-left: 3px #eee solid;
  padding: 1rem 2rem;
}

.quote-en {
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--foreground);
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

.quote-cn {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

.section-social {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  justify-content: center;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s, transform 0.2s;
}

.social-link:hover {
  color: var(--accent);
  transform: translateY(-2px);
}

.social-link i {
  font-size: 1.1rem;
}

.page-reserved {
  text-align: center;
}

.reserved-content h2 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 1rem;
}

.reserved-content p {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
}

.page-indicator {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  z-index: 80;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid var(--border);
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator-dot.active {
  border-color: var(--accent);
  background: var(--accent);
}

.dot-inner {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--background);
  opacity: 0;
  transition: opacity 0.2s;
}

.indicator-dot.active .dot-inner {
  opacity: 1;
}

.indicator-dot:hover {
  border-color: var(--accent);
  transform: scale(1.1);
}

.page-switcher {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(var(--background-rgb, 255, 255, 255), 0.9);
  backdrop-filter: blur(8px);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  z-index: 98;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

html[data-theme="dark"] .page-switcher {
  background: rgba(20, 20, 20, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

.switch-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--muted);
  border: none;
  color: var(--foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.switch-btn:hover:not(:disabled) {
  background: var(--accent);
  color: #fff;
  transform: scale(1.05);
}

.switch-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.page-current {
  color: var(--accent);
  font-size: 1.1rem;
}

.page-sep {
  opacity: 0.5;
}

@media (max-width: 768px) {
  .header-group {
    flex-direction: column;
    /* text-align: center; */
  }

  .section-intro {
    flex-direction: column;
    text-align: center;
  }

  .name-row {
    justify-content: center;
  }

  .page-indicator {
    right: 1rem;
  }

  .page-switcher {
    bottom: 1rem;
    padding: 0.4rem 0.8rem;
  }

  .switch-btn {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }

  .avatar-rounded {
    width: 100px;
    height: 100px;
    border-radius: 20px;
  }

  .name-main {
    font-size: 1.5rem;
  }

  .name-sub {
    font-size: 1rem;
  }

  .quote-en {
    font-size: 1.1rem;
  }

  .quote-cn {
    font-size: 1rem;
  }
}

html[data-theme="dark"] .page-switcher {
  background: rgba(20, 20, 20, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

.one-liner .typed-cursor {
  color: var(--accent);
  font-size: 1.5rem;
  animation: blink 0.7s infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style>