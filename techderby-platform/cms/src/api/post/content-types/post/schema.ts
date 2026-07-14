import { ARTICLE_CATEGORIES } from '../../../../constants/article-categories';

export default {
  kind: 'collectionType',
  collectionName: 'insights',
  info: { singularName: 'post', pluralName: 'posts', displayName: 'Post (Articles)' },
  options: { draftAndPublish: true },
  attributes: {
    title: { type: 'string', required: true },
    slug: { type: 'uid', targetField: 'title', required: true },
    featuredImage: { type: 'media', multiple: false, required: false, allowedTypes: ['images'] },
    featuredImageUrl: { type: 'string' },
    content: { type: 'richtext' },
    author: { type: 'string' },
    authorUserId: { type: 'integer' },
    excerpt: { type: 'text' },
    tags: { type: 'json' },
    category: {
      type: 'enumeration',
      enum: [...ARTICLE_CATEGORIES],
      default: 'News - Technology',
      required: true,
    },
    workflowStatus: {
      type: 'enumeration',
      enum: ['draft', 'pending-review', 'published', 'rejected', 'update-requested'],
      default: 'draft',
      required: true,
    },
    reviewNotes: { type: 'text' },
    readCount: { type: 'integer', default: 0 },
    likeCount: { type: 'integer', default: 0 },
    commentCount: { type: 'integer', default: 0 },
    mailingListNotifiedAt: { type: 'datetime' },
  },
};
