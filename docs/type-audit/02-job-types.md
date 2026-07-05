# Job Module Type Audit

## Summary

Overall health score: 5 / 10

Key findings:
- Job module type architecture is inconsistent and fractured across `types/`, action files, and UI components.
- There are duplicate Prisma payload aliases for the same job shapes.
- Critical type drift exists between job question IDs and answer key types.
- Several UI components accept `any` or partial local job interfaces instead of shared job contracts.
- Action-layer response types are defined locally and not reused.

Critical issues:
- `JobWithCompany` is defined twice: in `types/jobs.ts` and in `actions/job/get-filter-all-jobs.ts`.
- `types/jobs.ts` exposes raw `Prisma.JobGetPayload` aliases, but the app uses both these aliases and action-level aliases interchangeably.
- `JobQuestionType.id` is `string`, while `QuestionAnswers` is keyed by `number` and `EasyApplyQuestions` treats question IDs as numeric.
- `EasyApplyProps.job` is typed as `any` and `EasyApplySubmit` uses `job.questions` as `any`, bypassing safety.
- `CreateJobForm.parseJobQuestions` unsafely casts `Prisma.JsonValue` to `JobQuestionType[]`.

High priority issues:
- Different job-fetching actions define their own payload contracts instead of using shared types:
  - `actions/job/get-featured-jobs.ts`
  - `actions/job/get-job-by-id.ts`
  - `actions/job/get-saved-jobs.ts`
  - `actions/job/get-action-takens-jobs.ts`
- `types/easyApply.ts` defines `EasyApplyProps.job` as `any` and `Question` as a separate shape from `JobQuestionType`.
- UI components in `app/(public)/jobs` and `app/(protected)` use a mixture of `JobWithCompany`, `JobWithCompanyAndCount`, and local partial job interfaces.

Medium priority issues:
- `actions/job/get-jobs.ts` returns raw jobs without a typed contract.
- `getFilteredJobs` returns `JobWithCompany[]`, but the shared type export is duplicated and may lead to divergence.
- `FeaturedJobs` query result is typed in the component action but not exported as a shared type.
- `JobCompany`, `JobRecruiter`, `JobDescription`, and similar components use locally declared job interfaces instead of reusable shared subsets.

Low priority issues:
- `actions/job/delete-job.ts` and other simple actions lack explicit response types but this is lower risk.
- `app/(protected)/dashboard/employer/jobs/JobsClient.tsx` uses a local `Job` interface rather than a shared `JobWithCompanyAndCount` or a dedicated DTO.

---

## File-by-file Analysis

### `types/jobs.ts`

Problem:
- Defines raw Prisma payload types (`Job`, `JobWithCompany`, `JobWithApplications`, `JobWithSavedUsers`, `JobWithCompanyAndCount`) and `JobQuestionType` in the same file.
- `JobQuestionType` is likely a UI/domain shape, not a raw Prisma payload.
- This file should be the canonical source for job entity contracts, but the app does not consistently consume it.

Recommendation:
- Keep raw persistence shapes here, but split UI-domain contracts into a dedicated `types/job-views.ts` or `types/easyApply.ts`.
- Make `JobQuestionType` and `Question` consistent across code.
- Export a single authoritative job contract for each common include combination.

Priority: Critical

---

### `actions/job/get-filter-all-jobs.ts`

Problem:
- Declares `JobWithCompany` locally and exports it from the action.
- This duplicates the same shape from `types/jobs.ts`.
- The action returns a `JobWithCompany[]`, but UI consumers import this alias from the action file instead of a shared type module.

Recommendation:
- Remove the local alias and import `JobWithCompany` from `types/jobs.ts`.
- If the UI contract differs from the raw database query, define a separate DTO type.

Priority: High

---

### `actions/job/get-featured-jobs.ts`

Problem:
- Uses a local `FeaturedJobsPayload` type alias for a Prisma payload array.
- The feature list contract is not shared with the components consuming featured jobs.

Recommendation:
- Export a shared named type for this include shape, or reuse `JobWithCompany` / `JobWithCompanyAndCount` if appropriate.
- Prefer `type FeaturedJob = JobWithCompany` or a dedicated `JobWithCompanyMinimal` if only partial company fields are needed.

Priority: High

---

### `actions/job/get-job-by-id.ts`

Problem:
- Defines local `JobWithApplications` alias for the action result.
- The raw action contract is not centralized.

