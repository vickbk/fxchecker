import { assertAuthenticated } from "@/infra/core";
import { revalidateAllPaths } from "@/shared/cache";
import { ActionReturn } from "@/shared/utils";
import { and, eq } from "drizzle-orm";
import { db } from "./db/client";
import { exLogs } from "./db/schema";
import { LogData } from "./types";
import { logSchema } from "./utils";

export async function logConversion(data: LogData) {
  "use server";
  const results: ActionReturn = { success: false };

  try {
    const userId = await assertAuthenticated();

    await db.insert(exLogs).values({ userId, data: logSchema.parse(data) });

    results.success = true;
    revalidateAllPaths();
  } catch (error) {
    results.error = error as Error;
  }

  return results;
}

export async function deleteLogItem(id: string) {
  "use server";
  const results: ActionReturn = { success: false };
  try {
    const userId = await assertAuthenticated();

    await db
      .delete(exLogs)
      .where(and(eq(exLogs.id, id), eq(exLogs.userId, userId)));

    results.success = true;
    revalidateAllPaths();
  } catch (error) {
    results.error = error as Error;
  }
  return results;
}

export async function clearAllLogs() {
  "use server";
  const results: ActionReturn = { success: false };

  try {
    const userId = await assertAuthenticated();
    await db.delete(exLogs).where(eq(exLogs.userId, userId));

    results.success = true;
    revalidateAllPaths();
  } catch (error) {
    results.error = error as Error;
  }
  return results;
}

export async function saveConversion(form: FormData) {
  "use server";
  await logConversion({
    base: form.get("base") as string,
    quote: form.get("quote") as string,
    rate: form.get("rate") as unknown as number,
    amount: form.get("amount") as unknown as number,
  });
}
