# Production PWA Manifest Specification Data

## Scope

This document contains the production-ready PWA manifest planning data for the Jobify Next.js application. It is analysis-only and does not generate any code.

Sources reviewed:
- `app/layout.tsx`
- `app/page.tsx`
- `public/`
- `next.config.mjs`
- `package.json`
- `app/robots.ts`
- current metadata and icon references in the app shell

---

## 1. Final App Identity

### App identity
- name: Jobify
- short_name: Jobify
- description: Jobify is a job discovery and hiring platform for candidates, recruiters, and employers.

### Proposed production wording
- name: Jobify
- short_name: Jobify
- description: Find jobs, discover companies, and manage hiring opportunities with Jobify.

---

## 2. Theme Configuration

### Final recommended values
- theme_color: `#6366F1`
- background_color: `#09090B`
- display: `standalone`
- orientation: `portrait-primary`
- scope: `/`
- start_url: `/`

### Rationale
- The existing app shell already uses `#6366F1` as the primary brand color in `app/layout.tsx`.
- The landing page and main experience are dark-themed, so `#09090B` is the most compatible background value.
- `standalone` is the correct production install mode for a job portal PWA.

---

## 3. Icons

## Existing icon / image audit

### Current public assets available
- `public/og-image.webp`
- `public/logo.png`
- `public/noImage.webp`
- `public/noProfile.webp`
- `public/hero-dashboard.webp`
- `public/google.webp`
- `public/backgray.webp`

### Important note
The `public/` directory currently contains marketing and content images, but it does not contain a production PWA icon set.

## REQUIRED icon list

### 1. `favicon.ico`
- Status: Missing
- Recommended exact filename: `favicon.ico`
- Recommended dimensions: `32x32`
- Format: ICO
- Purpose: Browser tab icon and generic favicon fallback

### 2. `favicon.svg`
- Status: Missing
- Recommended exact filename: `favicon.svg`
- Recommended dimensions: vector (scalable)
- Format: SVG
- Purpose: High-quality modern browser favicon for light/dark pages and crisp scaling

### 3. `icon-192.png`
- Status: Missing
- Recommended exact filename: `icon-192.png`
- Recommended dimensions: `192x192`
- Format: PNG
- Purpose: Standard PWA install icon for Chrome, Edge, and Android home screen

### 4. `icon-512.png`
- Status: Missing
- Recommended exact filename: `icon-512.png`
- Recommended dimensions: `512x512`
- Format: PNG
- Purpose: High-resolution app icon and splash/install asset support

### 5. `apple-touch-icon.png`
- Status: Missing
- Recommended exact filename: `apple-touch-icon.png`
- Recommended dimensions: `180x180`
- Format: PNG
- Purpose: Apple home screen icon for iOS Safari and iPadOS install experience

### 6. Maskable icon(s)
- Status: Missing
- Recommended exact filename: `maskable-192.png`
- Recommended dimensions: `192x192`
- Format: PNG
- Purpose: Safe-area aware icon for Android adaptive icon and rounded mask support

### 7. Optional recommended maskable icon
- Recommended exact filename: `maskable-512.png`
- Recommended dimensions: `512x512`
- Format: PNG
- Purpose: Higher-resolution maskable asset for modern Android install surfaces

## Recommended icon production set
- `favicon.ico` — `32x32` — ICO — browser tab
- `favicon.svg` — vector — SVG — modern favicon
- `icon-192.png` — `192x192` — PNG — standard app icon
- `icon-512.png` — `512x512` — PNG — high-res install icon
- `apple-touch-icon.png` — `180x180` — PNG — iOS home screen
- `maskable-192.png` — `192x192` — PNG — Android maskable icon
- `maskable-512.png` — `512x512` — PNG — high-res maskable icon

---

## 4. Screenshots

## Should this project include PWA screenshots?
Yes. For a production-grade PWA, screenshots are recommended for installability and better Microsoft/Edge install prompts.

### Recommended screenshot set

### Desktop screenshot
- Recommended filename: `screenshots/desktop.png`
- Recommended dimensions: `1280x720`
- Orientation: landscape
- Purpose: Showcase the landing page and job discovery experience on larger screens

### Mobile screenshot
- Recommended filename: `screenshots/mobile.png`
- Recommended dimensions: `1080x1920`
- Orientation: portrait
- Purpose: Showcase the mobile job browsing and application flow

### Optional additional screenshot
- Recommended filename: `screenshots/dashboard.png`
- Recommended dimensions: `1280x720`
- Orientation: landscape
- Purpose: Showcase recruiter/dashboard workflow for install experience

---

