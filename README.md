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

* **文件驱动**: 所有数据均为人类可读的 TOML, TXT, 日记源还可配置为网络 URL
* **自由随写**: 没有固定的时间戳格式与排序, 格式由你定义
* **隐私保障**: 敏感内容分发时采用端到端 AES-GCM 加密, 应用内解密
* **丝滑书写**: 配置仓库鉴权文件即可在网页启动内置的编辑器
* **私密日记**: 可配置秘密时间线, 外观上拥有更加沉浸的氛围
* **特殊语法**: 支持 markdown 超链接与图片语法, 还支持简单的下划线, 删除线, 波浪线等语法
* **标签系统**: 自动提取正文首行的 `#标签` 并渲染过滤导航组件
* **体验优先**: 为人类优化交互体验, 例如未读系统, 鉴权记忆等

---

## 🌟 快速开始

框架仓库提供了实用脚本, 在一个空文件夹内粘贴以下命令即可快速创建 petal-note 应用模板

```bash
curl -fsSL https://raw.githubusercontent.com/miniyu157/petal-note/main/scripts/create-petal-app.sh | bash -e
```

> 会自动配置 .gitignore 忽略 *.html 或其它部署文件

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

| 变量名 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| **`GITHUB_TOKEN`** | **机密 (Secret)** | GitHub 访问令牌 (PAT) | `github_pat_...` |
| `GITHUB_USER` | 纯文本 | GitHub 用户名 | `miniyu157` |
| `GITHUB_REPO` | 纯文本 | 存放数据的私有仓库名 | `my-private-thoughts` |
| `DATA_PATH` | 纯文本 | 公开日记在仓库中的路径 | `data.txt` |
| `PRIVATE_PATH` | 纯文本 | 私密日记在仓库中的路径 | `private.txt` |
| **`AES_PASSWORD`** | **机密 (Secret)** | 你的私密日记解密密码 (用于云端加密) | `private.txt 密码` |

[worker.js 示例代码](./public/assets/worker.js)

配置完成后, 在 config.toml 中直接将数据源指向你的 Worker 地址即可：

```toml
data_source = "https://your-worker.workers.dev/data.txt"
private_source = "https://your-worker.workers.dev/private.txt"
```

---

## 🦊 数据格式参考

### 🔒 .env

```sh
KEY_private_source="admin"
KEY_editor_config="admin"
PASSWORD=""
```

分发时优先使用 KEY_\<config_name\>, 否则回退到 PASSWORD

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
