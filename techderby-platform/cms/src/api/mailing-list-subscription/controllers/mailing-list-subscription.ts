import { factories } from '@strapi/strapi';
import { MAILING_LIST_CATEGORIES } from '../../../constants/mailing-list';

const SUBSCRIPTION_UID = 'api::mailing-list-subscription.mailing-list-subscription';
const ADMIN_ROLES = new Set(['admin', 'super-admin']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_IMPORT_SIZE = 10_000;
const MAX_NEWSLETTER_HTML_SIZE = 2_000_000;
const MAX_NEWSLETTER_IMAGE_SIZE = 5 * 1024 * 1024;
const SEND_CONCURRENCY = 5;
const SEGMENT_TABLE = 'mailing_list_segments';
const SEGMENT_MEMBERSHIP_TABLE = 'mailing_list_segment_memberships';
const DEFAULT_SEGMENT_NAME = 'All Users';
const NEWSLETTER_IMAGE_EXTENSIONS: Record<string, string> = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif',
};

function normalizeCategory(value: unknown) {
	const raw = String(value ?? '').trim();
	if (!raw || raw === 'General') return 'None';
	return MAILING_LIST_CATEGORIES.includes(raw as (typeof MAILING_LIST_CATEGORIES)[number]) ? raw : 'None';
}

function parseSegmentIds(value: unknown): number[] {
	if (!Array.isArray(value)) return [];
	return value
		.map((entry) => Number(entry))
		.filter((entry) => Number.isInteger(entry) && entry > 0);
}

async function ensureDefaultSegment() {
	const knex = strapi.db.connection;
	const existing = await knex(SEGMENT_TABLE).where({ name: DEFAULT_SEGMENT_NAME }).first();
	if (existing) return;
	await knex(SEGMENT_TABLE).insert({
		name: DEFAULT_SEGMENT_NAME,
		description: 'All subscribers in the mailing list.',
		categories: JSON.stringify([]),
		include_all: true,
		created_at: new Date(),
		updated_at: new Date(),
	});
}

function segmentCategories(segment: any): string[] {
	const supplied: unknown[] = Array.isArray(segment.categories)
		? segment.categories
		: (() => {
			try {
				const parsed = JSON.parse(String(segment.categories ?? '[]'));
				return Array.isArray(parsed) ? parsed : [];
			} catch {
				return [];
			}
		})();

	return [...new Set(supplied.map((value) => normalizeCategory(value)).filter((value) => value !== 'None'))];
}

async function subscriberIdsForSegment(segment: any): Promise<number[]> {
	const knex = strapi.db.connection;
	const baseRows = segment.include_all
		? await knex('mailing_list_subscriptions').select('id')
		: segmentCategories(segment).length
			? await knex('mailing_list_subscriptions').whereIn('category', segmentCategories(segment)).select('id')
			: [];
	const subscriberIds = new Set<number>(baseRows.map((row: { id: number }) => Number(row.id)));

	if (!segment.include_all) {
		const overrides = await knex(SEGMENT_MEMBERSHIP_TABLE).where({ segment_id: segment.id });
		for (const override of overrides) {
			const subscriptionId = Number(override.subscription_id);
			if (override.included) subscriberIds.add(subscriptionId);
			else subscriberIds.delete(subscriptionId);
		}
	}

	return [...subscriberIds];
}

async function listSegmentsWithCounts() {
	await ensureDefaultSegment();
	const knex = strapi.db.connection;
	const segments = await knex(SEGMENT_TABLE).orderBy('created_at', 'asc');
	const allCountRow = await knex('mailing_list_subscriptions').count<{ count: string }>('id as count').first();
	const allCount = Number(allCountRow?.count ?? 0);

	const withCounts = await Promise.all(
		segments.map(async (segment: any) => {
			if (segment.include_all) {
				return {
					id: segment.id,
					name: segment.name,
					description: segment.description ?? '',
					includeAll: true,
					categories: [] as string[],
					subscriberCount: allCount,
				};
			}

			const normalizedCategories = segmentCategories(segment);
			const subscriberIds = await subscriberIdsForSegment(segment);

			return {
				id: segment.id,
				name: segment.name,
				description: segment.description ?? '',
				includeAll: false,
				categories: normalizedCategories,
				subscriberCount: subscriberIds.length,
			};
		}),
	);

	return withCounts;
}

