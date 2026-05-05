---
title: "ASPH 入门教程"
description: "本文教你使用 ASPH 半小时制作一个属于你自己的静态博客。"
pubDate: "2026-05-02"
tags: ["ASPH", "Blog"]
category: "ASPH"
status: [hot, check]
pin: 99
---

:::warning{open}
本博客仅支持在 Windows 系统编写。
:::

## 准备

### Node.js

下载 [Node.js](https://nodejs.org/en/download/current)。

:::info[加速链接]{open}
提供 [蓝奏云网盘链接](https://zym2013.lanzouq.com/ix1eh36upmna) 加速下载。
:::

### CMD 的使用

给小白看的，可以直接跳过。

:::info[CMD 的使用]
1. `Win + R`，输入 `cmd` 即可打开。
2. 输入 `d:` 切换至 D 盘。
3. 输入 `cd d:/xxx/xxx` 切换当前目录。
4. 一次输一行。
:::

### NPM

CMD 内输入 `npm -v`，应该输出一个类似 `10.9.3` 的版本号。

:::info[如果没有输出版本号怎么办？]
右键单击 `此电脑`，在显示的菜单里点击 `属性`，此时会打开系统设置窗口，点击的 `高级系统设置`，在弹出的系统属性小窗口点击 `环境变量(N)...`。

选择系统变量里的Path变量，选中，点击 `编辑` 按钮。

在打开的窗口里查看是否有 `Node.js` 的安装目录，如果没有，点击新建按钮，把 `Node.js` 的安装目录复制一份，然后点击 `确定` 按钮，再次在 CMD 内测试 `npm -v`。

如果还不行，可以 [搜一下](https://cn.bing.com/search?qs=UT&pq=%e4%b8%8b%e8%bd%bdnodejs&sk=CSYN1CT1MT1LT1UT2&sc=13-8&pglt=161&q=%E4%B8%8B%E8%BD%BDnodejs%E5%90%8E%E8%BE%93%E5%85%A5%E4%BB%BB%E4%BD%95npm%E5%91%BD%E4%BB%A4%E6%97%A0%E5%8F%8D%E5%BA%94&cvid=c7eb4c092819425db375d33978c57b30&gs_lcrp=EgRlZGdlKgYIBRAAGEAyBggAEEUYOTIGCAEQABhAMgYIAhAAGEAyBggDEAAYQDIGCAQQABhAMgYIBRAAGEAyBggGEAAYQDIGCAcQABhAMgYICBAAGEDSAQg5MzI4ajBqMagCALACAA&FORM=ANNTA1&PC=CNNDDB)。
:::

输入下面代码：

```bash
npm config set registry https://registry.npmmirror.com/
```

:::warning{open}
本博客只支持 `pnpm`。

不建议使用 Git Bash 等使用 Mintty 的工具。
:::

接下来无特殊说明都是在 CMD 内输入。

## 下载 PNPM

输入：

```bash
npm i -g pnpm
```

稍等片刻后会有类似于下面的结果：

理想输出：

```bash
D:\>npm i -g pnpm@10.33.0

changed 1 package in 3s

1 package is looking for funding
  run `npm fund` for details
```

再输入：

```bash
pnpm setup
```

等它弄完，关闭 CMD，重新开一个（目录保持不变）。

## 准备包

选好文件夹（例如 `D:\test`），CMD 切换至该文件夹目录。

CMD 输入：

```
pnpm i @zhangyimin12345/asph
```

理想输出：

```bash
d:\test>pnpm i @zhangyimin12345/asph
 WARN  Request took 26280ms: https://registry.npmjs.org/postcss
Packages: +298
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 372, reused 299, downloaded 1, added 298, done

dependencies:
+ @zhangyimin12345/asph 1.0.5

╭ Warning ───────────────────────────────────────────────────────────────────────────────────╮
│                                                                                            │
│   Ignored build scripts: esbuild@0.27.7, sharp@0.34.5.                                     │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.   │
│                                                                                            │
╰────────────────────────────────────────────────────────────────────────────────────────────╯
Done in 41.2s using pnpm v10.33.2
```

发现有个警告，按照它所说的输入：

```bash
pnpm approve-builds
```

按 `A`，回车，再按 `Y`，再回车。

## 复刻模板

输入：

```bash
pnpm asph init my-blog
```

其中的 `my-blog` 可以替换为其他值。

根据中文提示完成初始化（选择立即安装依赖）。

理想输出：

```bash
d:\test>pnpm asph init my-blog
T  初始化 ASPH 项目
|
o  [SUCC] 模板复制完成。
|
•  [LOG] 已更新 package.json 项目名称。
|
o  [QUES] 是否立即安装依赖？
|  Yes
|
•  [LOG] 使用 pnpm 安装依赖...
Lockfile is up to date, resolution step is skipped
Packages: +445
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 445, reused 445, downloaded 0, added 445, done

dependencies:
+ @astrojs/rss 4.0.18
+ @astrojs/vue 6.0.1
+ @fortawesome/fontawesome-free 7.2.0
+ @olets/markdown-it-wrapperless-fence-rule 1.2.1
+ @shikijs/colorized-brackets 4.0.2
+ @shikijs/markdown-it 4.0.2
+ @shikijs/rehype 4.0.2
+ @shikijs/transformers 4.0.2
+ @shikijs/twoslash 4.0.2
+ @shikijs/types 4.0.2
+ astro 6.1.8
+ git 0.1.5
+ github-slugger 2.0.0
+ gray-matter 4.0.3
+ hast 1.0.0
+ hast-util-to-string 3.0.1
+ jinrishici 1.0.6
+ js-yaml 4.1.1
+ katex 0.16.45
+ markdown-it 14.1.1
+ markdown-it-anchor 9.2.0
+ markdown-it-container 4.0.0
+ markdown-it-footnote 4.0.0
+ markdown-it-link-attributes 4.0.1
+ markdown-it-mark 4.0.0
+ markdown-it-math 5.2.1
+ markdown-it-task-lists 2.1.1
+ mdast 3.0.0
+ nprogress 0.2.0
+ rehype-autolink-headings 7.1.0
+ rehype-katex 7.0.1
+ rehype-shiki 0.0.9
+ rehype-slug 6.0.0
+ rehype-stringify 10.0.1
+ remark 15.0.1
+ remark-directive 4.0.0
+ remark-html 16.0.1
+ remark-math 6.0.0
+ remark-parse 11.0.0
+ remark-rehype 11.1.2
+ shiki 4.0.2
+ typed.js 3.0.0
+ unified 11.0.5
+ unist 0.0.1
+ unist-util-visit 5.1.0
+ vue 3.5.33
+ wavesurfer.js 7.12.6

devDependencies:
+ @types/js-yaml 4.0.9
+ @types/markdown-it 14.1.2
+ rimraf 6.1.3

Done in 6.8s using pnpm v10.33.0
|
*  [SUCC] 依赖安装完成。
|
o  感谢使用 ASPH -------------------------+
|                                         |
|  \\\\ _      ____    ____    _   _      |
|      / \    / ___|  |  _ \  | | | |     |
|     / _ \   \___ \  | |_)|  | |_| |     |
|    / ___ \   ___)|  |  __/  |  _  |     |
|   /_/   \_\ |____/  |_|     |_| |_|     |
|                                   \\\\  |
|                                         |
|       便捷、快速、美观的博客框架。      |
|                                         |
|     Build With Astro + Vite + Vue.      |
|                                         |
+-----------------------------------------+
|
—  [SUCC] 初始化完成！

|
o  快速开始 ----------------------+
|                                 |
|  $ cd my-blog                   |
|  $ asph dev  # 本地预览         |
|  $ asph build # 构建生产版本    |
|  $ asph preview # 预览生产版本  |
|                                 |
+---------------------------------+
|
|  [INFO] 如未自动退出请按 Ctrl + C 退出 ~

d:\test>
```

输入 `快速开始` 中给你的第一个指令：（你用的其它文件夹名字的话记得改）

```bash
cd my-blog
```

## 修改配置

进入文件夹，完善 `/src/config/home.yaml` 与 `/src/config/topbar.yaml`。

:::warning{open}
1. 注意 YAML 转义。
2. 换行请使用 `\n`
:::

再打开 `astro.config.mjs`，将 `export default defineConfig` 中的 `site` 与 `base` 字段修改。

## 本地预览

输入：

```bash
asph dev
```

理想输出：

```bash
d:\test\my-blog>asph dev
|
•  [LOG] 检测到包管理器: pnpm
√ [SUCC] 开发服务器已转接
|
|  [INFO] 按 Ctrl + C 停止服务器

> my-blog@0.0.1 dev D:\test\my-blog
> rimraf .astro && rimraf node_modules/.vite && astro dev "--port" "4321" "--host" "localhost"

[vite] connected.
15:29:52 [types] Generated 1ms
15:29:52 [WARN] [content] Content config not loaded
 astro  v6.1.8 ready in 1858 ms
┃ Local    http://localhost:4321/
15:29:52 watching for file changes...

 update  ▶ New version of Astro available: 6.2.1
  Run pnpm dlx @astrojs/upgrade to update

```

当出现类似 `http://localhost:4321/` 的网址时，打开它，就可以本地预览了。

:::info{open}
本地服务器较慢，请耐性等待。

本地慢并不意味着部署后慢。
:::

## 构建生产版本

```bash
asph build
```

## 预览生产版本

```bash
asph preview
```

## 部署

先确保你安装了 Git，如果没有，请输入：

```bash
pnpm i -g git
```

### 基本设置

在 Github 上创建好了仓库后，设置基本信息。

```bash
git config user.name "你的 Github 用户名"
git config user.email "你的 Github 绑定的邮箱"
git remote add origin https://github.com/你的 Github 用户名/要部署的仓库.git
git init
git add .
git commit -m "你想要的发布的名字"
```

如果要部署在类似 `用户名.github.io` 上，那么 `要部署的仓库` 就是 `你的 Github 用户名.github.io`。

### 开始部署

#### 快速版本

:::warning
我们正在尝试使用 PAT 让博客变得动态化。

所以此方案将会在未来的版本变得不适用。

如果您只想快速部署静态博客，请使用此方案。
:::

输入：

```bash
asph deploy
```

#### Github Actions

前往 Github 仓库，在 `Code` 一栏中找到 `Settings`，打开它，在左侧边栏中找到 `Pages`，点击它。

在 `Build and deployment` 板块下的 `Source`，将它改为 `Github Actions`。

回到项目根目录（例如 `D:\test\my-blog`，不是 `D:\test\`）。

创建 `.github/workflows/deploy.yml`。

```yaml
# .github/workflows/deploy.yml
name: Deploy Astro to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install pnpm via npm
        run: npm install -g pnpm@10.30.0

      - name: Configure Git to use HTTPS
        run: |
          git config --global url."https://github.com/".insteadOf git@github.com:
          git config --global url."https://".insteadOf git://
      
      - name: Install dependencies
        run: pnpm install  --ignore-scripts  --frozen-lockfile

      - name: Build
        run: pnpm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

随后输入：

```bash
pnpm bgh
```

## 补充：node_modules 的重装

请使用：

```bash
pnpm i --ignore-scripts
```

而不是

```bash
pnpm i
```