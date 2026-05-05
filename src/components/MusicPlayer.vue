<template>
	<div class="music-widget" :class="{ 'is-expanded': isExpanded, 'is-playing': isPlaying }">

		<!-- 1. 圆形主播放器 (始终显示) -->
		<div class="music-disc-container" @click="toggleExpand">
			<!-- 背景模糊层 -->
			<div class="disc-bg" :style="{ backgroundImage: `url(${currentSong.pic})` }"></div>

			<!-- 唱片/封面 -->
			<div class="disc-cover">
				<img :src="currentSong.pic" alt="Cover" crossorigin="anonymous" />
				<!-- 中心孔 -->
				<div class="disc-hole"></div>
			</div>

			<!-- 播放指示器 (中间的小图标) -->
			<div class="play-indicator">
				<i v-if="!isPlaying" class="fa-solid fa-play"></i>
				<div v-else class="playing-bars">
					<span></span><span></span><span></span>
				</div>
			</div>
		</div>

		<!-- 2. 展开/折叠按钮 (挂在右侧) -->
		<button class="expand-btn" @click.stop="toggleExpand" :title="isExpanded ? '收起' : '展开歌单'">
			<i :class="isExpanded ? 'fa-solid fa-chevron-down' : 'fa-solid fa-music'"></i>
		</button>

		<!-- 3. 展开后的控制面板 -->
		<div class="music-panel">
			<!-- 歌曲信息 -->
			<div class="song-info">
				<h3 class="song-title">{{ currentSong.name }}</h3>
				<p class="song-author">{{ currentSong.author }}</p>
			</div>

			<!-- 进度条 -->
			<div class="progress-container" @mousedown="startSeeking" @touchstart="startSeeking">
				<div class="progress-bar">
					<div class="progress-filled" :style="{ width: progressPercent + '%' }"></div>
					<div class="progress-thumb" :style="{ left: progressPercent + '%' }"></div>
				</div>
				<div class="time-display">
					<span>{{ formatTime(currentTime) }}</span>
					<span>{{ formatTime(duration) }}</span>
				</div>
			</div>

			<!-- 控制按钮组 -->
			<div class="controls">
				<button @click="prevSong" title="上一首"><i class="fa-solid fa-backward-step"></i></button>
				<button class="btn-play" @click="togglePlay" title="播放/暂停">
					<i :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
				</button>
				<button @click="nextSong" title="下一首"><i class="fa-solid fa-forward-step"></i></button>

				<!-- 音量控制 (简单版) -->
				<div class="volume-control" @mouseenter="showVolume = true" @mouseleave="showVolume = false">
					<i class="fa-solid fa-volume-high" @click="toggleMute"></i>
					<div class="volume-slider" v-show="showVolume || isMobile">
						<input type="range" min="0" max="1" step="0.01" v-model.number="volume" @input="setVolume" />
					</div>
				</div>
			</div>

			<!-- 歌单列表 -->
			<div class="playlist">
				<div v-for="(song, index) in playlist" :key="index" class="playlist-item"
					:class="{ active: currentIndex === index }" @click="playSpecificSong(index)">
					<span class="item-index">{{ index + 1 }}</span>
					<div class="item-info">
						<span class="item-title">{{ song.name }}</span>
						<span class="item-author">{{ song.author }}</span>
					</div>
					<i v-if="currentIndex === index && isPlaying" class="fa-solid fa-chart-simple playing-icon"></i>
				</div>
			</div>
		</div>

		<!-- 隐藏的原生 Audio 标签 -->
		<audio ref="audioRef" :src="currentSong.url" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
			@ended="nextSong" @error="handleError"></audio>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

// API 配置
const API_URL = 'https://api.qijieya.cn/meting/?server=netease&type=playlist&id=25674022';

// 状态
const playlist = ref<any[]>([]);
const currentIndex = ref(0);
const isPlaying = ref(false);
const isExpanded = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.7);
const showVolume = ref(false);
const isSeeking = ref(false);

// DOM 引用
const audioRef = ref<HTMLAudioElement | null>(null);

// 计算属性
const currentSong = computed(() => playlist.value[currentIndex.value] || {});
const progressPercent = computed(() => {
	if (!duration.value) return 0;
	return (currentTime.value / duration.value) * 100;
});
const isMobile = ref(false);