Recommendation:
- Reuse `types/jobs.ts` by exporting a shared `JobWithApplications` alias.
- If a different query shape is required, make it explicit and share it.

Priority: High

---

### `actions/job/get-saved-jobs.ts`

Problem:
- Defines local `SavedJob` alias for jobs returned through saved job relations.
- The action returns `SavedJob[]` but this type is not shared.

Recommendation:
- Define a shared type such as `JobWithCompany` or `SavedJobPayload` in a central location.
- Avoid action-level duplicates.

Priority: High

---

### `actions/job/get-action-takens-jobs.ts`

Problem:
- Uses a local `ActionTakenJob` alias identical to a reusable `JobWithCompany` shape.
- The response contract is action-local.

Recommendation:
- Reuse `JobWithCompany` or define a clearly named shared alias for jobs with company include.

Priority: High

---

### `actions/job/get-jobs.ts`

Problem:
- Returns raw jobs from `db.job.findMany()` with no explicit type annotation.
- This is harmless in server code, but it is still nicer to keep output contracts explicit.

Recommendation:
- Annotate `getJobs` to return `Promise<{ success: boolean; data: Job[] }>` or a dedicated payload type if used by UI.

Priority: Medium

---

### `actions/job/create-job.ts`

Problem:
- Accepts `questions?: JobQuestionType[]` and writes them as `Prisma.InputJsonValue`.
- The action is using `JobQuestionType`, which is defined as `id: string`, but downstream application answer types use numeric keys.

Recommendation:
- Define a single shared question type for job creation and easy apply flows.
- Keep JSON serialization at the DB boundary and use a well-typed runtime contract through the action.

Priority: Critical

---

### `actions/job/apply-job.ts`

Problem:
- Uses typed `JobQuestionAnswer` but the data mapping in `EasyApplySubmit` depends on `job.questions` being a safe shape.
- `job.questions` is currently accepted as `any` in easy apply components.

Recommendation:
- Tighten the contract for `job.questions` across `EasyApply` and `applyForJob`.
- Ensure `questionAndAnswers` maps from shared question IDs and answer types.

Priority: High

---

### `components/forms/CreateJobForm.tsx`

Problem:
- Imports `JobQuestionType` and `JobWithCompany` from `@/types`.
- The helper `parseJobQuestions` returns `questions as unknown as JobQuestionType[]`.
- This is an unsafe cast from JSON to typed questions.

Recommendation:
- Introduce a safe parser/validator for stored question JSON.
- Consider `JobQuestionType` as a real runtime contract; validate it before casting.
- Avoid `unknown as` wherever possible.

Priority: Critical

---

### `types/easyApply.ts`

Problem:
- `EasyApplyProps.job` is typed as `any`.
- `Question` uses `id: number` and `type: "input"`, while `types/jobs.ts` uses `JobQuestionType.id: string` and `type: "text"`.
- This mismatch is a strong source of type errors and runtime inconsistencies.

Recommendation:
- Make `Question` and `JobQuestionType` the same shared type or derive one from the other.
- Remove `any` from `EasyApplyProps.job` and replace it with a shared job job shape that includes `questions`.
- Use `ResumeData` and `QuestionAnswers` in a way that matches the persisted job question definitions.

Priority: Critical

---

### `types/application.ts`

Problem:
- `JobQuestionAnswerItem.id` is `number`, while `JobQuestionType.id` is `string`.
- This means `QuestionAnswers` and answer mapping are likely incompatible with persisted job question IDs.

Recommendation:
- Standardize question ID typing across `types/jobs.ts`, `types/application.ts`, and `types/easyApply.ts`.
- Prefer `string` if IDs are stored as UUID-like values or `number` if they are numeric.
- Keep all answer-related types aligned.

Priority: Critical

---

### `app/(public)/jobs/JobDetails.tsx`

Problem:
- Correctly uses shared `JobWithCompany`, but this only works because the action contract is imported from `get-filter-all-jobs.ts`.
- The shared type is still duplicated elsewhere.

Recommendation:
- Consume a centralized `JobWithCompany` from `types/jobs.ts`
- Keep UI props aligned with action return contracts.

Priority: Medium

---

### `app/(public)/jobs/JobLists/JobList.tsx`