async function requireAdmin(ctx: any) {
	const userId = ctx.state.user?.id;
	if (!userId) {
		ctx.unauthorized('You must be logged in.');
		return null;
	}

	const user = await strapi.db.connection('up_users').where({ id: userId }).first();
	const memberRole = user?.memberRole ?? user?.member_role;
	if (!ADMIN_ROLES.has(memberRole)) {
		ctx.forbidden('Administrator access is required.');
		return null;
	}

	return user;
}

function escapeCsv(value: unknown) {
	let raw = String(value ?? '');

	// Prevent spreadsheet applications from interpreting exported values as formulas.
	if (/^[=+\-@]/.test(raw)) {
		raw = `'${raw}`;
	}

	if (raw.includes(',') || raw.includes('"') || raw.includes('\n') || raw.includes('\r')) {
		return `"${raw.replace(/"/g, '""')}"`;
	}
	return raw;
}

function sendCsv(ctx: any, rows: Array<Record<string, unknown>>) {
	const lines = [['id', 'email', 'category', 'createdAt'].join(',')];
	for (const row of rows) {
		lines.push([row.id, row.email, row.category ?? 'None', row.createdAt].map(escapeCsv).join(','));
	}

	const timestamp = new Date().toISOString().slice(0, 10);
	ctx.set('Content-Type', 'text/csv; charset=utf-8');
	ctx.set('Content-Disposition', `attachment; filename="mailing-list-subscriptions-${timestamp}.csv"`);
	ctx.body = `\uFEFF${lines.join('\r\n')}`;
}

function htmlToPlainText(html: string) {
	return html
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/gi, ' ')
		.replace(/&amp;/gi, '&')
		.replace(/&lt;/gi, '<')
		.replace(/&gt;/gi, '>')
		.replace(/\s+/g, ' ')
		.trim();
}

