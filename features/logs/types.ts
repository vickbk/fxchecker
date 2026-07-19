import { FrankfurterRate } from "@/infra/api/frankfurter";

export type LogData = Pick<FrankfurterRate, "base" | "quote" | "rate"> & {
  amount: number;
};
