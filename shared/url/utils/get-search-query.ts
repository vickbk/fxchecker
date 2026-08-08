import type { QueryValue } from "../types";

export function getSearchQuery(
  queries: URLSearchParams | null | undefined,
  ...params: Array<[string, QueryValue]>
): string {
  if (!queries) return "";

  if (params.length === 0) return queries.toString();

  const nextQueries = new URLSearchParams(queries);
  const len = params.length;

  for (let i = 0; i < len; i++) {
    const pair = params[i];
    if (!pair || !(Array.isArray(pair) && pair.length >= 1)) continue;
    setQuery(nextQueries, pair[0], pair[1]);
  }

  return nextQueries.toString();
}

export function setQuery(
  nextQueries: URLSearchParams,
  key: string,
  val: QueryValue,
) {
  if (val === undefined || val === null || val === "") {
    nextQueries.delete(key);
  } else {
    nextQueries.set(key, String(val));
  }
}
