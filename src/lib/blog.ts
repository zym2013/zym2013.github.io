// src/lib/blog.ts
import matter from 'gray-matter';

export interface PostMeta {
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  draft?: boolean;

  // 🔥 自动统计字段
  wordCount: number;
  readingTime: string;  // 🔥 新增：阅读时间

  // 🔥 新增控制字段
  hidden?: boolean;     // 🔥 列表页隐藏
  pin?: number;         // 🔥 置顶权重（越大越前）
  updatedAt?: string;   // 🔥 最后更新时间（用于相同 pin 排序）

  // 🔥 状态徽章配置
  status?: string | { text: string; icon: string } | (string | { text: string; icon: string })[];  // 🔥 预设名或自定义配置

  // 🔥 原有字段
  icon?: string;
  iconColor?: string;
  category?: string;
}

export interface Post extends PostMeta {
  slug: string;
  body: string;
  headings: Array<{ text: string; slug: string; depth: number }>;
  statusConfig?: Array<{ text: string; icon: string }>;
}

// 🔥 预设状态映射
const STATUS_PRESETS: Record<string, { text: string; icon: string }> = {
  check: { text: '原创', icon: 'badge-check' },
  money: { text: '付费', icon: 'badge-dollar-sign' },
  beta: { text: 'Beta', icon: 'command' },
  hot: { text: '热门', icon: 'flame' },
  mark: { text: '推荐', icon: 'bookmark' },
};

// 🔥 修改：解析函数支持数组
function parseStatus(status: PostMeta['status']): Array<{ text: string; icon: string }> {
  if (!status) return [];
  
  // 统一转为数组处理
  const statuses = Array.isArray(status) ? status : [status];
  
  return statuses.map(s => {
    if (typeof s === 'string') {
      // 预设名 → 查找映射
      return STATUS_PRESETS[s] || { text: s, icon: 'circle' };
    }
    // 自定义对象 → 直接使用
    return s;
  }).filter(Boolean);  // 过滤无效值
}

/**
 * 🔥 更准确的字数统计（中文 + 英文）
 */
function countWords(content: string): number {
  // 移除 frontmatter（支持 --- 包裹的 YAML 头）
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, '');

  // 移除空白字符后，统计剩余字符总数（每个字符计为 1 字）
  const chars = withoutFrontmatter.replace(/\s/g, '');

  return chars.length;
}

/**
 * 🔥 估算阅读时间（中文 ~100 字/分钟）
 */
function estimateReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 100);
  return minutes < 1 ? '不到 1 分钟' : `${minutes} 分钟`;
}

/**
 * 从原始 Markdown 字符串中提取 H2-H4 标题
 */
function extractHeadings(markdown: string): Array<{ text: string; slug: string; depth: number }> {
  const headings: Array<{ text: string; slug: string; depth: number }> = [];
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;

  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const depth = match[1].length;
    let rawText = match[2].trim();

    // 清理 Markdown 语法
    rawText = rawText
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1');

    const slug = rawText
      .toLowerCase()
      .replace(/[\s]+/g, '-')
      .replace(/[^\w\-]/g, '');

    headings.push({ text: rawText, slug, depth });
  }

  return headings;
}

/**
 * 🔥 获取所有文章（支持过滤 + 排序）
 */
