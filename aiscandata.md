# AI Scan Data

## Route Performance

| Route | Route Size | First Load JS | Status | Main Problem | Priority |
|------|------------|---------------|--------|--------------|----------|
| `/` | Not explicitly broken out in generated build manifest; root app bundle is shared | Shared client chunks are heavier than needed | Healthy but not ultra-light | Global CSS + app-wide client wrappers | MEDIUM |
| `/jobs` | Build manifest shows route chunks plus shared bundles; no single route-size metric surfaced | Likely moderate because of client `JobsClient`, query, and AI matching UI | Reasonably structured; AI is server-side | AI fetch client route + rich job cards | HIGH |
| `/dashboard` | No direct route-size budget visible in manifest; overview loads in one route | Charts and card components are lazy-loaded but still all in overview initial payload | Good overall | Overview includes multiple cards/charts, still acceptable | LOW |
| `/dashboard/[jobId]/applicants` | Not individually visible in manifest excerpt | Likely moderate because of table + filters + applicant interactions | Acceptable | Heavy table code and filters | MEDIUM |
| `/companies` | Shared bundle dominates route size; no explicit route budget shown | Likely moderate | Reasonably okay | Client filters and company cards | LOW |
| `/userProfile/[userId]` | Manifest shows numerous chunks for this route | Higher than necessary likely due to many profile sections and client tags | Somewhat heavy | Many client sections assembled in one profile page | MEDIUM |
| `/messages` | Not individually visible in manifest excerpt | Can be heavy because many client chat components are loaded together | Potentially chat-heavy | Many client components around real-time-like UI | MEDIUM |
| `/resume-analyse` | Likely moderate to heavy due to analysis UI | Could carry chart and form logic | Potentially expensive | Analysis-heavy UI and AI outputs | MEDIUM |
| `/createJob` | Manifest shows route bundle | Likely moderate because rich editor form is involved | Not severe | `react-quill` + job form code | MEDIUM |
| authentication pages | Shared route bundle is the main concern | Not severe | Good | Mostly forms | LOW |

> The build output in `.next` confirms a large number of shared chunks and route chunks, but it does not provide a clean per-route size breakdown in the manifest excerpt. That is common in Next.js builds: route size is not the same as network weight, because chunk sharing and dynamic imports can affect actual loading time in different ways.

## Critical Files

### File: `app/(public)/jobs/JobsClient.tsx`

- Severity: HIGH
- Why it matters: This is the main jobs UI client boundary and the place where job matching begins in the browser.
- Current behavior: It reads `initialJobs`, computes `selectedJobId`, and runs a React Query fetch to `/api/aiJobMatch` with the current page job IDs.
- Performance problem: The browser triggers AI processing after initial render; the query key includes `jobIds`, so the client does more work when the list changes. This is not a blocking server render problem, but it does add unnecessary client fetch churn and UI complexity.
- Recommended optimization: Keep the AI fetch server-side, but throttle it, dedupe it, and avoid running it again on minor param changes. If the jobs list is large, only request AI for the selected job or the first N visible jobs.
- Expected benefit: Lower initial jobs-page interaction cost and less redundant network work.
- Difficulty: MEDIUM
- Dependencies affected: jobs page, AI route, matching UI, React Query

### File: `app/api/aiJobMatch/route.ts`

- Severity: HIGH
- Why it matters: This is the runtime choke point for the AI jobs workflow.
- Current behavior: Auth check -> `getServerSession` -> `getAIUserProfile` -> `db.job.findMany` -> `getJobAIMatches` -> Gemini.
- Performance problem: This is a server request with several steps and a potentially slow external AI request. If Gemini is slow, the route can block the user while the job page is already loaded.
- Recommended optimization: Reduce profile payload, cap job count, and skip non-visible jobs; prefer cheaper fallback when the request is already slow.
- Expected benefit: Better latency and lower Vercel timeout risk.
- Difficulty: MEDIUM
- Dependencies affected: AI matching, jobs page, database, Gemini API

### File: `actions/ai/jobs/get-job-ai-matches.ts`

- Severity: HIGH
- Why it matters: This is the expensive external AI path.
- Current behavior: Builds a large prompt using the candidate profile and job list, then calls Gemini with a large JSON response schema and high token budget.
- Performance problem: Expensive AI prompt generation is not free server work. It becomes more risky under cold starts or concurrent requests.
- Recommended optimization: Reduce job count, trim prompt size, and prefer deterministic fallback sooner if the request is already large or in a degraded state.
- Expected benefit: Lower runtime latency and better Vercel stability.
- Difficulty: MEDIUM
- Dependencies affected: job AI route, jobs page, Gemini API

