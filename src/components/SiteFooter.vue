<template>
  <footer v-if="!isHome" class="site-footer" role="contentinfo">
    <!-- 上半部分：视频 + 社交 + 四列链接 -->
    
    <!-- 视频 + 社交区（初始在链接区上方） -->
    <div ref="leftColRef" class="footer-left-column">
      <div class="footer-video">
        <video 
          class="avatar-video" 
          src="/fav.mp4" 
          autoplay 
          loop 
          muted 
          playsinline 
          webkit-playsinline 
          preload="auto"
          referrerpolicy="no-referrer" 
          crossorigin="anonymous" 
          aria-label="Site Avatar" 
        />
      </div>
      <div class="footer-social">
        <a v-for="(link, i) in socialLinks" :key="i" :href="link.url" :aria-label="link.name" 
           class="social-btn" target="_blank" rel="noopener">
          <i :class="link.icon"></i>
        </a>
      </div>
    </div>

    <!-- 文字链接区（动态接收/释放视频列） -->
    <div ref="linksContainerRef" class="footer-links">
      <div class="link-column">
        <h4>服务</h4>
        <ul>
          <li><a href="/rss.xml" target="_blank" rel="noopener">RSS</a></li>
          <li><a href="https://foreverblog.cn/go.html" target="_blank" rel="noopener">十年之约</a></li>
          <li><a href="https://www.travellings.cn/go.html" target="_blank" rel="noopener">开往</a></li>
        </ul>
      </div>
      <div class="link-column">
        <h4>导航</h4>
        <ul>
          <li><a href="/blog/">博客</a></li>
          <li><a href="/project/">项目</a></li>
          <li><a href="/lab/">实验室</a></li>
        </ul>
      </div>
      <div class="link-column">
        <h4>协议</h4>
        <ul>
          <li><a href="/privacy/">隐私协议</a></li>
          <li><a href="/cookies/">Cookies</a></li>
          <li><a href="/license/">版权协议</a></li>
        </ul>
      </div>
      <div class="link-column">
        <h4>友链</h4>
        <ul>
          <li><a href="https://lijingshu.blog" target="_blank" rel="noopener">lijingshu's blog</a></li>
          <li><a href="https://tsumugi.house" target="_blank" rel="noopener">House Tsumugi</a></li>
          <li><a href="https://betterluogu.dev" target="_blank" rel="noopener">Better Luogu</a></li>
        </ul>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="footer-divider" />

    <!-- 下半部分：版权 + 诗词 + 主题 -->
    <div class="footer-bottom">
      <!-- 左侧：版权 + 打字机诗词 -->
      <div class="footer-left">
        <span class="copyright">Copyright © zym2013 {{ currentYear }}. All rights reserved.</span>
        <span class="typewriter-container">
          <span ref="typewriterRef" class="typewriter-text" aria-live="polite">{{ displayedPoem }}</span>
          <span class="typewriter-cursor" :class="{ blink: isTyping }">|</span>
        </span>
      </div>

      <!-- 右侧：主题 + CC协议 -->
      <div class="footer-right">
        <a href="https://github.com/zym2013/zym2013-site" target="_blank" rel="noopener" class="theme-link">
          <i class="fa-solid fa-palette"></i> 主题
        </a>
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener" class="cc-link"
          aria-label="CC BY-NC-SA 4.0">
          <i class="fa-brands fa-creative-commons"></i>
          <i class="fa-brands fa-creative-commons-by"></i>
          <i class="fa-brands fa-creative-commons-nc"></i>
          <i class="fa-brands fa-creative-commons-sa"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Typed from 'typed.js';

defineProps<{ isHome: boolean }>();

const initPoemTypewriter = async () => {
  if (!typewriterRef.value) return;

  try {
    // 动态导入 CommonJS 模块
    const jinrishiciModule = await import('jinrishici');
    const jinrishici = (jinrishiciModule as any).default || jinrishiciModule;
    
    jinrishici.load((result: { data: { content: string } }) => {
      const poem = result.data.content;
      
      typed = new Typed(typewriterRef.value!, {
        strings: [poem],
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        showCursor: false,
      });
    }, (error: any) => {
      console.error('诗词加载失败:', error);
      // 降级文案
      typed = new Typed(typewriterRef.value!, {
        strings: ['「长风破浪会有时，直挂云帆济沧海。」'],
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        showCursor: false
      });
    });
  } catch (e) {
    console.error('jinrishici 导入失败:', e);
    // 完全降级
    typed = new Typed(typewriterRef.value!, {
      strings: ['「今日诗词加载失败」'],
      typeSpeed: 80,
      loop: true,
      showCursor: false
    });
  }
};

