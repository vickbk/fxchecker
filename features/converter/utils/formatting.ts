export const DEFAULT_FROM = "USD";
export const DEFAULT_TO = "EUR";
export const DEFAULT_AMOUNT = 100;

export function normalizeCurrency(
  value: string | null | undefined,
  fallback: string,
): string {
  const candidate = value?.trim().toUpperCase();
  return candidate ? candidate : fallback;
}

export function normalizeAmount(value: string | null | undefined): number {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_AMOUNT;
}
