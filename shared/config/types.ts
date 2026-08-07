export type Config = Record<
  | "FRANKFURTER_URL"
  | "AUTH_SECRET"
  | "AUTH_GOOGLE_ID"
  | "AUTH_GOOGLE_SECRET"
  | "AI_PROVIDER_KEY"
  | "DATABASE_URL"
  | "GEMINI_VERSION"
  | "GOOGLE_GENERATIVE_AI_API_KEY"
  // Public variables
  | "NEXT_PUBLIC_APP_URL"
  | "NEXT_PUBLIC_CHATBOT_STORAGE_KEY"
  // Test variables
  | "TEST_USER_NAME"
  | "TEST_USER_EMAIL"
  | "TEST_USER_ID",
  string
> & {
  DATABASE_MAX_CONNECTIONS: number;
};
