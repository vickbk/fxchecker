import z from "zod";
import { Config } from "../types";
import { clientSchema, getClientConfig } from "./client-config";
import { buildRequired } from "./helpers";
import { getTestConfig, isTestEnv, testSchema } from "./test-config";

export const configSchema = z.object({
  FRANKFURTER_URL: z.url({ message: "FRANKFURTER_URL is required" }),
  AUTH_SECRET: z
    .string({
      message: "AUTH_SECRET is required",
    })
    .min(1, "AUTH_SECRET cannot be empty"),

  AUTH_GOOGLE_ID: z
    .string({
      message: "AUTH_GOOGLE_ID is required",
    })
    .min(1, "AUTH_GOOGLE_ID cannot be empty"),

  AUTH_GOOGLE_SECRET: z
    .string({
      message: "AUTH_GOOGLE_SECRET is required",
    })
    .min(1, "AUTH_GOOGLE_SECRET cannot be empty"),

  AI_PROVIDER_KEY: z
    .string({
      message: "AI_PROVIDER_KEY is required",
    })
    .min(1, "AI_PROVIDER_KEY cannot be empty"),

  DATABASE_URL: z
    .string({
      message: "DATABASE_URL is required",
    })
    .min(1, "DATABASE_URL cannot be empty"),
  DATABASE_MAX_CONNECTIONS: z.number().default(10),
  GEMINI_VERSION: z.string().default("gemini-3.1-flash-lite-preview"),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(
    "GOOGLE_GENERATIVE_AI_API_KEY cannot be empty",
  ),
  ...clientSchema.shape,
  ...testSchema.shape,
});

let cachedConfig: Config | null = null;

export const getServerConfig = (): Config => {
  if (cachedConfig) return cachedConfig;

  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

  const parsed = configSchema.safeParse({
    FRANKFURTER_URL: buildRequired(isBuildPhase, process.env.FRANKFURTER_URL),
    AUTH_SECRET: buildRequired(isBuildPhase, process.env.AUTH_SECRET),
    AUTH_GOOGLE_ID: buildRequired(isBuildPhase, process.env.AUTH_GOOGLE_ID),
    AUTH_GOOGLE_SECRET: buildRequired(
      isBuildPhase,
      process.env.AUTH_GOOGLE_SECRET,
    ),
    AI_PROVIDER_KEY: buildRequired(isBuildPhase, process.env.AI_PROVIDER_KEY),
    DATABASE_URL: buildRequired(isBuildPhase, process.env.DATABASE_URL),
    DATABASE_MAX_CONNECTIONS: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : undefined,
    GOOGLE_GENERATIVE_AI_API_KEY: buildRequired(
      isBuildPhase,
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    ),
    GEMINI_VERSION: process.env.GEMINI_VERSION,

    ...getClientConfig(),
    ...(isTestEnv() ? getTestConfig() : {}),
  });

  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map((i) => i.message).join(", ");
    throw new Error(`Environment validation failed: ${errorMessages}`);
  }

  cachedConfig = parsed.data;
  return cachedConfig;
};
