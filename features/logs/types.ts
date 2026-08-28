import { FrankfurterRate } from "@/infra/api/frankfurter";
import { z } from "zod";
import { inputSchema } from "./tools/schema";

export type LogData = Pick<FrankfurterRate, "base" | "quote" | "rate"> & {
  amount: number;
};

export type LogsAIToolSchema = z.infer<typeof inputSchema>;
