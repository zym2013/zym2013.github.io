<!-- src/components/TopBar.vue -->
<template>
  <header class="top-bar" role="banner">
    <!-- 左侧：Logo + 功能按钮组 -->
    <div class="top-bar-left">
      <a href="/" class="logo-link" aria-label="返回首页">zym2013</a>
    </div>

    <!-- 中间：动态标题/提示/操作区 -->
    <div class="top-bar-center">
      <Transition name="fade" mode="out-in">
        <!-- 开往确认模式 -->
        <div v-if="travellingMode" :key="'travelling'" class="center-text travelling-actions">
          <span class="travelling-text">即将前往外部网站，安全性无法保证</span>
          <div class="travelling-buttons">
            <button class="btn-small btn-cancel" @click="cancelTravelling">取消</button>
            <button class="btn-small btn-confirm" @click="confirmTravelling">确认</button>
          </div>
        </div>
        <!-- 普通模式 -->
        <span v-else :key="displayText" class="center-text" :class="{ 'tooltip': showTooltipFlag }">
          {{ displayText }}
        </span>
      </Transition>
    </div>

    <!-- 右侧：功能按钮组 -->
    <div class="top-bar-right">
      <div class="action-buttons">
        <!-- 开往按钮 -->
        <button class="action-btn" @mouseenter="showTooltip('开往 · 友链接力')" @mouseleave="hideTooltip"
          @click="handleTravelling" aria-label="开往友链接力">
          <i class="fa-solid fa-bus"></i>
        </button>

        <!-- 随机文章按钮 -->
        <button class="action-btn" @mouseenter="showTooltip('随机跳转至本站的一篇文章')" @mouseleave="hideTooltip"
          @click="handleRandomPost" aria-label="随机文章">
          <i class="fa-solid fa-dice"></i>
        </button>

        <!-- RSS 按钮 -->
        <!-- <a href="/rss.xml" class="action-btn" target="_blank" @mouseenter="showTooltip('订阅 RSS')"
          @mouseleave="hideTooltip" aria-label="RSS 订阅">
          <i class="fa-solid fa-rss"></i>
        </a> -->

        <!-- 主题切换按钮 -->
        <button class="action-btn" @click="toggleTheme" @mouseenter="showTooltip('点击切换主题')" @mouseleave="hideTooltip"
          :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'">
          <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
        </button>

        <!-- 返回顶部按钮 -->
        <Transition name="slide-fade">
          <button v-if="scrollPercent > 0 && hasScrollbar" class="action-btn scroll-top-btn"
            @mouseenter="showTooltip('返回顶部'); showScrollArrowTemp = true"
            @mouseleave="hideTooltip(); showScrollArrowTemp = false" @click="handleScrollToTop" aria-label="返回顶部">
            <!-- 悬停时显示箭头，否则显示百分比数字 -->
            <i v-if="showScrollArrowTemp || scrollPercent > 95" class="fa-solid fa-arrow-up"></i>
            <span v-else class="scroll-percent">{{ scrollPercent }}</span>
          </button>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps<{
  pageTitle: string;
  allPosts?: Array<{ slug: string; title: string }>;
}>();

// --- 状态 ---
const isDark = ref(false);
const scrollPercent = ref(0);
const hasScrollbar = ref(true);
const showScrollArrowTemp = ref(false); // 仅控制返回顶部图标切换

// Tooltip 核心状态
const showTooltipFlag = ref(false);
const tooltipMessage = ref('');
const travellingMode = ref(false);

// --- 计算属性 ---
const displayText = computed(() => {
  // 1. 优先显示开往确认界面
  if (travellingMode.value) return ''; 
  
  // 2. 如果有 Tooltip 且处于激活状态，显示 Tooltip
  if (showTooltipFlag.value && tooltipMessage.value) {
    return tooltipMessage.value;
  }
  
  // 3. 默认显示页面标题
  return props.pageTitle || 'zym2013';
});

