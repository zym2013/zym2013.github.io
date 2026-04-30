// src/lib/shiki-meta-highlight.ts
import type { ShikiTransformer } from '@shikijs/types';

export function transformerMetaHighlight(): ShikiTransformer {
  return {
    name: 'meta-highlight',
    code(code) {
      // 获取 meta 字符串，例如 "js{1,3-5}"
      const meta = this.meta?.__raw || '';
      const match = meta.match(/\{([\d,-]+)\}/);
      
      if (match) {
        const linesToHighlight = match[1].split(',').flatMap(part => {
          const range = part.split('-');
          if (range.length === 2) {
            const start = parseInt(range[0]);
            const end = parseInt(range[1]);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
          }
          return parseInt(part);
        });

        // 遍历代码行的子节点（通常是 span.line）
        // 注意：Shiki 生成的结构可能是 <span class="line">...</span>
        if (code.children) {
          code.children.forEach((lineNode, index) => {
            // Shiki 的行号是从 1 开始的，但数组索引从 0 开始
            // 另外，lineNumbers: true 时，第一行可能是行号元素，需根据实际结构调整
            // 通常 lineNode 是 element，且 tagName 为 'span'，class 包含 'line'
            
            // 假设 lineNode 是直接子元素
            if (linesToHighlight.includes(index + 1)) {
               // 确保 lineNode 是 Element
               if (typeof lineNode === 'object' && 'properties' in lineNode) {
                 const props = (lineNode as any).properties || {};
                 props.class = (props.class || '') + ' highlighted';
                 (lineNode as any).properties = props;
               }
            }
          });
        }
      }
    },
  };
}