import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::mailing-list-subscription.mailing-list-subscription', ({ strapi }) => ({
	async exportCsv(ctx) {
		const rows = await strapi.db.query('api::mailing-list-subscription.mailing-list-subscription').findMany({
			select: ['id', 'email', 'createdAt'],
			orderBy: { createdAt: 'desc' },
		});

		const escapeCsv = (value: unknown) => {
			const raw = String(value ?? '');
			if (raw.includes(',') || raw.includes('"') || raw.includes('\n')) {
				return `"${raw.replace(/"/g, '""')}"`;
			}
			return raw;
		};

		const header = ['id', 'email', 'createdAt'];
		const lines = [header.join(',')];

		for (const row of rows) {
			lines.push([row.id, row.email, row.createdAt].map(escapeCsv).join(','));
		}

		const csv = lines.join('\n');
		const timestamp = new Date().toISOString().slice(0, 10);

		ctx.set('Content-Type', 'text/csv; charset=utf-8');
		ctx.set('Content-Disposition', `attachment; filename="mailing-list-subscriptions-${timestamp}.csv"`);
		ctx.body = csv;
	},
}));
