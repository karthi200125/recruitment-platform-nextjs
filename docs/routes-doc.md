# Next.js App Router Route Inventory

Scope audited:
- app/
- No src/app directory exists in this workspace.

## Summary

This project exposes a real App Router route surface composed of:
- 3 public marketing/search routes
- 4 authentication routes
- 1 dashboard overview route
- 1 candidate application-status route
- 1 recruiter applicant-management route
- 1 organization company-creation route
- 1 admin route
- 1 shared messaging route
- 1 profile networking route
- 1 settings route
- 1 user-profile dynamic route
- 1 network dynamic route
- 4 API routes
- 1 error fallback route
- 2 SEO route endpoints

## Existing Route Inventory

| Actual URL path | File system location | Route type | Navbar | Footer | Sitemap | Robots | Auth required | Dynamic | Search indexable |
|---|---|---|---|---|---|---|---|---|---|
| / | app/page.tsx | Public | Yes | No | Yes | Yes | No | No | Yes |
| /jobs | app/(public)/jobs/page.tsx | Public | Yes | Yes | Yes | Yes | No | No | Yes |
| /companies | app/(public)/companies/page.tsx | Public | Yes | Yes | Yes | Yes | No | No | Yes |
| /signin | app/(auth)/signin/page.tsx | Authentication | Yes | No | No | No | No | No | No |
| /signup | app/(auth)/signup/page.tsx | Authentication | Yes | No | No | No | No | No | No |
| /forgot-password | app/(protected)/forgot-password/page.tsx | Authentication | No | No | No | No | No | No | No |
| /reset-password | app/(protected)/reset-password/page.tsx | Authentication | No | No | No | No | No | No | No |
| /dashboard | app/(protected)/dashboard/page.tsx | Dashboard | No | No | No | No | Yes | No | No |
| /dashboard/jobStatus | app/(protected)/dashboard/jobStatus/page.tsx | Candidate | No | No | No | No | Yes | No | No |
| /dashboard/[jobId]/applicants | app/(protected)/dashboard/[jobId]/applicants/page.tsx | Recruiter | No | No | No | No | Yes | Yes | No |
| /messages | app/(protected)/messages/page.tsx | Dashboard | No | No | No | No | Yes | No | No |
| /network/[userId] | app/(protected)/network/[userId]/page.tsx | Dashboard | No | No | No | No | Yes | Yes | No |
| /setting | app/(protected)/setting/page.tsx | Dashboard | No | No | No | No | Yes | No | No |
| /createJob | app/(protected)/createJob/page.tsx | Recruiter | No | No | No | No | Yes | No | No |
| /create-company | app/(protected)/create-company/page.tsx | Organization | No | No | No | No | Yes | No | No |
| /selectrole | app/(protected)/selectrole/page.tsx | Dashboard | No | No | No | No | Yes | No | No |
| /admin | app/(protected)/admin/page.tsx | Dashboard | No | No | No | No | Yes | No | No |
| /subscriptions | app/(protected)/subscriptions/page.tsx | Dashboard | No | No | No | No | Yes | No | No |
| /userProfile/[userId] | app/(public)/userProfile/[userId]/page.tsx | Public | No | No | No | No | No | Yes | Yes |
| /api/auth/[...nextauth] | app/api/auth/[...nextauth]/route.ts | API | No | No | No | No | N/A | Yes | No |
| /api/jobs/search | app/api/jobs/search/route.ts | API | No | No | No | No | N/A | No | No |
| /api/upload | app/api/upload/route.ts | API | No | No | No | No | Yes | No | No |
| /api/webhook | app/api/webhook/route.ts | API | No | No | No | No | N/A | No | No |
| /robots.txt | app/robots.ts | Error/SEO route | No | No | Yes | Yes | No | No | Yes |
| /sitemap.xml | app/sitemap.ts | Error/SEO route | No | No | Yes | Yes | No | No | Yes |
| /404 | app/not-found.tsx | Error | No | No | No | No | No | No | No |

## Route Classification Notes

1. Public routes are only those that are intentionally accessible without login and are surfaced in marketing/search flow:
   - /
   - /jobs
   - /companies
   - /userProfile/[userId]

2. Authentication routes are the sign-in, sign-up, forgot-password, and reset-password flow.

3. Dashboard routes are protected pages that require a session and are app-owned operational surfaces.

4. Candidate, recruiter, and organization route intent is inferred from the specific page behavior and role checks inside the route code:
   - /dashboard/jobStatus → candidate-facing application tracking
   - /dashboard/[jobId]/applicants → recruiter-facing applicant management
   - /create-company → organization-facing company setup

5. The current sitemap implementation includes only the public static pages:
   - /
   - /jobs
   - /companies

6. The current robots implementation is global and allows crawling for the public site while explicitly disallowing /private/. There is no real /private/ route in the codebase.

## Production-Ready Config Shape

The discovered and supported route structure should be reduced to the following real route config:

```ts
export const routes = {
  public: {
    home: "/",
    jobs: "/jobs",
    companies: "/companies",
    userProfile: "/userProfile/[userId]",
  },

  auth: {
    signin: "/signin",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },

  dashboard: {
    root: "/dashboard",
    messages: "/messages",
    settings: "/setting",
    subscriptions: "/subscriptions",
    selectRole: "/selectrole",
    admin: "/admin",
    jobStatus: "/dashboard/jobStatus",
    applicants: "/dashboard/[jobId]/applicants",
    createJob: "/createJob",
    network: "/network/[userId]",
  },

  organization: {
    createCompany: "/create-company",
  },

  api: {
    auth: "/api/auth/[...nextauth]",
    jobsSearch: "/api/jobs/search",
    upload: "/api/upload",
    webhook: "/api/webhook",
  },

  seo: {
    robots: "/robots.txt",
    sitemap: "/sitemap.xml",
  },

  error: {
    notFound: "/404",
  },
} as const;
```
