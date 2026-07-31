# Chatroom Backend

Node.js backend for a chat app with **groups** and **direct messages**. Users sign up with **name, phone number, and password**.

## Stack
- Express (REST API)
- Socket.IO (real-time messaging)
- SQLite via `better-sqlite3` (zero-config file database)
- JWT auth, bcrypt password hashing

## Setup
```bash
npm install
cp .env.example .env   # then set a real JWT_SECRET
npm run dev             # or: npm start
```

Server runs on `http://localhost:4000` by default.
Open `http://localhost:4000` in your browser — the frontend (`public/index.html`) is fully wired to the API and Socket.IO: register/login with name+phone+password, create groups, start DMs by phone number, and chat in real time.

## Auth

### Register
`POST /api/auth/register`
```json
{ "name": "Hadi", "phone": "+989120000000", "password": "secret123", "deviceName": "iPhone 15" }
```
Returns `{ token, user }`. `deviceName` is optional — if omitted, it's guessed from the User-Agent header.

### Login
`POST /api/auth/login`
```json
{ "phone": "+989120000000", "password": "secret123", "deviceName": "iPhone 15" }
```
Returns `{ token, user }`.

Send the token on every request after that:
```
Authorization: Bearer <token>
```

### Logout
`POST /api/auth/logout` — ends only the current device's session.

## Account security

### Username (`@username`)
`PUT /api/users/me/username`
```json
{ "username": "hadi_dev" }
```
5-32 characters, must start with a letter, letters/numbers/underscore only, unique
(case-insensitive), with or without a leading `@`. Returned in the profile as `@hadi_dev`.