## 5. Shortcuts

## Recommended app shortcuts for Jobify

### Shortcut 1: Browse Jobs
- name: Browse Jobs
- url: `/jobs`
- description: Open the jobs search experience

### Shortcut 2: Companies
- name: Companies
- url: `/companies`
- description: Explore employers and company profiles

### Shortcut 3: Dashboard
- name: Dashboard
- url: `/dashboard`
- description: Open the authenticated dashboard

### Shortcut 4: Sign In
- name: Sign In
- url: `/signin`
- description: Access the account experience

### Recommended shortcut rule
Shortcuts should only point to public, stable, and meaningful entry points.

---

## 6. Categories

## Recommended manifest categories
- `business`
- `productivity`
- `utilities`

### Optional category wording if supported by target browser
- `job-search`
- `employment`

### Recommended production category set
- `business`
- `productivity`
- `utilities`

---

## 7. Protocol Handlers

## Status
Not applicable for the current application.

### Reason
The current product does not expose or require custom URL protocol handling such as:
- `web+job`
- `mailto`
- `tel`
- custom app deep links

---

## 8. Share Target

## Status
Not applicable for the current production manifest unless the app will support direct share-in from the OS share sheet.

### Only recommended if implemented later
- action: `/share`
- method: `GET` or `POST`
- enctype: `application/x-www-form-urlencoded`
- params:
  - `title`
  - `text`
  - `url`

### Current recommendation
Do not include share_target in the initial production manifest unless the app specifically supports it.

---

## 9. Launch Handler

## Recommended production launch handling
- launch_handler:
  - client_mode: `navigate`
  - url: `/`

### Reason
This ensures the app opens to the home experience when launched from the OS or browser install prompt.

---

## 10. Display Overrides

## Recommended display override data
- display_override:
  - `standalone`
  - `minimal-ui`

### Reason
- `standalone` provides the cleanest installed app experience.
- `minimal-ui` is a good secondary fallback for browser support.

---

## 11. Edge / Chrome Install Recommendations

## Production install guidance
For Chrome and Edge, the manifest should be considered installable only if all of the following are true:
- a valid `manifest.webmanifest` or `manifest.ts` route exists
- the manifest exposes a valid icon set
- there is a `theme_color`
- the app has a clear `name` and `short_name`
- the app has a valid `display` mode
- the icon set includes at least one `192x192` PNG and one `512x512` PNG
- the app is served from HTTPS
- there is no placeholder host or local development host in production metadata

## Edge-specific recommendation
- Use a high-contrast brand icon with clear spacing
- Use the primary Jobify blue (`#6366F1`) for the theme color
- Avoid relying on text-heavy icons that become unreadable at small sizes

## Chrome-specific recommendation
- Ensure the generated icons are square and centered
- Provide at least one maskable icon for Android launch surfaces

---

## 12. Final Production Manifest Specification

## Canonical manifest data specification

### Identity
- name: Jobify
- short_name: Jobify
- description: Find jobs, discover companies, and manage hiring opportunities with Jobify.

### Theme
- theme_color: `#6366F1`
- background_color: `#09090B`
- display: `standalone`
- orientation: `portrait-primary`
- scope: `/`
- start_url: `/`

### Icons
- favicon.ico — `32x32` — ICO — browser tab
- favicon.svg — vector — SVG — scalable favicon
- icon-192.png — `192x192` — PNG — PWA install icon
- icon-512.png — `512x512` — PNG — PWA install/high-resolution icon
- apple-touch-icon.png — `180x180` — PNG — iOS icon
- maskable-192.png — `192x192` — PNG — Android adaptive icon
- maskable-512.png — `512x512` — PNG — Android adaptive high-resolution icon

### Screenshots
- `screenshots/desktop.png` — `1280x720` — landscape
- `screenshots/mobile.png` — `1080x1920` — portrait

### Shortcuts
- Browse Jobs → `/jobs`
- Companies → `/companies`
- Dashboard → `/dashboard`
- Sign In → `/signin`

### Categories
- `business`
- `productivity`
- `utilities`

### Protocol handlers
- Not applicable

### Share target
- Not applicable in the first production release

### Launch handler
- client_mode: `navigate`
- url: `/`

### Display overrides
- `standalone`
- `minimal-ui`

### Final production requirement summary
The production PWA configuration for this project should be built around:
- the Jobify brand
- a single canonical production domain
- a complete icon set
- a valid manifest route
- installability support in Edge and Chrome
- optional screenshots for better install surfaces

This file provides the exact manifest planning data needed to build a production-quality `manifest.webmanifest` or `manifest.ts` later, without generating code yet.
