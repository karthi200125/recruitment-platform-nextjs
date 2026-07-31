# Production Metadata Audit

Scope inspected:
- app/
- public/
- config/
- package.json

## 1) Website Name

Found in the codebase:
- `Jobify`
  - Root layout metadata source: `const SITE_NAME = "Jobify"`
  - Site config: `name: "Jobify"`
  - Application name: `applicationName: SITE_NAME`

## 2) Short Name

Found in the codebase:
- `Jobify`
  - Site config: `shortName: "Jobify"`

## 3) Application Name

Found in the codebase:
- `Jobify`
  - Root layout metadata: `applicationName: SITE_NAME`
  - Site config: `applicationName: "Jobify"`

## 4) Default Title

Found in the codebase:
- `Jobify | Find Your Dream Job`
  - Root layout metadata: `default: "Jobify | Find Your Dream Job"`
  - Site config: `title: "Jobify | Find Your Dream Job"`

## 5) Title Template

Found in the codebase:
- `%s | Jobify`
  - Root layout metadata: `template: "%s | ${SITE_NAME}"`
  - Site config: `titleTemplate: "%s | Jobify"`

## 6) Description

Found in the codebase:
- `Find your dream job with verified companies. Search thousands of jobs, connect with recruiters, and grow your career with Jobify.`
  - Root layout metadata: `SITE_DESCRIPTION`
- `Find jobs, discover companies, and manage hiring opportunities with Jobify.`
  - Site config: `description`

## 7) Keywords

Found in the codebase:

Root layout metadata keywords:
- `Jobify`
- `Jobs`
- `Careers`
- `Hiring`
- `Job Board`
- `Remote Jobs`
- `Tech Jobs`
- `Software Engineer`
- `Developer Jobs`
- `Recruitment`
- `Employment`
- `Companies`
- `Internships`

Site config keywords:
- `Jobify`
- `jobs`
- `job portal`
- `job search`
- `careers`
- `employment`
- `recruitment`
- `hiring`
- `companies`
- `recruiters`
- `job board`
- `HR`
- `job marketplace`
- `career opportunities`

## 8) Author

Found in the codebase:
- `Jobify`
  - Root layout metadata authors: `[{ name: "Jobify", url: SITE_URL }]`
- `Jobify Team`
  - Site config authors: `[{ name: "Jobify Team" }]`

## 9) Creator

Found in the codebase:
- `Jobify`
  - Root layout metadata: `creator: "Jobify"`
  - Site config: `creator: "Jobify"`

## 10) Publisher

Found in the codebase:
- `Jobify`
  - Root layout metadata: `publisher: "Jobify"`
  - Site config: `publisher: "Jobify"`

## 11) Theme Color

Found in the codebase:
- `#6366F1`
  - Root layout viewport: `themeColor: "#6366F1"`
- `#000000`
  - Home page viewport: dark/light theme values in media query array

## 12) Background Color

No background color value was found in the metadata or viewport configuration.

## 13) Robots Policy

Found in the codebase:

Root layout robots:
- `index: true`
- `follow: true`
- `nocache: false`
- `googleBot.index: true`
- `googleBot.follow: true`
- `googleBot.max-image-preview: large`
- `googleBot.max-snippet: -1`
- `googleBot.max-video-preview: -1`

Site config robots:
- `index: true`
- `follow: true`

App robots route:
- `allow: '/'`
- `disallow: '/private/'`
- sitemap: `${baseUrl}/sitemap.xml`

## 14) OpenGraph Image

Found in the codebase:
- `/og-image.webp`
  - Root layout: `const OG_IMAGE = ${SITE_URL}/og-image.webp`
  - Site config: `ogImage: "/og-image.webp"`
- Actual file exists in `public/og-image.webp`

## 15) Twitter Image

Found in the codebase:
- `/og-image.webp`
  - Root layout `twitter.images: [OG_IMAGE]`
  - Site config `twitterImage: "/og-image.webp"`
- Actual file exists in `public/og-image.webp`

## 16) Canonical URL

Found in the codebase:
- Root layout canonical: `SITE_URL`
  - `alternates: { canonical: SITE_URL }`
- Home page canonical: `/`
  - `alternates: { canonical: '/' }`
- Companies page canonical: `/companies`
  - `alternates: { canonical: "/companies" }`

## 17) Existing favicon files

Referenced in root layout metadata:
- `/favicon.ico`
- `/favicon-16x16.png`
- `/favicon-32x32.png`

Referenced in site config:
- `/favicon.ico`

Actual files found in the workspace:
- No favicon files were found under `public/`

## 18) Existing PWA icons

Referenced in the codebase:
- `/manifest.webmanifest`
- `/apple-touch-icon.png`

Actual files found in the workspace:
- No PWA icon set files were found under `public/`

## 19) Apple Touch Icon

