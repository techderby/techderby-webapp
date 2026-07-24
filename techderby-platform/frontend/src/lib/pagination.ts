export const DEFAULT_PAGE_SIZE = 10;

export function paginateItems<T>(items: T[], requestedPage: number, pageSize = DEFAULT_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (page - 1) * pageSize;

  return {
    page,
    totalPages,
    items: items.slice(startIndex, startIndex + pageSize),
    start: items.length === 0 ? 0 : startIndex + 1,
    end: Math.min(startIndex + pageSize, items.length),
  };
}
