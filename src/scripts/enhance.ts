// src/scripts/enhance.ts

// 🔽 文件扩展名映射表：语言标识符 -> 标准文件后缀
const FILE_EXT_MAP: Record<string, string> = {
  // ========== 基础编程语言 ==========
  abap: 'abap',
  actionscript: 'as',
  'actionscript-3': 'as',
  ada: 'adb',
  'angular-html': 'html',
  'angular-ts': 'ts',
  apache: 'conf',
  apex: 'cls',
  apl: 'apl',
  applescript: 'scpt',
  ara: 'ara',
  asciidoc: 'adoc',
  adoc: 'adoc',
  asm: 'asm',
  astro: 'astro',
  awk: 'awk',
  ballierina: 'bal',
  bat: 'bat',
  batch: 'bat',
  beancount: 'beancount',
  berry: 'be',
  be: 'be',
  bibtex: 'bib',
  bicep: 'bicep',
  blade: 'blade.php',
  bsl: 'bsl',
  '1c': 'bsl',
  c: 'c',
  c3: 'c3',
  cadence: 'cdc',
  cdc: 'cdc',
  cairo: 'cairo',
  clarity: 'clar',
  clojure: 'clj',
  clj: 'clj',
  cmake: 'cmake',
  cobol: 'cob',
  codeowners: 'CODEOWNERS',
  codeql: 'ql',
  ql: 'ql',
  coffee: 'coffee',
  coffeescript: 'coffee',
  'common-lisp': 'lisp',
  lisp: 'lisp',
  coq: 'v',
  cpp: 'cpp',
  'c++': 'cpp',
  crystal: 'cr',
  csharp: 'cs',
  'c#': 'cs',
  cs: 'cs',
  css: 'css',
  csv: 'csv',
  cue: 'cue',
  cypher: 'cyp',
  cql: 'cyp',
  d: 'd',
  dart: 'dart',
  dax: 'dax',
  desktop: 'desktop',
  diff: 'diff',
  docker: 'Dockerfile',
  dockerfile: 'Dockerfile',
  dotenv: 'env',
  'dream-maker': 'dm',
  edge: 'edge',
  elixir: 'ex',
  elm: 'elm',
  'emacs-lisp': 'el',
  elisp: 'el',
  erb: 'erb',
  erlang: 'erl',
  erl: 'erl',
  fennel: 'fnl',
  fish: 'fish',
  fluent: 'ftl',
  ftl: 'ftl',
  'fortran-fixed-form': 'f',
  ffor: 'f',
  f77: 'f',
  'fortran-free-form': 'f90',
  f90: 'f90',
  f95: 'f95',
  f03: 'f03',
  f08: 'f08',
  f18: 'f18',
  fsharp: 'fs',
  'f#': 'fs',
  fs: 'fs',
  gdresource: 'tres',
  tscn: 'tscn',
  tres: 'tres',
  gdscript: 'gd',
  gd: 'gd',
  gdshader: 'gdshader',
  genie: 'gs',
  gherkin: 'feature',
  'git-commit': 'COMMIT_EDITMSG',
  'git-rebase': 'git-rebase-todo',
  gleam: 'gleam',
  'glimmer-js': 'gjs',
  gjs: 'gjs',
  'glimmer-ts': 'gts',
  gts: 'gts',
  glsl: 'glsl',
  gn: 'gn',
  gnuplot: 'gp',
  go: 'go',
  graphql: 'graphql',
  gql: 'gql',
  groovy: 'groovy',
  hack: 'hack',
  haml: 'haml',
  handlebars: 'hbs',
  hbs: 'hbs',
  haskell: 'hs',
  hs: 'hs',
  haxe: 'hx',
  hcl: 'hcl',
  hjson: 'hjson',
  hlsl: 'hlsl',
  html: 'html',
  'html-derivative': 'html',
  http: 'http',
  hurl: 'hurl',
  hxml: 'hxml',
  hy: 'hy',
  imba: 'imba',
  ini: 'ini',
  properties: 'properties',
  java: 'java',
  javascript: 'js',
  js: 'js',
  cjs: 'cjs',
  mjs: 'mjs',
  jinja: 'jinja',
  jison: 'jison',
  json: 'json',
  json5: 'json5',
  jsonc: 'json',
  jsonl: 'jsonl',
  jsonnet: 'jsonnet',
  jssm: 'jssm',
  fsl: 'fsl',
  jsx: 'jsx',
  julia: 'jl',
  jl: 'jl',
  kdl: 'kdl',
  kotlin: 'kt',
  kt: 'kt',
  kts: 'kts',
  kusto: 'csl',
  kql: 'csl',
  latex: 'tex',
  lean: 'lean',
  lean4: 'lean',
  less: 'less',
  liquid: 'liquid',
  llvm: 'll',
  log: 'log',
  logo: 'logo',
  lua: 'lua',
  luau: 'luau',
  make: 'Makefile',
  makefile: 'Makefile',
  markdown: 'md',
  md: 'md',
  marko: 'marko',
  matlab: 'm',
  mdc: 'mdc',
  mdx: 'mdx',
  mermaid: 'mmd',
  mmd: 'mmd',
  mipsasm: 's',
  mips: 's',
  mojo: 'mojo',
  moonbit: 'mbt',
  mbt: 'mbt',
  mbti: 'mbt',
  move: 'move',
  narrat: 'nar',
  nar: 'nar',
  nextflow: 'nf',
  nf: 'nf',
  nginx: 'conf',
  nim: 'nim',
  nix: 'nix',
  nushell: 'nu',
  nu: 'nu',
  'objective-c': 'm',
  objc: 'm',
  'objective-cpp': 'mm',
  ocaml: 'ml',
  odin: 'odin',
  openscad: 'scad',
  scad: 'scad',
  pascal: 'pas',
  perl: 'pl',
  php: 'php',
  pkl: 'pkl',
  plsql: 'pls',
  po: 'po',
  pot: 'pot',
  potx: 'pot',
  polar: 'polar',
  postcss: 'pcss',
  powerquery: 'pq',
  powershell: 'ps1',
  ps: 'ps1',
  ps1: 'ps1',
  prisma: 'prisma',
  prolog: 'pro',
  proto: 'proto',
  protobuf: 'proto',
  pug: 'pug',
  jade: 'pug',
  puppet: 'pp',
  purescript: 'purs',
  python: 'py',
  py: 'py',
  qml: 'qml',
  qmldir: 'qmldir',
  qss: 'qss',
  r: 'r',
  racket: 'rkt',
  raku: 'raku',
  perl6: 'raku',
  razor: 'cshtml',
  reg: 'reg',
  regexp: 'regex',
  regex: 'regex',
  rel: 'rel',
  riscv: 's',
  ron: 'ron',
  rosmsg: 'msg',
  rst: 'rst',
  ruby: 'rb',
  rb: 'rb',
  rust: 'rs',
  rs: 'rs',
  sas: 'sas',
  sass: 'sass',
  scala: 'scala',
  scheme: 'scm',
  scss: 'scss',
  sdbl: 'sdbl',
  '1c-query': 'sdbl',
  shaderlab: 'shader',
  shader: 'shader',
  shellscript: 'sh',
  bash: 'sh',
  sh: 'sh',
  shell: 'sh',
  zsh: 'sh',
  shellsession: 'sh',
  console: 'log',
  smalltalk: 'st',
  solidity: 'sol',
  soy: 'soy',
  'closure-templates': 'soy',
  sparql: 'sparql',
  splunk: 'spl',
  spl: 'spl',
  sql: 'sql',
  'ssh-config': 'ssh_config',
  stata: 'do',
  stylus: 'styl',
  styl: 'styl',
  surrealql: 'surql',
  surql: 'surql',
  svelte: 'svelte',
  swift: 'swift',
  'system-verilog': 'sv',
  systemd: 'service',
  talonscript: 'talon',
  talon: 'talon',
  tasl: 'tasl',
  tcl: 'tcl',
  templ: 'templ',
  terraform: 'tf',
  tf: 'tf',
  tfvars: 'tfvars',
  tex: 'tex',
  toml: 'toml',
  'ts-tags': 'ts',
  lit: 'ts',
  tsv: 'tsv',
  tsx: 'tsx',
  turtle: 'ttl',
  twig: 'twig',
  typescript: 'ts',
  ts: 'ts',
  cts: 'cts',
  mts: 'mts',
  typespec: 'tsp',
  tsp: 'tsp',
  typst: 'typ',
  typ: 'typ',
  v: 'v',
  vala: 'vala',
  vb: 'vb',
  cmd: 'bat',
  verilog: 'v',
  vhdl: 'vhd',
  viml: 'vim',
  vim: 'vim',
  vimscript: 'vim',
  vue: 'vue',
  'vue-html': 'vue',
  'vue-vine': 'vue',
  vyper: 'vy',
  vy: 'vy',
  wasm: 'wasm',
  wenyan: 'wy',
  '文言': 'wy',
  wgsl: 'wgsl',
  wikitext: 'wiki',
  mediawiki: 'wiki',
  wiki: 'wiki',
  wit: 'wit',
  wolfram: 'wl',
  wl: 'wl',
  xml: 'xml',
  xsl: 'xsl',
  yaml: 'yaml',
  yml: 'yaml',
  zenscript: 'zs',
  zig: 'zig',
};

