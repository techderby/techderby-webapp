export const ARTICLE_CATEGORIES = [
  'News - Technology',
  'News - Community',
  'News - Business',
  'Architecture',
  'Development',
  'DevOps',
  'Design',
  'Others',
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];
