import { deleteCompareCurrencies } from "../actions";
import { CompareAIToolSchema } from "../types";

export async function removeCompare(data: CompareAIToolSchema) {
  if (data.action !== "remove") throw new Error("Invalid action provided");

  const { currencies } = data;
  if (!currencies || currencies.length === 0)
    throw new Error(
      "At least one valid 3-letter currency code is required to remove items.",
    );

  const results = await deleteCompareCurrencies(currencies);

  if (results)
    return {
      success: true,
      revalidate: true,
      action: "remove",
      currencies,
    };
  throw new Error(
    `Failed to remove ${currencies.join(", ")} from the compare list.`,
  );
}
