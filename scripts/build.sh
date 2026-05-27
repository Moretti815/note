#!/bin/bash
set -euo pipefail

set -a
[[ -f .env ]] && source .env
set +a

readonly REPO="https://raw.githubusercontent.com/Moretti815/note/main"
PATH_PART=${REPO#https://raw.githubusercontent.com/}
_user=${PATH_PART%%/*} _repo=${PATH_PART#*/} _repo=${_repo%%/*}
_src="${_user}/${_repo}"

mkdir -p "public"

printf "仓库: github.com/%s\n" "$_src"

for item in "$@"; do
    target_path="public/${item}"
    printf "拉取 %s...\n" "$item"
    curl -fsSL "${REPO}/${target_path}" -o "$target_path" --create-dirs
done

mapfile -t PARSED_ITEMS < <(python3 -c '
import sys, tomllib
from pathlib import Path
try:
    with open("public/config.toml", "rb") as f:
        conf = tomllib.load(f)
        for key in ("private_source", "editor_config"):
            src = conf.get(key, "")
            if src:
                if src.startswith(("http://", "https://")):
                    if key == "editor_config":
                        print("URL_EDITOR")
                else:
                    print(f"{key}|{Path(src).name}")
except Exception:
    pass
')

TARGET_FILES=()
PULL_EDITOR=0

for item in "${PARSED_ITEMS[@]}"; do
    if [[ $item == "URL_EDITOR" ]]; then
        PULL_EDITOR=1
    else
        TARGET_FILES+=("$item")
    fi
done

if ((${#TARGET_FILES[@]} > 0)); then
    printf "拉取 cipher-thoughts.py...\n"
    curl -fsSL "$REPO/scripts/cipher-thoughts.py" -o "cipher-thoughts.py"

    printf "准备 Python 环境...\n"
    unset PYTHONPATH
    python3 -m venv .venv
    .venv/bin/pip install -q cryptography

    for item in "${TARGET_FILES[@]}"; do
        IFS='|' read -r conf_key target <<< "$item"

        specific_key="KEY_${conf_key}"
        pwd_val="${!specific_key:-}"

        if [[ -z $pwd_val ]]; then
            pwd_val="${PASSWORD:-}"
        fi

        if [[ -n $pwd_val ]]; then
            if [[ -f $target ]]; then
                .venv/bin/python cipher-thoughts.py -f "$target" -O "public/$target" -p "$pwd_val" 2>&1 |
                    sed "s/^/[cipher-thoughts.py: ${target}] /"

                if [[ $conf_key == "editor_config" ]]; then
                    PULL_EDITOR=1
                fi
            else
                printf "找不到文件: %s\n" "$target"
            fi
        else
            printf "未找到密钥, 文件: %s, 请配置 %s 或 PASSWORD\n" "$target" "$specific_key"
        fi
    done
else
    printf "没有需要处理加密的本地文件\n"
fi

if ((PULL_EDITOR == 1)); then
    printf "\n拉取 editor.html...\n"
    curl -fsSL "$REPO/public/editor.html" -o "public/editor.html"
fi