Found in the codebase:
- `/apple-touch-icon.png`
  - Root layout icons.apple entry
  - Site config `appleTouchIcon: "/apple-touch-icon.png"`

Actual file found in the workspace:
- No file exists under `public/`

## 20) Manifest assets

Found in the codebase:
- Manifest reference only:
  - Root layout metadata: `manifest: "/manifest.webmanifest"`
  - Site config: `manifest: "/manifest.webmanifest"`

Actual file found in the workspace:
- No `manifest.webmanifest` file exists under the project

## 21) Social links

Found in the codebase:

Footer social links:
- Twitter: `https://twitter.com`
- LinkedIn: `https://linkedin.com`
- Facebook: `https://facebook.com`
- Instagram: `https://instagram.com`

Site config social entries:
- Twitter: empty string
- GitHub: empty string
- LinkedIn: empty string

## 22) Organization information

Found in the codebase:
- `industry: "Job Portal"`
- `audience: ["Candidates", "Recruiters", "Organizations"]`
- `organization` role is represented in route behavior and user-role checks, such as `session.user.role !== "ORGANIZATION"`
- The companies page emits `@type: "Organization"` inside an `ItemList` JSON-LD payload

## 23) Existing metadata exports

Found in the codebase:
- Root layout export: `export const metadata: Metadata`
- Home page export: `export const metadata: Metadata`
- Auth sign-in page export: `export const metadata: Metadata`
- Auth sign-up page export: `export const metadata: Metadata`
- Companies page export: `export const metadata: Metadata`
- Dashboard page export: `export const metadata: Metadata`
- Create-company page export: `export const metadata: Metadata`
- Admin page export: `export const metadata = { title: "Admin" }`

## 24) Existing JSON-LD

Found in the codebase:
- Home page: `WebSite` JSON-LD with `SearchAction`
- Companies page: `ItemList` JSON-LD with `Organization` entries

## 25) Existing structured data

Found in the codebase:
- `application/ld+json` script block on the homepage
- `application/ld+json` script block on the companies page
- `WebSite` schema on the homepage
- `ItemList` / `Organization` schema on the companies page

## 26) Existing sitemap

Found in the codebase:
- `app/sitemap.ts`
- Static sitemap entries currently implemented:
  - `/`
  - `/jobs`
  - `/companies`

## 27) Existing robots

Found in the codebase:
- `app/robots.ts`
- Runtime robots policy:
  - allow `/`
  - disallow `/private/`
  - sitemap: `${baseUrl}/sitemap.xml`

## 28) Missing production metadata

The following production metadata gaps are visible from the codebase:
- No real `manifest.webmanifest` file exists in the project
- No favicon asset files exist under `public/`
- No apple-touch icon file exists under `public/`
- No PWA icon set files exist under `public/`
- The auth page metadata still uses `https://yourdomain.com` placeholder values
- Auth page OG/Twitter image references use `/og-image.png`, but the actual image file in the workspace is `/og-image.webp`
- `config/site.ts` contains empty social URLs for Twitter, GitHub, and LinkedIn
- `app/sitemap.ts` is still a static stub and does not include all live dynamic public content
- Root metadata and site config contain overlapping but not fully aligned values
- No `backgroundColor` metadata value is present

## Production-ready `config/metadata.ts` specification

The following specification matches the values that are already present in the codebase without inventing new data:

```ts
import type { Metadata, Viewport } from "next";

export const siteMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://www.jobify.com"),
  applicationName: "Jobify",
  title: {
    default: "Jobify | Find Your Dream Job",
    template: "%s | Jobify",
  },
  description:
    "Find your dream job with verified companies. Search thousands of jobs, connect with recruiters, and grow your career with Jobify.",
  keywords: [
    "Jobify",
    "Jobs",
    "Careers",
    "Hiring",
    "Job Board",
    "Remote Jobs",
    "Tech Jobs",
    "Software Engineer",
    "Developer Jobs",
    "Recruitment",
    "Employment",
    "Companies",
    "Internships",
  ],
  authors: [{ name: "Jobify", url: process.env.NEXT_PUBLIC_APP_URL ?? "https://www.jobify.com" }],
  creator: "Jobify",
  publisher: "Jobify",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL ?? "https://www.jobify.com",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://www.jobify.com",
    siteName: "Jobify",
    title: "Jobify | Find Your Dream Job",
    description:
      "Find your dream job with verified companies. Search thousands of jobs, connect with recruiters, and grow your career with Jobify.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.jobify.com"}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "Jobify",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobify | Find Your Dream Job",
    description:
      "Find your dream job with verified companies. Search thousands of jobs, connect with recruiters, and grow your career with Jobify.",
    creator: "@jobify",
    images: [`${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.jobify.com"}/og-image.webp`],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jobify",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "technology",
};

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366F1",
  colorScheme: "light",
};
```