onMounted(() => {
	// 初始化 isMobile
	isMobile.value = window.innerWidth < 768;
});

// 初始化加载歌单
onMounted(async () => {
	try {
		const res = await fetch(API_URL);
		const data = await res.json();
		if (Array.isArray(data)) {
			playlist.value = data;
			// 预加载第一首但不自动播放，避免浏览器策略拦截
			if (audioRef.value) {
				audioRef.value.volume = volume.value;
			}
		}
	} catch (e) {
		console.error('Failed to load playlist:', e);
	}
});

// 播放控制
const togglePlay = () => {
	if (!audioRef.value) return;
	if (isPlaying.value) {
		audioRef.value.pause();
	} else {
		audioRef.value.play().catch(e => console.warn('Play failed:', e));
	}
	isPlaying.value = !isPlaying.value;
};

const prevSong = () => {
	if (playlist.value.length === 0) return;
	currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length;
	resetAndPlay();
};

const nextSong = () => {
	if (playlist.value.length === 0) return;
	currentIndex.value = (currentIndex.value + 1) % playlist.value.length;
	resetAndPlay();
};

const playSpecificSong = (index: number) => {
	if (currentIndex.value === index && isPlaying.value) {
		togglePlay(); // 如果点击当前正在播放的，则暂停
		return;
	}
	currentIndex.value = index;
	resetAndPlay();
};

const resetAndPlay = () => {
	isPlaying.value = true;
	// Vue 响应式更新 src 后，需要手动 play
	setTimeout(() => {
		if (audioRef.value) {
			audioRef.value.load();
			audioRef.value.play().catch(e => console.warn('Auto-play failed:', e));
		}
	}, 100);
};

// 进度条控制
const onTimeUpdate = () => {
	if (!isSeeking.value && audioRef.value) {
		currentTime.value = audioRef.value.currentTime;
	}
};

const onLoadedMetadata = () => {
	if (audioRef.value) {
		duration.value = audioRef.value.duration;
	}
};

const startSeeking = () => {
	isSeeking.value = true;
	window.addEventListener('mousemove', onSeeking);
	window.addEventListener('mouseup', stopSeeking);
	window.addEventListener('touchmove', onSeeking);
	window.addEventListener('touchend', stopSeeking);
};

const onSeeking = (e: MouseEvent | TouchEvent) => {
	if (!audioRef.value || !duration.value) return;

	const bar = document.querySelector('.progress-bar');
	if (!bar) return;

	const rect = bar.getBoundingClientRect();
	let clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;

	// 限制范围
	let percent = (clientX - rect.left) / rect.width;
	percent = Math.max(0, Math.min(1, percent));

	currentTime.value = percent * duration.value;
};

const stopSeeking = () => {
	isSeeking.value = false;
	if (audioRef.value) {
		audioRef.value.currentTime = currentTime.value;
	}
	if (typeof window !== 'undefined') {
		window.removeEventListener('mousemove', onSeeking);
		window.removeEventListener('mouseup', stopSeeking);
		window.removeEventListener('touchmove', onSeeking);
		window.removeEventListener('touchend', stopSeeking);
	}
};

// 音量控制
const setVolume = () => {
	if (audioRef.value) {
		audioRef.value.volume = volume.value;
	}
};

const toggleMute = () => {
	if (audioRef.value) {
		if (audioRef.value.volume > 0) {
			audioRef.value.dataset.prevVolume = String(audioRef.value.volume);
			audioRef.value.volume = 0;
			volume.value = 0;
		} else {
			const prev = parseFloat(audioRef.value.dataset.prevVolume || '0.7');
			audioRef.value.volume = prev;
			volume.value = prev;
		}
	}
};

