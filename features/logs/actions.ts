import { assertAuthenticated } from "@/infra/core";
import { ActionReturn } from "@/shared/utils";
import { and, eq } from "drizzle-orm";
import { db } from "./db/client";
import { exLogs } from "./db/schema";
import { LogData } from "./types";

export async function logConversion(data: LogData) {
  const results: ActionReturn = { success: false };

  try {
    const userId = await assertAuthenticated();
    await db.insert(exLogs).values({ userId, data });

    results.success = true;
  } catch (error) {
    results.error = error as Error;
  }

  return results;
}

export async function deleteLogItem(id: string) {
  const results: ActionReturn = { success: false };
  try {
    const userId = await assertAuthenticated();

    await db
      .delete(exLogs)
      .where(and(eq(exLogs.id, id), eq(exLogs.userId, userId)));

    results.success = true;
  } catch (error) {
    results.error = error as Error;
  }
  return results;
}

export async function clearAllLogs() {
  const results: ActionReturn = { success: false };

  try {
    const userId = await assertAuthenticated();
    await db.delete(exLogs).where(eq(exLogs.userId, userId));

    results.success = true;
  } catch (error) {
    results.error = error as Error;
  }
  return results;
}
