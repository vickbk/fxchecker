import { exLogs } from "../../db/schema";

export type SelectLog = Omit<typeof exLogs.$inferSelect, "id" | "userId">;
