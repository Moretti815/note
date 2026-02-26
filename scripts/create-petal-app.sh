#!/bin/bash
set -euo pipefail

readonly REPO="https://raw.githubusercontent.com/miniyu157/petal-note/main"
PATH_PART=${REPO#https://raw.githubusercontent.com/}
_user=${PATH_PART%%/*} _repo=${PATH_PART#*/} _repo=${_repo%%/*}
_src="${_user}/${_repo}"

mkdir -p "public"
mkdir -p "public/assets"

printf "仓库: github.com/%s\n" "$_src"

printf "拉取模板文件 ...\n"
curl -fsSL "$REPO/public/config.toml" -o "public/config.toml"
curl -fsSL "$REPO/editor.toml" -o "editor.toml"

printf "创建数据模板 ...\n"
cat << 'EOF' > ".env"
KEY_private_source="admin"
KEY_editor_config="admin"
PASSWORD=""
EOF
cat << EOF > "public/data.txt"
Petal Note
#欢迎
点击左上角即可进入秘密时间线，
点击左下角进入编辑器，密码均为 admin。
---
Petal Note
#欢迎
欢迎使用 Petal Note! 你已经通过官方脚本初始化了一个项目。
关于如何使用，请参考文档中的说明。
[点此转到仓库](https://github.com/miniyu157/petal-note?tab=readme-ov-file#-%E9%83%A8%E7%BD%B2%E4%B8%8E%E4%BD%BF%E7%94%A8)
EOF
cat << 'EOF' > "private.txt"
Petal Note
#欢迎
这里是私密时间线，
更多信息，请查看 [仓库地址](https://github.com/miniyu157/petal-note?tab=readme-ov-file#-%E7%A7%98%E5%AF%86%E6%97%B6%E9%97%B4%E7%BA%BF)
EOF

printf "初始化空仓库 ...\n"
cat << 'EOF' > ".gitignore"
.venv/
.vscode/

*.html
*.sh
cipher-thoughts.py
public/editor.toml
public/private.txt
EOF
git init -b main > /dev/null 2>&1 || true
git add . > /dev/null 2>&1 || true
git commit -m "init petal note project" > /dev/null 2>&1 || true

cat << EOF

欢迎使用 Petal Note!

你已经成功初始化了一个空项目。

部署命令：

  curl -fsSL https://raw.githubusercontent.com/miniyu157/petal-note/main/scripts/build.sh | bash -e

部署完成后可以启动本地服务器预览效果。
EOF