// DOM refs
const leftColRef = ref<HTMLElement | null>(null);
const linksContainerRef = ref<HTMLElement | null>(null);
const typewriterRef = ref<HTMLElement | null>(null);

// 配置
const currentYear = new Date().getFullYear();
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/zym2013', icon: 'fa-brands fa-github' },
  { name: 'RSS', url: '/rss.xml', icon: 'fa-solid fa-rss' },
  { name: 'Email', url: 'mailto:3396619503@qq.com', icon: 'fa-solid fa-envelope' },
];

// 状态
let typed: Typed | null = null;
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

// 👇 核心：根据屏幕宽度移动 DOM
const syncFooterLayout = () => {
  const leftCol = leftColRef.value;
  const linksContainer = linksContainerRef.value;
  if (!leftCol || !linksContainer) return;

  const isWide = window.innerWidth >= 900;
  const isInContainer = leftCol.parentElement === linksContainer;

  if (isWide && !isInContainer) {
    // ≥900px: 放入 footer-links 首位
    linksContainer.insertBefore(leftCol, linksContainer.firstChild);
  } else if (!isWide && isInContainer) {
    // <900px: 取出，放回 footer-links 之前
    linksContainer.parentNode?.insertBefore(leftCol, linksContainer);
  }
};

// 👇 防抖 resize 监听
const handleResize = () => {
  clearTimeout(resizeTimer || undefined);
  resizeTimer = setTimeout(syncFooterLayout, 100);
};

onMounted(() => {
  // 1. 初始化布局
  syncFooterLayout();
  
  // 2. 初始化诗词打字机
  initPoemTypewriter();
  
  // 3. 监听窗口变化
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 清理
  window.removeEventListener('resize', handleResize);
  if (resizeTimer) clearTimeout(resizeTimer);
  if (typed) typed.destroy();
});
</script>

<style scoped>
/* ===== 页脚基础样式 ===== */
.site-footer {
  background: var(--background);
  border-top: 1px solid var(--border);
  padding: 2rem 1rem 1rem;
  font-size: 0.9rem;
  color: var(--foreground);
}

/* =========================================
   页脚主体布局 (居中对齐 + 900px 响应式)
   ========================================= */
.footer-main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* 👈 整体居中，不靠左 */
  align-items: flex-start;
  gap: 2rem;
  /* 左右区块间距 */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  /* 容器水平居中 */
  padding: 0 1rem;
  box-sizing: border-box;
}

/* 📱 默认：< 900px → 垂直堆叠（视频/社交在上，链接在下） */
.footer-main {
  flex-direction: column;
  align-items: center;
}

/* 🖥️ ≥ 900px → 变为一行并列 */
@media (min-width: 900px) {
  .footer-main {
    flex-direction: row;
  }
}

/* ===== 左侧区块：视频 + 社交 ===== */
.footer-left-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 内部居中 */
  gap: 1rem;
  flex-shrink: 0;
}

.footer-video {
  width: 100%;
  display: flex;
  justify-content: center;
}

.avatar-video {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 2px solid var(--border);
  transition: border-color 0.3s;
}

.avatar-video:hover {
  border-color: var(--accent);
}

/* 社交图标区：居中排列，严格限制最多 5 个一行 */
.footer-social {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  /* 图标间距 */
  width: 100%;
  /* 👇 精确计算：36px×5 + 8px(gap)×4 = 212px，超出自动换行 */
  max-width: calc(36px * 5 + 0.5rem * 4);
}

.social-btn {
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--muted);
  color: var(--foreground);
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: var(--accent);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ===== 右侧区块：链接列表 ===== */
.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* 链接组整体居中 */
  gap: 1.2rem 2rem;
  /* 行间距 1.2rem，列间距 2rem */
  flex: 1;
  min-width: 0;
  margin-bottom: 1rem;
  /* 允许 Flex 子项正确触发省略号 */
}

.link-column {
  flex: 0 0 120px;
  /* 固定列宽 120px，不伸缩 */
  min-width: 120px;
  overflow: hidden;
}

