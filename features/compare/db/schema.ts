import { users } from "@/infra/core";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const cx_compare = pgTable("cx_compare", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  compareList: text("compare_list")
    .array()
    .notNull()
    .default(["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "ZAR"]),
});
