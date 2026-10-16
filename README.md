# La Kimchi

Website for La Kimchi, the world's only (fictional) seven-star fermentation hotel.

- `src/pages/*.html` – page bodies (front-matter comment sets title/nav)
- `src/static/` – shared CSS, JS, favicon
- `build.mjs` – wraps pages with header/footer into `dist/`

```sh
npm install
npx wrangler dev      # local preview
npx wrangler deploy   # builds and deploys to la-kimchi.rhfd.net
```