.link-column h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.8rem;
  color: var(--foreground);
  border-bottom: 2px solid var(--accent);
  padding-bottom: 0.4rem;
  display: block;
  /* 省略号必须为块级 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-column a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
  display: block;
  /* 省略号必须为块级 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-column a:hover {
  color: var(--accent);
}

/* ===== 移动端适配 (≤768px) ===== */
@media (max-width: 768px) {
  .footer-main {
    flex-direction: column;
    /* 垂直堆叠 */
    align-items: center;
    gap: 1.5rem;
  }

  .footer-left-column {
    order: -1;
    /* 视频+社交置顶 */
  }

  .footer-links {
    justify-content: center;
    gap: 1rem 1.5rem;
    width: 100%;
  }

  .link-column {
    flex: 0 0 100px;
    /* 移动端列宽缩小 */
    min-width: 100px;
  }

  .footer-social {
    max-width: 180px;
    /* 移动端限制更紧 */
  }
}

@media (max-width: 899px) {
  .footer-left-column {
    margin-bottom: 1.5rem;
  }
}

.footer-video {
  flex-shrink: 0;
}

.avatar-video {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  user-select: none;
  background: var(--background);
  border: 2px solid var(--border);
  transition: border-color 0.3s;
}

/* ===== 四列链接（Flex布局 + 固定宽度 + 超出省略） ===== */
.footer-links {
  display: flex;
  flex-wrap: wrap;
  /* 允许自动换行 */
  justify-content: center;
  /* 整体居中排列 */
  gap: 1.2rem 2rem;
  /* 行间距 1.2rem，列间距 2rem */
  width: 100%;
}

.link-column {
  flex: 0 0 120px;
  /* 固定宽度 120px，不增长不收缩 */
  min-width: 120px;
  /* 安全底线 */
  overflow: hidden;
  /* 配合文字截断 */
}

.link-column h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.8rem;
  color: var(--foreground);
  border-bottom: 2px solid var(--accent);
  padding-bottom: 0.4rem;
  /* 👇 省略号核心三件套 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  /* 必须为块级，否则省略号不生效 */
}

.link-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-column a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
  /* 👇 省略号核心三件套 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  /* 必须为块级，否则省略号不生效 */
}

.link-column a:hover {
  color: var(--accent);
  /* 悬停移除 padding-left，避免破坏省略号计算宽度 */
}

/* 移动端适配：小屏幕缩小列宽 */
@media (max-width: 480px) {
  .footer-links {
    gap: 1rem 1.5rem;
    justify-content: flex-start;
    /* 小屏幕靠左更整齐 */
    padding: 0 0.5rem;
  }

  .link-column {
    flex: 0 0 100px;
    min-width: 100px;
  }
}

/* ===== 移动端自适应优化 ===== */
@media (max-width: 768px) {
  .footer-links {
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 1rem 1.5rem;
  }
}

/* ===== 分隔线 ===== */
.footer-divider {
  height: 1px;
  background: var(--border);
  max-width: 1200px;
  margin: 1rem auto;
}

/* ===== 底部信息 ===== */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.copyright {
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.typewriter-container {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 1.2em;
}

.typewriter-text {
  color: var(--accent);
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
}

.typewriter-cursor {
  color: var(--accent);
  font-weight: bold;
  animation: cursor-blink 1s step-end infinite;
}

.typewriter-cursor.blink {
  opacity: 1;
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
  50% {
    opacity: 0;
  }
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-link,
.cc-link {
  color: var(--vp-c-text-3);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: color 0.2s;
}

.theme-link:hover,
.cc-link:hover {
  color: var(--accent);
}

.cc-link i {
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .typewriter-container {
    display: none;
  }
}

/* ===== 移动端适配 ===== */
@media (max-width: 768px) {
  .footer-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2rem;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 0.8rem;
  }

  .footer-left,
  .footer-right {
    justify-content: center;
  }

  .typewriter-text {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 480px) {
  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }

  .avatar-video {
    width: 80px;
    height: 80px;
  }

  .social-btn {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .footer-bottom {
    padding: 0;
  }
}

/* ===== 暗色模式适配 ===== */
html[data-theme="dark"] .avatar-video {
  border-color: var(--muted);
}

html[data-theme="dark"] .social-btn {
  background: var(--border);
}

html[data-theme="dark"] .social-btn:hover {
  background: var(--accent);
  box-shadow: 0 4px 12px rgba(255, 107, 1, 0.4);
}
</style>