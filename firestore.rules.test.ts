/**
 * Phase 0 Adversarial Security Rule Verification Matrix ("Dirty Dozen")
 * Matches security_spec.md and validates boundary/shape invariants against DRAFT_firestore.rules.
 */

export interface AdversarialTestCase {
  id: number;
  name: string;
  actorUid: string | null;
  emailVerified: boolean;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
  enforcedByRule: string;
}

export const DIRTY_DOZEN_CASES: AdversarialTestCase[] = [
  {
    id: 1,
    name: 'Cross-Tenant Facility Spoof',
    actorUid: 'userA',
    emailVerified: true,
    operation: 'create',
    path: '/users/userB',
    payload: { uid: 'userA', name: 'Attacker' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'isOwner(userId) && incoming().uid == userId',
  },
  {
    id: 2,
    name: 'UID Hijack Inside Payload',
    actorUid: 'userA',
    emailVerified: true,
    operation: 'create',
    path: '/users/userA',
    payload: { uid: 'userB', name: 'Hijack' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'isValidUserFacility -> data.uid == request.auth.uid',
  },
  {
    id: 3,
    name: 'Unverified Email Write',
    actorUid: 'userA',
    emailVerified: false,
    operation: 'create',
    path: '/users/userA',
    payload: { uid: 'userA', name: 'Unverified' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'isVerifiedUser() -> request.auth.token.email_verified == true',
  },
  {
    id: 4,
    name: 'Shadow Role Escalation',
    actorUid: 'userA',
    emailVerified: true,
    operation: 'update',
    path: '/users/userA',
    payload: { isAdmin: true, role: 'SuperAdmin' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'hasOnly(...) + affectedKeys().hasOnly(...)',
  },
  {
    id: 5,
    name: 'PII Leak Attempt',
    actorUid: 'userA',
    emailVerified: true,
    operation: 'get',
    path: '/users/userB/private/info',
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'match /users/{userId}/private/{docId} -> isOwner(userId)',
  },
  {
    id: 6,
    name: 'Client Timestamp Forgery',
    actorUid: 'userA',
    emailVerified: true,
    operation: 'create',
    path: '/users/userA',
    payload: { uid: 'userA', createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'incoming().createdAt == request.time',
  },
  {
    id: 7,
    name: 'Immutable Field Mutation',
    actorUid: 'userA',
    emailVerified: true,
    operation: 'update',
    path: '/users/userA',
    payload: { uid: 'userA_renamed' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'incoming().uid == existing().uid && incoming().createdAt == existing().createdAt',
  },
  {
    id: 8,
    name: 'ID Poisoning Attack',
    actorUid: 'userA',
    emailVerified: true,
    operation: 'create',
    path: '/users/userA/evStations/bad$id',
    payload: { id: 'bad$id', ownerId: 'userA' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: "isValidId(stationId) -> id.matches('^[a-zA-Z0-9_\\\\-]+$')",
  },
  {
    id: 9,
    name: 'Orphaned Subcollection Write',
    actorUid: 'orphanUser',
    emailVerified: true,
    operation: 'create',
    path: '/users/orphanUser/evStations/ev-01',
    payload: { id: 'ev-01', ownerId: 'orphanUser' },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'isFacilityParentOwner(userId) -> exists(/users/$(userId))',
  },
  {
    id: 10,
    name: 'Negative / Unbounded Numeric Telemetry',
    actorUid: 'userA',
    emailVerified: true,
    operation: 'update',
    path: '/users/userA/evStations/ev-01',
    payload: { currentPowerKw: -999, socPercent: 400 },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'isValidEVStation -> range checks on currentPowerKw and socPercent',
  },
  {
    id: 11,
    name: 'Oversized String Denial-of-Wallet',
    actorUid: 'userA',
    emailVerified: true,
    operation: 'create',
    path: '/users/userA/notifications/notif-1',
    payload: { id: 'notif-1', ownerId: 'userA', message: 'A'.repeat(50000) },
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'isValidNotification -> data.message.size() <= 400',
  },
  {
    id: 12,
    name: 'Blanket List Query Scraping',
    actorUid: 'userA',
    emailVerified: true,
    operation: 'list',
    path: '/users',
    expectedResult: 'PERMISSION_DENIED',
    enforcedByRule: 'allow list: if false; on /users and resource.data.ownerId == request.auth.uid on subcollections',
  },
];
