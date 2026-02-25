#!/bin/bash
set -euo pipefail

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
                print(Path(src).name)
except Exception:
    pass
')

if ((${#TARGET_FILES[@]} > 0)); then
    printf "从 miniyu157/petal-note 拉取 cipher-thoughts.py ...\n"
    curl -fsSL "$REPO/scripts/cipher-thoughts.py" -o "cipher-thoughts.py"

    unset PYTHONPATH
    python3 -m venv .venv
    .venv/bin/pip install -q cryptography

    for target in "${TARGET_FILES[@]}"; do
        if [[ -f $target ]]; then
            .venv/bin/python cipher-thoughts.py -f "$target" -O "public/$target" 2>&1 |
                sed "s/^/[cipher-thoughts.py: ${target}] /"
        else
            printf "找不到文件: %s\n" "$target"
        fi
    done
else
    printf "没有需要处理加密的文件\n"
fi
