const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

export function sanitizeCurrencyCode(
  value: string,
  fieldName: "from" | "to",
): string {
  const normalized = value.trim().toUpperCase();
  if (!CURRENCY_CODE_REGEX.test(normalized)) {
    throw new Error(`Invalid '${fieldName}' currency code.`);
  }
  return normalized;
}
