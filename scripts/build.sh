#!/bin/bash
set -euo pipefail

set -a
[[ -f .env ]] && source .env
set +a

readonly REPO="https://raw.githubusercontent.com/miniyu157/petal-note/main"
PATH_PART=${REPO#https://raw.githubusercontent.com/}
_user=${PATH_PART%%/*} _repo=${PATH_PART#*/} _repo=${_repo%%/*}
_src="${_user}/${_repo}"

mkdir -p "public"

printf "仓库: github.com/%s\n" "$_src"

printf "拉取 index.html...\n"
curl -fsSL "$REPO/public/index.html" -o "public/index.html"

printf "\n"

mapfile -t TARGET_FILES < <(python3 -c '
import sys, tomllib
from pathlib import Path
try:
    with open("public/config.toml", "rb") as f:
        conf = tomllib.load(f)
        for key in ("private_source", "editor_config"):
            src = conf.get(key, "")
            if src:
                print(f"{key}|{Path(src).name}")
except Exception:
    pass
')

if ((${#TARGET_FILES[@]} > 0)); then
    printf "从 miniyu157/petal-note 拉取 cipher-thoughts.py ...\n"
    curl -fsSL "$REPO/scripts/cipher-thoughts.py" -o "cipher-thoughts.py"

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
            else
                printf "找不到文件: %s\n" "$target"
            fi
        else
            printf "未找到密钥, 请在 .env 中配置 %s 或 PASSWORD\n" "$specific_key"
        fi
    done
else
    printf "没有需要处理加密的文件\n"
fi
