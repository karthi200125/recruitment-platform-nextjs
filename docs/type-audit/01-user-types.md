# User Module Type Audit

## Summary

Overall health score: 6 / 10

Issues found:
- Duplicate and inconsistent User type definitions.
- Incorrect use of Prisma payload aliases for normalized UI data.
- Fragmented session/user type contract across NextAuth and hooks.
- Several `any` usages and local component interfaces.
- Inconsistent export surface in `types/index.ts`.

Critical issues:
- `types/user.ts` and `types/userProfile.ts` overlap and are used inconsistently.
- `ProfileUser` is treated as raw Prisma payload even after normalization.
- `useCurrentUser` uses `any` to cast session.user to `SessionUser`.

High priority issues:
- Server actions return inconsistent results and UI data contracts.
- `MoreProfileUser` and local ProfileUser prop interfaces should be centralized.
- NextAuth session/JWT types are not aligned with shared `SessionUser`.

Medium priority issues:
- `getAllUsers`/`getCompaniesEmployees` use raw `Prisma.UserGetPayload<{}>` even when a shared contract is preferable.
- `UserInfoForm` and `UserProfileImage` declare local user props.

Low priority issues:
- `EmployeeUser` in `EmployeesClient` is defined locally instead of imported.
- `getNetworkusers` uses an action-level `NetworkUser` interface.

---

## File-by-file Analysis

### File
`types/user.ts`

Problem:
- This file mixes raw Prisma payloads (`User`, `UserWithSubscription`, etc.) with view-model-like aliases.
- `UserProfile` is included here but a more accurate home may be `types/userProfile.ts`.

Recommendation:
- Keep `types/user.ts` for raw persistence shapes and lightweight aggregates only.
- Move `UserProfile` to `types/profile.ts` or keep it only in `types/userProfile.ts` with a single canonical export.
- Use smaller shared aliases such as `BasicUser`, `SessionUser`, `UserWithSubscription`.

Priority:
- High

---

### File
`types/userProfile.ts`

Problem:
- `ProfileUser` is defined as a raw `Prisma.UserGetPayload` including relations.
- The action layer normalizes `userAbout`, which means `ProfileUser` is not strictly the raw database shape.

Recommendation:
- Rename or reposition this type as `UserProfile` in a shared profile module.
- Define a separate DTO for normalized profile view state if needed.

Priority:
- Critical

---

### File
`types/index.ts`

Problem:
- The barrel file does not export `types/user.ts` or `types/userProfile.ts`.
- Consumers must import `ProfileUser` from `types/userProfile` and `SessionUser` from `types/user` in different ways.

Recommendation:
- Export `User`, `UserProfile`, `SessionUser`, and other user module contracts from `types/index.ts`.
- Keep the barrel as the canonical public surface.

Priority:
- Medium

---

### File
`hooks/useCurrentUser.ts`

Problem:
- Uses `session.user as any` to cast the NextAuth session user.
- This bypasses TypeScript safety and masks mismatches between auth session and shared types.

Recommendation:
- Replace the `any` cast with an explicit `SessionUser` type derived from a single shared interface.
- Ensure `next-auth` module augmentation and `types/user.ts` agree on the same `SessionUser` shape.

Priority:
- Critical

---

### File
`lib/auth/next-auth.d.ts`

Problem:
- Session/JWT augmentation is defined here, but the shape is not explicitly shared with `types/user.ts`.
- `Session.user` and `JWT` include overlapping fields but no shared export.

Recommendation:
- Align `next-auth` augmentation with a single exported `SessionUser` type.
- Use `interface SessionUser` in `types/user.ts` or `types/profile.ts` and reference it in the declaration file.

Priority:
- High

---

### File
`actions/auth/get-user-by-id.ts`

Problem:
- Returns `ProfileUser` typed as `Prisma.UserGetPayload` even after normalizing `userAbout`.
- This hides the fact that the returned payload is transformed.

Recommendation:
- Use a dedicated shared `UserProfile` DTO type, not a raw Prisma payload alias.
- Keep normalization explicit by defining the type as the returned contract.

Priority:
- Critical

---

### File
`actions/user/getuser/getUserProfileUserById.ts`

Problem:
- Imports `ProfileUser` from `types/userProfile.ts` and asserts `as ProfileUser` after JSON normalization.
- This mixing of raw payload and normalized fields is unsafe.

Recommendation:
- Convert `ProfileUser` into a shared view-model type that accounts for normalized `userAbout`.
- Avoid `as ProfileUser`; return a tightly defined DTO instead.

Priority:
- Critical

---

### File
`actions/user/more-profile-users.ts`

Problem:
- Contains a local `MoreProfileUser` interface and a local `UserRole` type.
- This type is used by profile components and should be shared.

Recommendation:
- Move `MoreProfileUser` to `types/user.ts` or `types/profile.ts` as `SuggestedProfileUser` or `NearbyProfileUser`.
- Keep only one shared type in the user module.

