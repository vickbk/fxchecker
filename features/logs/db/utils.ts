import { customType } from "drizzle-orm/pg-core";
import { LogData } from "../types";

export const logDataColumn = customType<{ data: LogData }>({
  dataType: () => "text",
  toDriver,
  fromDriver,
});

export function toDriver({ base, quote, rate, amount }: LogData) {
  return `${base}-${quote}_${amount}@${rate}`;
}

export function fromDriver(value: unknown): LogData {
  if (typeof value !== "string")
    return { base: "", quote: "", amount: 0, rate: 0 };

  try {
    const [pair, rest] = value.split("_");
    const [base, quote] = pair.split("-");
    const [amount, rate] = rest.split("@");

    return {
      base,
      quote,
      amount: Number(amount),
      rate: Number(rate),
    };
  } catch (error) {
    console.error(error);
    return { base: "ERR", quote: "ERR", amount: 0, rate: 0 };
  }
}
