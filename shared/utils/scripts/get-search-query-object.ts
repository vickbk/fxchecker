import type { QueryValue } from "../types/get-search-query";
import { setQuery } from "./get-search-query";

export function getSearchQueryObject(
  queries: URLSearchParams | null | undefined,
  params: Record<string, QueryValue> | null | undefined,
): string {
  if (!queries) return "";
  if (!params) return queries.toString();

  const nextQueries = new URLSearchParams(queries);
  const keys = Object.keys(params);
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    setQuery(nextQueries, key, params[key]);
  }

  return nextQueries.toString();
}
