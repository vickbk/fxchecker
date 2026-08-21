export type URLState = {
  from: string;
  to: string;
  amount: number;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  setAmount: (value: number) => void;
  swapCurrencies: () => void;
};

export type QueryValue = string | number | boolean | null | undefined;