// --- Tooltip 控制逻辑 (重构版) ---

// 显示提示
const showTooltip = (msg: string) => {
  if (travellingMode.value) return; // 开往模式下禁止普通提示
  tooltipMessage.value = msg;
  showTooltipFlag.value = true;
};

// 隐藏提示 (统一出口)
const hideTooltip = () => {
  if (travellingMode.value) return;
  
  // 只有当当前显示的正是我们要隐藏的消息时，才真正隐藏
  // 这样可以防止快速切换按钮时的闪烁
  showTooltipFlag.value = false;
  // 延迟清空消息，避免动画过程中文字突然消失
  setTimeout(() => {
    if (!showTooltipFlag.value) {
      tooltipMessage.value = '';
    }
  }, 250); // 与 CSS transition 时间一致
};

// --- 业务逻辑 ---

// 1. 主题切换
const toggleTheme = () => {
  isDark.value = !isDark.value;
  const theme = isDark.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// 2. 开往友链
const handleTravelling = () => {
  travellingMode.value = true;
  showTooltipFlag.value = false; // 强制隐藏任何现有 Tooltip
  tooltipMessage.value = '';
};

const cancelTravelling = () => {
  travellingMode.value = false;
  // 恢复默认状态
  tooltipMessage.value = '';
  showTooltipFlag.value = false;
};

const confirmTravelling = () => {
  window.open('https://www.travellings.cn/go.html', '_blank', 'noopener,noreferrer');
  cancelTravelling();
};

// 3. 随机文章
const handleRandomPost = async () => {
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
        if (href) {
          window.location.href = href;
          return;
        }
      }
    }
    if (posts && posts.length > 0) {
      const random = posts[Math.floor(Math.random() * posts.length)];
      window.location.href = `/blog/${random.slug}/`;
      return;
    }
    window.location.href = '/blog/';
  } catch (e) {
    console.error('Random post error:', e);
    window.location.href = '/blog/';
  }
};

// 4. 返回顶部
const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight;
  const winHeight = window.innerHeight;
  const scrollable = docHeight - winHeight;
  
  const percent = scrollable > 0 ? Math.round((scrollTop / scrollable) * 100) : 0;
  scrollPercent.value = percent;
  hasScrollbar.value = scrollable > 10;
};

// --- 生命周期 ---

onMounted(() => {
  // 初始化主题
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDark.value = saved === 'dark' || (!saved && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');

  // 监听滚动
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: var(--background);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
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

/* 返回顶部按钮的百分比数字样式 */
.scroll-percent {
  font-size: 0.8rem;
  font-weight: 1000;
  /* 加粗 */
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

/* 开往确认模式样式 */
.travelling-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  pointer-events: auto;
  /* 允许点击按钮 */
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

/* Transition 动画 */
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

/* 移动端适配 */
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

/* 返回顶部按钮的百分比数字样式 */
.scroll-percent {
  font-size: 0.8rem;
  font-weight: 700;
  /* 加粗 */
  min-width: 24px;
  text-align: center;
  line-height: 1;
}

/* 单向滑动淡入淡出动画 */
/* 显示时：从右侧滑入 (20px → 0) */
.slide-fade-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateX(0);
  opacity: 1;
}

/* 隐藏时：向左侧滑出 (0 → -20px) */
.slide-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
  transform: translateX(0);
  opacity: 1;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* 确保按钮容器允许溢出显示动画 */
.action-buttons {
  display: flex;
  overflow: visible;
}

/* 所有操作按钮的基础样式 */
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

/* 👇 关键：隐藏时的动画状态 */
.scroll-top-btn.slide-out {
  opacity: 0;
  transform: translateX(-20px);
  /* 向左淡出 */
  margin-right: -36px !important;
  /* 负边距：抵消按钮宽度(36px)+间距(0.5rem≈8px) */
  pointer-events: none;
  /* 隐藏后不可交互 */
}

/* 开往确认模式样式（保持不变） */
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