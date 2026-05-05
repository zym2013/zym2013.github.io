// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 定义 lab 集合
const lab = defineCollection({
  // 使用 glob loader 加载 src/content/lab 下的所有 .md/.mdx 文件
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lab' }),
  
  // 定义 Schema (数据结构校验)
  schema: z.object({
    title: z.string(),
    shortDesc: z.string(),
    fullDesc: z.string().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    tags: z.array(z.string()),
    category: z.string(),
    keywords: z.array(z.string()).optional(),
    links: z.array(
      z.object({
        name: z.string(),
        url: z.string()
      })
    ).optional(),
    draft: z.boolean().default(false),
  }),
});

// 导出所有集合
export const collections = {
  lab,
  // 如果你有 blog，也可以这样定义：
  // blog: defineCollection({
  //   loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  //   schema: z.object({ ... })
  // }),
};