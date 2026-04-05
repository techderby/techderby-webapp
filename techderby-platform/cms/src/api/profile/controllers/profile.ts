const SAFE_FIELDS = [
  'id', 'username', 'email', 'firstName', 'lastName', 'bio',
  'location', 'occupation', 'skills', 'certifications', 'isVisible',
  'avatar', 'socialLinks', 'memberRole', 'createdAt', 'updatedAt',
];

function sanitize(user: Record<string, any>) {
  // Normalise snake_case columns from raw SQL to camelCase
  const parsed = { ...user };
  if (parsed.created_at !== undefined && parsed.createdAt === undefined) parsed.createdAt = parsed.created_at;
  if (parsed.updated_at !== undefined && parsed.updatedAt === undefined) parsed.updatedAt = parsed.updated_at;
  if (parsed.first_name !== undefined && parsed.firstName === undefined) parsed.firstName = parsed.first_name;
  if (parsed.last_name !== undefined && parsed.lastName === undefined) parsed.lastName = parsed.last_name;
  if (parsed.member_role !== undefined && parsed.memberRole === undefined) parsed.memberRole = parsed.member_role;
  if (parsed.is_visible !== undefined && parsed.isVisible === undefined) parsed.isVisible = parsed.is_visible;
  if (parsed.social_links !== undefined && parsed.socialLinks === undefined) parsed.socialLinks = parsed.social_links;

  // JSON-parse any fields that may be stored as strings
  for (const f of ['skills', 'certifications', 'socialLinks']) {
    if (typeof parsed[f] === 'string') {
      try { parsed[f] = JSON.parse(parsed[f]); } catch { parsed[f] = null; }
    }
  }
  return Object.fromEntries(SAFE_FIELDS.filter((k) => k in parsed).map((k) => [k, parsed[k]]));
}

/** Run a raw SELECT on up_users — bypasses Strapi ORM which drops extension columns */
async function rawFindUser(where: Record<string, unknown>): Promise<Record<string, any> | null> {
  const knex = strapi.db.connection;
  const [key, val] = Object.entries(where)[0];
  // Use knex query builder for safe column handling (avoids quoting issues with snake_case columns)
  const row = await knex('up_users').where({ [key]: val }).first();
  return row ?? null;
}

