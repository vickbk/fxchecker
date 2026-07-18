import z from "zod";

export const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_CHATBOT_STORAGE_KEY: z.string().default(""),
  NEXT_PUBLIC_FLAGCDN: z.url().default("https://flagcdn.com"),
});
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
  ...clientSchema.shape,
});
