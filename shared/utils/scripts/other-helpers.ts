export function joinClasses(classes: (string | false)[]) {
  return classes.filter((c) => c !== false).join(" ");
}

export function keyFromSearchQuery(keys: Record<string, string>) {
  const result = [];
  for (const key in keys) {
    result.push(key, keys[key]);
  }
  return result.join("-");
}

export function getSearchQuery(
  queries: URLSearchParams,
  ...params: [string, string][]
) {
  queries = new URLSearchParams(queries);
  params.forEach(([key, value]) => queries.set(key, value));
  return queries.toString();
}