function prepareBrandedNewsletter(html: string) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const fs = require('fs');
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const path = require('path');
	const frontendUrl = (process.env.PUBLIC_FRONTEND_URL ?? 'http://localhost:3000').replace(/\/$/, '');
	const logoPath = path.join(strapi.dirs.static.public, 'techderbywhitelogo.webp');
	const hasLogoAttachment = fs.existsSync(logoPath);
	const logoSource = hasLogoAttachment ? 'cid:techderby-newsletter-logo' : '';
	const attachments = hasLogoAttachment
		? [{
				filename: 'techderby-logo.webp',
				path: logoPath,
				cid: 'techderby-newsletter-logo',
				contentType: 'image/webp',
			}]
		: [];

	const masthead = `<table role="presentation" data-td-server-brand="header" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="height:5px;background:#0ea5e9;font-size:0;line-height:0;">&nbsp;</td></tr><tr><td style="padding:28px 36px;background:#0f172a;">${
		logoSource
			? `<a href="${frontendUrl}" style="text-decoration:none;"><img src="${logoSource}" width="150" alt="Tech Derby" style="display:block;width:150px;max-width:100%;height:auto;border:0;"></a>`
			: `<a href="${frontendUrl}" style="color:#ffffff;text-decoration:none;font-size:24px;font-weight:800;">Tech Derby</a>`
	}</td></tr></table>`;
	const footer = `<table role="presentation" data-td-server-brand="footer" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding:26px 36px;background:#0f172a;"><p style="margin:0 0 8px;color:#ffffff;font-size:14px;line-height:21px;font-weight:700;">Learn. Connect. Build Derby's tech future.</p><p style="margin:0;color:#94a3b8;font-size:12px;line-height:19px;">You received this email because you joined the Tech Derby mailing list.</p><p style="margin:10px 0 0;color:#64748b;font-size:12px;line-height:18px;">&copy; ${new Date().getFullYear()} Tech Derby &middot; <a href="${frontendUrl}" style="color:#38bdf8;text-decoration:none;">Visit our website</a></p></td></tr></table>`;

	let brandedHtml = html;
	const logoPattern = /<img\b[^>]*data-td-brand-logo=["']true["'][^>]*>/i;
	if (logoPattern.test(brandedHtml)) {
		brandedHtml = brandedHtml.replace(logoPattern, (tag) =>
			tag.replace(/\bsrc=["'][^"']*["']/i, `src="${logoSource || `${frontendUrl}/techderbywhitelogo.webp`}"`),
		);
	} else if (/<body\b[^>]*>/i.test(brandedHtml)) {
		brandedHtml = brandedHtml.replace(/<body\b([^>]*)>/i, `<body$1>${masthead}`);
	} else {
		brandedHtml = `${masthead}${brandedHtml}`;
	}

	if (!/data-td-brand-footer=["']true["']/i.test(brandedHtml)) {
		brandedHtml = /<\/body>/i.test(brandedHtml)
			? brandedHtml.replace(/<\/body>/i, `${footer}</body>`)
			: `${brandedHtml}${footer}`;
	}

	return { html: brandedHtml, attachments };
}

export default factories.createCoreController('api::mailing-list-subscription.mailing-list-subscription', ({ strapi }) => ({
	async listForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;

		const rows = await strapi.db.query(SUBSCRIPTION_UID).findMany({
			select: ['id', 'email', 'category', 'createdAt'],
			orderBy: { createdAt: 'desc' },
		});

		const segments = await strapi.db.connection(SEGMENT_TABLE).where({ include_all: false });
		const membershipBySubscriber = new Map<number, number[]>();
		for (const segment of segments) {
			for (const subscriptionId of await subscriberIdsForSegment(segment)) {
				membershipBySubscriber.set(subscriptionId, [...(membershipBySubscriber.get(subscriptionId) ?? []), Number(segment.id)]);
			}
		}

		ctx.body = rows.map((row: any) => ({
			...row,
			segmentIds: membershipBySubscriber.get(Number(row.id)) ?? [],
		}));
	},

	async deleteForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;
		const id = Number(ctx.params?.id);
		if (!Number.isInteger(id) || id <= 0) return ctx.badRequest('Invalid subscriber id.');

		const existing = await strapi.db.query(SUBSCRIPTION_UID).findOne({ where: { id }, select: ['id'] });
		if (!existing) return ctx.notFound('Subscriber not found.');

		await strapi.db.query(SUBSCRIPTION_UID).delete({ where: { id } });
		ctx.status = 204;
	},

	async listSegmentsForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;
		ctx.body = await listSegmentsWithCounts();
	},

	async createSegmentForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;

		const name = String(ctx.request.body?.name ?? '').trim();
		const description = String(ctx.request.body?.description ?? '').trim();
		const suppliedCategories = Array.isArray(ctx.request.body?.categories) ? ctx.request.body.categories : [];

		if (!name) return ctx.badRequest('Segment name is required.');
		if (name.length > 120) return ctx.badRequest('Segment name must be 120 characters or fewer.');

		const categories = [...new Set(suppliedCategories.map((value: unknown) => normalizeCategory(value)).filter((value: string) => value !== 'None'))];
		if (!categories.length) return ctx.badRequest('Select at least one category for this segment.');

		const knex = strapi.db.connection;
		const exists = await knex(SEGMENT_TABLE).whereRaw('LOWER(name) = ?', [name.toLowerCase()]).first();
		if (exists) return ctx.badRequest('A segment with this name already exists.');

		await knex(SEGMENT_TABLE).insert({
			name,
			description: description || null,
			categories: JSON.stringify(categories),
			include_all: false,
			created_at: new Date(),
			updated_at: new Date(),
		});

		ctx.status = 201;
		ctx.body = await listSegmentsWithCounts();
	},

	async updateSegmentForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;
		const id = Number(ctx.params?.id);
		if (!Number.isInteger(id) || id <= 0) return ctx.badRequest('Invalid segment id.');

		const name = String(ctx.request.body?.name ?? '').trim();
		const description = String(ctx.request.body?.description ?? '').trim();
		const suppliedCategories = Array.isArray(ctx.request.body?.categories) ? ctx.request.body.categories : [];

		if (!name) return ctx.badRequest('Segment name is required.');
		if (name.length > 120) return ctx.badRequest('Segment name must be 120 characters or fewer.');

		const categories = [...new Set(suppliedCategories.map((value: unknown) => normalizeCategory(value)).filter((value: string) => value !== 'None'))];
		if (!categories.length) return ctx.badRequest('Select at least one category for this segment.');

		const knex = strapi.db.connection;
		const existing = await knex(SEGMENT_TABLE).where({ id }).first();
		if (!existing) return ctx.notFound('Segment not found.');
		if (existing.include_all) return ctx.badRequest('The default All Users segment cannot be edited.');

		const duplicate = await knex(SEGMENT_TABLE)
			.whereRaw('LOWER(name) = ?', [name.toLowerCase()])
			.whereNot({ id })
			.first();
		if (duplicate) return ctx.badRequest('A segment with this name already exists.');

		await knex(SEGMENT_TABLE).where({ id }).update({
			name,
			description: description || null,
			categories: JSON.stringify(categories),
			updated_at: new Date(),
		});

		ctx.body = await listSegmentsWithCounts();
	},

	async deleteSegmentForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;
		const id = Number(ctx.params?.id);
		if (!Number.isInteger(id) || id <= 0) return ctx.badRequest('Invalid segment id.');

		const knex = strapi.db.connection;
		const existing = await knex(SEGMENT_TABLE).where({ id }).first();
		if (!existing) return ctx.notFound('Segment not found.');
		if (existing.include_all) return ctx.badRequest('The default All Users segment cannot be deleted.');

		await knex(SEGMENT_TABLE).where({ id }).delete();
		ctx.body = await listSegmentsWithCounts();
	},

	async updateSegmentMembersForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;
		const id = Number(ctx.params?.id);
		if (!Number.isInteger(id) || id <= 0) return ctx.badRequest('Invalid segment id.');

		const action = String(ctx.request.body?.action ?? '');
		if (!['add', 'remove'].includes(action)) return ctx.badRequest('Action must be add or remove.');
		const suppliedIds = Array.isArray(ctx.request.body?.subscriptionIds) ? ctx.request.body.subscriptionIds : [];
		const subscriptionIds = [...new Set(suppliedIds.map(Number).filter((value: number) => Number.isInteger(value) && value > 0))];
		if (!subscriptionIds.length) return ctx.badRequest('Select at least one subscriber.');
		if (subscriptionIds.length > MAX_IMPORT_SIZE) return ctx.badRequest(`A maximum of ${MAX_IMPORT_SIZE} subscribers can be updated at once.`);

		const knex = strapi.db.connection;
		const segment = await knex(SEGMENT_TABLE).where({ id }).first();
		if (!segment) return ctx.notFound('Segment not found.');
		if (segment.include_all) return ctx.badRequest('The default All Users segment cannot be edited.');

		const existingSubscribers = await knex('mailing_list_subscriptions').whereIn('id', subscriptionIds).select('id');
		if (existingSubscribers.length !== subscriptionIds.length) return ctx.badRequest('One or more selected subscribers no longer exist.');

		const now = new Date();
		await knex(SEGMENT_MEMBERSHIP_TABLE)
			.insert(subscriptionIds.map((subscriptionId) => ({
				segment_id: id,
				subscription_id: subscriptionId,
				included: action === 'add',
				created_at: now,
				updated_at: now,
			})))
			.onConflict(['segment_id', 'subscription_id'])
			.merge({ included: action === 'add', updated_at: now });

		ctx.body = { updated: subscriptionIds.length, action };
	},

	async exportCsvForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;

		const rows = await strapi.db.query(SUBSCRIPTION_UID).findMany({
			select: ['id', 'email', 'category', 'createdAt'],
			orderBy: { createdAt: 'desc' },
		});
		sendCsv(ctx, rows);
	},

	async importForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;

		const supplied = ctx.request.body?.emails;
		if (!Array.isArray(supplied)) {
			return ctx.badRequest('emails must be an array.');
		}
		if (supplied.length > MAX_IMPORT_SIZE) {
			return ctx.badRequest(`A maximum of ${MAX_IMPORT_SIZE} emails can be imported at once.`);
		}

		const normalised = supplied.map((value: unknown) => String(value).trim().toLowerCase());
		const valid = [...new Set(normalised.filter((email: string) => EMAIL_PATTERN.test(email)))];
		const invalid = supplied.length - normalised.filter((email: string) => EMAIL_PATTERN.test(email)).length;

		const existingRows = valid.length
			? await strapi.db.query(SUBSCRIPTION_UID).findMany({
					select: ['email'],
					where: { email: { $in: valid } },
				})
			: [];
		const existing = new Set(existingRows.map((row: { email: string }) => row.email.toLowerCase()));
		const toImport = valid.filter((email) => !existing.has(email));

		for (const email of toImport) {
			await strapi.db.query(SUBSCRIPTION_UID).create({ data: { email, category: 'None' } });
		}

		ctx.body = {
			received: supplied.length,
			valid: valid.length,
			imported: toImport.length,
			skippedExisting: valid.length - toImport.length,
			invalid,
		};
	},

	async sendNewsletterForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;

		const subject = String(ctx.request.body?.subject ?? '').replace(/[\r\n]+/g, ' ').trim();
		const html = String(ctx.request.body?.html ?? '').trim();

		if (!subject || !html) {
			return ctx.badRequest('A subject and newsletter content are required.');
		}
		if (subject.length > 200) {
			return ctx.badRequest('The subject must be 200 characters or fewer.');
		}
		if (html.length > MAX_NEWSLETTER_HTML_SIZE) {
			return ctx.badRequest('The newsletter content is too large.');
		}
		if (/<script\b/i.test(html)) {
			return ctx.badRequest('Newsletter content cannot contain scripts.');
		}
		if (/&lt;img\b/i.test(html)) {
			return ctx.badRequest('An image was inserted as text. Remove it and add it again using an Image block.');
		}
		if (/<img\b[^>]*\bsrc\s*=\s*["']data:image\//i.test(html)) {
			return ctx.badRequest('Embedded images are not supported. Upload images through the editor asset manager.');
		}

		const segmentIds = parseSegmentIds(ctx.request.body?.segmentIds);
		const knex = strapi.db.connection;
		await ensureDefaultSegment();

		const selectedSegments = segmentIds.length
			? await knex(SEGMENT_TABLE).whereIn('id', segmentIds)
			: await knex(SEGMENT_TABLE).where({ include_all: true });
		if (!selectedSegments.length) {
			return ctx.badRequest('Select at least one valid segment.');
		}

		const includesAll = selectedSegments.some((segment: any) => Boolean(segment.include_all));
		let subscribers: Array<{ email?: string }> = [];

		if (includesAll) {
			subscribers = await strapi.db.query(SUBSCRIPTION_UID).findMany({
				select: ['email'],
				orderBy: { createdAt: 'asc' },
			});
		} else {
			const subscriberIds = new Set<number>();
			for (const segment of selectedSegments) {
				for (const subscriptionId of await subscriberIdsForSegment(segment)) subscriberIds.add(subscriptionId);
			}
			if (!subscriberIds.size) return ctx.badRequest('Selected segments do not contain any subscribers.');

			subscribers = await strapi.db.query(SUBSCRIPTION_UID).findMany({
				select: ['email'],
				where: { id: { $in: [...subscriberIds] } },
				orderBy: { createdAt: 'asc' },
			});
		}
		const recipients = [
			...new Set(
				subscribers
					.map((subscriber: { email?: string }) => String(subscriber.email ?? '').trim().toLowerCase())
					.filter((email: string) => EMAIL_PATTERN.test(email)),
			),
		];

		if (recipients.length === 0) {
			return ctx.badRequest('There are no subscribers in the mailing list.');
		}

		const brandedNewsletter = prepareBrandedNewsletter(html);
		const plainText = htmlToPlainText(brandedNewsletter.html);
		let sent = 0;
		let failed = 0;

		for (let index = 0; index < recipients.length; index += SEND_CONCURRENCY) {
			const batch = recipients.slice(index, index + SEND_CONCURRENCY);
			const results = await Promise.allSettled(
				batch.map((email) =>
					strapi.plugin('email').service('email').send({
						to: email,
						subject,
						html: brandedNewsletter.html,
						text: plainText,
						attachments: brandedNewsletter.attachments,
					}),
				),
			);

			for (const result of results) {
				if (result.status === 'fulfilled') {
					sent += 1;
				} else {
					failed += 1;
					strapi.log.error('[newsletter] Failed to send an email', result.reason);
				}
			}
		}

		ctx.body = {
			segments: selectedSegments.map((segment: any) => ({ id: segment.id, name: segment.name })),
			total: recipients.length,
			sent,
			failed,
		};
	},

	async uploadNewsletterAssetForAdmin(ctx) {
		if (!(await requireAdmin(ctx))) return;

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const fs = require('fs');
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const path = require('path');
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const crypto = require('crypto');

		const supplied =
			ctx.request.files?.files ??
			ctx.request.files?.['files[]'] ??
			ctx.request.files?.file;
		const files = Array.isArray(supplied) ? supplied : supplied ? [supplied] : [];
		if (files.length === 0) {
			return ctx.badRequest("Upload an image using the 'files' form-data field.");
		}
		if (files.length > 10) {
			return ctx.badRequest('A maximum of 10 images can be uploaded at once.');
		}

		const uploadDir = path.join(strapi.dirs.static.public, 'uploads', 'newsletters');
		if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

		const publicBackendUrl = (process.env.PUBLIC_BACKEND_URL ?? 'http://localhost:1337').replace(/\/$/, '');
		const uploaded: string[] = [];

		for (const file of files) {
			const uploadedFile = file as any;
			const mimeType = String(uploadedFile.mimetype ?? uploadedFile.type ?? '');
			const extension = NEWSLETTER_IMAGE_EXTENSIONS[mimeType];
			if (!extension) {
				return ctx.badRequest('Only JPEG, PNG, WebP and GIF newsletter images are allowed.');
			}
			if (Number(uploadedFile.size ?? 0) > MAX_NEWSLETTER_IMAGE_SIZE) {
				return ctx.badRequest('Newsletter images must be 5 MB or smaller.');
			}

			const sourcePath = uploadedFile.filepath ?? uploadedFile.path;
			if (!sourcePath) return ctx.badRequest('The uploaded image could not be read.');

			const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`;
			fs.copyFileSync(sourcePath, path.join(uploadDir, filename));
			uploaded.push(`${publicBackendUrl}/uploads/newsletters/${filename}`);
		}

		ctx.body = { data: uploaded };
	},

	async exportCsv(ctx) {
		const configuredToken = process.env.MAILING_LIST_EXPORT_TOKEN;
		const suppliedToken = ctx.get('x-export-token');
		if (!configuredToken || suppliedToken !== configuredToken) {
			return ctx.unauthorized('A valid export token is required.');
		}

		const rows = await strapi.db.query('api::mailing-list-subscription.mailing-list-subscription').findMany({
			select: ['id', 'email', 'createdAt'],
			orderBy: { createdAt: 'desc' },
		});
		sendCsv(ctx, rows);
	},
}));
