# 💬 چت‌روم | Chatroom

پلتفرم چت گروهی و خصوصی بلادرنگ با پنل مدیریت کامل.
Real-time group + direct-message chat platform with a full admin panel.

> 🇮🇷 [راهنمای فارسی](#-فارسی) &nbsp;|&nbsp; 🇬🇧 [English guide](#-english)

---

## 🇮🇷 فارسی

### 📖 معرفی

یک بک‌اند Node.js همراه با فرانت‌اند تک‌صفحه‌ای (Vanilla JS) برای یک اپلیکیشن چت فارسی‌زبان. کاربران با **نام، شماره موبایل و رمز عبور** ثبت‌نام می‌کنند، در **روم‌های عمومی/خصوصی** یا **پیام خصوصی (DM)** چت می‌کنند، و همه‌چیز از طریق Socket.IO به‌صورت آنی همگام می‌شود. یک پنل ادمین کامل (`/dashboard.html`) هم برای مدیریت کاربران، روم‌ها، فایل‌ها، نقش‌ها و بکاپ‌گیری وجود دارد.

### ✨ امکانات

**🔐 حساب کاربری و امنیت**
- ثبت‌نام/ورود با شماره موبایل + رمز عبور، مدیریت چند دستگاه، خروج تکی از هر دستگاه
- تأیید شماره موبایل و بازیابی رمز با کد یک‌بارمصرف (OTP)
- سؤالات امنیتی، قفل موقت حساب پس از تلاش‌های ناموفق (Lockout)
- نام کاربری یکتا (`@username`)

**🏠 روم‌ها (گروه‌ها)**
- روم عمومی/خصوصی، آواتار و بیوگرافی روم
- سلسله‌مراتب نقش: مالک 👑 / ادمین 🛡️ / عضو 👤
- دعوت مستقیم کاربر + لینک دعوت اشتراکی 🔗
- قفل ارسال به‌تفکیک نوع محتوا (پیام متنی، فایل، عکس، صدا، ویدیو) 🔒 — فقط مالک/ادمین می‌توانند وقتی قفل است ارسال کنند
- بلاک 🚫 و میوت 🔇 کاربران به‌صورت شخصی

**💬 پیام‌رسانی**
- پیام متنی، عکس 🖼️، صدا 🎤، ویدیو 🎬، فایل 📎 و استیکر 🎨
- ریپلای ↩️، ریاکشن ایموجی 😄 و فوروارد پیام ➡️
- ویرایش/حذف پیام ✏️🗑️، وضعیت خوانده‌شدن ✅✅ (Read Receipts)
- استیکر: ایمپورت مستقیم پک استیکر تلگرام با توکن ربات (BotFather) 🤖

**📁 فایل‌ها**
- سقف حجم و نوع فایل مجاز، جدا برای هر دسته (عکس/صدا/ویدیو/فایل)، قابل تغییر از پنل سوپرادمین
- رمزنگاری فایل‌ها هنگام ذخیره‌سازی 🔐 (AES-256-GCM، envelope encryption)
- دانلود/نمایش فایل فقط با لینک امن و کوتاه‌مدت (Signed URL با انقضا) ⏳

**🎨 رابط کاربری**
- چهار تم رنگی 🌗 (تاریک شیشه‌ای، تاریک کلاسیک، روشن، روشن کلاسیک) با ذخیره در دستگاه
- PWA 📲 — قابل نصب روی موبایل و دسکتاپ
- کاملاً واکنش‌گرا (موبایل و دسکتاپ) 📱💻

**⚙️ مدیریت (`/dashboard.html`)**
- سیستم نقش/مجوز (RBAC): `super_admin`، `admin`، `member` + مجوزهای ریز مثل مدیریت کاربران، مدیریت گروه‌ها، نظارت بر پیام‌ها، مدیریت فایل‌ها، اعلان‌ها، مشاهده لاگ
- کنسول سوپرادمین: مرور همهٔ روم‌ها و همهٔ گفتگوهای خصوصی (همراه با عکس/فایل/ویس/ویدیوی واقعی پیام‌ها 🖼️🎤🎬📎)، ارسال اعلان سراسری 📢، بکاپ‌گیری و بازیابی دیتابیس 💾
- مدیریت تنظیمات آپلود (سقف حجم/نوع فایل هر دسته) بدون نیاز به ری‌استارت سرور
- لاگ کامل رویدادهای مدیریتی 📋 (بن، میوت، تغییر نقش و ...)

### 🧱 پشته فناوری (Stack)
| بخش | ابزار |
|---|---|
| سرور | Express.js |
| بلادرنگ | Socket.IO |
| دیتابیس | SQLite (`better-sqlite3`) — بدون نیاز به سرور جداگانه |
| احراز هویت | JWT + bcrypt |
| آپلود | Multer + رمزنگاری AES-256-GCM |
| فرانت‌اند | HTML/CSS/JS خالص (بدون فریم‌ورک) |

### ✅ پیش‌نیازهای سرور
- یک سرور لینوکسی (VPS) یا سرویسی مثل Railway
- Node.js نسخه ۱۸ یا بالاتر
- npm
- (پیشنهادی) [PM2](https://pm2.keymetrics.io/) برای بالا نگه‌داشتن دائمی پروسه و ری‌استارت خودکار
- (پیشنهادی) Nginx به‌عنوان reverse proxy جلوی برنامه، برای گرفتن SSL رایگان با Certbot

### ⚠️ نکات مهم قبل از شروع

این پروژه با حذف مقادیر حساس آماده شده تا هرکسی خودش آن‌ها را بسازد:

1. **فایل `.env` وجود ندارد** — فقط `.env.example` هست. باید یک فایل `.env` جدید بسازید و مقادیر خودتان (کلیدهای رمزنگاری، رمز JWT و ...) را داخلش بگذارید. **هیچ‌کدام از این مقادیر را از جای دیگری کپی نکنید** — هرکدام باید یکتا و مخصوص سرور خودتان باشند.
2. **شمارهٔ سوپرادمین هاردکد است** — داخل فایل `helpers/superAdmin.js` مقدار `SUPER_ADMIN_PHONE_DIGITS` روی `9123456789` تنظیم شده که فقط یک **مقدار نمونه/جای‌گیر (placeholder)** است، نه شمارهٔ واقعی کسی. حتماً قبل از اجرا آن را با شمارهٔ موبایل خودتان جایگزین کنید (بخش «تبدیل شدن به سوپرادمین» را ببینید).

### 🚀 راه‌اندازی روی سرور (VPS)

این بخش نصب و اجرای دائمی روی یک سرور واقعی (نه اجرای لوکال روی سیستم شخصی) را توضیح می‌دهد.

```bash
# ۱) به سرور SSH بزنید و پیش‌نیازها را نصب کنید (مثال برای Ubuntu)
sudo apt update && sudo apt install -y nodejs npm git
sudo npm install -g pm2

# ۲) پروژه را روی سرور قرار دهید (کپی/آپلود زیپ یا clone از گیت)
cd /var/www
unzip luckdone-updated.zip
cd luckdone-updated

# ۳) نصب پکیج‌ها
npm install --omit=dev

# ۴) ساخت فایل .env از روی نمونه و پر کردن مقادیر واقعی
cp .env.example .env
nano .env
#    حداقل این مقادیر را با مقداری تصادفی و امن پر کنید:
#    JWT_SECRET, UPLOAD_LINK_SECRET, UPLOAD_ENCRYPTION_KEY
#    (برای ساخت یک رشتهٔ تصادفی امن می‌توانید از دستور زیر کمک بگیرید:
#     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# ۵) اجرای مهاجرت‌های دیتابیس (ساخت جداول)
npm run migrate

# ۶) اجرای برنامه به‌صورت دائمی با PM2
pm2 start server.js --name chatroom
pm2 save
pm2 startup   # برای بالا آمدن خودکار بعد از ری‌بوت سرور
```

از این به بعد برنامه روی پورتی که در `.env` (`PORT`) تنظیم کرده‌اید در حال اجراست (پیش‌فرض `4000`).
- فرانت‌اند اصلی چت: `http://IP-یا-دامنهٔ-سرور:PORT/`
- پنل مدیریت: `http://IP-یا-دامنهٔ-سرور:PORT/dashboard.html`

> برای آپدیت بعدی: فایل‌های جدید را جایگزین کنید (بدون دست‌زدن به `.env` و پوشهٔ دیتا/آپلود)، `npm install --omit=dev` و `npm run migrate` را دوباره اجرا کنید و در آخر `pm2 restart chatroom` بزنید.

#### 🌐 قرار دادن پشت دامنه با HTTPS (اختیاری ولی توصیه‌شده)

با Nginx به‌عنوان reverse proxy و Certbot برای گواهی SSL رایگان:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
sudo certbot --nginx -d yourdomain.com
```

پس از این کار، `CORS_ORIGIN` در `.env` را هم به `https://yourdomain.com` محدود کنید.

### 👑 تبدیل شدن به سوپرادمین (اولین بار)

اولین سوپرادمین با شمارهٔ موبایلی که در `helpers/superAdmin.js` تنظیم شده مشخص می‌شود:

```js
const SUPER_ADMIN_PHONE_DIGITS = '9123456789'; // ← این فقط یک نمونه است
```

**قبل از اجرا روی سرور**، این عدد را با شمارهٔ موبایل خودتان (بدون `0` یا `98` ابتدایی) عوض کنید، سپس با همان شماره در اپ ثبت‌نام کنید — به‌محض راه‌اندازی سرور، نقش `super_admin` به‌صورت خودکار به آن حساب داده می‌شود. بعد از آن، از داخل پنل مدیریت (تب نقش‌ها) می‌توانید به بقیهٔ کاربران هم نقش `admin`/`member` بدهید.

### 🔧 متغیرهای محیطی (`.env`)

فایل `.env.example` را کپی کرده و به `.env` تغییر نام دهید، سپس مقادیر زیر را با مقادیر واقعی خودتان پر کنید (این پروژه بدون `.env` واقعی منتشر شده — همهٔ مقادیر باید توسط خودتان ساخته شوند):

| متغیر | توضیح | پیش‌فرض |
|---|---|---|
| `PORT` | پورت سرور | `4000` |
| `JWT_SECRET` | کلید امضای توکن ورود — **حتماً یک مقدار طولانی و تصادفی خودتان بسازید** | — |
| `JWT_EXPIRES_IN` | مدت اعتبار توکن ورود | `7d` |
| `DB_PATH` | مسیر فایل دیتابیس SQLite | `./data/chat.db` |
| `BACKUP_DIR` | مسیر ذخیرهٔ بکاپ‌های دیتابیس | کنار فایل دیتابیس |
| `CORS_ORIGIN` | دامنه‌های مجاز برای CORS | `*` |
| `UPLOAD_DIR` | مسیر ذخیرهٔ فایل‌های آپلودی | `./uploads` |
| `MAX_FILE_SIZE_MB` / `MAX_IMAGE_SIZE_MB` / `MAX_VOICE_SIZE_MB` / `MAX_VIDEO_SIZE_MB` | سقف حجم هر دسته (مگابایت) — بعداً هم از پنل سوپرادمین قابل تغییرند | متفاوت |
| `FILE_ALLOWED_TYPES` / `IMAGE_ALLOWED_TYPES` / `VOICE_ALLOWED_TYPES` / `VIDEO_ALLOWED_TYPES` | لیست MIME type مجاز هر دسته | متفاوت |
| `UPLOAD_ENCRYPTION_KEY` | کلید ۳۲ بایتی برای رمزنگاری فایل‌ها روی دیسک (hex یا base64) — **الزامی، خودتان بسازید** | — |
| `UPLOAD_LINK_SECRET` | کلید امضای لینک‌های دانلود امن — **خودتان بسازید** | — |
| `UPLOAD_LINK_TTL_MINUTES` | مدت اعتبار لینک دانلود | `15` |
| `TELEGRAM_BOT_TOKEN` | توکن ربات تلگرام برای ایمپورت پک استیکر (اختیاری، از BotFather بگیرید) | — |
| `STICKERS_DIR` | مسیر ذخیرهٔ استیکرهای ایمپورت‌شده | داخل `UPLOAD_DIR` |
| `MAX_STICKERS_PER_PACK` | سقف تعداد استیکر هر پک | `200` |
| `DEFAULT_PAGE_SIZE` / `MAX_PAGE_SIZE` | صفحه‌بندی نتایج API | `20` / `100` |
| `LOG_LEVEL` / `LOG_TO_CONSOLE` | تنظیمات لاگ | `info` / `true` |
| `OTP_TTL_MINUTES` / `OTP_MAX_ATTEMPTS` / `OTP_RESEND_SECONDS` | تنظیمات کد یک‌بارمصرف (تأیید شماره/بازیابی رمز) | `5` / `5` / `60` |

### 📂 ساختار پروژه

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

### ☁️ دیپلوی روی Railway (جایگزین سریع‌تر VPS)

1. مخزن پروژه را به Railway وصل کنید یا فایل‌ها را مستقیم آپلود کنید.
2. متغیرهای محیطی بالا را در تب Variables تنظیم کنید (حتماً `JWT_SECRET`، `UPLOAD_ENCRYPTION_KEY`، `UPLOAD_LINK_SECRET`).
3. یک **Volume** به سرویس وصل کنید و `DB_PATH` و `UPLOAD_DIR` را داخل مسیر آن Volume قرار دهید — در غیر این صورت با هر دیپلوی جدید، دیتابیس و فایل‌های آپلودی پاک می‌شوند.
4. Build Command: `npm install` — Start Command: `npm start`.
5. بعد از اولین دیپلوی، یک‌بار از طریق Railway Shell دستور `npm run migrate` را اجرا کنید.

### 📜 اسکریپت‌های npm

| دستور | کاربرد |
|---|---|
| `npm start` | اجرای سرور در حالت عادی |
| `npm run dev` | اجرا با nodemon (ری‌استارت خودکار هنگام تغییر کد — مخصوص توسعه) |
| `npm run migrate` | اجرای مهاجرت‌های دیتابیس |

---

## 🇬🇧 English

### 📖 Overview

A Node.js backend with a vanilla-JS single-page frontend for a Persian-language chat app. Users sign up with **name, phone number, and password**, chat in **public/private rooms** or **direct messages**, and everything syncs live over Socket.IO. A full admin dashboard (`/dashboard.html`) is included for managing users, rooms, files, roles, and backups.

### ✨ Features

**🔐 Account & security**
- Register/login with phone + password, multi-device sessions, per-device logout
- Phone verification and password reset via OTP
- Security questions, temporary account lockout after failed attempts
- Unique `@username`

**🏠 Rooms (groups)**
- Public/private rooms with avatar and bio
- Role hierarchy: owner 👑 / admin 🛡️ / member 👤
- Direct invites + shareable invite links 🔗
- Per-content-type send locks (text, files, images, voice, video) 🔒 — only owner/admin can send while locked
- Personal block 🚫 and mute 🔇 of other users

**💬 Messaging**
- Text, image 🖼️, voice 🎤, video 🎬, file 📎, and sticker 🎨 messages
- Reply ↩️, emoji reactions 😄, and forwarding ➡️
- Edit/delete ✏️🗑️, read receipts ✅✅
- Stickers: import a Telegram sticker pack directly via a bot token (BotFather) 🤖

**📁 Files**
- Per-category size and allowed-MIME-type limits (image/voice/video/file), tunable live from the super-admin panel
- At-rest file encryption 🔐 (AES-256-GCM, envelope encryption)
- Files are only ever served through short-lived signed download links ⏳

**🎨 UI**
- Four color themes 🌗 (dark glass, dark classic, light, light classic), saved per device
- Installable PWA 📲 (mobile and desktop)
- Fully responsive 📱💻

**⚙️ Admin panel (`/dashboard.html`)**
- Role-based access control: `super_admin`, `admin`, `member`, plus granular permissions (user management, group management, message moderation, upload management, notifications, logs)
- Super-admin console: browse every room and every DM conversation (with real images/files/voice/video 🖼️🎤🎬📎, not just labels), send global broadcasts 📢, create/restore database backups 💾
- Live-editable upload limits per category, no server restart needed
- Full audit log 📋 of admin actions (bans, mutes, role changes, etc.)

### 🧱 Stack
| Layer | Tool |
|---|---|
| Server | Express.js |
| Real-time | Socket.IO |
| Database | SQLite (`better-sqlite3`) — no separate DB server needed |
| Auth | JWT + bcrypt |
| Uploads | Multer + AES-256-GCM encryption |
| Frontend | Plain HTML/CSS/JS (no framework) |

### ✅ Server requirements
- A Linux VPS or a service like Railway
- Node.js 18+
- npm
- (Recommended) [PM2](https://pm2.keymetrics.io/) to keep the process alive and auto-restart it
- (Recommended) Nginx as a reverse proxy in front of the app, for free SSL via Certbot

### ⚠️ Important before you start

This project ships with sensitive values stripped out so everyone generates their own:

1. **There's no `.env` file** — only `.env.example`. You need to create your own `.env` and fill in your own values (encryption keys, JWT secret, etc). **Don't copy these from anywhere else** — each one should be unique to your server.
2. **The super-admin phone number is hardcoded** — `SUPER_ADMIN_PHONE_DIGITS` in `helpers/superAdmin.js` is set to `9123456789`, which is only a **placeholder example**, not anyone's real number. Replace it with your own phone number before running the server (see "Becoming super admin" below).

### 🚀 Server setup (VPS)

This section covers installing and running the app permanently on a real server (not a local dev run on your own machine).

```bash
# 1) SSH into your server and install prerequisites (Ubuntu example)
sudo apt update && sudo apt install -y nodejs npm git
sudo npm install -g pm2

# 2) Get the project onto the server (upload/unzip, or git clone)
cd /var/www
unzip luckdone-updated.zip
cd luckdone-updated

# 3) Install dependencies
npm install --omit=dev

# 4) Create .env from the example and fill in real values
cp .env.example .env
nano .env
#    At minimum, fill these with a secure random value:
#    JWT_SECRET, UPLOAD_LINK_SECRET, UPLOAD_ENCRYPTION_KEY
#    (you can generate a secure random string with:
#     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 5) Run database migrations (creates tables)
npm run migrate

# 6) Run the app permanently with PM2
pm2 start server.js --name chatroom
pm2 save
pm2 startup   # so it comes back up automatically after a server reboot
```

The app is now running on the port set in `.env` (`PORT`, default `4000`).
- Chat frontend: `http://your-server-ip-or-domain:PORT/`
- Admin dashboard: `http://your-server-ip-or-domain:PORT/dashboard.html`

> To update later: replace the project files (leave `.env` and the data/uploads folders alone), run `npm install --omit=dev` and `npm run migrate` again, then `pm2 restart chatroom`.

#### 🌐 Putting it behind a domain with HTTPS (optional but recommended)

Using Nginx as a reverse proxy and Certbot for a free SSL certificate:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
sudo certbot --nginx -d yourdomain.com
```

After that, also restrict `CORS_ORIGIN` in `.env` to `https://yourdomain.com`.

### 👑 Becoming super admin (first run)

The first super admin is determined by the phone number set in `helpers/superAdmin.js`:

```js
const SUPER_ADMIN_PHONE_DIGITS = '9123456789'; // ← this is just a placeholder
```

**Before running on your server**, change this to your own phone number (digits only, no leading `0` or `98`), then register in the app with that same number — the `super_admin` role is granted to that account automatically on server startup. After that, use the dashboard's Roles tab to grant `admin`/`member` to other users.

### 🔧 Environment variables (`.env`)

Copy `.env.example` to `.env` and fill in real values yourself (this project ships without a real `.env` — every value below needs to be generated by you):

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `4000` |
| `JWT_SECRET` | Login token signing key — **generate your own long random value** | — |
| `JWT_EXPIRES_IN` | Login token lifetime | `7d` |
| `DB_PATH` | SQLite database file path | `./data/chat.db` |
| `BACKUP_DIR` | Where database backups are stored | next to the DB file |
| `CORS_ORIGIN` | Allowed CORS origin(s) | `*` |
| `UPLOAD_DIR` | Where uploaded files are stored | `./uploads` |
| `MAX_FILE_SIZE_MB` / `MAX_IMAGE_SIZE_MB` / `MAX_VOICE_SIZE_MB` / `MAX_VIDEO_SIZE_MB` | Per-category size cap (MB) — also editable later from the super-admin panel | varies |
| `FILE_ALLOWED_TYPES` / `IMAGE_ALLOWED_TYPES` / `VOICE_ALLOWED_TYPES` / `VIDEO_ALLOWED_TYPES` | Allowed MIME types per category | varies |
| `UPLOAD_ENCRYPTION_KEY` | 32-byte key for at-rest file encryption (hex or base64) — **required, generate your own** | — |
| `UPLOAD_LINK_SECRET` | Signing key for secure download links — **generate your own** | — |
| `UPLOAD_LINK_TTL_MINUTES` | Download link lifetime | `15` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for sticker-pack import (optional, get it from BotFather) | — |
| `STICKERS_DIR` | Where imported stickers are stored | inside `UPLOAD_DIR` |
| `MAX_STICKERS_PER_PACK` | Max stickers per imported pack | `200` |
| `DEFAULT_PAGE_SIZE` / `MAX_PAGE_SIZE` | API pagination | `20` / `100` |
| `LOG_LEVEL` / `LOG_TO_CONSOLE` | Logging config | `info` / `true` |
| `OTP_TTL_MINUTES` / `OTP_MAX_ATTEMPTS` / `OTP_RESEND_SECONDS` | OTP (phone verify / password reset) config | `5` / `5` / `60` |

### 📂 Project structure

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

### ☁️ Deploying on Railway (faster alternative to a VPS)

1. Connect the repo to Railway, or upload the files directly.
2. Set the environment variables above in the Variables tab (`JWT_SECRET`, `UPLOAD_ENCRYPTION_KEY`, and `UPLOAD_LINK_SECRET` in particular).
3. Attach a **Volume** to the service and point `DB_PATH` and `UPLOAD_DIR` into it — otherwise the database and uploaded files are wiped on every redeploy.
4. Build command: `npm install` — Start command: `npm start`.
5. After the first deploy, run `npm run migrate` once via the Railway shell.

### 📜 npm scripts

| Command | Purpose |
|---|---|
| `npm start` | Run the server normally |
| `npm run dev` | Run with nodemon (auto-restart on file changes — for development) |
| `npm run migrate` | Run pending database migrations |

---

## 📄 License
MIT
