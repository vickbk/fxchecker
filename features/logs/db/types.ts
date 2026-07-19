import { FrankfurterRate } from "@/infra/api/frankfurter";

export type LogDataColumnType = Pick<
  FrankfurterRate,
  "base" | "quote" | "rate"
> & { amount: number };
