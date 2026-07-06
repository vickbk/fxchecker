export function getLatestCacheKey(base?: string, symbols?: string[]): string {
  const normalizedBase = base ?? "";
  const normalizedSymbols = symbols ? [...symbols].sort().join(",") : "";
  return `latest:${normalizedBase}:${normalizedSymbols}`;
}

export function getHistoricalCacheKey(
  date: string,
  base?: string,
  symbols?: string[],
): string {
  const normalizedBase = base ?? "";
  const normalizedSymbols = symbols ? [...symbols].sort().join(",") : "";
  return `historical:${date}:${normalizedBase}:${normalizedSymbols}`;
}

export function getTimeSeriesCacheKey(
  startDate: string,
  endDate: string,
  base?: string,
  symbols?: string[],
): string {
  const normalizedBase = base ?? "";
  const normalizedSymbols = symbols ? [...symbols].sort().join(",") : "";
  return `timeseries:${startDate}:${endDate}:${normalizedBase}:${normalizedSymbols}`;
}
