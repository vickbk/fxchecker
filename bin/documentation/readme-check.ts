import { runTask } from "@vickbk/ci-tools/core";
import { checkReadmeFiles, handleReadmeCliError } from "@vickbk/ci-tools/docs";

import { binReadmeContract } from "../readme-contract";

await runTask(
  "readme-check",
  async () =>
    await checkReadmeFiles({
      "./bin/README.md": binReadmeContract,
    }),
  handleReadmeCliError,
);
