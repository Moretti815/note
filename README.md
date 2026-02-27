<div align="center">

<img src="./public/assets/favicon.png" alt="Petal Logo" width="120" />

# Petal Note

*风吹落的花瓣, 和那些无处安放的碎碎念。*

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

Petal 是一个极简, 唯美, 无需任何构建工具链的纯前端日记/碎碎念框架。没有冗余的依赖, 只需最纯粹的 HTML, TXT 和 TOML, 即可在任何支持静态托管的平台上部署。

**🌸 [Live Demo](https://petal-note.vercel.app/) 🌸**

### ✨ 特性

* **文件驱动**: 所有数据均为人类可读的 TOML, TXT
* **无服务器**: 通过组合 cloudflare workers, R2, 将数据源设置为远程 URL, 即可实现非常丝滑的书写体验
* **自由随写**: 没有固定的时间戳格式与排序, 格式由你定义
* **隐私保障**: 敏感内容分发时采用端到端 AES-GCM 加密, 应用内解密
* **丝滑书写**: 配置仓库鉴权文件即可在网页启动内置的编辑器
* **私密日记**: 可配置秘密时间线, 外观上拥有更加沉浸的氛围
* **特殊语法**: 支持 markdown 超链接与图片语法, 还支持简单的下划线, 删除线, 波浪线等语法
* **标签系统**: 自动提取正文首行的 `#标签` 并渲染过滤导航组件
* **体验优先**: 为人类优化交互体验, 例如未读系统, 鉴权记忆等

---

## 🌟 快速开始

无论是哪种部署方式，第一步都是在本地初始化你的个人配置和数据源

在一个空文件夹内，运行以下命令创建 Petal Note 数据模板

```bash
curl -fsSL https://raw.githubusercontent.com/miniyu157/petal-note/main/scripts/create-petal-app.sh | bash -e
```

> 可选自动配置 .gitignore 忽略 *.html 或其它部署文件

### 方式一: ☘️ 传统静态托管

将整个文件夹托管到任意静态服务平台, 如 Cloudflare Pages, Vercel, GitHub Pages, 甚至是一个普通的 Nginx 服务器, 保留稳定的 html 骨架

### 方式二: 🍀 内容与框架分离 (推荐, 保持最新)

如果你希望外观和特性永远保持最新, 并与个人日记解耦

1. 在静态服务平台托管你的仓库, 无需放入 html 和任何加密文件
2. 在部署设置中, 将 **Build command** 设置为:

    ```bash
    curl -fsSL https://raw.githubusercontent.com/miniyu157/petal-note/ce399ea/scripts/build.sh | bash -e
    ```

    [提交 ce399ea - build.sh](https://github.com/miniyu157/petal-note/commit/ce399ea)

3. 将构建输出目录设置为 `public`

这样, 你的仓库触发 `deploy` 时, 都会自动拉取并注入最新版本的 Petal Note 骨架, 同时会自动处理加密并分发, 均在 `config.toml` 中设置, 个人内容仓库保持纯净

> 若想要仅更新骨架, 手动运行一次 `Redeploy`

---

## 🦉 编辑器

正确设置 `editor_config` 后, 将在页面左下角显示一个淡淡的编辑器入口按钮

editor_config 的值应为 AES-GCM 加密的 toml 文件, 包含目标仓库信息, 帐号令牌,等, 目前只支持连接 github 仓库

明文格式如下, 将在应用内解锁, 解锁成功后打开编辑器

```toml
github_user = "user"
github_repo = "repo"
github_token = "github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

data_path = "data.txt"
private_path = "private.txt"

commit_msg = "web_editor: {{yyyy-mm-dd hh:mm:ss}}"
commit_user = "Web Editor"
commit_email = "example@mail.com"
```

其中 `data_path` 和 `private_path` 是数据文件位于远程仓库的路径

编辑器预览

![editor_preview](./public/assets/editor.png)

---

## 🐰 秘密时间线

当正确设置 `private_source` 后即可生效

因为没有时间戳等约定, 秘密时间线与公开时间线相互独立. 秘密时间线通过 **AES-GCM** 驱动, 密语匹配成功即可进入

个人仓库中无需手动上传加密文件, petal-note 提供了 `build.sh` 和 `cipher-thoughts.py` 等实用分发工具

---

## 🐈 个人仓库结构概览

需要加密的文件, 包括 **.env**, **都可以存储为明文**在你的个人仓库中, 只需在静态托管平台设置了根目录为 `public`

> [!WARNING]
> 不要将仓库设置为 public, 除非你想暴露所有的东西

> [!TIP]
> 如果不想让人轻易获取你的网站, 可以根据个人情况为网站  
> 添加 `x-robots-tag: noindex, nofollow` 标记

```plaintext
.
├── .env              // 密语文件, 包含需要加密的文件的密码
├── .gitignore
├── editor.toml       // 明文, 账户令牌和仓库信息
├── private.txt       // 明文, 秘密时间线
└── public  
    ├── config.toml   // 配置文件
    ├── data.txt      // 公开时间线
    └── assets        // 其它资源文件
         ├── favicon.ico    // 图标资源
         ├── font.woff2     // 字体
         └── ...jpg         // 其他资源文件
```

---

## 🦅 进阶部署指南

如果你不想每次写日记都触发构建，可以将托管仓库与数据仓库分离, 使用 **Cloudflare Workers** 作为中枢代理

在 Cloudflare Worker 控制台的 `Settings -> Variables` 中添加以下变量

* **GITHUB_TOKEN**: GitHub 访问令牌 (PAT)

  *示例*

  ```plaintext
  github_pat_xxxxxxxxx
  ```

> [!WARNING]
> 令牌使用 [Fine-grained tokens](https://github.com/settings/personal-access-tokens) 生成, 并在此处设置为 **机密**

* **ENCRYPT_MAP**: AES-GCM 密码和文件映射字典

  *示例*

  ```json
  {
    "private.txt": "your_private_password",
    "editor.toml": "your_editor_password"
  }
  ```

> [!WARNING]
> 文件路径直接对应 github 仓库路径, 务必将敏感文件添加到字典, 字典外的其余文件均明文返回  
> 该 json 应设置为 **机密**, 而不是 json

* **GITHUB_USER**: Github 用户名
* **GITHUB_REPO**: 数据仓库的私有仓库名

以下为 worker.js, 直接返回仓库文件, 并根据字典名单机制进行加密

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

配置完成后, 在 config.toml 中直接将数据源指向你的 Worker 地址即可：

```toml
data_source = "https://your-worker.workers.dev/data.txt"
private_source = "https://your-worker.workers.dev/private.txt"
editor_config = "https://your-worker.workers.dev/editor.toml"
```

> 每次返回的加密文件都是不同的  
> 也可以在数据仓库中设置一个 Github Actions, 即推送后自动生成加密文件, 这样可以节省 cloudflare cpu 时间, ~~虽然似乎没有必要这样做~~

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

**但似乎无法做到每次写日记时拉取最新骨架了**, 因为只有所有者能够设置骨架更新时触发静态托管平台的钩子  
如果让数据仓库和托管仓库在一起, 同时设置 worker, 但那样就可以直接通过 worker 获取任意明文了  
*手动点 `Redeploy`? 绝对不行*

**解决方案**: 在数据仓库中, 设置一个 CI, 当你的日记更新时自动触发静态托管平台的 Deploy Hook

创建文件 `.github/workflows/deploy.yml` 写入以下内容

```yml
name: Trigger Pages Deploy

on:
  push:
    branches:
      - main
      - master

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Call Webhook
        run: curl -s -X POST "${{ secrets.DEPLOY_HOOK }}" > /dev/null
```

同时在仓库设置中, 进入 `Secrets and variables` 章节下的 `Actions`, 或者直接在浏览器的地址栏追加 `/settings/secrets/actions`

创建一个机密变量 `DEPLOY_HOOK`, 填入你在静态托管平台上拿到的 URL

完成以上步骤, 即可在数据仓库的内容更新时, 自动拉取最新的 petal-note 骨架  
同时只需要在网页中打开编辑器, 点点保存, 前端即可立即更新日记

**那么恭喜你, 已经完全应用了无服务器架构的玩法, 享受它!**

---

## 🦊 数据格式参考

### 🔒 .env

```sh
KEY_private_source="admin"
KEY_editor_config="admin"
PASSWORD=""
```

Build Command 分发时优先使用 KEY_\<config_name\>, 否则回退到 PASSWORD

### ⚙️ config.toml

用于定义站点的全局信息, 所有项均为可选  
包括 `data_source`, `private_source` 的资源可以设置为网络 URL, 运行时将自动拉取

```toml
data_source = "./data.txt"

private_source = "./private.txt"
private_tip = "" # 回退: '输入轻语解锁梦境...'

editor_config = "./editor.toml"
editor_unlocktip= "" # 回退: '输入轻语解锁时序...'

home_url = "https://github.com/miniyu157/petal-note"
font = "./assets/font.ttf"

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
```

### 📖 data_source, private_source

使用 `---` 作为每条日记的分割线

```text
2026-02-18 19:40
#日记 #碎碎念 在这里种下一颗种子, 希望能开出温柔的花。
不问花期, 只愿过程静好。
---
2026-02-18 深夜
长内容会自动检测高度并在底部呈现渐隐折叠。
![猫咪图片](./assets/cat.jpeg)
支持简单的 Markdown 图片语法, 以及直接写入的 https:// 链接, 它们会被自动解析并高亮。
```

---

## 🛠️ AES-GCM 工具

仓库中的 `cipher-thoughts.py` 是一个极简的 AES-GCM 工具, 由 python 库 cryptography 驱动

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
