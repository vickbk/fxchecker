import { assertAuthenticated } from "@/infra/core";
import { desc, eq } from "drizzle-orm";
import z from "zod";
import { db } from "./db/client";
import { exLogs } from "./db/schema";

const currencyMessage = "currency must be 3 characters long";
export const logSchema = z.object({
  base: z.string().length(3, "base " + currencyMessage),
  quote: z.string().length(3, "quote " + currencyMessage),
  amount: z.coerce.number("amount must be defined"),
  rate: z.coerce.number("rate must be defined"),
});

export async function getLogs() {
  try {
    const userId = await assertAuthenticated();

    return await db.query.exLogs.findMany({
      where: eq(exLogs.userId, userId),
      orderBy: desc(exLogs.editTime),
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getLogsCount() {
  try {
    const userId = await assertAuthenticated();
    return db.$count(exLogs, eq(exLogs.userId, userId));
  } catch (error) {
    console.log(error);
    return 0;
  }
}
