import type { QueryValue } from "../types";

export function getSearchQuery(
  queries: URLSearchParams | undefined,
  ...params: Array<[string, QueryValue]>
): string {
  const queriesType = typeof queries;
  if (
    !queries &&
    (!(queriesType === "string" || queriesType === "undefined") || !params)
  )
    return "";

  const nextQueries = new URLSearchParams(queries);
  if (params.length === 0) return nextQueries.toString();

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
