# چت‌روم | Chatroom

پلتفرم چت گروهی و خصوصی بلادرنگ با پنل مدیریت کامل.
Real-time group + direct-message chat platform with a full admin panel.

> 🇮🇷 [راهنمای فارسی](#-فارسی) &nbsp;|&nbsp; 🇬🇧 [English guide](#-english)

---

## 🇮🇷 فارسی

### معرفی

یک بک‌اند Node.js همراه با فرانت‌اند تک‌صفحه‌ای (Vanilla JS) برای یک اپلیکیشن چت فارسی‌زبان. کاربران با **نام، شماره موبایل و رمز عبور** ثبت‌نام می‌کنند، در **روم‌های عمومی/خصوصی** یا **پیام خصوصی (DM)** چت می‌کنند، و همه‌چیز از طریق Socket.IO به‌صورت آنی همگام می‌شود. یک پنل ادمین کامل (`/dashboard.html`) هم برای مدیریت کاربران، روم‌ها، فایل‌ها، نقش‌ها و بکاپ‌گیری وجود دارد.

### امکانات

**حساب کاربری و امنیت**
- ثبت‌نام/ورود با شماره موبایل + رمز عبور، مدیریت چند دستگاه، خروج تکی از هر دستگاه
- تأیید شماره موبایل و بازیابی رمز با کد یک‌بارمصرف (OTP)
- سؤالات امنیتی، قفل موقت حساب پس از تلاش‌های ناموفق (Lockout)
- نام کاربری یکتا (`@username`)

**روم‌ها (گروه‌ها)**
- روم عمومی/خصوصی، آواتار و بیوگرافی روم
- سلسله‌مراتب نقش: مالک / ادمین / عضو
- دعوت مستقیم کاربر + لینک دعوت اشتراکی
- قفل ارسال به‌تفکیک نوع محتوا (پیام متنی، فایل، عکس، صدا، ویدیو) — فقط مالک/ادمین می‌توانند وقتی قفل است ارسال کنند
- بلاک و میوت کاربران به‌صورت شخصی

**پیام‌رسانی**
- پیام متنی، عکس، صدا (ویس)، ویدیو، فایل و استیکر
- ریپلای، ریاکشن (واکنش ایموجی) و فوروارد پیام
- ویرایش/حذف پیام، وضعیت خوانده‌شدن (Read Receipts)
- استیکر: ایمپورت مستقیم پک استیکر تلگرام با توکن ربات (BotFather)

**فایل‌ها**
- سقف حجم و نوع فایل مجاز، جدا برای هر دسته (عکس/صدا/ویدیو/فایل)، قابل تغییر از پنل سوپرادمین
- رمزنگاری فایل‌ها هنگام ذخیره‌سازی (AES-256-GCM، envelope encryption)
- دانلود/نمایش فایل فقط با لینک امن و کوتاه‌مدت (Signed URL با انقضا)

**رابط کاربری**
- چهار تم رنگی (تاریک شیشه‌ای، تاریک کلاسیک، روشن، روشن کلاسیک) با ذخیره در دستگاه
- PWA — قابل نصب روی موبایل و دسکتاپ
- کاملاً واکنش‌گرا (موبایل و دسکتاپ)

**مدیریت (`/dashboard.html`)**
- سیستم نقش/مجوز (RBAC): `super_admin`، `admin`، `member` + مجوزهای ریز مثل مدیریت کاربران، مدیریت گروه‌ها، نظارت بر پیام‌ها، مدیریت فایل‌ها، اعلان‌ها، مشاهده لاگ
- کنسول سوپرادمین: مرور همهٔ روم‌ها و همهٔ گفتگوهای خصوصی (همراه با عکس/فایل/ویس/ویدیوی واقعی پیام‌ها)، ارسال اعلان سراسری، بکاپ‌گیری و بازیابی دیتابیس
- مدیریت تنظیمات آپلود (سقف حجم/نوع فایل هر دسته) بدون نیاز به ری‌استارت سرور
- لاگ کامل رویدادهای مدیریتی (بن، میوت، تغییر نقش و ...)

### پشته فناوری (Stack)
| بخش | ابزار |
|---|---|
| سرور | Express.js |
| بلادرنگ | Socket.IO |
| دیتابیس | SQLite (`better-sqlite3`) — بدون نیاز به سرور جداگانه |
| احراز هویت | JWT + bcrypt |
| آپلود | Multer + رمزنگاری AES-256-GCM |
| فرانت‌اند | HTML/CSS/JS خالص (بدون فریم‌ورک) |

### پیش‌نیازها
- Node.js نسخه ۱۸ یا بالاتر
- npm

### نصب و راه‌اندازی

```bash
# ۱) نصب پکیج‌ها
npm install

# ۲) کپی فایل تنظیمات نمونه
cp .env.example .env

# ۳) فایل .env را باز کنید و حداقل این مقادیر را عوض کنید:
#    JWT_SECRET, UPLOAD_LINK_SECRET, UPLOAD_ENCRYPTION_KEY

# ۴) اجرای مهاجرت‌های دیتابیس (ساخت جداول)
npm run migrate

# ۵) اجرا در حالت توسعه (ری‌استارت خودکار با nodemon)
npm run dev

# یا اجرا در حالت پروداکشن
npm start
```

سرور به‌صورت پیش‌فرض روی `http://localhost:4000` بالا می‌آید.
- فرانت‌اند اصلی چت: `http://localhost:4000/`
- پنل مدیریت: `http://localhost:4000/dashboard.html`

> مهاجرت‌ها (`npm run migrate`) idempotent هستند؛ یعنی هر بار که سرور را آپدیت کردید فقط کافیست دوباره اجرایشان کنید، مهاجرت‌های قبلاً اجراشده دوباره اجرا نمی‌شوند.

### تبدیل شدن به سوپرادمین (اولین بار)

اولین سوپرادمین با شمارهٔ موبایل هاردکد در `helpers/superAdmin.js` مشخص می‌شود:

```js
const SUPER_ADMIN_PHONE_DIGITS = '9106736500';
```

**قبل از دیپلوی**، این عدد را با شمارهٔ موبایل خودتان (بدون `0` یا `98` ابتدایی) عوض کنید، سپس با همان شماره در اپ ثبت‌نام کنید — به‌محض راه‌اندازی سرور، نقش `super_admin` به‌صورت خودکار به آن حساب داده می‌شود. بعد از آن، از داخل پنل مدیریت (تب نقش‌ها) می‌توانید به بقیهٔ کاربران هم نقش `admin`/`member` بدهید.

### متغیرهای محیطی (`.env`)

| متغیر | توضیح | پیش‌فرض |
|---|---|---|
| `PORT` | پورت سرور | `4000` |
| `JWT_SECRET` | کلید امضای توکن ورود — حتماً در پروداکشن تغییر دهید | — |
| `JWT_EXPIRES_IN` | مدت اعتبار توکن ورود | `7d` |
| `DB_PATH` | مسیر فایل دیتابیس SQLite | `./data/chat.db` |
| `BACKUP_DIR` | مسیر ذخیرهٔ بکاپ‌های دیتابیس | کنار فایل دیتابیس |
| `CORS_ORIGIN` | دامنه‌های مجاز برای CORS | `*` |
| `UPLOAD_DIR` | مسیر ذخیرهٔ فایل‌های آپلودی | `./uploads` |
| `MAX_FILE_SIZE_MB` / `MAX_IMAGE_SIZE_MB` / `MAX_VOICE_SIZE_MB` / `MAX_VIDEO_SIZE_MB` | سقف حجم هر دسته (مگابایت) — بعداً هم از پنل سوپرادمین قابل تغییرند | متفاوت |
| `FILE_ALLOWED_TYPES` / `IMAGE_ALLOWED_TYPES` / `VOICE_ALLOWED_TYPES` / `VIDEO_ALLOWED_TYPES` | لیست MIME type مجاز هر دسته | متفاوت |
| `UPLOAD_ENCRYPTION_KEY` | کلید ۳۲ بایتی برای رمزنگاری فایل‌ها روی دیسک (hex یا base64) — **الزامی برای پروداکشن** | — |
| `UPLOAD_LINK_SECRET` | کلید امضای لینک‌های دانلود امن | — |
| `UPLOAD_LINK_TTL_MINUTES` | مدت اعتبار لینک دانلود | `15` |
| `TELEGRAM_BOT_TOKEN` | توکن ربات تلگرام برای ایمپورت پک استیکر (اختیاری) | — |
| `STICKERS_DIR` | مسیر ذخیرهٔ استیکرهای ایمپورت‌شده | داخل `UPLOAD_DIR` |
| `MAX_STICKERS_PER_PACK` | سقف تعداد استیکر هر پک | `200` |
| `DEFAULT_PAGE_SIZE` / `MAX_PAGE_SIZE` | صفحه‌بندی نتایج API | `20` / `100` |
| `LOG_LEVEL` / `LOG_TO_CONSOLE` | تنظیمات لاگ | `info` / `true` |
| `OTP_TTL_MINUTES` / `OTP_MAX_ATTEMPTS` / `OTP_RESEND_SECONDS` | تنظیمات کد یک‌بارمصرف (تأیید شماره/بازیابی رمز) | `5` / `5` / `60` |

### ساختار پروژه

```
├── server.js            نقطهٔ ورود سرور
├── config/               تنظیمات
├── db/                    اتصال دیتابیس + migrations
├── helpers/              منطق مشترک (پرمیشن، آپلود، امنیت و ...)
├── middleware/           میان‌افزار Express (auth و ...)
├── routes/                اندپوینت‌های REST API
├── sockets/               منطق بلادرنگ Socket.IO
├── events/                باس رویداد داخلی
├── scripts/migrate.js     اجراکنندهٔ migrationها
└── public/
    ├── index.html          فرانت‌اند اصلی چت
    └── dashboard.html      پنل مدیریت
```

### دیپلوی (Railway / VPS)

1. متغیرهای محیطی بالا را در پنل هاست تنظیم کنید (حتماً `JWT_SECRET`، `UPLOAD_ENCRYPTION_KEY`، `UPLOAD_LINK_SECRET`).
2. مطمئن شوید مسیرهای `DB_PATH` و `UPLOAD_DIR` روی یک **Volume دائمی** قرار دارند (نه فایل‌سیستم موقت)، وگرنه با هر ری‌دیپلوی دیتا و فایل‌ها پاک می‌شوند.
3. دستور Build: `npm install` — دستور Start: `npm start` (بعد از اولین دیپلوی یک‌بار `npm run migrate` را هم اجرا کنید).
4. اگر پشت HTTPS/Proxy هستید، `CORS_ORIGIN` را به دامنهٔ واقعی فرانت‌اند محدود کنید.

### اسکریپت‌های npm

| دستور | کاربرد |
|---|---|
| `npm start` | اجرای سرور در حالت عادی |
| `npm run dev` | اجرا با nodemon (ری‌استارت خودکار هنگام تغییر کد) |
| `npm run migrate` | اجرای مهاجرت‌های دیتابیس |

---

## 🇬🇧 English

### Overview

A Node.js backend with a vanilla-JS single-page frontend for a Persian-language chat app. Users sign up with **name, phone number, and password**, chat in **public/private rooms** or **direct messages**, and everything syncs live over Socket.IO. A full admin dashboard (`/dashboard.html`) is included for managing users, rooms, files, roles, and backups.

### Features

**Account & security**
- Register/login with phone + password, multi-device sessions, per-device logout
- Phone verification and password reset via OTP
- Security questions, temporary account lockout after failed attempts
- Unique `@username`

**Rooms (groups)**
- Public/private rooms with avatar and bio
- Role hierarchy: owner / admin / member
- Direct invites + shareable invite links
- Per-content-type send locks (text, files, images, voice, video) — only owner/admin can send while locked
- Personal block/mute of other users

**Messaging**
- Text, image, voice, video, file, and sticker messages
- Reply, emoji reactions, and forwarding
- Edit/delete, read receipts
- Stickers: import a Telegram sticker pack directly via a bot token (BotFather)

**Files**
- Per-category size and allowed-MIME-type limits (image/voice/video/file), tunable live from the super-admin panel
- At-rest file encryption (AES-256-GCM, envelope encryption)
- Files are only ever served through short-lived signed download links

**UI**
- Four color themes (dark glass, dark classic, light, light classic), saved per device
- Installable PWA (mobile and desktop)
- Fully responsive

**Admin panel (`/dashboard.html`)**
- Role-based access control: `super_admin`, `admin`, `member`, plus granular permissions (user management, group management, message moderation, upload management, notifications, logs)
- Super-admin console: browse every room and every DM conversation (with real images/files/voice/video, not just labels), send global broadcasts, create/restore database backups
- Live-editable upload limits per category, no server restart needed
- Full audit log of admin actions (bans, mutes, role changes, etc.)

### Stack
| Layer | Tool |
|---|---|
| Server | Express.js |
| Real-time | Socket.IO |
| Database | SQLite (`better-sqlite3`) — no separate DB server needed |
| Auth | JWT + bcrypt |
| Uploads | Multer + AES-256-GCM encryption |
| Frontend | Plain HTML/CSS/JS (no framework) |

### Requirements
- Node.js 18+
- npm

### Setup

```bash
# 1) Install dependencies
npm install

# 2) Copy the example env file
cp .env.example .env

# 3) Open .env and change at least:
#    JWT_SECRET, UPLOAD_LINK_SECRET, UPLOAD_ENCRYPTION_KEY

# 4) Run database migrations (creates tables)
npm run migrate

# 5) Start in dev mode (auto-restart via nodemon)
npm run dev

# or run in production mode
npm start
```

The server runs on `http://localhost:4000` by default.
- Chat frontend: `http://localhost:4000/`
- Admin dashboard: `http://localhost:4000/dashboard.html`

> Migrations (`npm run migrate`) are idempotent — after updating the server, just run it again; already-applied migrations are skipped.

### Becoming super admin (first run)

The first super admin is determined by a hardcoded phone number in `helpers/superAdmin.js`:

```js
const SUPER_ADMIN_PHONE_DIGITS = '9106736500';
```

**Before deploying**, change this to your own phone number (digits only, no leading `0` or `98`), then register in the app with that same number — the `super_admin` role is granted to that account automatically on server startup. After that, use the dashboard's Roles tab to grant `admin`/`member` to other users.

### Environment variables (`.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `4000` |
| `JWT_SECRET` | Login token signing key — change in production | — |
| `JWT_EXPIRES_IN` | Login token lifetime | `7d` |
| `DB_PATH` | SQLite database file path | `./data/chat.db` |
| `BACKUP_DIR` | Where database backups are stored | next to the DB file |
| `CORS_ORIGIN` | Allowed CORS origin(s) | `*` |
| `UPLOAD_DIR` | Where uploaded files are stored | `./uploads` |
| `MAX_FILE_SIZE_MB` / `MAX_IMAGE_SIZE_MB` / `MAX_VOICE_SIZE_MB` / `MAX_VIDEO_SIZE_MB` | Per-category size cap (MB) — also editable later from the super-admin panel | varies |
| `FILE_ALLOWED_TYPES` / `IMAGE_ALLOWED_TYPES` / `VOICE_ALLOWED_TYPES` / `VIDEO_ALLOWED_TYPES` | Allowed MIME types per category | varies |
| `UPLOAD_ENCRYPTION_KEY` | 32-byte key for at-rest file encryption (hex or base64) — **required in production** | — |
| `UPLOAD_LINK_SECRET` | Signing key for secure download links | — |
| `UPLOAD_LINK_TTL_MINUTES` | Download link lifetime | `15` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for sticker-pack import (optional) | — |
| `STICKERS_DIR` | Where imported stickers are stored | inside `UPLOAD_DIR` |
| `MAX_STICKERS_PER_PACK` | Max stickers per imported pack | `200` |
| `DEFAULT_PAGE_SIZE` / `MAX_PAGE_SIZE` | API pagination | `20` / `100` |
| `LOG_LEVEL` / `LOG_TO_CONSOLE` | Logging config | `info` / `true` |
| `OTP_TTL_MINUTES` / `OTP_MAX_ATTEMPTS` / `OTP_RESEND_SECONDS` | OTP (phone verify / password reset) config | `5` / `5` / `60` |

### Project structure

```
├── server.js            Server entry point
├── config/               Configuration
├── db/                    DB connection + migrations
├── helpers/              Shared logic (permissions, uploads, security, ...)
├── middleware/           Express middleware (auth, ...)
├── routes/                REST API endpoints
├── sockets/               Socket.IO real-time logic
├── events/                Internal event bus
├── scripts/migrate.js     Migration runner
└── public/
    ├── index.html          Main chat frontend
    └── dashboard.html      Admin dashboard
```

### Deployment (Railway / VPS)

1. Set the environment variables above on your host (`JWT_SECRET`, `UPLOAD_ENCRYPTION_KEY`, and `UPLOAD_LINK_SECRET` in particular).
2. Make sure `DB_PATH` and `UPLOAD_DIR` point to a **persistent volume**, not ephemeral storage — otherwise data and files are wiped on every redeploy.
3. Build command: `npm install` — Start command: `npm start` (run `npm run migrate` once after the first deploy).
4. If you're behind HTTPS/a proxy, restrict `CORS_ORIGIN` to your actual frontend domain.

### npm scripts

| Command | Purpose |
|---|---|
| `npm start` | Run the server normally |
| `npm run dev` | Run with nodemon (auto-restart on file changes) |
| `npm run migrate` | Run pending database migrations |

---

## License
MIT