### File: `actions/job/get-filter-all-jobs.ts`

- Severity: MEDIUM
- Why it matters: This is the main job list server query.
- Current behavior: It includes `user`, `company`, `jobApplications`, and `_count` for each job row, then serializes that data to the browser.
- Performance problem: This is not disastrous, but it is more than the job list needs for initial rendering, especially when a lot of fields are unused on the client.
- Recommended optimization: Tighten the `select` and avoid sending full nested relation shapes that are not reused in the UI.
- Expected benefit: Less serialized payload and lower DB load.
- Difficulty: LOW
- Dependencies affected: `/jobs`, `JobsClient`, job list rendering

### File: `app/layout.tsx`

- Severity: MEDIUM
- Why it matters: This file is the app root and is loaded across routing.
- Current behavior: It imports global CSS for `react-quill` and declares the app-wide Inter font.
- Performance problem: Global CSS from a rich text editor is not route-scoped and is heavier than necessary for routes that do not use it.
- Recommended optimization: Move editor-specific CSS to the form route or imported component, not the root layout.
- Expected benefit: Smaller global bundle and better route isolation.
- Difficulty: LOW
- Dependencies affected: all routes, form pages, initial page load

## Database Optimization

### Query: `db.user.findUnique` in `getAIUserProfile`

- File: `actions/ai/jobs/get-ai-user-profile.ts`
- Function: `getAIUserProfile`
- Model: `User`
- Current query: Finds a user and includes `educations`, `experiences`, `projects` and skills in one complex nested read.
- Problem: This can be a large payload for a single profile when the candidate has many experiences or projects.
- Recommended query shape: Keep only the fields needed for matching: profession, skills, city, state, country, skill-surface fields, and a bounded number of experiences/projects.
- Index recommendation if applicable: No index needed for a single-user lookup by `id`; the issue is payload size, not lookup slowness.
- Expected impact: Lower server memory and lower matching latency.

### Query: `db.job.findMany` in `/api/aiJobMatch/route.ts`

- File: `app/api/aiJobMatch/route.ts`
- Function: `POST`
- Model: `Job`
- Current query: Selects active jobs by `id in jobIds`, returning full text fields and skills.
- Problem: This is compact but repeated for the current job view; still large enough when the prompt is built for Gemini.
- Recommended query shape: Keep only title, description, required skills, location, type, mode, and experience; no extra metadata.
- Index recommendation if applicable: `@@index([status, id])` or query by `id in (...)` is effectively already efficient; the issue is payload size, not missing index.
- Expected impact: Small but useful reduction in AI latency.

### Query: `getDashboardOverview` rolling stats queries

- File: `actions/dashboard/getDashboardOverview.ts`
- Function: `candidateStats`, `recruiterStats`, `organizationStats`
- Model: `JobApplication`, `SavedJob`, `ProfileView`, `Job`
- Current query: Many `findMany` calls that only select `createdAt` for rolling stats.
- Problem: This pattern is fine in parallel, but it does a lot of work to reconstruct metric windows from raw timestamps. It can be expensive if user data is very large.
- Recommended query shape: Prefer direct aggregate queries or narrowed date windows instead of loading all rows for each metric.
- Index recommendation if applicable: `JobApplication(status, createdAt)`, `SavedJob(userId, createdAt)`, `ProfileView(profileUserId, createdAt)` would help if the dataset is large.
- Expected impact: Better dashboard load time and lower DB pressure.

### Query: `db.job.count` + `db.job.findMany` pair in `getFilteredJobs`

- File: `actions/job/get-filter-all-jobs.ts`
- Function: `getFilteredJobs`
- Model: `Job`
- Current query: Count + paginated list query for jobs with rich includes.
- Problem: This is standard, not wrong, but the include payload is bigger than necessary for the list UI.
- Recommended query shape: Use a narrower field set and keep only what the UI renders.
- Index recommendation if applicable: Add indexes for search/filter sort columns if query filters become expensive, especially on `createdAt`, `status`, `companyId`, and `isEasyApply` combinations.
- Expected impact: Better job list latency and lower payload size.

## Client Bundle Optimization

- Large client components: `JobsClient.tsx`, `DashboardClient.tsx`, `DashboardOverview.tsx`, and the many profile/dashboard card components.
- Unnecessary client boundaries: A number of components are marked as client even though they are mostly passive UI. This is not malicious, but the page-level bundle still includes them where they are not needed.
- Heavy imports: `recharts` in dashboard charts, `react-quill` in form pages, and client UI wrappers around many dashboard/profile components.
- Dynamic import opportunities: The dashboard chart components are already dynamically imported, which is good. The same pattern should be used more selectively in other large features if data-heavy or rarely-used.
- Code splitting opportunities: `jobs` AI UI and profile-heavy sections can be isolated further. Keep client logic for selected job details only, not for every card.
- Components that should load only after interaction: AI match details and job-specific expanded panels should load after the user interacts, not immediately for every job card.

