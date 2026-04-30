// src/lib/remark-code-group.ts
import { visit } from 'unist-util-visit';
import type { Parent, Node } from 'unist';
import type { Code } from 'mdast';

export function remarkCodeGroup() {
  return (tree: Parent) => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'code-group') return;

      const data = node.data || (node.data = {});
      
      // 1. 标记为 div，类名为 vp-code-group
      data.hName = 'div';
      data.hProperties = {
        class: 'vp-code-group',
      };

      // 2. 处理子节点（通常是多个 code 块）
      if (node.children) {
        let activeIndex = 0;
        
        node.children.forEach((child: any, index: number) => {
          if (child.type === 'code') {
            // 提取标题：优先从 meta [title] 获取，否则用语言名
            const meta = child.meta || '';
            const titleMatch = meta.match(/\[(.*?)\]/);
            const title = titleMatch ? titleMatch[1] : (child.lang || 'Code');
            
            // 初始化 data
            child.data = child.data || {};
            child.data.hProperties = child.data.hProperties || {};
            
            // 添加自定义属性用于前端识别
            child.data.hProperties['data-title'] = title;
            child.data.hProperties['data-lang'] = child.lang;
            child.data.hProperties['class'] = 'vp-code-block';
            
            // 第一个默认激活
            if (index === 0) {
              child.data.hProperties['active'] = '';
            }
          }
        });
      }
    });
  };
}