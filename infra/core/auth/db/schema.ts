/**
 * @fileactor Schema - Auth table definitions
 * This file only defines table shapes using `drizzle-orm/pg-core`. It must
 * never import database clients or run-time side-effects. Schemas are
 * intentionally local to the auth subsystem and can be supplied to `getDB`.
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * `users` table schema used by the auth subsystem. Exported so other modules
 * (e.g., feature slices) may reference the shape for type-safe queries.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
