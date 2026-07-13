export interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: FrankfurterRate[];
}

export type FrankfurterHistoricalResponse = FrankfurterLatestResponse;

export interface FrankfurterTimeSeriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

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
