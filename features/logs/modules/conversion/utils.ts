"use server";

import { getRate } from "@/infra/api/frankfurter";

const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

function sanitizeCurrencyCode(value: string, fieldName: "from" | "to"): string {
  const normalized = value.trim().toUpperCase();
  if (!CURRENCY_CODE_REGEX.test(normalized)) {
    throw new Error(`Invalid '${fieldName}' currency code.`);
  }
  return normalized;
}

export async function loadConversionRate(
  _: unknown,
  { from, to }: Record<"from" | "to", string>,
) {
  "use server";
  const safeFrom = sanitizeCurrencyCode(from, "from");
  const safeTo = sanitizeCurrencyCode(to, "to");
  const { rate } = await getRate(safeFrom, safeTo);
  return rate;
}
