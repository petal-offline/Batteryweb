# KCEL Website Agent Handoff

This project is the production website for KULDEEP COMMUNICATION & ELECTRONICS (KCEL), hosted on Cloudflare Pages from GitHub repo `petal-offline/Batteryweb`.

## Current Stack

- Next.js static export with `output: "export"` in `next.config.mjs`
- Tailwind CSS in `src/app/globals.css`
- Product data as JSON files in `content/products/`
- Product photos as static files in `public/uploads/product-images/`
- Decap CMS admin UI in `public/admin/`
- Cloudflare Pages Functions for GitHub OAuth in `functions/api/auth.js` and `functions/api/auth/callback.js`

## Important URLs

- Temporary Cloudflare Pages site: `https://batteryweb-8d0.pages.dev/`
- Temporary admin panel: `https://batteryweb-8d0.pages.dev/admin/`
- Intended final domain: `https://thekcel.com/`
- Intended final admin panel: `https://thekcel.com/admin/`
- GitHub repository: `https://github.com/petal-offline/Batteryweb`

## Local Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

`npm run build` must produce the static output in `out/`; Cloudflare Pages serves that folder.

## Cloudflare Pages Settings

Use these build settings:

```text
Framework preset: Next.js
Build command: npm run build
Build output directory: out
Node.js version: 20 or newer
```

Cloudflare Pages should be connected to GitHub repo `petal-offline/Batteryweb`, branch `main`.

## Decap CMS Setup

The CMS does not have its own password database. KCEL staff log in with GitHub through Decap CMS. Any staff account that needs to edit products must have write access to `petal-offline/Batteryweb`.

Cloudflare Pages must have these environment variables:

```text
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

These come from a GitHub OAuth App.

For the current test domain, configure the GitHub OAuth App as:

```text
Homepage URL: https://batteryweb-8d0.pages.dev/admin/
Authorization callback URL: https://batteryweb-8d0.pages.dev/api/auth/callback
```

When `thekcel.com` is connected, update the OAuth App to:

```text
Homepage URL: https://thekcel.com/admin/
Authorization callback URL: https://thekcel.com/api/auth/callback
```

Then update `public/admin/config.yml`:

```yml
backend:
  base_url: https://thekcel.com

site_url: https://thekcel.com
display_url: https://thekcel.com
```

Commit and push the config change after the domain is live.

## Product Editing Flow

CMS product records map to JSON files in `content/products/`.

The public product section is intentionally category-first:

- Homepage shows only `NCM Cells` and `LFP Cells`.
- The old broad Lithium-ion category card has been removed.
- Each category card opens a modal listing all products for that category.
- Product-level `Inquire` opens a two-number WhatsApp picker.
- `Out of Stock` disables the product-level enquiry button.
- Product images should be static repo assets under `public/uploads/product-images/`, not external hotlinks.

The public UI fetches product JSON from GitHub at runtime as a freshness layer, with static build data as fallback. This lets stock/text edits appear quickly after the CMS commits to GitHub. Newly uploaded static images still need the normal Cloudflare Pages rebuild before they are served from the site domain.

To add a product:

1. Go to `/admin/`.
2. Log in with a GitHub account that has repo write access.
3. Open `Products`.
4. Click `New Product`.
5. Fill name, category (`NCM` or `LFP`), description, voltage, capacity, image, price, stock status, sort order, and specifications.
6. Save/publish.

To remove a product:

1. Go to `/admin/`.
2. Open `Products`.
3. Select the product.
4. Delete it from the CMS.
5. Save/publish.

Decap commits the content change to GitHub. Cloudflare Pages rebuilds automatically. Changes usually appear in one to three minutes.

## Design Notes

- The hero is intentionally visual and industrial, using `public/images/battery-cells-lab.png`.
- The floating WhatsApp CTA links to `https://wa.me/918799759565`.
- Mobile hero spacing has been tuned to avoid the white intro section overlapping the trust tags on short phone viewports.
- Product category cards use hover/focus reveal overlays with a single `See All` action.

## Before Handoff

Run:

```bash
npm run typecheck
npm run build
git status --short --branch
```

If making changes for production, commit and push to `main`. Cloudflare Pages should redeploy from that branch.
