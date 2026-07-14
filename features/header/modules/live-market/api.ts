import { fetchCurrencies, fetchHistoricalRates } from "@/infra/api/frankfurter";
import { getRandomElement, getRandomElements } from "@/shared/random";
import { getLookbackDate } from "@/shared/utils";

export async function getLatestRates() {
  try {
    const currencies = await fetchCurrencies();
    const retained = getRandomElements(currencies, 10);
    const rates = await Promise.all(
      retained.map(({ code }) =>
        fetchHistoricalRates(getLookbackDate(7), code),
      ),
    );

    return rates.map((history) => {
      const grouped = Object.groupBy(history, ({ quote }) => quote);
      const picked = getRandomElement(Object.keys(grouped));
      const selected = grouped[picked]!;

      const starting = selected[0];
      const ending = selected.at(-1)!;
      return { ...ending, change: starting.rate - ending.rate };
    });
  } catch (error) {
    console.error(error);
  }
}
