# Optional Open-ended Portfolio AI
The GitHub Pages site is static. The currently deployed assistant uses built-in answers until you configure a secure backend.

## Deploy
1. Create a Cloudflare Worker and paste in `worker/portfolio-ai.js`.
2. Set the Worker secret `OPENAI_API_KEY` in the Cloudflare dashboard (never put the key in GitHub or frontend JavaScript).
3. Optionally set `MODEL` to a supported model ID.
4. Deploy, and note its HTTPS URL.
5. In the website's `assistant.js`, replace the empty `window.PORTFOLIO_AI_ENDPOINT` setting with that HTTPS URL.

The worker restricts browser requests to the published website, limits message sizes, and avoids logging chat contents in this code. **Origin restrictions are not authentication**. Before public launch, configure provider-side spending limits, rate limiting (and ideally Cloudflare Turnstile or equivalent abuse protection). Anyone can send requests to a public Worker endpoint unless stronger controls are added.

The fallback assistant answers questions about the portfolio even without a Worker.