export async function getAllPosts(options?: { includeHidden?: boolean }): Promise<Post[]> {
  const globPosts = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default' });
  const posts: Post[] = [];

  for (const path in globPosts) {
    try {
      const rawContent = await globPosts[path]() as string;
      const { data, content: body } = matter(rawContent);

      // 🔥 生产环境跳过草稿
      if (data.draft && import.meta.env.PROD) continue;

      // 🔥 跳过隐藏文章（除非显式要求包含）
      if (data.hidden && !options?.includeHidden) continue;

      const slug = path.split('/').pop()?.replace('.md', '') || '';
      const pubDate = data.pubDate
        ? new Date(data.pubDate).toISOString()
        : new Date().toISOString();

      // 🔥 自动计算字数 + 阅读时间
      const wordCount = countWords(body);
      const readingTime = estimateReadingTime(wordCount);

      // 🔥 解析状态配置
      const statusConfig = parseStatus(data.status);

      // 🔥 用于排序的日期：优先 updatedAt，其次 pubDate
      const sortDate = data.updatedAt
        ? new Date(data.updatedAt).toISOString()
        : pubDate;

      posts.push({
        slug,
        title: data.title || '无标题',
        description: data.description || '',
        pubDate,
        tags: Array.isArray(data.tags) ? data.tags : [],

        // 🔥 自动统计字段
        wordCount,
        readingTime,

        // 🔥 控制字段
        hidden: !!data.hidden,
        pin: typeof data.pin === 'number' ? data.pin : 0,
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : undefined,

        // 🔥 状态字段
        status: data.status,
        statusConfig,

        // 🔥 原有字段
        icon: data.icon || 'fa-solid fa-feather-pointed',
        iconColor: data.iconColor || 'var(--vp-c-text-3)',
        category: data.category || '未分类',

        body,
        headings: extractHeadings(body),
      });
    } catch (e) {
      console.error(`Error loading post list ${path}:`, e);
    }
  }

  // 🔥 智能排序：置顶权重降序 → 更新时间降序 → 发布时间降序
  return posts.sort((a, b) => {
    // 1. 置顶权重（越大越前）
    const pinDiff = (b.pin || 0) - (a.pin || 0);
    if (pinDiff !== 0) return pinDiff;

    // 2. 相同 pin：按更新时间降序
    const dateA = new Date(a.updatedAt || a.pubDate).getTime();
    const dateB = new Date(b.updatedAt || b.pubDate).getTime();
    if (dateB !== dateA) return dateB - dateA;

    // 3. 完全相同：按发布时间降序（兜底）
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });
}

/**
 * 根据 slug 获取单篇文章
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const path = `./posts/${slug}.md`;
  const globPosts = import.meta.glob('./posts/*.md', { query: '?raw', import: 'default' });
  const loader = globPosts[path];

  try {
    if (!loader) return null;

    const rawContent = await loader() as string;
    const { data, content: body } = matter(rawContent);

    const pubDate = data.pubDate
      ? new Date(data.pubDate).toISOString()
      : new Date().toISOString();

    // 🔥 自动计算字数 + 阅读时间
    const wordCount = countWords(body);
    const readingTime = estimateReadingTime(wordCount);

    // 🔥 解析状态配置
    const statusConfig = parseStatus(data.status);

    // 🔥 排序用日期
    const sortDate = data.updatedAt
      ? new Date(data.updatedAt).toISOString()
      : pubDate;

    return {
      slug,
      title: data.title || '无标题',
      description: data.description || '',
      pubDate,
      tags: Array.isArray(data.tags) ? data.tags : [],

      // 🔥 自动统计
      wordCount,
      readingTime,

      // 🔥 控制字段
      hidden: !!data.hidden,
      pin: typeof data.pin === 'number' ? data.pin : 0,
      updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : undefined,

      // 🔥 状态
      status: data.status,
      statusConfig,

      // 🔥 原有字段
      icon: data.icon || 'fa-solid fa-feather-pointed',
      iconColor: data.iconColor || 'var(--vp-c-text-3)',
      category: data.category || '未分类',

      body,
      headings: extractHeadings(body),
    };
  } catch (e) {
    console.error(`Error loading post ${slug}:`, e);
    return null;
  }
}

/**
 * 🔥 新增：获取可见文章（用于博客列表页，自动过滤隐藏 + 排序）
 */
export async function getVisiblePosts(): Promise<Post[]> {
  return getAllPosts({ includeHidden: false });
}

/**
 * 🔥 新增：获取带状态过滤的文章
 */
export async function getPostsByStatus(statusFilter: string): Promise<Post[]> {
  const all = await getAllPosts({ includeHidden: false });
  return all.filter(post => {
    if (!post.statusConfig || post.statusConfig.length === 0) return false;
    if (typeof statusFilter === 'string') {
      return post.statusConfig.some(status => status.icon === statusFilter || status.text === statusFilter);
    }
    return true;
  });
}