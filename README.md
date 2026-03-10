<div align="center">

<img src="./public/assets/favicon.png" alt="Petal Logo" width="120" />

# Petal Note

*风吹落的花瓣，和那些无处安放的碎碎念。*

[![MIT License](https://img.shields.io/badge/License-MIT-pink.svg?style=flat-square)](./LICENSE)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow?logo=javascript&style=flat-square)
![End-to-End Encryption](https://img.shields.io/badge/🔒%20End--to--End-AES--GCM-blue?style=flat-square)  
![No Build](https://img.shields.io/badge/Build-None-success.svg?style=flat-square)
![Deploy](https://img.shields.io/badge/Deploy-Shell_Script-blue.svg?style=flat-square&logo=gnubash&logoColor=white)
![Serverless](https://img.shields.io/badge/Architecture-Serverless-orange?style=flat-square&logo=serverless)  
![GitHub repo size](https://img.shields.io/github/repo-size/miniyu157/petal-note?style=flat-square&color=8e44ad&label=repo%20size)
![GitHub stars](https://img.shields.io/github/stars/miniyu157/petal-note?style=flat-square&color=f1c40f)
</div>

## 🌸 简介

Petal 是一个极简、唯美、无需任何构建工具链的纯前端日记/碎碎念框架。没有冗余的依赖，只需最纯粹的 HTML、TXT 和 TOML，即可在任何支持静态托管的平台上部署。

**[🌸 Live Demo 🌸](https://petal-note.vercel.app/)**

### ✨ 特性

* **文件驱动**: 所有数据均为人类可读的 TOML, TXT
* **无服务器**: 通过组合 Cloudflare Workers 与 R2, 将数据源设置为远程 URL, 即可实现非常丝滑的书写体验
* **自由随写**: 没有固定的时间戳格式与排序, 格式由你定义
* **隐私保障**: 敏感内容分发时采用端到端 AES-GCM 加密, 应用内解密
* **丝滑书写**: 配置仓库鉴权文件即可在网页启动内置的编辑器
* **私密日记**: 可配置秘密时间线, 外观上拥有更加沉浸的氛围
* **特殊语法**: 支持 Markdown 超链接与图片语法, 还支持**完备的自定义语法规则**
* **标签系统**: 自动提取正文首行的 `#标签` 并渲染过滤导航组件
* **体验优先**: 为人类优化交互体验, 例如未读系统, 鉴权记忆等

---

## 🌟 快速开始

无论如何部署，第一步都是在本地初始化你的个人配置和数据源

在一个空文件夹内，运行以下命令根据向导创建 Petal Note 数据模板

```bash
curl -fsSL https://raw.githubusercontent.com/miniyu157/petal-note/main/scripts/create-petal-app.sh | bash -e
```

### 方式一: ☘️ 传统静态托管

将整个文件夹托管到任意静态服务平台, 如 Cloudflare Pages, Vercel, GitHub Pages, 保留稳定的 HTML 骨架

### 方式二: 🍀 内容与框架分离 (推荐, 保持最新)

如果你希望外观和特性永远保持最新, 并与个人日记解耦

1. 在静态服务平台托管你的仓库, 无需放入 HTML 和任何加密文件
1. 在部署设置中, 将 **Build command** 设置为:

    ```bash
    curl -fsSL https://raw.githubusercontent.com/miniyu157/petal-note/e310ca1/scripts/build.sh | bash -e -s -- index.html syntax.toml petal-parser.js
    ```

    [提交 e310ca1 - build.sh](https://github.com/miniyu157/petal-note/commit/e310ca1)

1. 将构建输出目录 **Output Directory** 设置为 `public`

> [!NOTE]
> 如果希望手动配置语法文件, 而不是跟随仓库更新, 则去掉 **Build command** 末尾的 `syntax.toml`

这样, 你的仓库触发 `Deploy` 时, 都会自动拉取并注入最新版本的 Petal Note 骨架, 同时自动处理 **各种文件的加密** 与 **分发**, 个人内容仓库保持纯净

> 若想要仅更新骨架, 手动运行一次 `Redeploy`

### 方式三: 🍂 无服务器架构的终极解耦

提供了更加灵活的方式处理加密和内容更新  
具体请参考 [进阶部署指南](#-进阶部署指南) 章节

```plaintext
[repo1]                   [repo2]
  └── public                ├── data.txt
      └── config.toml   →   ├── editor.toml
                            └── private.txt
```

---

## 🪐 Petal Note 基础

如果选择第二种部署方式, 那么需要加密的文件, **都可以存储为明文** 在你的个人仓库中, 只需在静态托管平台设置了根目录为 `public/`

仓库中无需保留 HTML, 部署脚本会自动拉取最新版本的 petal-note 骨架, 并自动处理所有文件的加密

> [!WARNING]
> 不要将仓库设置为 public, 除非你想暴露所有的东西

> [!TIP]
> 如果不想让人轻易获取你的网站, 可以根据个人情况为网站  
> 添加 `x-robots-tag: noindex, nofollow` 标记

```plaintext
.
├── .env              // 密语文件, 包含需要加密的文件的密码
├── .gitignore
├── editor.toml       // 明文, 仓库信息与令牌
├── private.txt       // 明文, 秘密时间线
└── public  
    ├── config.toml   // 配置文件
    ├── data.txt      // 公开时间线
    └── assets
         ├── favicon.ico    // 图标资源
         ├── font.woff2     // 字体
         └── ...jpg         // 其他资源文件
```

**.env 格式示例:**

```sh
KEY_private_source="admin"
KEY_editor_config="admin"
PASSWORD=""
```

Build Command 脚本分发时优先使用 KEY_\<config_name\>, 否则回退到 PASSWORD

> 框架文件: index.html, editor.html, syntax.toml, petal-parser.js

### 📜 配置文件

用于定义站点的全局信息, 所有项均为可选  
资源文件均可以设置为网络 URL, 运行时将自动拉取

```toml
data_source = "./data.txt"

private_source = "./private.txt"
private_tip = "" # 回退: '输入轻语解锁梦境...'

editor_config = "./editor.toml"
editor_unlocktip = "" # 回退: '输入轻语解锁时序...'

home_url = "https://github.com/miniyu157/petal-note"
font = "./assets/font.woff2"

title = "Petal"
header_title = "Petal Note"
header_subtitle = """
风吹落的花瓣，和那些无处安放的碎碎念。
"""
icon = "./assets/favicon.ico"
theme_color = "#FFB6C1"
unread_empty_tip = "所有的花瓣都已读过了，去吹吹风吧。"

private_title = ""
private_header_title = ""
private_header_subtitle = ""
private_icon = ""
private_theme_color = ""
private_unread_empty_tip = ""

load_delay = 800   # ms
data_order = "asc" # [asc|desc]

syntax_config = "syntax.toml"
```

### 🐰 秘密时间线

当正确设置 `private_source` 后即可生效

因为没有时间戳等约定, 秘密时间线与公开时间线相互独立. 秘密时间线通过 **AES-GCM** 驱动, 密语匹配成功即可进入

个人仓库中无需手动上传加密文件, petal-note 提供了 `build.sh` 和 `cipher-thoughts.py` 等实用分发工具

### 📃 数据格式

使用 `---` 作为每条日记的分割线, 第一行渲染为每条碎碎念的时间戳

第二行及以下为正文, 正文第一行中所有的 `#tag` 将渲染为标签

```text
2026-02-18 19:40
#日记 #碎碎念 在这里种下一颗种子, 希望能开出温柔的花。
不问花期, 只愿过程静好。
---
2026-02-18 深夜
长内容会自动检测高度并在底部呈现渐隐折叠。
![猫咪图片](./assets/cat.jpeg)
```

---

## 🦉 编辑器

Petal Note 内置了一个编辑器, 通过 **GitHub Git Data REST API**（Blobs / Trees / Commits / Refs）实现仓库文件管理能力

正确设置 `editor_config` 后, 将在页面左下角显示一个淡淡的编辑器入口按钮, 密码通过 **SessionStorage** 传递, 也可以直接启动编辑器页面鉴权

editor_config 的值应为 AES-GCM 加密的 TOML 文件, 包含目标仓库信息, 帐号令牌等, 目前只支持连接 GitHub 仓库

明文格式如下, 将在应用内解锁, 解锁成功后打开编辑器

```toml
github_user = "user"
github_repo = "repo"
github_token = "github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

commit_msg = "web_editor: {{yyyy-mm-dd hh:mm:ss}}"
commit_user = "Web Editor"
commit_email = "example@mail.com"
```

编辑器允许直接上传图片, 需要配置一个接受 `PUT` 请求的图片上传 API, 并在 `[image]` 块中完成对应设置

```toml
[image]
api_url = "https://img-upload.example.com"
api_key = "xxxxxxxxxxxxxxxxx"
img_domain = "https://img.example.com"
default_dir = "images"
```

例如使用 **Cloudflare R2** 配合 **Workers** 搭建, 只需要创建一个 R2 存储桶和一个 Worker, 并在 Worker 中绑定你的存储桶, 需要设置以下两个变量

* **MY_BUCKET**: 位于 **绑定** 选项卡, 填入存储桶名称
* **UPLOAD_TOKEN**: 位于 **环境变量**, 可以使用以下命令生成

  ```console
  openssl rand -hex 32
  ```

  将结果填入, 对应配置文件中的 `api_key`

完成变量关联后, 将以下代码粘贴到 Workers 中并部署:

<details>
<summary><b>点击展开代码</b></summary>

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== 'PUT') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${env.UPLOAD_TOKEN}`;
    if (!authHeader || authHeader !== expectedAuth) {
      return new Response('Unauthorized: Invalid or missing token', { status: 401, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const objectName = decodeURIComponent(url.pathname.slice(1));
    if (!objectName) {
      return new Response('Bad Request: Missing file path in URL', { status: 400, headers: corsHeaders });
    }

    try {
      await env.MY_BUCKET.put(objectName, request.body, {
        httpMetadata: {
          contentType: request.headers.get('Content-Type') || 'application/octet-stream',
        }
      });

      const spaceEncodedPath = objectName.replace(/ /g, '%20');
      return new Response(JSON.stringify({
        success: true,
        message: 'File uploaded successfully',
        path: spaceEncodedPath
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      return new Response(`Internal Server Error: ${error.message}`, { status: 500, headers: corsHeaders });
    }
  }
};
```

</details>

部署成功后, 将 Worker 的路由地址填入 `api_url`, 如果存储桶绑定了自定义域名, 将其填入 `img_domain`

### 🔬 编辑器细节

Petal Note 编辑器集成了多种渲染器, 均在 `const RenderStrategies = []` 中定义, 右下角会显示一个下拉菜单, 允许自由切换渲染器

![editor_renders](./public/assets/editor_renders.png)

简单介绍:

* Petal Note 卡片: Petal Note 客户端格式
* Markdown only: 仅 Markdown, 使用 marked 解析
* Petal only: 仅富文本渲染, 核心 petal-parser.js 驱动
* MD + Petal: 为 Markdown 添加 Petal 的富文本语法

> [!NOTE]
> 可以仅部署编辑器, 配置好令牌文件即可管理你的任何博客仓库, 随时随地书写

---

## 🐏 自定义语法

通过配置 `config.toml` 指向的 `syntax_config` TOML 文件即可定义语法

*以下是一个简单的示例:*

```toml
[[rules]]
# 定义基本语法
prefix = "**"
suffix = "**"

# 填入元素
replacement = '<strong class="text-bold">$1</strong>'

# 具体渲染样式
css = ".text-bold { font-weight: 600; color: var(--text-main); }"
```

> [!TIP]
> 关于如何在其他位置使用, 请参考 [独立解析引擎](#-独立解析引擎-petal-parserjs) 章节

### 🧩 正则表达式语法解析

> [!IMPORTANT]
> 为了摆脱正则替换的局限性, Petal Note 内置了一个复杂状态机驱动的**轻量版 AST 抽象语法树解析渲染引擎**, 足以覆盖大多数场景,  
> 例如多重嵌套, 符号隔离, 定界符冲突, 字面量透明性, 反斜杠转义保护, 解析容错, 递归状态下的深度闭包等等

Petal Note 支持基于正则表达式的复杂自定义规则

使用 `regex` 定义用于匹配目标文本的正则表达式模式, 可以使用捕获组 (如 `()`) 来提取内容，这些捕获组可以在 `replacement` 字段作为变量被引用

> [!TIP]
> 可以使用 TOML 单引号或或者块语法避免多重转义

*示例*:
  
* `'^> (.*)$'`：匹配块引用
* `'\[@([\w]+):([^\]]+)\]'`：匹配类似 `[@username:RealName]` 的提及语法，并包含两个捕获组

`replacement` 示例: `<a class='mention' href='user/$1'>$2</a>`

`flags` 字段用于确定匹配范围, 默认为 `g`, 可以组合多个标准 JavaScript RegExp 标志, 例如 `gmi`  
*以下是关于候选值的说明*

* `"g"`：全局匹配, 匹配所有符合的实例
* `"i"`：忽略大小写, 例如 `[Aa][Bb]` 也能匹配 `ab`。
* `"m"`：多行模式, 让 `^` 和 `$` 不仅匹配整个字符串的首尾，还能匹配每一行的首尾，通常用于处理块级结构, 如行首引用
* `"s"`：点号包含换行符, 允许元字符 `.` 匹配包含换行符在内的任何字符，常用于跨行内容提取
* `"u"`：Unicode 模式, 准确处理高位 Unicode 字符集 (如 Emoji)
* `"y"`：粘连模式, 仅从确切的指定位置开始搜索匹配

> [!NOTE]
> 当使用正则表达式模式时, 通常也需要设置 `prefix` 和 `suffix` 字段, 此时仅生效与编辑器工具栏的文本插入功能

*示例:* 允许渲染十六进制背景色, 通过 `flags` 实现跨行匹配

```toml
[[rules]]
regex = '\{bg-([A-Za-z0-9#\(\),.\s]+)\}(.*?)\{/bg\}'
flags = "gs"
openTag = "{bg-"
closeTag = "{/bg}"
replacement = '<span style="background-color: color-mix(in srgb, $1, transparent 60%); padding: 0 4px; border-radius: 4px; border-bottom: 1px solid color-mix(in srgb, $1 60%, var(--text-main) 40%);">$2</span>'
group = "color"
```

指定 `open_tag` 和 `close_tag` 字段表示开闭标签, 解析引擎将启用状态机模式, 再向下传递给 regex 处理

*示例:* 复刻 Markdown 标题层级语法

```toml
global_css = """
.md-h { font-family: ui-monospace, monospace; color: var(--text-main); line-height: 1.3; }
.md-h1 { font-size: 1.8rem; font-weight: 800; margin: 1.5em 0 0.8em; }
"""

[[view_templates]]
type = "icon_class"
template = '<i class="{{value}}"></i>'

[merge_groups.headings]
title = "标题层级"
icon_html = '<i class="ri-heading"></i><i class="ri-arrow-down-s-line" style="font-size: 0.8em; margin-left: -2px;"></i>'

[[rules]]
regex = "^# (.*)$"
flags = "gm"
prefix = "# "
suffix = ""
replacement = '<h1 class="md-h md-h1">$1</h1>'
group = "headings"
title = "一级标题"
view_type = "icon_class"
view_value = "ri-h-1"
```

#### 🖇️ Prefix / Suffix 的默认行为

当语法逻辑是对称且简单的字符串包裹时，推荐使用 prefix 模式

```toml
[[rules]]
prefix = "=="
suffix = "=="
replacement = "<mark>$1</mark>"
```

等同于:

```toml
[[rules]]
regex = '(?<!\\)==(.+?)(?<!\\)=='
flags = "gs"
replacement = "<mark>$1</mark>"
```

### 🦇 编辑器工具栏

#### 🧩 工具栏组与合并行为

由 `group` 指定分组, 两个或两个以上连续的元素, 若组相同, 会在工具栏合并

使用 `[merge_groups.<group_name>]` 定义组的元数据, 作用于工具栏上的图标

> 没有定义组的元数据时, 将显示一个默认图标

```toml
[[rules]]
# 其它字段...
group = "basic_styles"
title = "加粗"
view_type = "basic_styles"
view_value = "ri-bold"

# ...

[merge_groups.basic_styles]
title = "基础样式"
icon_html = """
<i class="ri-font-size-2"></i>
<i class="ri-arrow-down-s-line" style="font-size:0.8em; margin-left:-2px;"></i>
"""
```

#### 🖌️ 图标模板

使用 `[[view_type]]` 定义一种图标模板, 可以在 `[[rules]]` 的 `view_type` 和 `view_value` 中使用图标模板

* *示例: 定义一个颜色块图标*  

  ```toml
  [[view_templates]]
  type = "color"
  template = """<div style="width: 16px; height: 16px; border-radius: 4px;
    background: {{value}};
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 15%);">
  </div>"""
  ```

* *示例: 定义一个复杂图标*  
还支持使用 **TOML 内联表** 和 **TOML 数组** 替换模板变量

  **TOML 内联表**: 通过 `{{key}}` 来引用

  ```toml
  [[view_templates]]
  type = "simple_alert"
  template = "<i class='{{icon}}'></i> <span>{{label}}</span>"

  [[rules]]
  view_type = "simple_alert"
  view_value = { icon = "ri-info", label = "Note" }
  ```

  **TOML 数组**: 使用 `{{0}}`, `{{1}}` 等索引来引用

  ```toml
  [[view_templates]]
  type = "status_bar"
  template = "状态: <b>{{0}}</b> | 负载: {{1}}%"

  [[rules]]
  view_type = "status_bar"
  view_value = ["运行中", 42]
  ```

* *示例: 定义一个 base64 图片图标*

  ```toml
  [[view_templates]]
  type = "icon_base64"
  template = '<img src="{{value}}" class="fmt-b64" alt="">'
  ```

* 类似的, 还可以直接定义一个 `html` 图标

  ```toml
  [[view_templates]]
  type = "html"
  template = '{{value}}'
  ```

> [!TIP]
> petal-note 仓库预设的语法文件足够应对大多数场景，可以通过 **[🌸 Live Demo 🌸](https://petal-note.vercel.app/)** 预览，或者[单击查看文件](./public/syntax.toml)。

有了这些玩法, 可以实现的效果非常多了, 例如以下这段示例复刻了精美的 *GitHub Alerts* 效果, 自动生成工具栏按钮和直观的图标, 可以直接投入使用

<details>
<summary><b>点击展开代码</b></summary>

```toml
[[view_templates]]
type = "github_alerts"
template = '<div style="display:flex; align-items:center; gap:6px; color:{{color}}; font-size:0.85rem; font-family:ui-monospace,monospace; font-weight:600; "><i class="{{icon}}"></i><span>{{label}}</span></div>'

[merge_groups.github_alerts]
title = "插入 GitHub Alerts"
icon_html = """<i class="ri-chat-4-line"></i>"""

[[rules]]
prefix = ":::note\n"
suffix = "\n:::"
replacement = """<div class="gh-alert gh-alert-note"><div class="gh-alert-title"><i class="ri-information-line"></i> Note</div><div class="gh-alert-body">$1</div></div>"""
css = """
.gh-alert { border-left: 4px solid; padding: 0.6rem 1rem; margin: 0.8rem 0; border-radius: 0 6px 6px 0; box-shadow: 0 2px 8px rgb(0 0 0 / 2%); }
.gh-alert-title { display: flex; align-items: center; gap: 0.4rem; font-weight: 600; margin-bottom: 0.2rem; font-size: 0.9rem; }
.gh-alert-body { font-size: 0.9rem; color: var(--text-main); line-height: 1.6; }
.gh-alert-note { border-left-color: #0969da; background: rgb(9 105 218 / 4%); }
.gh-alert-note .gh-alert-title { color: #0969da; }
"""
group = "github_alerts"
title = "Note (常规提示)"
view_type = "github_alerts"
view_value = { color = "#0969da", icon = "ri-information-line", label = "Note" }

[[rules]]
prefix = ":::tip\n"
suffix = "\n:::"
replacement = """<div class="gh-alert gh-alert-tip"><div class="gh-alert-title"><i class="ri-lightbulb-line"></i> Tip</div><div class="gh-alert-body">$1</div></div>"""
css = """
.gh-alert-tip { border-left-color: #1a7f37; background: rgb(26 127 55 / 4%); }
.gh-alert-tip .gh-alert-title { color: #1a7f37; }
"""
group = "github_alerts"
title = "Tip (建议与技巧)"
view_type = "github_alerts"
view_value = { color = "#1a7f37", icon = "ri-lightbulb-line", label = "Tip" }

[[rules]]
prefix = ":::important\n"
suffix = "\n:::"
replacement = """<div class="gh-alert gh-alert-important"><div class="gh-alert-title"><i class="ri-message-3-line"></i> Important</div><div class="gh-alert-body">$1</div></div>"""
css = """
.gh-alert-important { border-left-color: #8250df; background: rgb(130 80 223 / 4%); }
.gh-alert-important .gh-alert-title { color: #8250df; }
"""
group = "github_alerts"
title = "Important (重要信息)"
view_type = "github_alerts"
view_value = { color = "#8250df", icon = "ri-message-3-line", label = "Important" }

[[rules]]
prefix = ":::warning\n"
suffix = "\n:::"
replacement = """<div class="gh-alert gh-alert-warning"><div class="gh-alert-title"><i class="ri-error-warning-line"></i> Warning</div><div class="gh-alert-body">$1</div></div>"""
css = """
.gh-alert-warning { border-left-color: #9a6700; background: rgb(154 103 0 / 4%); }
.gh-alert-warning .gh-alert-title { color: #9a6700; }
"""
group = "github_alerts"
title = "Warning (警告提示)"
view_type = "github_alerts"
view_value = { color = "#9a6700", icon = "ri-error-warning-line", label = "Warning" }

[[rules]]
prefix = ":::caution\n"
suffix = "\n:::"
replacement = """<div class="gh-alert gh-alert-caution"><div class="gh-alert-title"><i class="ri-close-circle-line"></i> Caution</div><div class="gh-alert-body">$1</div></div>"""
css = """
.gh-alert-caution { border-left-color: #d1242f; background: rgb(209 36 47 / 4%); }
.gh-alert-caution .gh-alert-title { color: #d1242f; }
"""
group = "github_alerts"
title = "Caution (危险操作)"
view_type = "github_alerts"
view_value = { color = "#d1242f", icon = "ri-close-circle-line", label = "Caution" }
```

</details>

### 📜 语法文件结构

```toml
global_css = ""   # 全局 CSS 样式表

# 定义忽略的节点或者标签, 以免错误替换样式
# 生效范围示例: 
# - petal-note 编辑器的 `MD+Petal` 渲染器
# - 手动编写 Astro Remark 插件
immune_nodes = ["code", "inlineCode", "link", "html"]
ignore_tags = ["a", "pre", "code", "script", "style"]

# 工具栏图标模板
[[view_templates]]
type = ""       # 图标类型名称
template = ""   # 图标模板 DOM
                # 支持替换 {{value}} / TOML 数组: {{1}}, {{2}} / TOML 内链表: {{var1}}, {{var2}}

# 组元数据, 作用于 petal-note 编辑器工具栏上的图标和合并行为
[merge_groups.basic_styles]
title = ""       # 组名称
icon_html = ""   # 组名称

# 一个语法
[[rules]]
prefix = ""       # 前缀匹配
suffix = ""       # 后缀匹配
replacement = ""  # 实际渲染的 DOM, 替换 $1 为 prefix 与 suffix 之间的文本内容
css = ""          # 附带 CSS 样式表
group = ""        # 所属组, 未指定时无任何合并行为, 相关: [merge_groups.<group_name>]
title = ""        # 工具栏按钮提示
view_type = ""    # 图标的类型, 相关: [[view_templates]]
view_value = ""   # 图标的值, 相关: [[view_templates]]

# 一个语法
[[rules]]
regex = ""         # 正则表达式, 使用捕获组提取内容
flags = ""         # 正则细调
openTag = ""       # 复杂状态机模式下必要的开标签
closeTag = ""      # 复杂状态机模式下必要的闭标签
prefix = ""        # 编辑器按钮插入内容的前缀
suffix = ""        # 编辑器按钮插入内容的后缀
replacement = ""   # 实际渲染的 DOM, 替换 $1, $2... 为正则表达式捕获的内容
# group = ""
# title = ""
# view_type = ""
# view_value = ""
```

---

## 🧩 独立解析引擎 petal-parser.js

Petal Note 的核心解析引擎 `petal-parser.js` 被设计为完全解耦的独立模块

### ☘️ Vanilla JS 原生引入

在没有任何构建工具链的纯静态页面中, 你可以直接通过 ES Module 引入解析器并接管 DOM 渲染

*以下是一个极简的集成示例:*

<details>
<summary><b>点击展开代码</b></summary>

```html
<body>
    <div id="app"></div>

    <script type="module">
        import { parse as parseToml } from 'https://esm.sh/smol-toml@1.6.0';
        import { PetalParser } from './petal-parser.js';

        async function bootstrap() {
            const app = document.getElementById('app');
            try {
                const [synRes, dataRes] = await Promise.all([
                    fetch('syntax.toml'),
                    fetch('data.txt')
                ]);

                if (!synRes.ok || !dataRes.ok) throw new Error('依赖资源加载异常');

                const syntaxData = parseToml(await synRes.text());
                const rawData = await dataRes.text();

                const rules = syntaxData.rules || [];
                const parser = new PetalParser(rules);
                const css = parser.getStyles(syntaxData.global_css);
                
                if (css) {
                    const styleNode = document.createElement('style');
                    styleNode.textContent = css;
                    document.head.appendChild(styleNode);
                }
                let parsedHtml = parser.parse(rawData);

                parsedHtml = parsedHtml
                    .split('\n')
                    .join('<div class="line-break"></div>')
                    .replace(/(?:<div class="line-break"><\/div>)*\s*(<img[^>]+>)\s*(?:<div class="line-break"><\/div>)*/g, '$1');

                app.innerHTML = parsedHtml;

            } catch (err) {
                app.innerHTML = `<div style="color: #d88c9a; text-align: center; font-style: italic;">渲染中止: ${err.message}</div>`;
            }
        }

        bootstrap();
    </script>
</body>
```

</details>

### 🚀 静态站点集成 (以 Astro 为例)

可以在构建期间侵入，最终输出纯净的静态 HTML

* **步骤一**: 补全构建依赖, 安装 AST 节点遍历工具和轻量级 TOML 解析器

  ```console
  npm install unist-util-visit smol-toml
  ```

* **步骤二**: 将 `petal-parser.js` 和 `syntax.toml` 复制到你的项目目录 (例如 `src/lib/`)
* **步骤三**: 编写 Remark 插件 `src/lib/remark-petal.mjs`, 拦截并重写文本节点

  ```javascript
  import { visit } from 'unist-util-visit';
  import { PetalParser } from './petal-parser.js';

  export default function remarkPetal(options = {}) {
    const parser = new PetalParser(options.rules || []);
    const immune = new Set(options.immuneNodes || []);

    return (tree) => {
      visit(tree, 'text', (node, _, parent) => {
        if (parent && immune.has(parent.type)) return;

        const parsed = parser.parse(node.value);
        if (parsed !== node.value) {
          node.type = 'html';
          node.value = parsed;
        }
      });
    };
  }
  ```

* **步骤四**: 在 `astro.config.mjs` 中读取语法配置, 并注入全局解析管道

  ```javascript
  import mdx from '@astrojs/mdx';
  import sitemap from '@astrojs/sitemap';
  import { defineConfig } from 'astro/config';
  import { readFileSync } from 'node:fs';
  import { parse } from 'smol-toml';
  import remarkPetal from './src/lib/remark-petal.mjs';

  const syntaxData = parse(readFileSync(new URL('./src/lib/syntax.toml', import.meta.url), 'utf-8'));

  export default defineConfig({
    site: 'https://example.com',
    integrations: [mdx(), sitemap()],
    markdown: {
      remarkPlugins: [[remarkPetal, { rules: syntaxData.rules || [] }]]
    }
  });
  ```

* **步骤五**: 在全局头部组件 (如 `src/components/BaseHead.astro`) 中提取并挂载语法引擎专属样式

  ```astro
  import { readFileSync } from 'node:fs';
  import { parse } from 'smol-toml';
  import { PetalParser } from '../lib/petal-parser.js';

  //...

  const syntaxData = parse(readFileSync(new URL('../lib/syntax.toml', import.meta.url), 'utf-8'));
  const petalCss = new PetalParser(syntaxData.rules || []).getStyles(syntaxData.global_css);

  //...
  { petalCss && <style set:html={petalCss} /> }
  ```

---

## 🦅 进阶部署指南

利用 config.toml 支持 URL 的特性, 可以配置书写完成后数据即刻刷新, 并且不会触发频繁的 Deploy  
需要将 **托管仓库** 与 **数据仓库** 分离, 使用 **Cloudflare Workers** 作为中枢代理

在 Cloudflare Worker 控制台的 `Settings -> Variables` 中添加以下变量

* **GITHUB_TOKEN**: GitHub 访问令牌 (PAT)

  *示例*

  ```plaintext
  github_pat_xxxxxxxxx
  ```

> [!WARNING]
> 令牌使用 **[Fine-grained personal access tokens](https://github.com/settings/personal-access-tokens)** 生成, 并在此处设置为 **机密**

* **ENCRYPT_MAP**: AES-GCM 密码和文件映射字典

  *示例*

  ```json
  {
    "private.txt": "your_private_password",
    "editor.toml": "your_editor_password"
  }
  ```

> [!WARNING]
> 文件路径直接对应 GitHub 仓库路径, 务必将敏感文件添加到字典, 字典外的其余文件均明文返回  
> 该 JSON 应设置为 **机密**

* **GITHUB_USER**: GitHub 用户名
* **GITHUB_REPO**: 数据仓库的私有仓库名

以下为 worker.js, 直接返回仓库文件, 并根据字典名单机制进行加密

<details>
<summary><b>点击展开代码</b></summary>

```javascript
export default {
  async fetch(r, e) {
    const h = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Content-Type": "text/plain;charset=UTF-8" };
    if (r.method === "OPTIONS") return new Response(null, { headers: h });

    const p = new URL(r.url).pathname.replace(/\/+/g, '/').slice(1);
    if (!p) return new Response("Please specify a file path", { status: 400, headers: h });

    const f = async (t) => {
      const s = await fetch(`https://api.github.com/repos/${e.GITHUB_USER}/${e.GITHUB_REPO}/contents/${t}`, {
        headers: { Authorization: `Bearer ${e.GITHUB_TOKEN}`, Accept: "application/vnd.github.v3.raw", "User-Agent": "CF-Worker" }
      });
      if (!s.ok) throw new Error(s.status === 404 ? "Not Found" : `Failed to fetch ${t}: ${s.status} ${s.statusText}`);
      return await s.text();
    };

    const c = async (t, k) => {
      const n = new TextEncoder(), d = await crypto.subtle.digest("SHA-256", n.encode(k));
      const y = await crypto.subtle.importKey("raw", d, { name: "AES-GCM" }, false, ["encrypt"]);
      const i = crypto.getRandomValues(new Uint8Array(12));
      const b = await crypto.subtle.encrypt({ name: "AES-GCM", iv: i }, y, n.encode(t));
      const a = new Uint8Array(b), o = new Uint8Array(12 + a.length);
      o.set(i); o.set(a, 12);
      return btoa(o.reduce((x, v) => x + String.fromCharCode(v), ""));
    };

    try {
      const t = await f(p);
      let m = {};
      if (e.ENCRYPT_MAP) try { m = JSON.parse(e.ENCRYPT_MAP); } catch (_) { }
      return new Response(m[p] ? await c(t, m[p]) : t, { headers: h });
    } catch (x) {
      return new Response(x.message, { status: x.message === "Not Found" ? 404 : 500, headers: h });
    }
  }
};
```

</details>

配置完成后, 在 config.toml 中直接将数据源指向你的 Worker 地址即可:

```toml
data_source = "https://your-worker.workers.dev/data.txt"
private_source = "https://your-worker.workers.dev/private.txt"
editor_config = "https://your-worker.workers.dev/editor.toml"
```

> 每次返回的密文内容都是不同的  
> 也可以在数据仓库中设置一个 GitHub Actions, 即推送后自动生成加密文件, 这样可以节省 cloudflare cpu 时间, ~~虽然似乎没有必要这样做~~

完成这一步后, 你的托管仓库就非常干净了, 仓库升级为统一调度中心, 核心仅一个 `config.toml`  
资源文件也可以放进任何位置, 推荐使用 **Cloudflare R2** 进行存储

```plaintext
.
└── public
    └── config.toml
         ↑
      icon = "https://your-r2.com/favicon.ico"     # 云存储
      font = "https://your-worker.com/font.woff2"  # 存储在数据仓库, 通过 worker 读取
      res_config = "./assets/file.ext"             # 存储在托管仓库
```

**但似乎无法做到每次写日记时拉取最新骨架了**, 因为只有 petal-note 仓库所有者能够设置骨架更新时触发静态托管平台的钩子  
*手动点 `Redeploy`? 绝对不行*

> [!WARNING]
> 如果让数据仓库和托管仓库在一起, 同时设置 worker  
> 但那样就可以直接通过 worker 获取任意明文了

**解决方案**: 在你的静态平台上拿到一个触发 Deploy 的钩子, 然后在任意位置设置定时任务, 即可保持骨架自动更新

若完成以上步骤, 只需要在网页中打开编辑器, 点点保存, 前端即可立即更新日记

**⭐ 那么恭喜你, 已经完全应用了无服务器架构的玩法, 享受它!**

---

## 💽 其它信息

### 🛠️ AES-GCM 工具

仓库中的 `cipher-thoughts.py` 是一个极简的 AES-GCM 工具, 由 python 库 cryptography 驱动

> [!NOTE]
> `build.sh` 会在需要的时候自动拉取该文件并处理加密

每次加密时生成 12 字节的 IV, 所以即使内容和密码相同, 每次的密文也是不同的

```console
> ./cipher-thoughts.py
usage: cipher-thoughts.py [-d] [-t TEXT] [-f FILE][-o [OUT]] [-O [OVERWRITE_OUT]] [-p PASSWORD] [-h] [filepath]

极简 AES-GCM 工具

positional arguments:
  filepath              要处理的文件

options:
  -d, --decrypt         解密模式
  -t, --text TEXT       直接处理传入的文本内容
  -f, --file FILE       处理指定路径的文件 (同位置参数)
  -o, --out [OUT]       将结果输出到文件 (不指定文件名则自动去除或加入 .dec 后缀)
  -O, --overwrite-out [OVERWRITE_OUT]
                        将结果输出到文件 (不指定文件名则自动去除或加入 .dec 后缀, 不检查覆盖)
  -p, --password PASSWORD
                        指定密码 (优先于环境变量及.env)
  -h, --help            显示此帮助信息并退出
```

---

<div align="center">
<sub>Stay gentle, stay pure.</sub>
</div>
