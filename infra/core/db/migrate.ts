/**
 * @fileactor Server Runtime - Migration runner
 * Executable script that runs Drizzle migrations against the core database.
 * This script uses the `getDB()` factory without a local schema mapping so the
 * migrator runs against the base client connection.
 */

import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
import { getDB } from "./client";

(async function () {
  try {
    console.log("Migration starting...");
    await migrate(getDB(), {
      migrationsFolder: path.join(__dirname, "migrations"),
    });
    console.log("Migration completed");
  } catch (error) {
    console.error("Migration failed. Error:", error);
    process.exit(1);
  }
})();