Priority:
- High

---

### File
`actions/user/get-network-users.ts`

Problem:
- Defines a local `NetworkUser` interface and depends on `ProfileUser` from `actions/auth/get-user-by-id.ts`.
- This is a duplicated user type for list data.

Recommendation:
- Use a shared user list item type from `types/user.ts` or `types/profile.ts`.
- Avoid local `NetworkUser` interfaces in action files.

Priority:
- Medium

---

### File
`app/(public)/userProfile/[userId]/page.tsx`

Problem:
- Imports `ProfileUser` from `types/userProfile.ts` and uses it across multiple profile subcomponents.
- This file is doing the correct thing, but it exposes the issue that the shared type is the only user profile contract.

Recommendation:
- Keep the page using a shared `UserProfile` type.
- Ensure the type is exported consistently from `types/index.ts`.

Priority:
- Low

---

### File
`components/forms/UserInfoForm.tsx`

Problem:
- Uses local `Props` with `UserProfile` imported from `types`.
- The component currently relies on `userAbout` normalization in a few places.

Recommendation:
- Keep `UserInfoForm` using the shared `UserProfile` type.
- Add a dedicated `UserAbout` DTO in `types/profile.ts` if the field is conceptually separate.

Priority:
- Low

---

### File
`app/(public)/userProfile/UserProfileImage.tsx`

Problem:
- Defines a local `ProfileUser` interface with only `profileImage`.
- This should reuse a shared `ProfileImageOwner` or `UserProfile` subset.

Recommendation:
- Replace local interface with a shared type such as `ProfileUserImageProps` or a partial of `UserProfile`.

Priority:
- Medium

---

### File
`app/(protected)/dashboard/employees/EmployeesClient.tsx`

Problem:
- `EmployeeUser` is defined locally as `Prisma.UserGetPayload<{}>`, duplicating the shared user model.

Recommendation:
- Replace with a shared `User` type or `CompanyEmployee` alias in `types/user.ts`.
- Keep component props strongly typed from central user types.

Priority:
- Medium

---

### File
`actions/user/get-all-users.ts`

Problem:
- Uses raw `Prisma.UserGetPayload<{}>[]` for all users.
- If this is a public contract, it should be a shared user DTO or at least `User[]`.

Recommendation:
- Use `User[]` from `types/user.ts` or a dedicated action DTO if only a subset is returned.

Priority:
- Medium

---

### File
`actions/user/get-company-employees.ts`

Problem:
- Also uses `Prisma.UserGetPayload<{}>[]`.
- This duplicates the shared `User` contract.

Recommendation:
- Use a shared `User` type or a `CompanyEmployee` DTO if the returned shape is subset.

Priority:
- Medium

---

### File
`actions/user/update-user.ts`

Problem:
- Return type uses generic `ActionResponse<T = unknown>` and returns `updatedUser` without a concrete shared type.

Recommendation:
- Define a shared `ActionResult<T>` type in `types/api.ts` or `types/user.ts`.
- Return `ActionResponse<User>` or a dedicated `UserUpdateResult`.

Priority:
- High

---

### File
`lib/auth/authOptions.ts`

Problem:
- NextAuth JWT and session callbacks write fields to session and token, but the actual shared `SessionUser` type is not reused.
- `Session.user` augmentation includes `role: string | null` rather than `Role`.

Recommendation:
- Use a shared `SessionUser` type and/or `AuthUser` alias exported from `types/user.ts`.
- Prefer `Role` from Prisma or shared `types/user.ts` rather than broad `string | null`.

Priority:
- High

---

### File
`lib/auth/next-auth.d.ts`

Problem:
- Custom `Session.user` and JWT fields are declared locally and not connected to shared type exports.

Recommendation:
- Change these declarations to extend an exported shared `SessionUser` type.
- Keep auth augmentation and shared user types in sync.

Priority:
- High

---

## Duplicate Types

Current | Recommended | Reason
--- | --- | ---
`types/user.ts` `UserProfile` | remove / consolidate into `types/profile.ts` | `UserProfile` belongs in a profile-focused module and is used with normalized fields.
`actions/user/more-profile-users.ts` `MoreProfileUser` | `SuggestedProfileUser` in `types/profile.ts` | This is reused by UI and should be shared.
`app/(public)/userProfile/UserProfileImage.tsx` local `ProfileUser` | shared partial `UserProfile` or `UserImageProps` | Local interface duplicates shared user shape.
`app/(protected)/dashboard/employees/EmployeesClient.tsx` `EmployeeUser` | shared `User` or `CompanyEmployee` | Duplicate raw user model.
`actions/user/get-network-users.ts` `NetworkUser` | shared list item user type | Duplicate list response typing.
`lib/auth/next-auth.d.ts` session/JWT user shape | shared `SessionUser` | Align auth type with app-wide session contract.

---

## Shared Types

These shared types should exist:

