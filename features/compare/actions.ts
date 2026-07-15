import { auth } from "@/infra/core";
import { db } from "./db/client";
import { cx_compare } from "./db/schema";

export async function updateCompareList(newList: string[]) {
  const session = await auth();
  if (!session?.user || !session.user.id) return null;
  try {
    await db
      .insert(cx_compare)
      .values({
        userId: session.user.id!,
        currencyList: newList,
      })
      .onConflictDoUpdate({
        target: cx_compare.userId,
        set: { currencyList: newList },
      });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
