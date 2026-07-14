import { fetchCurrencies, fetchHistoricalRates } from "@/infra/api/frankfurter";
import { getRandomElement, getRandomElements } from "@/shared/random";
import { getLookbackDate } from "@/shared/utils";

export async function getLatestRates() {
  try {
    const currencies = await fetchCurrencies();
    if (!currencies || currencies.length === 0) return [];

    const retained = getRandomElements(currencies, 10);

    const lookbackDate = getLookbackDate(7);

    const ratesHistory = await Promise.all(
      retained.map(({ code }) => fetchHistoricalRates(lookbackDate, code)),
    );

    return ratesHistory
      .map((history) => {
        if (!history || history.length === 0) return null;

        const uniqueQuotes = Array.from(new Set(history.map((h) => h.quote)));
        if (uniqueQuotes.length === 0) return null;

        const pickedQuote = getRandomElement(uniqueQuotes);

        const selected = history.filter((h) => h.quote === pickedQuote);
        if (selected.length === 0) return null;

        const starting = selected[0];
        const ending = selected[selected.length - 1];

        return {
          ...ending,
          change: starting.rate - ending.rate,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching latest rates:", error);
    return null;
  }
}
