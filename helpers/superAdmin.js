const db = require('../db');
const { assignRole } = require('./permissions');
const { normalizePhone } = require('./phone');

// Whoever has this phone number is always treated as super_admin,
// regardless of formatting (spaces, +98/0 prefix, etc).
const SUPER_ADMIN_PHONE_DIGITS = '9123456789';

function normalizedPhoneDigits(phone) {
  return normalizePhone(phone);
}

function isSuperAdminPhone(phone) {
  return normalizedPhoneDigits(phone) === SUPER_ADMIN_PHONE_DIGITS;
}

// Run once at server startup: grants super_admin (and member) to any
// *existing* user whose phone matches, not just newly-registered ones.
// Without this, an account created before the auto-assign-on-register
// logic existed (or one whose role was accidentally revoked) would be
// permanently locked out of the admin panel with no way for anyone to
// grant it back, since granting roles itself requires the roles.manage
// permission that only super_admin has.
function ensureDefaultSuperAdmin() {
  const users = db.prepare('SELECT id, phone FROM users').all();
  for (const user of users) {
    if (isSuperAdminPhone(user.phone)) {
      assignRole(user.id, 'member');
      assignRole(user.id, 'super_admin');
    }
  }
}

module.exports = { SUPER_ADMIN_PHONE_DIGITS, normalizedPhoneDigits, isSuperAdminPhone, ensureDefaultSuperAdmin };
