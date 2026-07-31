export type FrankfurterRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
  change?: number;
};

export type FrankfurterCurrency = {
  iso_code: string;
  iso_numeric: string;
  name: string;
  symbol: string;
  start_date: string;
  end_date: string;
  providers: string[];
};

export type Currency = {
  code: string;
  name: string;
  symbol: string;
};