// 🔧 增强型后缀获取函数（处理映射、清理、降级）
export function getFileExtension(rawLang: string | null | undefined): string {
  if (!rawLang || rawLang === 'text') return 'txt';

  // 1. 精确匹配
  if (rawLang in FILE_EXT_MAP) return FILE_EXT_MAP[rawLang];

  // 2. 小写匹配
  const lower = rawLang.toLowerCase();
  if (lower in FILE_EXT_MAP) return FILE_EXT_MAP[lower];

  // 3. 清理特殊字符（确保文件名安全）
  let clean = lower
    .replace(/\+\+/g, 'pp')      // c++ -> cpp
    .replace(/#/g, 'sharp')      // c# -> csharp
    .replace(/[^a-z0-9._-]/g, '') // 移除非法字符
    .replace(/\./g, '');          // 移除点号避免多级扩展名

  // 如果清理后为空或过短，返回默认值
  if (!clean || clean.length < 2) return 'txt';

  return clean;
}

function getLangInfo(pre: HTMLElement) {
  const display = pre.getAttribute('data-language') || 'Code';
  const raw = pre.getAttribute('data-lang') || 'txt';
  const ext = FILE_EXT_MAP[raw] || FILE_EXT_MAP[raw.toLowerCase()] || raw;
  return { display, ext };
}

export function initCodeGroups() {
  const groups = document.querySelectorAll('.vp-code-group');
  
  groups.forEach(group => {
    // 1. 获取所有代码块容器 (.code-block-wrapper 是 enhance.ts 包裹后的结构)
    // 注意：如果 Shiki 直接渲染在 pre 上，可能需要调整选择器
    const wrappers = Array.from(group.querySelectorAll('.code-block-wrapper'));
    
    if (wrappers.length < 2) return; // 少于2个不生成 Tabs

    // 2. 创建 Tabs 头部
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs';
    
    wrappers.forEach((wrapper, index) => {
      const pre = wrapper.querySelector('pre.shiki');
      if (!pre) return;

      // 👇 关键：直接从 pre 标签获取 Shiki 注入的语言名称
      // 之前 transformerAddLanguage 已经注入了 data-language="JavaScript"
      let title = pre.getAttribute('data-language') || 'Code';
      
      // 如果 data-tabs 属性存在且有效，优先使用它（允许用户自定义标题）
      try {
        const customTabs = JSON.parse(group.getAttribute('data-tabs') || '[]');
        if (customTabs[index]) {
          title = customTabs[index];
        }
      } catch (e) {}

      // 为每个 wrapper 添加标识类，方便控制显隐
      wrapper.classList.add('vp-code-block');
      if (index === 0) wrapper.classList.add('active');

      // 创建 Tab 按钮
      const tab = document.createElement('div');
      tab.className = `tab ${index === 0 ? 'active' : ''}`;
      tab.textContent = title;
      
      // 点击事件
      tab.addEventListener('click', () => {
        // 切换 Tab 样式
        tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // 切换代码块显示
        group.querySelectorAll('.vp-code-block').forEach(b => b.classList.remove('active'));
        wrapper.classList.add('active');
      });
      
      tabsContainer.appendChild(tab);
    });

    // 3. 将 Tabs 插入到 Code Group 的最前面
    group.insertBefore(tabsContainer, group.firstChild);
  });
}
export function initCodeBlocks() {
  const pres = document.querySelectorAll('pre.shiki:not([data-enhanced])');

  pres.forEach((pre) => {
    pre.setAttribute('data-enhanced', 'true');

    // 👇 获取分离的语言信息
    const { display, ext } = getLangInfo(pre);
    const lines = pre.querySelectorAll('.line').length;
    const isLongCode = lines > 25;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    if (isLongCode) wrapper.classList.add('collapsed');

    const header = document.createElement('div');
    header.className = 'code-header';
    header.innerHTML = `
      <div class=header-left">
        <i class="fa-solid fa-chevron-right header-chevron"></i>
        <span class="filename">${display}</span>
      </div>
      <div class="code-actions">
        <button class="code-btn copy-btn" type="button" title="复制"><i class="fa-regular fa-copy"></i></button>
        <button class="code-btn download-btn" type="button" title="下载"><i class="fa-solid fa-download"></i></button>
      </div>
    `;

    if (pre.parentNode) pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);

    if (isLongCode) {
      const footerIndicator = document.createElement('div');
      footerIndicator.className = 'code-footer-indicator';
      footerIndicator.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
      wrapper.appendChild(footerIndicator);
    }

    // A. 点击 Header 折叠/展开
    header.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.code-btn')) return;
      toggleCollapse(wrapper);
    });

    // B. 点击底部指示器折叠/展开
    const footerInd = wrapper.querySelector('.code-footer-indicator');
    footerInd?.addEventListener('click', () => {
      toggleCollapse(wrapper);
    });

    // 复制逻辑
    const copyBtn = wrapper.querySelector('.copy-btn');
    const codeText = pre.innerText;
    copyBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(codeText).then(() => {
        const icon = copyBtn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-check';
          setTimeout(() => icon.className = 'fa-regular fa-copy', 2000);
        }
      });
    });

    // 👇 下载逻辑：使用 ext 确保后缀正确
    const downloadBtn = wrapper.querySelector('.download-btn');
    downloadBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const rawLang = pre.getAttribute('data-lang') || 'txt';
      const ext = getFileExtension(rawLang); // ✅ 使用增强函数

      const blob = new Blob([codeText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code.${ext}`; // code.cpp, code.js, code.Dockerfile
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });
}

function toggleCollapse(wrapper: HTMLElement) {
  const isCollapsed = wrapper.classList.contains('collapsed');
  if (isCollapsed) {
    wrapper.classList.remove('collapsed');
  } else {
    wrapper.classList.add('collapsed');
  }
}

export function initOnlineHtml() {
  const cards = document.querySelectorAll('.online-html-card:not([data-enhanced])');
  cards.forEach(card => {
    card.setAttribute('data-enhanced', 'true');
    const btn = card.querySelector('.online-html-preview-btn') as HTMLButtonElement;
    const iframe = card.querySelector('.preview-frame') as HTMLIFrameElement;
    const src = card.getAttribute('data-src');
    if (btn && iframe && src) {
      btn.addEventListener('click', () => {
        if (iframe.style.display === 'none' || iframe.style.display === '') {
          iframe.src = src;
          iframe.style.display = 'block';
          btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> 隐藏预览';
        } else {
          iframe.style.display = 'none';
          btn.innerHTML = '<i class="fa-solid fa-play"></i> 预览效果';
        }
      });
    }
  });
}

if (typeof document !== 'undefined') {
  requestAnimationFrame(() => {
    initCodeBlocks();
    initCodeGroups();
    initOnlineHtml();
  });
}