# EcoEnergy Firestore Security Specification (Phase 0 — Payload-First Security TDD)

## 1. Data Invariants
1. **Identity Isolation (`users/{userId}`)**: A facility profile document at `/users/{userId}` can only be read, created, or updated by the authenticated, email-verified user whose `request.auth.uid == userId`. `uid` and `createdAt` are immutable after creation.
2. **Strict PII Isolation (`users/{userId}/private/info`)**: Personally Identifiable Information (`email`, `phone`) is stored exclusively inside `/users/{userId}/private/{docId}` (`docId == 'info'`) and is strictly inaccessible to any user other than the owner (`request.auth.uid == userId` and `email_verified == true`).
3. **Master Gate Parent Integrity (`evStations`, `notifications`)**: An `EVStationRecord` under `/users/{userId}/evStations/{stationId}` or a `NotificationRecord` under `/users/{userId}/notifications/{notificationId}` cannot exist or be mutated unless the parent `/users/{userId}` document exists and belongs to `request.auth.uid`.
4. **No Shadow Fields / Type & Boundary Integrity**: All documents strictly enforce allowed keys via `hasAll` / `hasOnly` on creation and action-scoped `affectedKeys().hasOnly(...)` on update, along with regex-validated IDs (`^[a-zA-Z0-9_\\-]+$`, size `<= 128`), bounded strings, valid numeric ranges, and server timestamps (`request.time`).
5. **Verified Users & Query Enforcement**: All standard reads/writes mandate `request.auth.token.email_verified == true`, and all `allow list` rules explicitly evaluate `resource.data` ownership without performing `get()` lookups.

## 2. The "Dirty Dozen" Adversarial Payloads (Must All Return `PERMISSION_DENIED`)
1. **Cross-Tenant Facility Spoof (`POST /users/otherUid`)**: Authenticated as `userA`, attempt to create `/users/userB` with `{ uid: "userA", ... }` -> Denied by `isOwner(userId)` + `isValidId`.
2. **UID Hijack Inside Payload (`POST /users/userA`)**: Authenticated as `userA`, send `{ uid: "userB", ... }` -> Denied by `data.uid == request.auth.uid` inside `isValidUserFacility`.
3. **Unverified Email Write (`POST /users/userA`)**: Authenticated with `email_verified: false` -> Denied by `isVerifiedUser()`.
4. **Shadow Role Escalation (`PATCH /users/userA`)**: Send `{ isAdmin: true, role: "SuperAdmin" }` -> Denied by `hasOnly(...)` schema check and action-scoped `affectedKeys().hasOnly(...)`.
5. **PII Leak Attempt (`GET /users/userB/private/info`)**: Authenticated as `userA`, attempt to read `userB`'s PII -> Denied by `isOwner(userId)`.
6. **Client Timestamp Forgery (`POST /users/userA`)**: Send backdated `createdAt` or `updatedAt` instead of `request.time` -> Denied by `incoming().createdAt == request.time`.
7. **Immutable Field Mutation (`PATCH /users/userA`)**: Attempt to alter `uid` or `createdAt` on update -> Denied by `incoming().uid == existing().uid` and `incoming().createdAt == existing().createdAt`.
8. **ID Poisoning Attack (`PUT /users/userA/evStations/bad$id..1500chars`)**: Send malformed or oversized document ID -> Denied by `isValidId(stationId)`.
9. **Orphaned Subcollection Write (`POST /users/nonExistentUid/evStations/ev-01`)**: Write subcollection when parent `/users/{userId}` does not exist -> Denied by `isFacilityParentOwner(userId)`.
10. **Negative / Unbounded Numeric Telemetry (`PATCH /users/userA/evStations/ev-01`)**: Send `{ currentPowerKw: -999, socPercent: 400 }` -> Denied by `isValidEVStation` numeric bounds.
11. **Oversized String Denial-of-Wallet (`PATCH /users/userA/notifications/notif-1`)**: Send a 50KB `message` string -> Denied by `data.message.size() <= 400`.
12. **Blanket List Query Scraping (`LIST /users` or `LIST /users/userB/evStations`)**: Attempt to list another user's stations or top-level `/users` collection -> Denied (`allow list: if false` on `/users`; `resource.data.ownerId == request.auth.uid` on subcollections).
