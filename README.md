# KULDEEP COMMUNICATION & ELECTRONICS (KCEL)

Production static website for KULDEEP COMMUNICATION & ELECTRONICS (KCEL), a New Delhi based wholesaler and supplier of lithium-ion, NMC, and LFP battery cells.

The site is built with Next.js static export and Decap CMS. Product inventory lives in Git as JSON under `content/products`, so CMS edits commit back to the repository and trigger a Cloudflare Pages rebuild.

## Setup

Requirements:

- Node.js 20 or newer
- npm
- Git

Install dependencies:

```bash
npm install
```

Start the website locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build the production static site:

```bash
npm run build
```

Preview the exported site:

```bash
npm run preview
```

The static output is generated in `out`.

## Product Inventory

Seed product data is stored here:

```text
content/products/
```

Each product is a JSON file with:

- Product name
- Product description
- Image path
- Specifications
- Price
- Stock status
- Sort order

Uploaded product images from Decap CMS are stored in:

```text
public/uploads/
```

## Decap CMS

The admin portal is available at:

```text
/admin
```

CMS configuration lives at:

```text
public/admin/config.yml
```

Before production, update these values:

```yml
backend:
  repo: your-github-org/kcel-website
  branch: main
  base_url: https://kcel.pages.dev

site_url: https://kcel.pages.dev
display_url: https://kcel.pages.dev
```

For local CMS testing, run the local Decap backend in one terminal:

```bash
npm run cms:local
```

Then run the site in another terminal:

```bash
npm run dev
```

Open `http://localhost:3000/admin`.

## Cloudflare Pages Deployment

1. Push this repository to GitHub.
2. In Cloudflare, go to **Workers & Pages**.
3. Create a new Pages project from the GitHub repository.
4. Use these build settings:

```text
Framework preset: Next.js
Build command: npm run build
Build output directory: out
Node.js version: 20 or newer
```

5. Deploy once to create the temporary `pages.dev` URL.
6. Update `public/admin/config.yml` with the real GitHub repo and `pages.dev` URL.
7. Commit and push the CMS config update.

## GitHub Authentication For CMS

Decap CMS uses GitHub OAuth so KCEL staff can log in and publish product edits.

Create a GitHub OAuth app:

1. Go to GitHub **Settings > Developer settings > OAuth Apps**.
2. Create a new OAuth app.
3. Use the Cloudflare Pages site as the homepage URL, for example:

```text
https://kcel.pages.dev/admin
```

4. Use the callback URL:

```text
https://kcel.pages.dev/api/auth/callback
```

5. Copy the GitHub client ID and client secret.
6. In Cloudflare Pages, go to **Settings > Environment variables**.
7. Add:

```text
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

8. Redeploy the Pages project.

The OAuth code is included in:

```text
functions/api/auth.js
functions/api/auth/callback.js
```

Do not commit OAuth secrets to the repository.

## Moving From pages.dev To The Final Domain

After the client buys the domain through Cloudflare:

1. Open the Cloudflare Pages project.
2. Go to **Custom domains**.
3. Add the final domain, for example `kcelbattery.com`.
4. Follow Cloudflare DNS prompts until the domain is active.
5. Update `public/admin/config.yml`:

```yml
base_url: https://kcelbattery.com
site_url: https://kcelbattery.com
display_url: https://kcelbattery.com
```

6. Update the GitHub OAuth app:

```text
Homepage URL: https://kcelbattery.com/admin
Authorization callback URL: https://kcelbattery.com/api/auth/callback
```

7. Commit and push the config change.
8. Redeploy on Cloudflare Pages.

## CMS User Guide For KCEL Staff

### 1. Access The Admin Portal

Go to:

```text
https://your-domain.com/admin
```

Use the final domain once it is connected. During testing, use the `pages.dev` address.

### 2. Log In

Click **Login with GitHub**.

Use the approved GitHub account that has write access to the website repository. After login, the CMS dashboard opens.

### 3. Modify An Existing Product Price

1. Click **Products**.
2. Select the product to edit.
3. Find the **Price** field.
4. Enter the updated price or quotation text.
5. Click **Save**.

Decap CMS commits the change to GitHub. Cloudflare Pages then rebuilds and republishes the site.

### 4. Add A New Product

1. Click **Products**.
2. Click **New Product**.
3. Enter the product name, category, description, price, stock status, and specifications.
4. Upload a product image.
5. Set the sort order if the product should appear in a specific position.
6. Click **Save**.

### 5. Publish Timeline

After saving, the CMS commits the update to GitHub. Cloudflare Pages automatically starts a rebuild. Most small content changes appear on the live site within one to three minutes, depending on Cloudflare queue time.

## Contact Details Used On The Site

```text
Business: KULDEEP COMMUNICATION & ELECTRONICS (KCEL)
Address: RZ-26P/54, Street No.2, Indra Park, Palam Colony, New Delhi-110045
Phone: 8799759565
Phone: 9990941779
Email: kuldeeptelecommunication@gmail.com
WhatsApp CTA: https://wa.me/918799759565
```
