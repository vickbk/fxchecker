import { config } from "@/shared/config";

export const [
  SIGN_IN_BUTTON = /Sign In to your account/i,
  SIGN_IN_HEADER = /Welcome to Foreign exchange tracker/i,
  SIGN_IN_WITH_GOOGLE = /Sign in with Google/i,

  // Signed in variables
  TEST_USER_NAME = config.TEST_USER_NAME,
  TEST_USER_EMAIL = config.TEST_USER_EMAIL,
  TEST_USER_ACCOUNT_TRIGGER = new RegExp(
    `Manage your account ${TEST_USER_NAME}`,
    "i",
  ),
  TEST_USER_ACCOUNT_PREVIEW = new RegExp(
    `Signed in as full name: ${TEST_USER_NAME} email address: ${TEST_USER_EMAIL}`,
    "i",
  ),
] = [];