Problem:
- Imports `JobWithCompany` from `@/types`, which is good.
- However, the component still uses optional fields and local assumptions about nested `company` and counts; a dedicated subset type would be safer.

Recommendation:
- If `JobWithCompany` is the canonical type, keep it; otherwise define a narrower `JobListItem` contract in `types/jobs.ts`.

Priority: Low

---

### `app/(public)/home/FeaturedJobs.tsx`

Problem:
- Uses `JobWithCompanyAndCount` from `@/types`, but `getFeaturedJobs` returns a different featured payload type.
- The component consumes fields like `job.company.companyImage` and `job.jobDesc` safely, but the source type is not shared with the fetch action.

Recommendation:
- Make the featured job payload explicit and shared.
- Align `getFeaturedJobs` with a named export such as `FeaturedJobWithCompany` or `JobWithFeaturedCompany`.

Priority: Medium

---

### `app/(public)/jobs/Job/JobRecruiter.tsx`

Problem:
- Defines a local `Job` interface with only `id` and `userId`.
- This is a good partial shape, but it duplicates a possible shared `Job` subset.

Recommendation:
- Use a shared `JobPoster` or `JobMetadata` subset type from `types/jobs.ts`.
- Keep component-specific shapes explicit and reusable.

Priority: Low

---

### `app/(protected)/dashboard/employer/job/EmployerJobClient.tsx`

Problem:
- Uses `JobWithCompanyAndCount` correctly from `@/types`.
- The `applicants` data is typed as `JobApplicationWithUser[]`, which is good.
- No major issue here, but the upstream query in `page.tsx` should ensure it returns the same shared contract.

Recommendation:
- Keep this pattern and avoid local `Job` interfaces in other dashboard job components.

Priority: Low

---

## Architecture Recommendations

1. Centralize job contracts in `types/jobs.ts`.
   - `Job`: raw entity shape
   - `JobWithCompany`: company include
   - `JobWithApplications`: applications include
   - `JobWithCompanyAndCount`: company plus counts
   - `JobQuestionType`: job question DTO shape

2. Export action contracts from a single shared module.
   - Remove local action-level Prisma aliases.
   - If actions need data normalization, define dedicated DTO types with explicit names.

3. Standardize question typing.
   - Decide whether question IDs are `string` or `number`.
   - Ensure `JobQuestionType`, `Question`, `JobQuestionAnswerItem`, and `QuestionAnswers` all use the same key type.

4. Remove `any` from job props.
   - `EasyApplyProps.job` should be typed as a shared job payload with `questions`.
   - `EasyApplySubmit` should accept `job: JobWithQuestions` or equivalent.

5. Keep JSON parsing explicit.
   - Replace `as unknown as JobQuestionType[]` with a validator or shape guard.
   - Validate stored question JSON before using it in forms and apply flow.

6. Use shared partial types for UI components.
   - For components that only need a few fields, define narrower shared types in `types/jobs.ts` or `types/job-views.ts`.
   - Avoid ad-hoc local interfaces when a reusable subset already exists.

## Suggested Cleanup Checklist

- [ ] Remove duplicate `JobWithCompany` alias from `actions/job/get-filter-all-jobs.ts`.
- [ ] Share `JobWithCompany`, `JobWithApplications`, `JobWithCompanyAndCount` from `types/jobs.ts` across actions and UI.
- [ ] Define and export a `FeaturedJob` payload if `getFeaturedJobs` requires a distinct shape.
- [ ] Fix job question type mismatch:
  - `JobQuestionType.id`
  - `Question.id`
  - `QuestionAnswers` key type
  - `JobQuestionAnswerItem.id`
- [ ] Replace `EasyApplyProps.job: any` with a typed shared shape.
- [ ] Replace unsafe JSON casting in `CreateJobForm` with explicit validation.
- [ ] Align `types/easyApply.ts` with `types/jobs.ts` for question and resume-related contracts.
- [ ] Add explicit action response types for job actions where feasible.
- [ ] Review dashboard job components and migrate local partial job interfaces to shared subsets.

## Conclusion

The job module has a good foundation, but the current type architecture is brittle because of duplicate payload aliases and inconsistent question typing. The strongest risks are in the easy-apply/question flow and in action-to-UI contract drift. A focused refactor of the job type surface can eliminate duplicated contracts, reduce `any` usage, and make job actions safe and maintainable.

> Note: This audit is analysis-only; no code changes were made in the repository.