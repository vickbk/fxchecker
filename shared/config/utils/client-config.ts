import { z } from "zod";

export const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NEXT_PUBLIC_CHATBOT_STORAGE_KEY: z.string().default(""),
  NEXT_PUBLIC_FLAGCDN: z.url().default("https://flagcdn.com"),
});

export const getClientConfig = () =>
  clientSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CHATBOT_STORAGE_KEY:
      process.env.NEXT_PUBLIC_CHATBOT_STORAGE_KEY,
    NEXT_PUBLIC_FLAGCDN: process.env.NEXT_PUBLIC_FLAGCDN,
  });

export function checkClientRequest(prop: string | symbol) {
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    if (!prop.toString().startsWith("NEXT_PUBLIC")) {
      throw new Error(
        `Attempted to access server-side environment variable ${String(
          prop,
        )} from a Client Component.`,
      );
    }
    return true;
  }
  return false;
}
