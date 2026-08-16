# Batteryweb

A client-facing battery catalogue and enquiry website built for a battery supplier.

## What it does

- Presents NMC and LFP cell inventory from JSON files
- Shows product details, stock status, and specifications
- Provides product enquiry flows
- Uses a small Git-based content workflow for product updates
- Exports a static site for deployment

## Stack

- Next.js static export
- React and TypeScript
- Tailwind CSS
- Decap CMS
- Cloudflare Pages Functions

## Repository layout

- content/products/ contains product records
- public/uploads/product-images/ contains static product images
- functions/api/ contains the OAuth callback used by the content workflow
- src/ and components/ contain the site UI

## Run locally

Requirements: Node.js 20 or newer and npm.

~~~bash
npm install
npm run dev
~~~

Open http://localhost:3000. For a production export:

~~~bash
npm run build
npm run preview
~~~

The static output is generated in out/.

## Configuration note

Environment-specific deployment URLs, OAuth values, and client contact details are intentionally omitted from this public README. Use .dev.vars.example as a placeholder and keep real values outside Git.

This is a client project and is kept as a supporting example rather than a featured profile repository.
