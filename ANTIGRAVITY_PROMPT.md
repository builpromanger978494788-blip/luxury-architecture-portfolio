# Antigravity implementation brief — Sohan Mali replacement website

You have these three folders open in the same workspace:

- `D:\New Sohan Mail Web` — **your only write target**; build the replacement website here.
- `D:\sohanmail\smdark` — current production website; inspect it for visual reference and content only. **Do not modify it.**
- `D:\Sohanmali Admin pannel` — existing admin/CMS; inspect it for the data contract and Firebase integration only. **Do not modify it.**

Read `ANALYSIS.md`, `src/types/content.ts`, and the existing two folders before making implementation choices. Preserve the current public content, image catalogue, and the warm, editorial Sohan Mali visual identity, but produce a materially cleaner, more responsive, component-based website with improved hierarchy and typography.

## Non-negotiable architecture

Build in this folder as a production-quality **Vite + React + TypeScript** application. Keep the provided Firebase repository structure, but replace the small bootstrap `App.tsx` with the full implementation.

- Use Firebase modular SDK and subscribe to exactly `website/content` with `onValue()`. Firebase is the shared live source used by the existing admin panel.
- `src/data/content.seed.json` is offline/development fallback only. Never write it at runtime and do not make the old `data.json` or the old admin's localhost API a frontend dependency.
- Use `.env.local` for configuration, based on `.env.example`. Do not put Cloudinary secrets, Firebase Admin credentials, or new server secrets in the frontend.
- Use React rendering only; do not recreate the old solution with one large HTML file, DOM query selectors, inline `onclick`, `innerHTML`, or JavaScript-built HTML strings.
- Do not modify either old folder, even to "connect" the new site. The connection is Firebase.
- Do not hard-code fixed counts, projects, categories, service cards, stat cards, gallery images, principles, or select options. Render all repeating data with `.map()` and stable project `id` keys.

## Functional behaviour

Implement routes with React Router (or a robust equivalent):

| Route | Required content |
| --- | --- |
| `/` | Header; hero; dynamic hero service labels; home stats; selected work from `home.featured.cards`; philosophy; process; testimonial; footer. |
| `/projects` | Dynamic category filter (All plus every category in Firebase), responsive project grid, project quick view/detail dialog with title, category, description, full image gallery, keyboard close, accessible focus handling, and image fallbacks. |
| `/about` | About image, intro, both body texts, dynamic stats, dynamic principles list, footer. |
| `/services` | Heading and description, dynamic services with icons/features, CTA whose values come from `services.cta`, footer. |
| `/contact` | Contact details and a validated enquiry form; both select lists must come from Firebase. Because no message-submission backend exists in the provided system, do not pretend a form was sent. Use a clearly labelled `mailto:` fallback or explicitly add an integration only if you also configure it securely. |

Changes in the current admin must appear without a browser refresh: edited text, uploaded remote image URLs, project additions/deletions, a brand-new category, service changes, form option changes, etc. Do not set an arbitrary maximum number for dynamic items. Preserve the `rekhatan` category; display it as `रेखाटने` where appropriate, with a graceful title-cased fallback for future categories.

## Visual direction

Use the current `smdark/index.html` as an identity reference, not as code to copy:

- retain its calming luxury architecture character: cream `#faf8f5`, white, beige/sand, taupe/stone, deep warm charcoal; avoid bright gradients and generic dashboard styling;
- retain Cormorant Garamond for expressive display headlines and Jost for UI/body copy, but define a deliberate type scale, readable line lengths, better mobile sizing, and clear hover/focus states;
- design a refined sticky translucent header, simple mobile menu, generous whitespace, elegant images, restrained reveal transitions, and a consistent footer;
- use CSS modules or a well-organised global/component CSS structure. CSS custom properties are preferred. Respect `prefers-reduced-motion`;
- make every interactive control keyboard-accessible, visibly focusable, and touch-friendly; use meaningful image alt text generated from project/card data.

Use the copied legacy images from `public/media` via `assetUrl()`. That function must support both relative legacy paths and HTTPS Cloudinary/Firebase Storage URLs. Add responsive image sizing, `loading="lazy"` outside the initial viewport, and prevent layout shift with aspect ratios.

## Data mapping requirements

Use the provided `WebsiteContent` type fully. Key mapping details:

- Hero title is `title_line1` plus `title_highlight`; do not hard-code the old literal word "That" because the CMS has no field for it.
- `home.featured.cards[]` has its own `image`, category, and title and must render any number of cards, not only the old three.
- Render `about.principles.items[]`; the old website only updates its heading, which is one of the present defects.
- Render `services.items[]` and each `features[]`; do not assume four cards.
- `projects[]` is the authoritative project list. Use `thumbnail` for cards and every `images[]` entry in the dialog/gallery. Cope with empty galleries and missing thumbnails safely.
- Render footer contact and social content from `footer`, and contact page content/options from `contact`.

Do not use unsafe HTML injection. React text rendering should handle user-entered CMS strings safely.

## Suggested file organisation

Keep `src/lib/firebase.ts`, `src/lib/content-repository.ts`, `src/lib/asset-url.ts`, `src/hooks/useWebsiteContent.ts`, and `src/types/content.ts` as the integration layer. Add clear components such as `SiteHeader`, `SiteFooter`, `PageLoader`, `ProjectCard`, `ProjectFilters`, `ProjectDialog`, and page components under `src/pages`. Split styles coherently; do not create a monolithic component/file.

## Quality gate before handoff

1. Install dependencies and run `npm run build`; fix all TypeScript and build errors.
2. Run the local site with `.env.local` present and verify it initially loads live Firebase data. Also verify fallback behaviour by temporarily omitting the Firebase env values.
3. Verify every route directly (including browser refresh/deep link), the mobile header, project filtering, project dialog/gallery, image fallback, and reduced-motion behaviour.
4. Compare all content groups with `src/types/content.ts` and ensure no old copy or image is lost.
5. Report the files changed, the build result, and any limitation that needs client credentials or deployment configuration. Do not claim the contact form sends messages unless it truly does.
