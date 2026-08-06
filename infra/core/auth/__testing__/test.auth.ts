import { config } from "@/shared/config";
import { BrowserContext } from "@playwright/test";
import { encode } from "next-auth/jwt";
import { login } from "../utils/login";

export async function setupTestUser(context: BrowserContext) {
  if (!(await login({ profile, account }))) {
    throw new Error("Failed to seed test user using existing login() helper.");
  }

  const isSecure = config.NEXT_PUBLIC_APP_URL.startsWith("https");
  const name = isSecure
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const sessionToken = await encode({
    secret: config.AUTH_SECRET,
    token: {
      ...profile,
      sub: account.providerAccountId,
    },
    salt: name,
  });

  await context.addCookies([
    {
      name,
      value: sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: Boolean(isSecure),
      sameSite: "Lax",
      expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    },
  ]);
}

const profile = {
  name: process.env.TEST_USER_NAME,
  email: process.env.TEST_USER_EMAIL,
  picture: null,
};

const account = {
  provider: "google",
  type: "oauth" as const,
  providerAccountId: "google-test-id-12345",
};
