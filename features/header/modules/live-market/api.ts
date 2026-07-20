import { getRate } from "@/infra/api/frankfurter";
import { revalidateAllPaths, SWREngine } from "@/shared/cache";
import { parseTimeToMs } from "@/shared/utils";
import { getCurrencyPairs } from "./utils";

const headerCache = new SWREngine({ ttlMs: parseTimeToMs("1D") });

export async function getLatestRates() {
  try {
    const pairs = await headerCache.execute(
      "header-pairs-selection",
      getCurrencyPairs,
    );

    const ratePromises = pairs.map(async ([base, quote]) => {
      try {
        return await getRate(base.code, quote.code);
      } catch (err) {
        console.error(`Failed rate fetch for ${base.code}/${quote.code}:`, err);
        return null;
      }
    });

    const results = await Promise.all(ratePromises);
    return results.filter((rate): rate is NonNullable<typeof rate> =>
      Boolean(rate),
    );
  } catch (error) {
    console.error("Error fetching latest rates:", error);
    return [];
  }
}

export async function clearRatesCache() {
  headerCache.clearKey("header-pairs-selection");
  revalidateAllPaths();
}
