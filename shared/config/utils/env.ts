import type { Config } from "../types";
import { checkClientRequest, getClientConfig } from "./client-config";
import { expandEnv } from "./expand-env";
import { getServerConfig } from "./server-config";
import { checkTestRequest } from "./test-config";

expandEnv();

export const config = new Proxy({} as Config, {
  get(_, prop) {
    checkTestRequest(prop);

    if (checkClientRequest(prop))
      return getClientConfig()[
        prop as keyof ReturnType<typeof getClientConfig>
      ];

    return getServerConfig()[prop as keyof Config];
  },
});