## Server Performance

- Waterfalls: `JobsPage` does `getCompanyNames()` and `getFilteredJobs()` in parallel. This is efficient. The AI request in the browser is a separate client waterfall, but it is not blockingly in the server-render path.
- Expensive server actions: The AI route is the main expensive server action path; it is the point where the app pays the highest runtime cost.
- Expensive route handlers: `app/api/aiJobMatch/route.ts` is the main one. It should stay server-only and keep the request envelope small.
- Repeated queries: dashboard overview and some session callbacks may re-read user data more often than necessary.
- AI calls: Server-side AI is correct, but prompt size and concurrent handling are worth trimming.
- Timeout risks: The `GEMINI_API_KEY` path is the largest runtime risk on Vercel because an external model call can take long or fail.

## Jobs Page

### Initial render path

- `app/(public)/jobs/page.tsx` runs on the server.
- It calls `getServerSession(authOptions)` and then runs `getCompanyNames()` and `getFilteredJobs(filters)` in parallel.
- It passes the results into `JobsClient`.
- This is the correct pattern: the page renders the job list without AI blocking initial SSR.

### Data fetching path

- Server-side data fetching occurs in `actions/job/get-filter-all-jobs.ts`.
- It filters jobs, counts them, and returns a paginated set with a large include payload.
- The browser then runs `useQuery` in `JobsClient.tsx` to trigger AI matching by calling `/api/aiJobMatch`.

### AI matching path

- The AI path is correctly separated: the browser does not call Gemini directly.
- The client calls `/api/aiJobMatch` and the API route loads the user profile, selects matching jobs, and calls `getJobAIMatches` from `actions/ai/jobs/get-job-ai-matches.ts`.
- That server-side AI is the right architecture; it prevents leaking credentials into the client bundle.

### Potential timeout causes

- Gemini prompt size and model call latency are the main risk.
- The route does user fetch + DB fetch + AI call in the same request. This is acceptable but should be bounded and trimmed.
- The request is forced dynamic via `export const dynamic = "force-dynamic"`; that is fine for this route but means no caching and more runtime pressure.

### Client bundle problems

- The jobs page still keeps a fairly rich client UI around each job card and the AI result display. That is acceptable, but not lightweight.
- The main concern is not that the AI is in the client bundle; it is not. The concern is that the jobs page is doing an extra client-side fetch for AI results on initial page use.

### Exact files that should be changed

- `app/(public)/jobs/JobsClient.tsx`
- `app/api/aiJobMatch/route.ts`
- `actions/ai/jobs/get-job-ai-matches.ts`
- `actions/job/get-filter-all-jobs.ts`

### Recommended architecture

- Keep the server-rendered jobs list fast.
- Only request AI for the visible or selected jobs.
- Limit AI payload to the necessary fields.
- Show skeleton/loading state without affecting the underlying jobs list.
- Fail gracefully if AI is unavailable.

This is already very close to the desired architecture; the remaining work is in the request budget, not in the overall design.

## Dashboard

The dashboard already follows the intended architecture:

- Overview loads first: yes, `app/(protected)/dashboard/page.tsx` resolves `activeTab`, and if it is `overview`, it calls `getDashboardOverview(userId, role)`.
- Other tabs are fetched only when selected: yes, `buildTableDashboardData` is only used when the active tab is not `overview`.
- The client `DashboardClient` only renders the active tab content via `DashboardContent`.
- Chart components are dynamically imported in `components/dashboard/overview/DashboardOverview.tsx`, which helps separate heavy chart code.

This means the current dashboard implementation is already aligned with the desired pattern. No broad change is recommended unless metrics show a specific tab or card is still too heavy.

## React Performance

- `JobsClient.tsx` is a legitimate performance surface because it carries current job selection state and AI fetch logic. It is not a bug, but it is still a meaningful client cost.
- `DashboardOverview.tsx` includes several chart cards and profile sections, but they are split and lazy-loaded well enough not to warrant major changes.
- `app/layout.tsx` importing editor CSS at the root is a real route-level cost, though not a deep React issue.
- No broad `useMemo` or `useCallback` recommendations are necessary here because the app is not obviously doing a lot of needless memoization.

## Images and Fonts

