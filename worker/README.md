# Free-only portfolio AI (Cloudflare Workers AI)
This project uses Cloudflare Workers AI's free allocation and **does not use OpenAI API billing**.

## To activate
1. Create a **Cloudflare Free** account at https://dash.cloudflare.com/ (do not upgrade to Workers Paid).
2. Create a Worker in Workers & Pages. Paste or upload `worker/portfolio-ai.js`.
3. Add a **Workers AI binding**, variable name `AI`, in the Worker's Settings > Bindings.
4. Deploy the Worker and copy its URL (for example, `https://your-worker.your-name.workers.dev`).
5. Edit `assistant.js`: set `window.PORTFOLIO_AI_ENDPOINT` to that URL. Never put API secrets in site JavaScript.
6. Test the conversation from https://angelin-moyer.github.io/.

The Worker uses `@cf/zai-org/glm-4.7-flash`, listed by Cloudflare as supported on Free as of October 2026. Cloudflare documents 10,000 free Neurons per day on the Workers Free plan; when your free allotment is exceeded, additional inference requests fail rather than incurring Workers Paid charges. The free Worker tier has other execution/request limits.

**Important for public sites:** CORS origin checks are not access control. To prevent strangers from abusing a public AI endpoint, add Cloudflare rate limiting and ideally Turnstile before promoting it widely. The code imposes length limits but not per-visitor request quotas. A free quota can run out even without billing charges. Verify current free limits in the Cloudflare dashboard before launch.

The website falls back to its existing prepared-answer FAQ when the Worker is unavailable or not yet configured.