- `User` (raw persistence user model)
- `SessionUser` (NextAuth session/JWT user shape)
- `UserProfile` (full profile DTO with relations)
- `UserSummary` or `SuggestedProfileUser` (list/follower item)
- `UserProfileImageProps` (partial user image props)
- `AuthUser` / `AuthSessionUser` (for session and JWT contracts)
- `ActionResult<T>` (shared action response wrapper)

Why:
- `User` is the canonical database user contract.
- `SessionUser` is the auth/session contract used throughout hooks and components.
- `UserProfile` is the profile view contract and should accommodate normalized JSON fields.
- `UserSummary` is a lightweight list contract for followers/following.
- `ActionResult<T>` standardizes server action result shapes.

---

## Prisma Types

List:
- `Prisma.UserGetPayload<{}>`
- `Prisma.UserGetPayload<{ include: {...} }>`

Whether to remain Prisma-derived:
- `User`: remain Prisma-derived.
- `UserWithSubscription`, `UserWithCompany`, `UserWithProjects`, `UserWithSavedJobs`, `UserWithProfileViews`: remain Prisma-derived if they represent raw queries used in repository/DB logic.
- `ProfileUser` as currently defined: should become a shared DTO if returned by actions after normalization.

Explain:
- Raw persistence items can remain Prisma-derived for repository types.
- Anything transformed or normalized should become explicit DTOs, not raw Prisma aliases.

---

## DTOs

These DTOs should exist:
- `SessionUser` as the auth contract for NextAuth session/JWT.
- `UserProfile` as the returned profile detail object.
- `UserSummary` / `SuggestedProfileUser` as a lightweight list item.
- `UserProfileImageProps` as a partial shape used by image upload components.
- `UserUpdateResult` or `ActionResult<User>` for update-user response.
- `ProfileViewUser` if profile view payloads need a dedicated subset.

Why:
- DTOs make intent explicit and separate UI contracts from raw DB models.
- They prevent incorrect type aliasing when fields are normalized.

---

## Naming Convention

Final naming convention for the User module:

- Raw persistence model: `User`
- Auth session model: `SessionUser`
- Full profile model: `UserProfile`
- Lightweight list model: `UserSummary` or `SuggestedProfileUser`
- Action result wrapper: `ActionResult<T>`
- Partial props model: `UserProfileImageProps`

Use `User` for database shapes and `UserProfile` / `UserSummary` for view/UI shapes.

---

## Barrel Exports

`types/index.ts` should export:
- `User`
- `UserProfile`
- `SessionUser`
- `UserSummary` / `SuggestedProfileUser`
- `ActionResult`
- `UserWithSubscription`
- `UserWithCompany`
- `UserWithProjects`
- `UserWithSavedJobs`
- `UserWithProfileViews`

Explain:
- This makes user type imports consistent.
- It avoids ad hoc imports from `types/userProfile.ts`.

---

## Migration Checklist

- [ ] Move `UserProfile` responsibility to a single file (`types/profile.ts` or `types/userProfile.ts`).
- [ ] Remove duplicate `ProfileUser` from `types/user.ts`.
- [ ] Export `User`, `UserProfile`, `SessionUser`, and related aliases from `types/index.ts`.
- [ ] Replace `any` in `hooks/useCurrentUser.ts` with the shared `SessionUser` type.
- [ ] Align `next-auth` augmentation with shared `SessionUser` in `lib/auth/next-auth.d.ts`.
- [ ] Convert `actions/auth/get-user-by-id.ts` and `actions/user/getuser/getUserProfileUserById.ts` to explicit shared profile DTOs.
- [ ] Move `MoreProfileUser` and `NetworkUser` into shared user module types.
- [ ] Replace local `EmployeeUser` and `ProfileUser` interfaces in UI components with shared types.
- [ ] Define `ActionResult<T>` for server action return values.
- [ ] Ensure `types/user.ts` is reserved for raw persistence shapes and small raw query aliases.

---

## Final Architecture

Recommended final folder structure:

```
types/
  index.ts
  user.ts
  profile.ts
  api.ts
```

What belongs in each file:

- `types/user.ts`
  - Raw Prisma-derived user shapes: `User`, `UserWithSubscription`, `UserWithCompany`, `UserWithProjects`, `UserWithSavedJobs`, `UserWithProfileViews`.
  - `SessionUser` if it is the auth/session representation.

- `types/profile.ts`
  - Full user profile DTO: `UserProfile`.
  - Lightweight profile view models: `UserSummary`, `SuggestedProfileUser`.
  - Partial profile props types: `UserProfileImageProps`.

- `types/api.ts`
  - Shared server action wrappers: `ActionResult<T>`, `ApiError`.

- `types/index.ts`
  - Barrel exports for all user module contracts.
```

Explain what belongs where:
- `user.ts` should be the persistence and auth user types.
- `profile.ts` should be the profile-focused UI/DTO contracts.
- `api.ts` should hold action result types used across server actions.
- `index.ts` should re-export all user-related contracts.
