import { fetchCurrencies, fetchLatestRates } from "@/infra/api/frankfurter";
import { assertAuthenticated, auth } from "@/infra/core";
import { SWREngine } from "@/shared/cache";
import { parseTimeToMs } from "@/shared/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "./db/client";
import { cx_compare } from "./db/schema";
import { resolveCompareList } from "./utils";

const compareCache = new SWREngine({ ttlMs: parseTimeToMs("30m") });

export async function updateCompareList(newList: string[]) {
  const session = await auth();
  if (!session?.user || !session.user.id) return null;
  try {
    const userId = session.user.id;
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
    compareCache.clearKey("compare-" + userId);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function myCompareList(base = "USD") {
  try {
    const userId = await assertAuthenticated();

    const compareList = await compareCache.execute(
      `compare-list-${userId}`,
      async () =>
        await db.query.cx_compare.findFirst({
          where: eq(cx_compare.userId, userId),
        }),
    );

    if (!compareList) throw new Error("Empty list");

    return await resolveCompareList(base, compareList.currencyList);
  } catch (error) {
    console.log(error);
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
    console.error(error);
    return [];
  }
}

export async function deleteCompareCurrency(toDelete: string) {
  "use server";
  const rates = await myCompareList("UNDEFINED");
  await updateCompareList(rates.filter((rate) => rate !== toDelete));
  revalidatePath("/compare");
}

export async function addToCompareCurrencies(form: FormData) {
  "use server";
  const currencies = await myCompareList("UNDEFINED");
  const newCurrencies = form.getAll("currency") as string[];

  const newList = [...new Set([...currencies, ...newCurrencies])];
  await updateCompareList(newList);
  revalidatePath("/compare");
}
