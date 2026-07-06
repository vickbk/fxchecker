import { config } from "@/shared/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./features/**/db/schema.ts", "./infra/core/**/db/schema.ts"],
  out: "./infra/core/db/migrations",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