// 工具函数
const formatTime = (seconds: number) => {
	if (!seconds || isNaN(seconds)) return '00:00';
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const handleError = (e: Event) => {
	console.error('Audio error:', e);
	// 可选：自动跳过错误歌曲
	// nextSong();
};

const toggleExpand = () => {
	isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
/* ===== 容器定位 ===== */
.music-widget {
	position: fixed;
	bottom: 20px;
	left: 20px;
	z-index: 9999;
	font-family: inherit;
	user-select: none;
}

/* ===== 1. 圆形唱片容器 ===== */
.music-disc-container {
	position: relative;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	cursor: pointer;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	overflow: hidden;
	background: #000;
}

.music-disc-container:hover {
	transform: scale(1.05);
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* 背景模糊层 */
.disc-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-size: cover;
	background-position: center;
	filter: blur(8px) brightness(0.6);
	transform: scale(1.2);
	/* 防止模糊边缘露白 */
	z-index: 1;
}

/* 封面图片 */
.disc-cover {
	position: absolute;
	top: 5px;
	left: 5px;
	right: 5px;
	bottom: 5px;
	border-radius: 50%;
	overflow: hidden;
	z-index: 2;
	/* 默认不旋转，播放时通过父级 class 控制 */
	transition: transform 0.5s linear;
}

.is-playing .disc-cover {
	animation: rotate-disc 10s linear infinite;
}

.disc-cover img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* 中心孔 */
.disc-hole {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 12px;
	height: 12px;
	background: var(--background, #fff);
	border-radius: 50%;
	z-index: 3;
	box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
}

/* 播放指示器 (中间) */
.play-indicator {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 4;
	color: #fff;
	font-size: 14px;
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
	pointer-events: none;
	/* 让点击穿透到容器 */
}

/* 播放时的音波动画 */
.playing-bars {
	display: flex;
	align-items: flex-end;
	gap: 2px;
	height: 12px;
}

.playing-bars span {
	width: 2px;
	background: #fff;
	animation: sound-wave 0.8s ease-in-out infinite;
}

.playing-bars span:nth-child(1) {
	height: 60%;
	animation-delay: 0s;
}

.playing-bars span:nth-child(2) {
	height: 100%;
	animation-delay: 0.2s;
}

.playing-bars span:nth-child(3) {
	height: 40%;
	animation-delay: 0.4s;
}

@keyframes rotate-disc {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

@keyframes sound-wave {

	0%,
	100% {
		transform: scaleY(0.5);
	}

	50% {
		transform: scaleY(1);
	}
}

/* ===== 2. 展开按钮 ===== */
.expand-btn {
	position: absolute;
	top: 50%;
	left: 50px;
	/* 挂在圆的右侧 */
	transform: translateY(-50%);
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background: var(--accent, #6366f1);
	color: #fff;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	transition: all 0.3s ease;
	z-index: 10;
}

.expand-btn:hover {
	transform: translateY(-50%) scale(1.1);
	background: var(--link-hover, #4f46e5);
}

/* 展开时按钮旋转并移动 */
.is-expanded .expand-btn {
	transform: translateY(-50%) rotate(180deg);
	left: auto;
	right: -12px;
	/* 移到面板右侧边缘 */
	top: 20px;
}

/* ===== 3. 展开面板 ===== */
.music-panel {
	position: absolute;
	bottom: 0;
	left: 70px;
	/* 在圆的右侧 */
	width: 320px;
	max-height: 400px;
	background: rgba(var(--background-rgb, 255, 255, 255), 0.95);
	backdrop-filter: blur(10px);
	border-radius: 12px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	padding: 16px;
	opacity: 0;
	visibility: hidden;
	transform: translateX(-20px) scale(0.95);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: 9;
	border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
	display: flex;
	flex-direction: column;
}

/* 暗色模式适配 */
html[data-theme="dark"] .music-panel {
	background: rgba(var(--background-rgb, 20, 20, 20), 0.95);
	border-color: var(--border, rgba(255, 255, 255, 0.1));
}

.is-expanded .music-panel {
	opacity: 1;
	visibility: visible;
	transform: translateX(0) scale(1);
}

/* 面板内容 */
.song-info {
	margin-bottom: 12px;
	text-align: center;
}

.song-title {
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 4px;
	color: var(--foreground);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.song-author {
	font-size: 12px;
	color: var(--vp-c-text-2);
	margin: 0;
}

/* 进度条 */
.progress-container {
	margin-bottom: 12px;
	cursor: pointer;
}

.progress-bar {
	position: relative;
	height: 4px;
	background: var(--border, #e5e7eb);
	border-radius: 2px;
	overflow: visible;
}

.progress-filled {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	background: var(--accent, #6366f1);
	border-radius: 2px;
	width: 0%;
	transition: width 0.1s linear;
}

.progress-thumb {
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 12px;
	height: 12px;
	background: #fff;
	border: 2px solid var(--accent, #6366f1);
	border-radius: 50%;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	opacity: 0;
	transition: opacity 0.2s;
}

.progress-container:hover .progress-thumb {
	opacity: 1;
}

.time-display {
	display: flex;
	justify-content: space-between;
	font-size: 10px;
	color: var(--vp-c-text-3);
	margin-top: 4px;
}

/* 控制按钮 */
.controls {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;
	margin-bottom: 12px;
}

.controls button {
	background: none;
	border: none;
	color: var(--foreground);
	font-size: 16px;
	cursor: pointer;
	padding: 8px;
	border-radius: 50%;
	transition: background 0.2s, color 0.2s;
}

.controls button:hover {
	background: var(--muted, rgba(0, 0, 0, 0.05));
	color: var(--accent);
}

.btn-play {
	font-size: 20px !important;
	background: var(--accent, #6366f1) !important;
	color: #fff !important;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn-play:hover {
	background: var(--link-hover, #4f46e5) !important;
	transform: scale(1.05);
}

/* 音量 */
.volume-control {
	position: relative;
	display: flex;
	align-items: center;
}

.volume-slider {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%) translateY(-8px);
	background: var(--background);
	padding: 8px 4px;
	border-radius: 20px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	border: 1px solid var(--border);
}

.volume-slider input {
	writing-mode: bt-lr;
	/* IE */
	-webkit-appearance: slider-vertical;
	/* Webkit */
	width: 4px;
	height: 80px;
	accent-color: var(--accent);
}

/* 歌单列表 */
.playlist {
	flex: 1;
	overflow-y: auto;
	max-height: 180px;
	border-top: 1px solid var(--border);
	padding-top: 8px;
}

.playlist::-webkit-scrollbar {
	width: 4px;
}

.playlist::-webkit-scrollbar-thumb {
	background: var(--border);
	border-radius: 2px;
}

.playlist-item {
	display: flex;
	align-items: center;
	padding: 6px 8px;
	border-radius: 6px;
	cursor: pointer;
	transition: background 0.2s;
	font-size: 12px;
}

.playlist-item:hover {
	background: var(--muted, rgba(0, 0, 0, 0.05));
}

.playlist-item.active {
	background: rgba(var(--accent-rgb, 99, 102, 241), 0.1);
	color: var(--accent);
}

.item-index {
	width: 20px;
	color: var(--vp-c-text-3);
	font-size: 10px;
}

.item-info {
	flex: 1;
	overflow: hidden;
}

.item-title {
	display: block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-weight: 500;
}

.item-author {
	display: block;
	font-size: 10px;
	color: var(--vp-c-text-3);
}

.playing-icon {
	font-size: 12px;
	animation: pulse 1s infinite;
}

@keyframes pulse {

	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0.5;
	}
}

/* ===== 移动端适配 ===== */
@media (max-width: 768px) {
	.music-widget {
		bottom: 10px;
		left: 10px;
	}

	.music-disc-container {
		width: 50px;
		height: 50px;
	}

	.expand-btn {
		left: 40px;
	}

	.music-panel {
		left: 0;
		bottom: 60px;
		/* 向上弹出 */
		width: 90vw;
		max-width: 320px;
	}

	.is-expanded .expand-btn {
		right: auto;
		left: 50%;
		top: -12px;
		transform: translateX(-50%) rotate(180deg);
	}
}

/* 音量 */
.volume-control {
	position: relative;
	display: flex;
	align-items: center;
}

.volume-slider {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%) translateY(-8px);
	background: var(--background);
	padding: 8px 4px;
	border-radius: 20px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	border: 1px solid var(--border);
    
    /* 👇 修改：默认隐藏，悬停显示 */
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
}

/* 👇 新增：悬停父元素时显示滑块 */
.volume-control:hover .volume-slider {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-5px);
}

.volume-slider input {
	writing-mode: bt-lr;
	-webkit-appearance: slider-vertical;
	width: 4px;
	height: 80px;
	accent-color: var(--accent);
    cursor: pointer;
}
</style>