### Phone number verification
| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/auth/phone/verify/request` | — | sends a 6-digit code to your own phone via SMS |
| POST | `/api/auth/phone/verify/confirm` | `{ code }` | confirms the code, sets `phoneVerified: true` |

### Password reset
| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/auth/password/forgot` | `{ phone }` | sends a reset code by SMS if that phone has an account (response is identical either way, so phone numbers can't be enumerated) |
| POST | `/api/auth/password/reset` | `{ phone, code, newPassword }` | verifies the code and sets the new password |

A successful reset signs the account out of **every** device (all sessions revoked, any open
socket connections disconnected) since the old password may have been compromised.

Codes expire after `OTP_TTL_MINUTES` (default 5), allow `OTP_MAX_ATTEMPTS` wrong tries (default 5),
and can only be re-requested every `OTP_RESEND_SECONDS` (default 60). No SMS gateway is wired up —
each generated code is written to the `logs` table (`helpers/logger.js`) instead, visible via
`GET /api/logs` (admin only) or the server console. Plug in a real SMS gateway later by sending
the code from `otp.createOtp(...)` (see `routes/auth.js`) through whichever provider you choose.

### Session management
Every login/register creates a session row (device name, user agent, IP, timestamps) tied to that
JWT via a `jti` claim. Revoking a session immediately invalidates its token and disconnects any live
Socket.IO connection using it — no need to wait for the token to expire.

| Method | Route | Description |
|---|---|---|
| GET | `/api/auth/sessions` | list your active sessions/devices (`current: true` marks this one) |
| DELETE | `/api/auth/sessions/:id` | revoke one specific session |
| DELETE | `/api/auth/sessions/others` | force logout every device **except** this one |
| DELETE | `/api/auth/sessions` | force logout **every** device, including this one |

## Groups

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/groups` | `{ name, memberPhones?: [] }` | create a group |
| GET | `/api/groups` | — | list groups you belong to |
| POST | `/api/groups/:id/join` | — | join a group |
| GET | `/api/groups/:id/members` | — | list members |
| GET | `/api/groups/:id/messages?before=&limit=` | — | message history |

## Direct messages

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/conversations` | `{ phone }` | start/get a DM with a user by phone |
| GET | `/api/conversations` | — | list your DMs |
| GET | `/api/conversations/:id/messages?before=&limit=` | — | message history |

## Profile

| Method | Route | Body | Description |
|---|---|---|---|
| GET | `/api/users/me` | — | your own profile |
| PATCH | `/api/users/me` | `{ name?, bio? }` | edit your name and/or bio |
| POST | `/api/users/me/avatar` | multipart, field `avatar` | change your profile picture |
| GET | `/api/users/:id` | — | view any user's profile |
| GET | `/api/users/:id/avatar` | — | fetch a user's avatar image |

A profile includes: `id`, `name`, `username` (as `@handle`, or `null`), `bio`, `avatarUrl`, `createdAt` (join date),
`lastSeenAt`, `online`, `roles`. Online status and profile edits (name, bio,
avatar) are pushed live over Socket.IO (`presence:update`,
`profile:updated`) so open profile views update without a page refresh.

## Real-time (Socket.IO)

Connect with the JWT:
```js
const socket = io('http://localhost:4000', { auth: { token } });
```

Events:
- `join` → `{ type: 'group' | 'dm', id }` — subscribe to a chat
- `message:send` → `{ target: { type, id }, content }` — send a message
- `message:new` ← `{ target, message }` — new message broadcast
- `message:edit` → `{ target, messageId, content }` — edit your own message
- `message:edited` ← `{ target, message }` — broadcast when a message is edited
- `message:delete` → `{ target, messageId }` — delete (soft-delete) your own message
- `message:deleted` ← `{ target, messageId, deletedAt }` — broadcast when a message is deleted
- `message:pin` → `{ target, messageId }` — pin a message
- `message:pinned` ← `{ target, message }` — broadcast when a message is pinned
- `message:unpin` → `{ target, messageId }` — unpin a message
- `message:unpinned` ← `{ target, messageId }` — broadcast when a message is unpinned
- `typing` → `{ type, id }` — notify others you're typing
- `error:message` ← `{ error }` — sent back to you only, when an edit/delete/pin/unpin/send is rejected
- `session:revoked` ← `{ reason }` — sent right before the server disconnects this socket because its
  session was logged out, deleted, or force-logged-out from elsewhere (`reason`: `logout`,
  `session_deleted`, `force_logout`, or `password_reset`)

Only the original sender can edit or delete their own message; any group member / DM participant can pin or unpin. Deleted messages are kept as soft-deleted rows (`content` cleared, `deleted_at` set) so message ids stay stable in open UIs.

## Message history: infinite scroll, search, pinned

- `GET /api/groups/:id/messages?before=&limit=` / `GET /api/conversations/:id/messages?before=&limit=` — paginated history (infinite scroll), now also returns `edited_at`, `deleted_at`, `pinned_at`, `pinned_by`, `pinned_by_name` per message.
- `GET /api/groups/:id/messages/search?q=&before=&limit=` / `GET /api/conversations/:id/messages/search?q=&before=&limit=` — full-text-ish search (`LIKE`) over non-deleted message content, same pagination shape.
- `GET /api/groups/:id/messages/pinned` / `GET /api/conversations/:id/messages/pinned` — list currently pinned messages, most recently pinned first.

## Monitoring dashboard (admin only)

Open `http://localhost:4000/dashboard.html` and log in with an account that has the `admin` or `super_admin` role. All stats update live over the `/dashboard` Socket.IO namespace (every few seconds, plus instantly on new messages/uploads/users/presence changes):

- Online / offline / total users, total admins, total rooms, total messages, total files, total voice messages (uploads with an `audio/*` mime type)
- RAM and CPU usage, server uptime
- Server / database / WebSocket connection status
- Messages chart and user-activity chart (last 24 hours, hourly)
- Current Jalali (Persian) date

REST snapshot (same data, one-time): `GET /api/dashboard/stats` (requires `Authorization: Bearer <token>` for an admin/super_admin user).

## Data model
`users`, `groups`, `group_members`, `conversations`, `messages`, `sessions`, `otp_codes` — see
`db/index.js` and `db/migrations/` for the full SQLite schema.

## Notes
- The SQLite file is created at `./data/chat.db` (git-ignored).
- Swap `better-sqlite3` for Postgres/MySQL later without touching the routes much — the queries are isolated in `routes/` and `db/`.

## Infrastructure (RBAC, migrations, notifications, logs, uploads)

This groundwork is in place for future features. Nothing here changes existing
behavior — it's additive scaffolding only.

- **Migrations** (`db/migrations/`): each file exports `{ name, up(db) }`.
  Applied automatically on boot (tracked in a `migrations` table) or manually
  with `npm run migrate`.
- **Roles & permissions** (`helpers/permissions.js`): `permissions`, `roles`,
  `role_permissions`, `user_roles` tables. Seeded roles: `super_admin`,
  `admin`, `member` (new users get `member` automatically). Use
  `requirePermission('key')` / `requireRole('key')` as route middleware.
  - `GET /api/roles/me` — current user's roles & permissions
  - `GET /api/roles`, `GET /api/roles/permissions` — admin only (`roles.manage`)
- **Notifications** (`helpers/notifier.js`, `notifications` table):
  - `GET /api/notifications`, `GET /api/notifications/unread-count`
  - `POST /api/notifications/:id/read`, `POST /api/notifications/read-all`
- **Logs** (`helpers/logger.js`, `logs` table): every HTTP error and every
  emitted domain event is recorded automatically.
  - `GET /api/logs` — admin only (`logs.view`)
- **Uploads / file system** (`helpers/upload.js`, `helpers/crypto.js`,
  `helpers/downloadLink.js`, `uploads` table, local disk storage under
  `UPLOAD_DIR`, works on a plain VPS/shared host — no cloud dependency):
  - Three send endpoints, one per kind, each with its own size/type limits
    (`config/index.js`, env vars `MAX_FILE_SIZE_MB`/`FILE_ALLOWED_TYPES`,
    `MAX_IMAGE_SIZE_MB`/`IMAGE_ALLOWED_TYPES`, `MAX_VOICE_SIZE_MB`/`VOICE_ALLOWED_TYPES`):
    - `POST /api/uploads/file` (multipart field `file`) — send a file
    - `POST /api/uploads/image` (multipart field `image`) — send a photo
    - `POST /api/uploads/voice` (multipart field `voice`) — send a voice message
  - `GET /api/uploads` — list your own uploads; `GET /api/uploads/:id` — metadata
    (accessible to the uploader, and to anyone the file was actually sent to in a chat)
  - `GET /api/uploads/:id/download` — download the file (`Content-Disposition: attachment`)
  - `GET /api/uploads/:id/stream` — inline, with HTTP Range support (206 Partial
    Content) for online voice playback (`<audio src="...">`) and image previews
  - `GET /api/uploads/:id/link` — mint a short-lived, signed download link
    (`?token=...`, default 15 min via `UPLOAD_LINK_TTL_MINUTES`) that works on
    `/download` or `/stream` without an `Authorization` header
  - **Encryption at rest**: every file is encrypted while it's written to disk
    (AES-256-GCM, envelope encryption — each file gets its own random key, which
    is itself encrypted with `UPLOAD_ENCRYPTION_KEY`). Plaintext is never
    persisted; files are decrypted on the fly when served. A SHA-256 checksum is
    stored for integrity.
  - **Upload progress**: send an `X-Upload-Id: <id-you-make-up>` header on the
    upload request; the server emits `upload:progress` Socket.IO events
    (`{ uploadId, loaded, total, percent }`) to your own connection(s) as the
    request body is received, finishing with `{ percent: 100, done: true }`.
  - **Sending a file/photo/voice message**: upload it first via one of the
    three endpoints above to get an `id`, then send it over Socket.IO:
    `message:send` → `{ target, content?, attachment: { uploadId, category: 'file'|'image'|'voice' } }`
    (`content` is an optional caption). The upload must belong to you and not
    already be attached to another message. Message history
    (`GET .../messages`, `.../messages/search`, `.../messages/pinned`) and the
    `message:new`/`message:edited`/`message:pinned` socket events now include
    `message_type` (`text`|`file`|`image`|`voice`) and, when present, an
    `attachment` object (`id`, `original_name`, `mime_type`, `size`, `category`).
  - **Size limits from the super-admin panel** (`helpers/settings.js`,
    `settings` table): the `.env` values above are just the defaults — a
    `super_admin` (not a regular `admin`; needs the `settings.manage`
    permission) can change the per-category max size at runtime, no restart
    needed:
    - `GET /api/admin/settings/upload-limits` — current effective limits
    - `PATCH /api/admin/settings/upload-limits` `{ file?, image?, voice? }` (MB, 1–500) —
      update one or more categories
    - `DELETE /api/admin/settings/upload-limits/:category` — revert that
      category back to its `.env` default
    - `GET /api/uploads/limits` — read-only, any authenticated user (so
      clients can show the current limit before picking a file)
- **Events** (`events/bus.js`, `events/types.js`): a simple in-process
  `EventEmitter`. Existing routes/sockets emit events
  (`user.registered`, `user.logged_in`, `group.created`,
  `conversation.created`, `message.sent`, `file.uploaded`,
  `notification.created`) that future features can subscribe to.
- **Config** (`config/index.js`): centralizes env vars (uploads, pagination,
  logging). See `.env.example` for the new variables.
- **Helpers** (`helpers/`): `asyncHandler.js`, `response.js`,
  `pagination.js` — shared utilities for building new routes consistently.
