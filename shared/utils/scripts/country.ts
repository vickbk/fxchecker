const CURRENCY_OVERRIDES: Record<string, string> = {
  EUR: "eu", // Eurozone
  XOF: "sn", // Senegal / West African CFA anchor
  XAF: "cm", // Cameroon / Central African CFA anchor
  XCD: "lc", // Saint Lucia / East Caribbean anchor
  ANG: "cw", // Curaçao
  NLG: "nl", // Historical/Obscure legacy fallbacks
};

export function getCurrencyCountry(currency: `${string}${string}${string}`) {
  return CURRENCY_OVERRIDES[currency] ?? currency.substring(0, 2).toLowerCase();
}
