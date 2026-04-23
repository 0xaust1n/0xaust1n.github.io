# AGENTS

## GitHub Pages / Domain

- 如果網域由 Cloudflare 託管，禁止主動開啟 GitHub Pages 的 `https_enforced`。
- 處理 GitHub Pages 或自訂網域設定前，先確認 domain 是否由 Cloudflare 代理或託管。
- 在 Cloudflare 託管情境下，維持 GitHub Pages custom domain 與 deployment 設定即可，不要變更 GitHub Pages HTTPS 強制設定，除非使用者明確要求。
