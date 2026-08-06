import type { Config } from "../types";
import { getClientConfig } from "./client-config";
import { expandEnv } from "./expand-env";
import { getServerConfig } from "./server-config";
import { checkTestRequest } from "./test-config";

expandEnv();

export const config = new Proxy({} as Config, {
  get(_, prop) {
    checkTestRequest(prop);
    const isBrowser = typeof window !== "undefined";

    if (isBrowser) {
      if (!prop.toString().startsWith("NEXT_PUBLIC")) {
        throw new Error(
          `Attempted to access server-side environment variable ${String(
            prop,
          )} from a Client Component.`,
        );
      }
      return getClientConfig()[
        prop as keyof ReturnType<typeof getClientConfig>
      ];
    }

    return getServerConfig()[prop as keyof Config];
  },
});
