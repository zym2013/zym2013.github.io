<template>
	<div class="center-wrap">
		<main class="card" role="main" aria-labelledby="site-title">

			<!-- 头部区域：包含头像和标题 -->
			<div class="header-group">
				<!-- 1. 圆形头像 -->
				<div class="avatar-container" :class="{ show: typedDone }">
					<video class="avatar-video" src="/fav.mp4" autoplay loop muted playsinline webkit-playsinline preload="auto"
						referrerpolicy="no-referrer" crossorigin="anonymous">
						<!-- 可选：添加加载时的占位图 -->
						<!-- <img src="https://cdn.luogu.com.cn/upload/image_hosting/n28h9d5u.png?x-oss-process=image/rounded-corners,r_360" alt="Loading..." /> -->
					</video>
				</div>
				<!-- <div class="avatar-container" :class="{ show: typedDone }">
					<img
						src="https://cdn.luogu.com.cn/upload/image_hosting/n28h9d5u.png?x-oss-process=image/rounded-corners,r_360"
						alt="zym2013 Avatar" class="avatar-img" referrerpolicy="no-referrer" crossorigin="anonymous" />
				</div> -->

				<!-- 2. 标题 -->
				<h1 id="site-title">
					<span class="typed-container">
						<span ref="typedEl"></span>
					</span>
				</h1>
			</div>

			<nav class="links" :class="{ show: typedDone }" aria-label="主要链接">
				<a class="link" href="/project/">
					项目
				</a>
				<span class="sep">｜</span>
				<a class="link" href="/blog/">
					博客
				</a>
				<span class="sep">｜</span>
				<a class="link" href="/rss.xml">
					RSS
				</a>
				<span class="sep">｜</span>
				<a class="link" href="https://github.com/zym2013" target="_blank" rel="noopener">
					Github
				</a>
				<span class="sep">｜</span>
				<a class="link" href="mailto:3396619503@qq.com">
					联系方式
				</a>
			</nav>

			<footer>
				<div class="text-muted small" :class="{ show: typedDone }">
					Copyright ©
					<a href="https://github.com/zym2013" target="_blank" rel="noopener" class="text-decoration-none">
						zym2013
					</a>
					2026. All rights reserved.
				</div>
			</footer>
		</main>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{ name: string }>();

const typedEl = ref<HTMLElement | null>(null);
const typedDone = ref(false);

onMounted(() => {
	const loadTyped = () => {
		if (!(window as any).Typed) {
			const script = document.createElement('script');
			script.src = 'https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js';
			script.onload = initTyped;
			document.head.appendChild(script);
		} else {
			initTyped();
		}
	};

	const initTyped = () => {
		const Typed = (window as any).Typed;
		if (!typedEl.value) return;

		new Typed(typedEl.value, {
			strings: [props.name],
			typeSpeed: 80,
			backSpeed: 0,
			startDelay: 300,
			showCursor: true,
			cursorChar: '|',
			loop: false,
			onComplete: () => {
				// 打字完成后，显示导航和头像
				setTimeout(() => { typedDone.value = true; }, 500);
			}
		});
	};

	loadTyped();
});
</script>

<style scoped>
/* 头部组布局：Flex 居中，头像在左，文字在右 */
.header-group {
	display: flex;
	align-items: center;
	/* justify-content: center; */
	gap: 1.5rem;
	/* 头像和文字的间距 */
	margin-bottom: 2rem;
}

/* 头像容器 */
.avatar-container {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	overflow: hidden;
	opacity: 0;
	transform: translateY(20px) scale(0.9);
	transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
	-webkit-mask-image: radial-gradient(circle, black 70%, transparent 100%);
	mask-image: radial-gradient(circle, black 70%, transparent 100%);
	display: flex;
	justify-content: center;
	align-items: center;
}

/* 激活状态：淡入并上浮 */
.avatar-container.show {
	opacity: 1;
	transform: translateY(0) scale(1);
}

/* 头像图片 */
.avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	/* 确保图片不变形 */
}

/* 标题样式调整 */
#site-title {
	margin: 0;
	font-size: 2.5rem;
	font-weight: 700;
	color: var(--vp-c-text-1);
	/* 确保标题内的文字垂直居中 */
	line-height: 1.2;
}

.avatar-container.show {
  opacity: 1;
  transform: translateY(0);
}

/* 视频样式：圆角 + 填充 + 禁止右键 */
.avatar-video {
  width: 100%;
  height: 100%;
  object-fit: cover;        /* 保持比例填充 */
  border-radius: 50%;       /* 圆形头像 */
  display: block;
  pointer-events: none;     /* 禁止右键/拖拽 */
  user-select: none;
  background: var(--background); /* 加载时背景色 */
}

/* 可选：加载失败时的降级样式 */
.avatar-video:not([src]) {
  display: none;
}
</style>