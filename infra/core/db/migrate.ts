/**
 * @fileactor Server Runtime - Migration runner
 * Executable script that runs Drizzle migrations against the core database.
 * This script uses the `getDB()` factory without a local schema mapping so the
 * migrator runs against the base client connection.
 */

import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
import { getDB } from "./client";

const db = getDB();
export async function runMigrations() {
  console.log("Migration starting...");
  await migrate(db, {
    migrationsFolder: path.join(__dirname, "migrations"),
  });
  console.log("Migration completed");
}

// Only execute immediately if this specific file is run directly via node/tsx
if (require.main === module || process.argv[1]?.endsWith("migrate.ts")) {
  runMigrations()
    .catch((error) => {
      console.error("Migration failed. Error:", error);
      process.exit(1);
    })
    .finally(() => {
      db.$client.end().catch((error) => {
        console.error("Failed to close database connection. Error:", error);
      });
    });
}