- `app/layout.tsx` uses `Inter` from `next/font/google` via `next/font`; this is acceptable but not zero-cost.
- Many remote images are allowed in `next.config.mjs`, which is normal for a job platform.
- No severe image-loading issue is visible from the code alone; the platform is using `next/image` in a reasonably standard way.
- Actual problem found: only the global CSS/editor import cost is more relevant than image optimization in this project. No large image optimization bug was found.

## Vercel Production Risks

- Runtime risk: `app/api/aiJobMatch/route.ts` + `actions/ai/jobs/get-job-ai-matches.ts` can become a slow dependency path under serverless cold starts or traffic spikes.
- Build-time risk: none visible from the project code.
- Client-bundle risk: large route chunks and app-wide CSS are the main concern for first-load cost, not Vercel runtime.
- Memory risk: moderate only if the AI prompt or user profile becomes very large, but this is limited by the request payload and caps.
- Cold-start risk: moderate because the route works through Prisma + AI with a forced dynamic route; not catastrophic but not negligible.

## Recommended Optimization Order

1. `app/(public)/jobs/JobsClient.tsx` — reduce unnecessary AI request churn and keep the client jobs UI lean.
2. `app/api/aiJobMatch/route.ts` — bound request work, trim payload, and keep the AI route stable under serverless constraints.
3. `actions/ai/jobs/get-job-ai-matches.ts` — lower prompt size and fallback threshold to reduce server time.
4. `app/layout.tsx` — move editor-specific CSS and reduce app-global bundle cost.
5. `actions/job/get-filter-all-jobs.ts` — tighten the Prisma include payload to the fields actually rendered.
6. `actions/dashboard/getDashboardOverview.ts` — reduce repeated timestamp-based DB work and keep dashboard overview efficient.
7. `prisma/schema.prisma` — add targeted indexes only for proven slow queries, not broad ones.

## Quick Wins

- Keep the AI route server-side and do not move it to the client.
- Move `react-quill` CSS out of the root layout and into the form route that uses it.
- Reduce AI request payload size in `getAIUserProfile` and `db.job.findMany` by selecting only what the model needs.
- Keep the job list rendering fast by reducing nested include payloads in `getFilteredJobs`.
- Preserve the current dashboard overview-first pattern; it is already good.

## Advanced Optimizations

- If AI matching becomes expensive, request it only for the selected or first visible jobs rather than the entire page set.
- Consider a lighter service-layer summary profile for matching, not the full user/profile object.
- For large dashboard datasets, replace broad timestamp fetches with aggregate queries in SQL where the logic is predictable.
- Only add indexes after confirming real slow queries from production data. Do not do blanket indexing.

## Files That Are Already Good

- `app/(public)/jobs/page.tsx` — server-side data fetching is clean and keeps AI off the initial render path.
- `app/(protected)/dashboard/page.tsx` — overview-first loading is correct and tab-specific data loading is separated properly.
- `components/dashboard/overview/DashboardOverview.tsx` — chart components are lazily loaded with `next/dynamic`.
- `app/api/aiJobMatch/route.ts` — API boundary is correct and server-side; it does not leak Gemini credentials to the browser.
- `actions/ai/jobs/get-job-ai-matches.ts` — deterministic fallback is a good safety net.
- `middleware.ts` — simple and low overhead; no evidence of a large middleware cost problem.

## Final Verdict

Overall assessment:

- Initial load: 78/100. The strongest app-level issue is not SSR blocking; it is bundle weight and global CSS cost.
- Client bundle: 66/100. There are several client boundaries and shared chunk costs, especially around jobs and dashboard UI.
- Server rendering: 82/100. The app architecture is mostly solid and does not block initial renders with AI.
- Database: 74/100. Fine overall, but there are a few broad query patterns and timestamp-heavy dashboard stats that can be trimmed.
- React: 76/100. No serious anti-patterns, but some route-level cost remains.
- AI architecture: 80/100. The server-only AI separation is correct and the fallback is good; runtime cost still needs bounding.
- Vercel readiness: 75/100. Runtime risk is not severe, but the AI route is the main thing to watch.

This score is an engineering assessment based on static code and build inspection, not a real Lighthouse or Web Vitals measurement.

## Summary of the most important findings

1. The app already does the main thing right: jobs data loads without AI blocking the initial render.
2. The main remaining work is reducing route and shared-bundle weight, especially from global CSS and large client sections.
3. The AI route is the biggest production-runtime risk because it does user lookup + DB lookup + external model call in one request.
4. The dashboard architecture is already good and should not be over-optimized.
5. Prisma payload size and timestamp-heavy overview stats are the main data-layer improvements worth doing, not broad index churn.
