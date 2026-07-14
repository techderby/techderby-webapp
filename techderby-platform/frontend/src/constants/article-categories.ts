export const ARTICLE_CATEGORIES_BY_GROUP = {
  News: ['News - Technology', 'News - Community', 'News - Business'],
  Technical: ['Architecture', 'Development', 'DevOps', 'Design', 'Others'],
} as const;

export const ARTICLE_CATEGORIES = [
  ...ARTICLE_CATEGORIES_BY_GROUP.News,
  ...ARTICLE_CATEGORIES_BY_GROUP.Technical,
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];
