# Existing-system analysis

## Scope and preservation rule

This folder is the replacement website only. Do **not** edit `D:\sohanmail\smdark` or `D:\Sohanmali Admin pannel` while building it. They are the current production site and CMS/admin application.

## What currently exists

| Area | Location | Finding |
| --- | --- | --- |
| Current public site | `D:\sohanmail\smdark\index.html` | One ~99 KB HTML file containing layout, CSS, navigation, page state, animation code, and Firebase code together. |
| Current visual direction | `D:\sohanmail\smdark\index.html` | Warm cream / beige / taupe palette; Cormorant Garamond display type; Jost body type; minimalist editorial architecture styling. |
| Content CMS | `D:\Sohanmali Admin pannel` | Electron application hosting an Express server and an HTML/JS admin interface. |
| Canonical live content | Firebase Realtime Database | The admin and website both use `website/content` in the `sohanmali-77014` project. |
| Backup/first-run content | `data.json` and `%APPDATA%/Architecture Admin Panel/data.json` | Local fallback/seed used by the admin application. It is not guaranteed to be the latest production data. |
| Assets | copied to `public/media` | 83 legacy image files from `arch`, `images`, `interior`, `paint`, `red`, and `ren`. Use paths through `assetUrl()`. |

## Current data contract

The full typed contract is in `src/types/content.ts`. The top-level shape is:

```text
website/content
├── site                 logo, nav_cta
├── home                 hero, stats[], featured.cards[], philosophy, process.steps[], testimonial
├── projects[]           id, title, category, description, thumbnail, images[]
├── about                text, stats[], principles.items[]
├── services             items[], cta
├── contact              contact details and select options[]
└── footer               text, contact data, social[]
```

The checked-in seed currently has 12 projects across `architecture`, `interior`, `residential`, and `renovation`. The existing admin has explicit support for an additional `rekhatan` (रेखाटने) category, and `add_rekhatan.js` can add a 13th Sketches & Drawings project to its AppData copy. Therefore the Firebase value must be treated as authoritative and categories must be generated dynamically; do not hard-code the seed's project count or category list.

## Why changes currently fail or appear inconsistent

1. The website is a static DOM shell. Firebase updates some text, but many repeating sections only mutate already-existing DOM nodes by index. A new featured card, principle, service card, or other repeated record has no matching node, so it is silently ignored.
2. Existing project cards are rebuilt from Firebase, but filtering, styles, modal data, and strings are stitched together with HTML/inline JavaScript. This makes data containing quotes or unfamiliar categories fragile and forces a full DOM rebuild on each update.
3. The admin writes to three places: Firebase, its local AppData `data.json` backup, and the old HTML publisher. The three versions can diverge. The local checked-in seed and the active Firebase content are not guaranteed to have the same project list.
4. The admin's local image upload endpoint writes into the **old** `smdark` directory. Cloudinary URLs work remotely, but relative paths only work when the new website has a copy of the legacy media catalogue.
5. The admin panel is not authenticated and stores Cloudinary credentials in `server.js`. The replacement frontend must never receive Cloudinary secrets or add write access to Firebase; it only needs Firebase read access.

## Replacement architecture

The new application is a Vite + React + TypeScript frontend. `src/lib/content-repository.ts` is the one read path: it subscribes to Firebase with `onValue()` and re-renders React components from the received object. The bundled `src/data/content.seed.json` is development/offline fallback only. It is not a competing CMS.

This means an admin Save / Add / Delete that writes Firebase changes visible website UI automatically, including new projects, new categories, removed rows, changed service options, and changed gallery images. No publish-to-HTML step should be required for the new site.

## Integration boundaries

- Read from Firebase path: `website/content`.
- Use the existing Firebase project config via Vite environment variables. Copy `.env.example` to `.env.local` for local development.
- Resolve legacy relative images with `assetUrl(path)`, which maps `arch/ap1.jpg` to `/media/arch/ap1.jpg`; leave HTTPS Cloudinary/Firebase Storage URLs unchanged.
- Do not depend on the admin's random local Express port, its `/api/*` routes, or its local data file in browser production code.
- Do not edit the old publisher endpoint to target this React app. Firebase is the integration channel.

## Delivery checks

1. `npm install`, then `npm run build` succeeds in this folder.
2. With `.env.local` configured, an admin edit in Firebase appears on the open new site without refresh; an added project appears and a deleted one disappears.
3. Every old data field in the TypeScript contract has a visible rendering home or a sensible source-of-truth use; no content is replaced by hard-coded copy.
4. Project filters are data-driven, project modal galleries work with legacy and remote images, and all pages work at mobile, tablet, and desktop widths.
