import { users } from "@/infra/core";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { logDataColumn } from "./utils";

export const exLogs = pgTable("ex_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  data: logDataColumn("data"),
  editTime: timestamp("edit_time").notNull().defaultNow(),
});
