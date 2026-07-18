import { users } from "@/infra/core";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const exFavorites = pgTable("ex_favorites", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  // Stores stringified tuplets formatted as "BASE-QUOTE" (e.g., ["USD-EUR", "GBP-JPY"])
  favoritePairs: text("favorite_pairs").array().notNull().default([]),
});
