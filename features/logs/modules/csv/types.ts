import { exLogs } from "../../db/schema";

export type InsertLog = Omit<typeof exLogs.$inferInsert, "id" | "editTime">;
export type SelectLog = Omit<typeof exLogs.$inferSelect, "id" | "userId">;
