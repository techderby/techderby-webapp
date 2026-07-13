import { factories } from '@strapi/strapi';

export default {
	routes: [
		{
			method: 'POST',
			path: '/mailing-list-subscriptions',
			handler: 'mailing-list-subscription.create',
			config: {
				auth: false,
			},
		},
		{
			method: 'GET',
			path: '/mailing-list-subscriptions/admin/list',
			handler: 'mailing-list-subscription.listForAdmin',
		},
		{
			method: 'GET',
			path: '/mailing-list-subscriptions/admin',
			handler: 'mailing-list-subscription.listForAdmin',
		},
		{
			method: 'GET',
			path: '/mailing-list-subscriptions/admin/export.csv',
			handler: 'mailing-list-subscription.exportCsvForAdmin',
		},
		{
			method: 'GET',
			path: '/mailing-list-subscriptions/export-admin',
			handler: 'mailing-list-subscription.exportCsvForAdmin',
		},
		{
			method: 'POST',
			path: '/mailing-list-subscriptions/admin/import',
			handler: 'mailing-list-subscription.importForAdmin',
		},
		{
			method: 'POST',
			path: '/mailing-list-subscriptions/import-admin',
			handler: 'mailing-list-subscription.importForAdmin',
		},
		{
			method: 'POST',
			path: '/mailing-list-subscriptions/admin/send-newsletter',
			handler: 'mailing-list-subscription.sendNewsletterForAdmin',
		},
		{
			method: 'POST',
			path: '/mailing-list-subscriptions/send-newsletter',
			handler: 'mailing-list-subscription.sendNewsletterForAdmin',
		},
		{
			method: 'POST',
			path: '/mailing-list-subscriptions/admin/upload-newsletter-asset',
			handler: 'mailing-list-subscription.uploadNewsletterAssetForAdmin',
		},
		{
			method: 'POST',
			path: '/mailing-list-subscriptions/newsletter-assets',
			handler: 'mailing-list-subscription.uploadNewsletterAssetForAdmin',
		},
		{
			method: 'GET',
			path: '/mailing-list-subscriptions/admin/segments',
			handler: 'mailing-list-subscription.listSegmentsForAdmin',
		},
		{
			method: 'POST',
			path: '/mailing-list-subscriptions/admin/segments',
			handler: 'mailing-list-subscription.createSegmentForAdmin',
		},
		{
			method: 'PUT',
			path: '/mailing-list-subscriptions/admin/segments/:id',
			handler: 'mailing-list-subscription.updateSegmentForAdmin',
		},
		{
			method: 'DELETE',
			path: '/mailing-list-subscriptions/admin/segments/:id',
			handler: 'mailing-list-subscription.deleteSegmentForAdmin',
		},
		{
			method: 'GET',
			path: '/mailing-list-subscriptions/export.csv',
			handler: 'mailing-list-subscription.exportCsv',
			config: {
				auth: false,
			},
		},
		{
			method: 'GET',
			path: '/mailing-list-subscriptions/export',
			handler: 'mailing-list-subscription.exportCsv',
			config: {
				auth: false,
			},
		},
	],
};
