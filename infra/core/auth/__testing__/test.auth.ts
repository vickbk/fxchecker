import { config } from "@/shared/config";
import { encode } from "next-auth/jwt";
import { login } from "../utils/login";

export async function setupTestUser() {
  if (!(await login({ profile, account }))) {
    throw new Error("Failed to seed test user using existing login() helper.");
  }

  const url = new URL(config.NEXT_PUBLIC_APP_URL);
  const secure = url.protocol.startsWith("https");
  const name = secure
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  return {
    name,
    value: await encode({
      secret: config.AUTH_SECRET,
      token: {
        ...profile,
        sub: account.providerAccountId,
      },
      salt: name,
    }),
    secure,
    domain: url.hostname,
  };
}

const profile = {
  name: config.TEST_USER_NAME,
  email: config.TEST_USER_EMAIL,
  picture: null,
};

const account = {
  provider: "google",
  type: "oauth" as const,
  providerAccountId: config.TEST_USER_ID,
};
