#!/usr/bin/env bash
# Fails if any local asset URL bypasses the baseURL subpath. relURL returns a
# leading-slash path unchanged, so "/images/x.webp" in a data file silently
# 404s on a project Pages site served under /<repo>/.
set -euo pipefail
out=$(mktemp -d)
hugo --quiet --destination "$out" --baseURL "https://example.com/subpath/"
if bad=$(find "$out" -name "*.html" -exec grep -rhoE '(src|href|srcset)="?/[^ ">]*|url\(['\''"]?/[^)'\''"]*['\''"]?\)' {} + | grep -v '/subpath/'); then
  echo "::error::asset URL(s) bypassed the baseURL subpath:"
  echo "$bad" | sed 's/^/  /'
  exit 1
fi
echo "all local asset URLs respect the baseURL subpath"
