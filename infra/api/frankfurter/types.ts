export interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export type FrankfurterHistoricalResponse = FrankfurterLatestResponse;

export interface FrankfurterTimeSeriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

export type Rate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
  change?: number;
};
