#!/bin/sh

set -eu

SRC_DIR="overrides/hexo-theme-next"
DST_DIR="node_modules/hexo-theme-next"

if [ ! -d "$SRC_DIR" ] || [ ! -d "$DST_DIR" ]; then
  exit 0
fi

find "$SRC_DIR" -type f | while IFS= read -r src_file; do
  rel_path=${src_file#"$SRC_DIR"/}
  dst_file="$DST_DIR/$rel_path"
  mkdir -p "$(dirname "$dst_file")"
  cp "$src_file" "$dst_file"
done
