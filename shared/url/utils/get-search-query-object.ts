import type { QueryValue } from "../types";
import { setQuery } from "./get-search-query";

export function getSearchQueryObject(
  queries: URLSearchParams | string | undefined,
  params: Record<string, QueryValue> | null | undefined,
): string {
  const queriesType = typeof queries;
  if (
    !queries &&
    (!(queriesType === "string" || queriesType === "undefined") || !params)
  )
    return "";
  const nextQueries = new URLSearchParams(queries);
  if (!params) return nextQueries.toString();

  const keys = Object.keys(params);
  const len = keys.length;

  for (let i = 0; i < len; i++) {
    const key = keys[i];
    setQuery(nextQueries, key, params[key]);
  }

  return nextQueries.toString();
}
