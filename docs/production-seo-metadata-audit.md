# Production SEO & Metadata Audit Report

## Scope

This document captures the metadata, routing, asset, and SEO configuration that is currently present in the Next.js application and the remaining production deployment requirements.

Sources reviewed:
- `app/layout.tsx`
- `app/page.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `package.json`
- `next.config.mjs`
- `README.md`
- `constants/site.ts`
- `public/`
- `.env`
- route files under `app/`

---

## 1. Website Identity

### Website identity summary
- Website name: Jobify
- Brand name: Jobify
- Short name: Jobify
- Default page title: Jobify | Find Your Dream Job
- Title template: `%s | Jobify`
- Website description: Find your dream job with verified companies. Search thousands of jobs, connect with recruiters, and grow your career with Jobify.
- Business description: Job board / recruiting marketplace for candidates, recruiters, and companies.
- Author: Jobify / Jobify Team
- Organization name: Jobify
- Website language: English (`en`)
- Timezone: Not defined
- Country: Not explicitly defined; default locale is `en_US`
- Primary audience: Job seekers, recruiters, hiring organizations, talent acquisition teams
- Industry: Job portal / HR tech / recruitment platform
- Category: Technology

### Metadata source
- Global metadata is defined in `app/layout.tsx`
- Home page metadata is defined in `app/page.tsx`

---

## 2. Domain Information

### Domain state
- Production URL: Not fully finalized; current fallback references are:
  - `https://job-portal-hmif.vercel.app`
  - `https://www.jobify.com`
- Development URL: `http://localhost:3000`
- Base URL source: `NEXT_PUBLIC_URL`
- Canonical URL: Not yet standardized across all pages
- WWW vs non-WWW: Not standardized
- HTTPS status: Production should be HTTPS-only, but local env values still use HTTP

### Localhost references that must be removed before production
- `.env` currently contains:
  - `NEXTAUTH_URL='http://localhost:3000'`
  - `NEXT_PUBLIC_URL='http://localhost:3000'`
- `README.md` still instructs using `http://localhost:3000`

### Environment variable risk
- The project uses multiple environment-driven base URL variables:
  - `NEXT_PUBLIC_URL`
  - `NEXT_PUBLIC_APP_URL`
  - `NEXTAUTH_URL`
- These must be aligned on a single production host before deployment.

---

## 3. Website Pages

## Public routes

| Route | Page name | Type | Index? | Priority | Change frequency | Last modified source |
|---|---|---|---|---|---|---|
| `/` | Home | Static | Yes | 1.0 | Weekly | `app/page.tsx` |
| `/jobs` | Jobs listing | Static route with query params | Yes | 0.9 | Weekly | `app/(public)/jobs/page.tsx` |
| `/companies` | Companies listing | Static | Yes | 0.8 | Weekly | `app/(public)/companies/page.tsx` |
| `/userProfile/[userId]` | Public user profile | Dynamic | Conditional | 0.6 | Monthly | No dedicated metadata contract |
| `/signin` | Sign in | Static | No | 0.0 | Never | `app/(auth)/signin/page.tsx` |
| `/signup` | Sign up | Static | No | 0.0 | Never | `app/(auth)/signup/page.tsx` |
| `/forgot-password` | Forgot password | Static | No | 0.0 | Never | `app/(protected)/forgot-password/page.tsx` |
| `/reset-password` | Reset password | Static | No | 0.0 | Never | `app/(protected)/reset-password/page.tsx` |