export default {
  async register(ctx: any) {
    const { username, email, password, firstName = '', lastName = '' } = ctx.request.body ?? {};

    if (!username || !email || !password) {
      return ctx.badRequest('username, email and password are required.');
    }

    const byEmail = await rawFindUser({ email: email.toLowerCase() });
    if (byEmail) return ctx.badRequest('Email is already taken.');

    const byUsername = await rawFindUser({ username });
    if (byUsername) return ctx.badRequest('Username is already taken.');

    const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'authenticated' } });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const knex = strapi.db.connection;
    const now = new Date().toISOString();
    const docId = Math.random().toString(36).slice(2, 18);

    const inserted = await knex('up_users').insert({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      memberRole: 'member',
      isVisible: true,
      confirmed: true,
      blocked: false,
      provider: 'local',
      document_id: docId,
      created_at: now,
      updated_at: now,
    }).returning('*');

    const user = inserted[0];

    // Link to role
    if (role?.id) {
      await knex('up_users_role_lnk').insert({ user_id: user.id, role_id: role.id }).onConflict().ignore();
    }

    const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });
    return ctx.send({ jwt, user: sanitize(user) });
  },

  async getProfile(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized('You must be logged in.');

    const user = await rawFindUser({ id: userId });
    if (!user) return ctx.notFound();

    return ctx.send(sanitize(user));
  },

  async updateProfile(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized('You must be logged in.');

    // Strip fields users must never self-assign
    const { memberRole, blocked, role, password, email, id, username, ...allowedData } = ctx.request.body ?? {};

    // Stringify JSON fields for storage
    const data: Record<string, unknown> = { ...allowedData, updated_at: new Date().toISOString() };
    for (const f of ['skills', 'certifications', 'socialLinks']) {
      if (data[f] !== undefined && typeof data[f] !== 'string') {
        data[f] = JSON.stringify(data[f]);
      }
    }

    const knex = strapi.db.connection;
    const rows = await knex('up_users').where({ id: userId }).update(data).returning('*');
    const updated = rows[0];

    return ctx.send(sanitize(updated));
  },

  async uploadAvatar(ctx: any) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized('You must be logged in.');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');

    const files = ctx.request.files ?? {};
    // Field name sent from frontend is 'avatar'; fall back to 'files' just in case
    const file = files.avatar ?? files.files;

    if (!file) {
      strapi.log.error('[uploadAvatar] No file found. Available keys: ' + Object.keys(files).join(', '));
      return ctx.badRequest("No file uploaded. Send the image as form-data field 'avatar'.");
    }

    const mimeType: string = file.mimetype ?? file.type ?? '';
    if (!mimeType.startsWith('image/')) {
      return ctx.badRequest('Only image files are allowed.');
    }

    // Resolve where the file data lives (disk path or in-memory buffer)
    const srcPath: string | undefined = file.filepath ?? file.path ?? undefined;
    const ext = (path.extname(file.originalFilename ?? file.name ?? 'avatar.jpg') || '.jpg').toLowerCase();
    const filename = `avatar-${userId}-${Date.now()}${ext}`;

    // Write to Strapi's public/uploads directory
    const uploadDir = path.join(strapi.dirs.static.public, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const destPath = path.join(uploadDir, filename);

    if (srcPath) {
      fs.copyFileSync(srcPath, destPath);
    } else {
      const buf: Buffer | undefined = file.data ?? file._buf ?? undefined;
      if (!buf) {
        strapi.log.error('[uploadAvatar] File has no path or buffer. Keys: ' + Object.keys(file).join(', '));
        return ctx.badRequest('Cannot read uploaded file data.');
      }
      fs.writeFileSync(destPath, buf);
    }

    const avatarUrl = `/uploads/${filename}`;

    const knex = strapi.db.connection;
    await knex('up_users').where({ id: userId }).update({ avatar: avatarUrl, updated_at: new Date().toISOString() });

    return ctx.send({ url: avatarUrl });
  },

  async forgotPassword(ctx: any) {
    const { email } = ctx.request.body ?? {};

    // Always respond 200 immediately to prevent email enumeration
    ctx.send({ ok: true });

    if (!email || typeof email !== 'string') return;

    const user = await rawFindUser({ email: email.trim().toLowerCase() });
    if (!user || user.blocked) return;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require('crypto');
    const resetToken: string = crypto.randomBytes(32).toString('hex');

    const knex = strapi.db.connection;
    await knex('up_users').where({ id: user.id }).update({
      reset_password_token: resetToken,
      updated_at: new Date().toISOString(),
    });

    const frontendUrl = process.env.PUBLIC_FRONTEND_URL ?? 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?code=${resetToken}`;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    const logoPath = path.join(strapi.dirs.static.public, 'techderbywhitelogo.webp');
    const logoDataUri = fs.existsSync(logoPath)
      ? `data:image/webp;base64,${fs.readFileSync(logoPath).toString('base64')}`
      : null;

    const displayName: string = user.first_name
      ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
      : user.username;

    try {
      await strapi.plugin('email').service('email').send({
        to: user.email,
        subject: 'Reset your Tech Derby password',
        html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
        <tr><td style="height:4px;background:linear-gradient(90deg,#0ea5e9,#f97316);"></td></tr>
        <tr><td style="padding:36px 36px 0;">
          ${logoDataUri ? `<img src="${logoDataUri}" alt="Tech Derby" width="140" style="display:block;height:auto;margin-bottom:16px;" />` : `<p style="margin:0 0 16px;font-size:22px;font-weight:900;color:#ffffff;">Tech Derby</p>`}
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);">Password reset request</p>
        </td></tr>
        <tr><td style="padding:28px 36px;">
          <p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.85);">Hi ${displayName},</p>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.6);">We received a request to reset your password. Click the button below to choose a new one. This link expires in <strong style="color:rgba(255,255,255,0.8);">1 hour</strong>.</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr><td style="border-radius:10px;background:#f97316;">
              <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Reset my password</a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,0.35);">Or copy this link into your browser:</p>
          <p style="margin:0 0 24px;font-size:11px;color:rgba(255,255,255,0.3);word-break:break-all;">${resetUrl}</p>
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">If you didn't request this, you can safely ignore this email — your password won't change.</p>
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">&copy; ${new Date().getFullYear()} Tech Derby &middot; <a href="${frontendUrl}" style="color:rgba(255,255,255,0.2);">techderby.org</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        text: `Hi ${displayName},\n\nReset your Tech Derby password by visiting:\n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
      });
    } catch (err) {
      strapi.log.error('[forgotPassword] Failed to send reset email:', err);
    }
  },

  async resetPassword(ctx: any) {
    const { code, password, passwordConfirmation } = ctx.request.body ?? {};

    if (!code || typeof code !== 'string') {
      return ctx.badRequest('Reset code is required.');
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return ctx.badRequest('Password must be at least 8 characters.');
    }
    if (password !== passwordConfirmation) {
      return ctx.badRequest('Passwords do not match.');
    }

    const user = await rawFindUser({ reset_password_token: code });
    if (!user) {
      return ctx.badRequest('Invalid or expired reset code.');
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bcrypt = require('bcryptjs');
    const hashedPassword: string = await bcrypt.hash(password, 10);

    const knex = strapi.db.connection;
    await knex('up_users').where({ id: user.id }).update({
      password: hashedPassword,
      reset_password_token: null,
      updated_at: new Date().toISOString(),
    });

    return ctx.send({ ok: true });
  },
};
