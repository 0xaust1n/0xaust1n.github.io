# Aust1n Blog

## Clone

```
# git version 2.13 of Git and later,
git clone --recurse-submodules -j8 <url>
```

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

`pnpm dev` starts the Hexo server with live reload and watches `overrides/` plus `tools/apply-next-overrides.sh`. When an override changes, the theme patches are re-applied automatically.

## Build

```bash
pnpm build
```

## Deploy

```bash
pnpm deploy
```
