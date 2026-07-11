import { SWREngine } from "@/shared/cache";
import { config } from "@/shared/config";
import type {
  Currency,
  FrankfurterCurrency,
  FrankfurterHistoricalResponse,
  FrankfurterLatestResponse,
  FrankfurterRate,
  FrankfurterTimeSeriesResponse,
} from "./types";
import {
  FrankfurterError,
  FrankfurterOfflineError,
  FrankfurterRateLimitError,
  FrankfurterValidationError,
  getHistoricalCacheKey,
  getLatestCacheKey,
  getTimeSeriesCacheKey,
} from "./utils/";

export const frankfurterCache = new SWREngine({ ttlMs: 3 * 60 * 1000 });

const BASE_URL = config.FRANKFURTER_URL;

async function request<T>(
  path: string,
  queryParams?: Record<string, string | string[] | undefined>,
): Promise<T> {
  const url = new URL(path, BASE_URL);

  const queryEntries: string[] = [];

  Object.entries(queryParams ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const normalizedValue = Array.isArray(value) ? value.join(",") : value;
    if (!normalizedValue) {
      return;
    }

    const encodedValue =
      key === "quotes" ? normalizedValue : encodeURIComponent(normalizedValue);
    queryEntries.push(`${key}=${encodedValue}`);
  });

  if (queryEntries.length > 0) {
    url.search = `?${queryEntries.join("&")}`;
  }

  try {
    const response = await globalThis.fetch(url.toString());

    if (response.status === 200) {
      const contentType = response.headers?.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        throw new FrankfurterError(
          `Invalid content-type: expected application/json but received ${contentType}`,
        );
      }
      return await response.json();
    }

    if (response.status === 429) {
      throw new FrankfurterRateLimitError(
        "Frankfurter API rate limit exceeded (429).",
      );
    }

    if (response.status === 422) {
      throw new FrankfurterValidationError(
        "Invalid currency parameters or malformed request payload (422).",
      );
    }

    throw new FrankfurterError(
      `Frankfurter API returned unclassified response: HTTP ${response.status}`,
    );
  } catch (error: unknown) {
    if (error instanceof FrankfurterError) {
      throw error;
    }
    throw new FrankfurterOfflineError(
      `Network connectivity issue / offline: ${(error as Error).message || String(error)}`,
    );
  }
}

function toCurrency(payload: unknown, fallbackCode?: string): Currency {
  if (typeof payload !== "object" || payload === null) {
    return {
      code: fallbackCode ?? "",
      name: "",
      symbol: "",
    };
  }

  const record = payload as FrankfurterCurrency;

  return {
    code: record.iso_code,
    name: typeof record.name === "string" ? record.name : "",
    symbol: typeof record.symbol === "string" ? record.symbol : "",
  };
}

export async function fetchCurrencies(): Promise<Currency[]> {
  return frankfurterCache.execute("currencies", async () => {
    const payload = await request<FrankfurterCurrency[]>("/currencies");
    if (Array.isArray(payload)) {
      return payload.map((entry) => {
        if (typeof entry === "object" && entry !== null) {
          return {
            code: entry.iso_code,
            name: entry.name || "",
            symbol: entry.symbol || "",
          };
        }

        return { code: "", name: "", symbol: "" };
      });
    }

    return Object.entries(payload ?? {}).map(([code, details]) =>
      toCurrency(details, code),
    );
  });
}

export async function fetchCurrencyDetails(code: string): Promise<Currency> {
  const normalizedCode = code.toUpperCase();
  return frankfurterCache.execute(`currency:${normalizedCode}`, async () => {
    const payload = await request<FrankfurterCurrency>(
      `/currency/${normalizedCode}`,
    );
    return toCurrency(payload);
  });
}

export async function getRate(
  from: string,
  to: string,
): Promise<FrankfurterRate> {
  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();

  return frankfurterCache.execute(`rate:${fromCode}:${toCode}`, async () => {
    const payload = await request<FrankfurterRate>(
      `/rate/${fromCode}/${toCode}`,
    );
    return {
      date: payload.date || "",
      base: fromCode,
      quote: toCode,
      rate: payload.rate || 0,
    };
  });
}

export async function fetchLatestRates(
  base?: string,
  symbols?: string[],
): Promise<FrankfurterLatestResponse> {
  const key = getLatestCacheKey(base, symbols);
  return frankfurterCache.execute(key, () =>
    request<FrankfurterLatestResponse>("/rates", {
      base: base?.toUpperCase(),
      quotes: symbols?.map((symbol) => symbol.toUpperCase()),
    }),
  );
}

export async function fetchHistoricalRates(
  date: string,
  base?: string,
  symbols?: string[],
): Promise<FrankfurterHistoricalResponse> {
  const key = getHistoricalCacheKey(date, base, symbols);
  return frankfurterCache.execute(key, () =>
    request<FrankfurterHistoricalResponse>("/rates", {
      from: date,
      base: base?.toUpperCase(),
      quotes: symbols?.map((symbol) => symbol.toUpperCase()),
    }),
  );
}

export async function fetchTimeSeriesRates(
  startDate: string,
  endDate: string,
  base?: string,
  symbols?: string[],
): Promise<FrankfurterTimeSeriesResponse> {
  const key = getTimeSeriesCacheKey(startDate, endDate, base, symbols);
  return frankfurterCache.execute(key, () =>
    request<FrankfurterTimeSeriesResponse>(`/${startDate}..${endDate}`, {
      from: base,
      to: symbols,
    }),
  );
}