## Routes that should not appear in sitemap
- `/dashboard`
- `/dashboard/*`
- `/messages`
- `/network/*`
- `/selectrole`
- `/create-company`
- `/createJob`
- `/subscriptions`
- `/admin`
- `/signin`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/api/*`
- `/_next/*`

## Dynamic pages
- `/userProfile/[userId]`
- Any future job detail or company detail routes if they are not stable/indexable

### Recommended indexing policy
- Index: `/`, `/jobs`, `/companies`
- Noindex: auth, dashboard, admin, private account, and profile-only internal routes

---

## 4. Robots Requirements

### Current robots file
The file `app/robots.ts` exists but is not production-ready.

Current behavior:
- `allow: '/'`
- `disallow: '/private/'`
- sitemap target is `NEXT_PUBLIC_URL/sitemap.xml`

### Required robots production rules
- Allow:
  - `/`
  - `/jobs`
  - `/companies`
- Disallow:
  - `/dashboard`
  - `/messages`
  - `/network`
  - `/signin`
  - `/signup`
  - `/forgot-password`
  - `/reset-password`
  - `/admin`
  - `/create-company`
  - `/createJob`
  - `/selectrole`
  - `/subscriptions`
  - `/api/*`
  - `/_next/*`

### Admin pages
- Should be blocked from search indexing

### Dashboard pages
- Should be blocked from search indexing

### Auth pages
- Should be blocked from search indexing

### API routes
- Should be blocked from search indexing

### Search pages
- Search/filter pages should be treated carefully; if they are not intended for independent indexing, they should not be in sitemap

### Upload routes
- Should be blocked from robot crawlers

---

## 5. Sitemap Requirements

## Current status
- `app/sitemap.ts` exists, but it is currently commented out and not active.

## Recommended sitemap planning

| URL | Priority | Change frequency | Last modified strategy | Notes |
|---|---:|---|---|---|
| `/` | 1.0 | Weekly | Static or build-time date | Core homepage |
| `/jobs` | 0.9 | Daily | Use latest job publish/update timestamp | Public listing page |
| `/companies` | 0.8 | Weekly | Use latest company update time | Public company directory |
| `/userProfile/[userId]` | 0.6 | Monthly | Only if intentionally public | Usually exclude |

### Dynamic route treatment
- Job detail pages: should only be included if they have strong canonical/public value and stable URLs
- Company pages: should only be included if they are stable and public-facing
- Profile pages: should be excluded by default unless explicitly approved for indexing

### Sitemaps should exclude
- Auth routes
- Dashboard routes
- Account routes
- Internal/private routes
- User-specific dynamic pages
- Admin pages

---

## 6. Manifest Requirements

## Current state
There is no active `manifest.ts` or `manifest.webmanifest` in the app.

### Manifest information needed
- App name: Jobify
- Short name: Jobify
- Description: Jobify Job Discovery and Hiring Platform
- Theme color: `#6366F1`
- Background color: Not currently defined
- Display mode: `standalone`
- Orientation: `portrait-primary` or unspecified
- Scope: `/`
- Start URL: `/`

### Icons currently available in `public/`
- `og-image.webp`
- `logo.png`
- `noImage.webp`
- `noProfile.webp`
- `hero-dashboard.webp`
- `google.webp`
- `backgray.webp`

### Required manifest icons missing
- favicon
- favicon-16x16
- favicon-32x32
- apple-touch-icon
- icon-192
- icon-512
- maskable icons

### PWA readiness gap
The app is not installable yet because the manifest and icon files are incomplete.

---

## 7. Images

### Existing SEO/social image assets
- Open Graph image: `public/og-image.webp`
- Twitter image: currently uses OG image
- Logo: `public/logo.png`
- Favicon: Missing
- Apple icon: Missing
- Social sharing image: `public/og-image.webp`

### Broken image references detected
- Auth metadata pages reference `/og-image.png`, but no such asset exists in `public/`
- Auth pages are using placeholder metadata roots like `https://yourdomain.com`

### Assets missing for production SEO
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `icon-192.png`
- `icon-512.png`
- `maskable-icon.png`

---

## 8. SEO Information

### Existing metadata
The project already contains these metadata types:
- `title`
- `description`
- `keywords`
- `authors`
- `creator`
- `publisher`
- `metadataBase`
- `alternates.canonical`
- `robots`
- `openGraph`
- `twitter`
- `appleWebApp`
- `icons`
- `manifest`

### Existing structured data
- Homepage includes a `WebSite` JSON-LD object in `app/page.tsx`
- Companies page includes an `ItemList` JSON-LD object in `app/(public)/companies/page.tsx`

### Missing SEO elements
- No active sitemap generation
- No complete manifest implementation
- No complete favicon/PWA icon set
- No stable canonical domain standardization across pages
- No dedicated metadata for dynamic route pages
- No consistent `robots` strategy for private/internal URL patterns
- No `noindex` metadata for some sensitive routes beyond a few pages

### SEO quality concerns
- Metadata is defined in multiple places (`app/layout.tsx` and `app/page.tsx`), which may lead to duplication or drift
- Auth pages still point to placeholder domains and image paths
- Some page metadata sources are inconsistent with the production domain

---

## 9. PWA Readiness

### Current state
- Installable: No
- Manifest complete: No
- Icons complete: No
- Offline support configured: No

### Missing requirements
- Manifest route
- Service worker/offline support
- Maskable icon support
- Proper app icon sizes
- Complete PWA configuration

---

## 10. Technical SEO Audit

## Current findings
- Duplicate metadata definitions exist across root and homepage metadata objects
- Missing titles and descriptions are possible on some routes that do not define metadata
- Canonical URLs are inconsistent or absent on many child pages
- Open Graph images are partially present but not fully standardized
- Twitter cards are partially present but rely on the same OG image assumption
- Robots rules are incomplete
- Sitemap is inactive
- Broken metadata asset references exist
- Localhost URLs remain in `.env`
- Hardcoded placeholder domain values exist in auth page metadata

---

## 11. Final Production Checklist

### Required before deployment
- [ ] Choose one final production base URL and use it consistently everywhere
- [ ] Replace localhost values in `.env` with the production host
- [ ] Align `NEXT_PUBLIC_URL`, `NEXT_PUBLIC_APP_URL`, and `NEXTAUTH_URL`
- [ ] Remove placeholder domain values from auth page metadata
- [ ] Implement a production-ready `robots.ts`
- [ ] Implement a production-ready `sitemap.ts`
- [ ] Add a complete `manifest.ts` or `manifest.webmanifest`
- [ ] Add missing favicon and PWA icon assets
- [ ] Standardize OG image and Twitter image filenames and paths
- [ ] Ensure all public pages have meaningful titles and descriptions
- [ ] Add `noindex` rules to all internal/private routes
- [ ] Add structured data where needed for public business pages
- [ ] Confirm that social sharing previews work with the final image assets
- [ ] Verify the app is crawler-safe and privacy-safe before launch

---

## Production Implementation Summary

### Already present
- Basic root metadata
- Homepage metadata
- `robots.ts`
- `sitemap.ts` stub
- `public/og-image.webp`
- `public/logo.png`

### Missing for production-grade SEO and PWA
- Production-ready `robots.ts`
- Production-ready `sitemap.ts`
- Complete `manifest.ts`
- Complete favicon and icon asset set
- Production hostname normalization
- Standardized canonical metadata
- Verified OG/Twitter image assets
- Noindex handling for all private routes

This file is intended as a single source of truth for planning the production SEO implementation: metadata, robots, sitemap, manifest, social sharing assets, and remaining deployment blockers.
