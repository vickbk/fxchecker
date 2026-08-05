import { fetchCurrencies, fetchLatestRates } from "@/infra/api/frankfurter";
import { assertAuthenticated, isAuthError } from "@/infra/core";
import { createGlobalCache, SWREngine } from "@/shared/cache";
import { logError, parseTimeToMs } from "@/shared/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "./db/client";
import { cx_compare } from "./db/schema";
import { resolveCompareList } from "./utils/helpers";

const getCompareCache = createGlobalCache(
  "COMPARE_CACHE",
  () => new SWREngine({ ttlMs: parseTimeToMs("30m") }),
);
const compareKeyPrefix = "compare-list-";

async function updateCompareList(newList: string[]) {
  try {
    const userId = await assertAuthenticated();
    await db
      .insert(cx_compare)
      .values({
        userId,
        currencyList: newList,
      })
      .onConflictDoUpdate({
        target: cx_compare.userId,
        set: { currencyList: newList },
      });
    getCompareCache().clearKey(compareKeyPrefix + userId);
    return true;
  } catch (error) {
    logError(error, !isAuthError(error, "AuthNotAuthenticatedError"));
    return false;
  }
}

async function myCompareList(base = "USD") {
  try {
    const userId = await assertAuthenticated();

    const compareList = await getCompareCache().execute(
      `${compareKeyPrefix}${userId}`,
      async () =>
        await db.query.cx_compare.findFirst({
          where: eq(cx_compare.userId, userId),
        }),
    );

    if (!compareList) throw new Error("Empty list");

    return await resolveCompareList(base, compareList.currencyList);
  } catch (error) {
    logError(error, !isAuthError(error, "AuthNotAuthenticatedError"));
    return resolveCompareList(base);
  }
}

export async function getCompareRates(base = "USD") {
  try {
    const quotes = await myCompareList(base);

    if (quotes.length === 0) return [];

    const [results, currencies] = await Promise.all([
      fetchLatestRates(base, quotes),
      fetchCurrencies(),
    ]);

    if (!currencies || currencies.length === 0) return [];

    const currencyMap = new Map(currencies.map((c) => [c.code, c]));

    const baseDetails = currencyMap.get(base);

    return results.map((rate) => ({
      ...rate,
      details: {
        [base]: baseDetails!,
        [rate.quote]: currencyMap.get(rate.quote)!,
      },
    }));
  } catch (error) {
    logError(error);
    return [];
  }
}

export async function deleteCompareCurrency(toDelete: string) {
  "use server";
  await deleteCompareCurrencies([toDelete]);
}

export async function addCompareCurrencies(currencies: string[]) {
  const myCurrencies = await myCompareList("UNDEFINED");

  const newList = [...new Set([...myCurrencies, ...currencies])];
  const results = await updateCompareList(newList);
  revalidatePath("/compare");
  return !!results;
}

export async function deleteCompareCurrencies(toDelete: string[]) {
  const currencies = await myCompareList("UNDEFINED");
  const deleteSet = new Set(toDelete);

  const results = await updateCompareList(
    currencies.filter((currency) => !deleteSet.has(currency)),
  );

  revalidatePath("/compare");
  return results;
}

export async function addToCompareCurrencies(form: FormData) {
  "use server";
  const newCurrencies = form.getAll("currency") as string[];

  await addCompareCurrencies(newCurrencies);
}
