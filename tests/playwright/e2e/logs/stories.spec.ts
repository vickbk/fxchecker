import {
  shouldSeeEmptyLogs,
  shouldSeeInterceptorMessageIfNotSignedIn,
} from "@/features/logs/__testing__";
import test from "@playwright/test";
import { runSimilarTests } from "../../utils/dsl";

test.describe("Logs test", () => {
  runSimilarTests([
    ["should see empty logs", shouldSeeEmptyLogs],
    [
      "Should see the SignIn interceptor when trying to log a conversion without signing in",
      shouldSeeInterceptorMessageIfNotSignedIn,
    ],
  ]);
});
