export function getSearchQuery(
  queries: URLSearchParams,
  [key, value]: [string, string],
) {
  queries.set(key, value);
  return queries.toString();
}
