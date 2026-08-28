import { addCompareCurrencies } from "../actions";
import { CompareAIToolSchema } from "../types";

export async function addCompare(data: CompareAIToolSchema) {
  if (data.action !== "add") throw new Error("Invalid action provided");

  const { currencies } = data;
  if (!currencies || currencies.length === 0) {
    throw new Error(
      "At least one valid 3-letter currency code is required to add items.",
    );
  }

  const results = await addCompareCurrencies(currencies);
  if (results)
    return {
      success: true,
      revalidate: true,
      action: "add",
      currencies,
    };

  throw new Error(
    `Failed to add ${currencies.join(", ")} to the compare list.`,
  );
}
