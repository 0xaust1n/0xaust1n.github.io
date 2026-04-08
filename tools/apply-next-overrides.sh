#!/bin/sh

set -eu

find overrides -mindepth 1 -maxdepth 1 -type d | while IFS= read -r src_dir; do
  theme_name=$(basename "$src_dir")
  dst_dir="node_modules/$theme_name"

  if [ ! -d "$dst_dir" ]; then
    continue
  fi

  find "$src_dir" -type f | while IFS= read -r src_file; do
    rel_path=${src_file#"$src_dir"/}
    dst_file="$dst_dir/$rel_path"
    mkdir -p "$(dirname "$dst_file")"
    cp "$src_file" "$dst_file"
  done
done
