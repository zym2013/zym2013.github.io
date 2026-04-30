import MarkdownIt from 'markdown-it';
import { createHighlighter } from 'shiki';
import { transformerTwoslash } from '@shikijs/twoslash';
import mdTaskLists from 'markdown-it-task-lists';
import mdContainer from 'markdown-it-container';
import mdAnchor from 'markdown-it-anchor';
import mdLinkAttributes from 'markdown-it-link-attributes';

export interface MarkdownRenderOptions {
  allowHtml?: boolean;
  linkify?: boolean;
  breaks?: boolean;
}

export async function createMarkdownRenderer(options: MarkdownRenderOptions = {}) {
  const {
    allowHtml = true,
    linkify = true,
    breaks = false,
  } = options;

  // 👇 创建 Shiki 高亮器（移除类型导入，直接用字符串）
  const shiki = await createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: [
      'typescript', 'javascript', 'python', 'bash',
      'json', 'yaml', 'markdown', 'diff', 'cpp', 'html', 'css', 'vue', 'astro'
    ],
  });

  // 👇 初始化 markdown-it
  const md = new MarkdownIt({
    html: allowHtml,
    linkify: linkify,
    typographer: true,
    breaks: breaks,

    // 👇 自定义高亮函数（集成 Shiki + Twoslash）
    highlight: (code: string, lang: string = '', attrs: string = '') => {
      // 解析代码块属性（如 {1,3-5} 行高亮）
      const linesAttr = attrs.match(/\{([\d,-]+)\}/)?.[1];

      return shiki.codeToHtml(code, {
        lang: lang || 'text',
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        defaultColor: false, // 让 CSS 变量控制主题
        transformers: [
          // 👇 Twoslash：TypeScript 悬浮类型提示（只在标记 twoslash 时启用）
          transformerTwoslash({
            explicitTrigger: /\btwoslash\b/,
            rendererRich: {
              jsdoc: true,
              hoverBasic: true,
              errorRendering: 'hover',
            },
            twoslashOptions: {
              compilerOptions: {
                target: 'ES2020',
                module: 'ESNext',
                lib: ['ES2020', 'DOM'],
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
              },
            },
          }),
          // 👇 行高亮支持（解析 {1,3-5}）
          {
            name: 'shiki:line-highlight',
            code(code) {
              if (!linesAttr) return;
              const lines = linesAttr.split(',').flatMap((range: string) => {
                if (range.includes('-')) {
                  const [start, end] = range.split('-').map(Number);
                  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
                }
                return [Number(range)];
              });
              return {
                ...code,
                children: code.children?.map((line: any, idx: number) => {
                  const lineNum = idx + 1;
                  if (lines.includes(lineNum)) {
                    return {
                      ...line,
                      properties: {
                        ...line.properties,
                        class: `${line.properties?.class || ''} highlight`.trim(),
                      },
                    };
                  }
                  return line;
                }),
              };
            },
          },
        ],
      });
    },
  });

  // 👇 启用插件
  md.use(mdTaskLists, { enabled: true, label: true });

  md.use(mdContainer, 'warning', {
    render: (tokens: any[], idx: number) => {
      return tokens[idx].nesting === 1
        ? '<div class="custom-block warning">\n'
        : '</div>\n';
    },
  });

  md.use(mdContainer, 'tip', {
    render: (tokens: any[], idx: number) => {
      return tokens[idx].nesting === 1
        ? '<div class="custom-block tip">\n'
        : '</div>\n';
    },
  });

  // 标题锚点配置
  md.use(mdAnchor, {
    permalink: mdAnchor.permalink.linkAfterHeader({
      style: 'visually-hidden',  // 👈 关键修复：改为 'visually-hidden'（原 'aria-hidden' 无效）
      assistiveText: (title: string) => `锚点链接: ${title}`,
      visuallyHiddenClass: 'anchor-link',
      symbol: '#',
    }),
  });

  md.use(mdLinkAttributes, {
    matcher: (link: string) => /^https?:\/\//.test(link),
    attrs: {
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  });

  // 👇 数学公式标记（保留 $ 符号，前端用 KaTeX 渲染）
  md.inline.ruler.after('text', 'math_inline', (state, silent) => {
    const pos = state.pos;
    if (state.src.charCodeAt(pos) !== 0x24) return false;
    const end = state.src.indexOf('$', pos + 1);
    if (end === -1) return false;
    if (silent) return true;
    const content = state.src.slice(pos + 1, end);
    const token = state.push('math_inline', 'math', 0);
    token.content = content;
    token.markup = '$';
    state.pos = end + 1;
    return true;
  });

  md.renderer.rules.math_inline = (tokens, idx) => {
    return `<span class="math-inline">\\(${tokens[idx].content}\\)</span>`;
  };

  md.block.ruler.after('paragraph', 'math_block', (state, startLine, endLine, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    if (state.src.charCodeAt(pos) !== 0x24 || state.src.charCodeAt(pos + 1) !== 0x24) return false;
    if (silent) return true;
    let nextLine = startLine + 1;
    while (nextLine < endLine) {
      const checkPos = state.bMarks[nextLine] + state.tShift[nextLine];
      if (state.src.charCodeAt(checkPos) === 0x24 && state.src.charCodeAt(checkPos + 1) === 0x24) break;
      nextLine++;
    }
    const content = state.getLines(startLine + 1, nextLine, state.blkIndent, true).trim();
    const token = state.push('math_block', 'math', 0);
    token.content = content;
    token.map = [startLine, nextLine + 1];
    token.markup = '$$';
    state.line = nextLine + 1;
    return true;
  });

  md.renderer.rules.math_block = (tokens, idx) => {
    return `<div class="math-block">\\[${tokens[idx].content}\\]</div>`;
  };

  return { md, shiki };
}