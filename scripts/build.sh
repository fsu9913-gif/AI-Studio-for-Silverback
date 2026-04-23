#!/usr/bin/env bash
# Build script for Cloudflare Pages.
# Composes homepage/ and orozco/ into public_dist/, adds SPA fallback + cache headers.
set -euo pipefail

(cd homepage && npm ci --silent && npm run build)
(cd orozco   && npm ci --silent && VITE_BASE_PATH=/orozco/ npm run build)

rm -rf public_dist
mkdir -p public_dist
cp -r homepage/dist/. public_dist/
mkdir -p public_dist/orozco
cp -r orozco/dist/. public_dist/orozco/

cat > public_dist/_redirects <<'EOF'
/orozco/*  /orozco/index.html  200
/*         /index.html         200
EOF

cat > public_dist/_headers <<'EOF'
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/orozco/assets/*
  Cache-Control: public, max-age=31536000, immutable
EOF
