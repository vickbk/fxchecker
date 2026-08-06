const regex = /\${([^}]+)}/g;

export function expandEnv() {
  let hasPlaceholders = true;

  // Multi-pass expansion to handle chained or out-of-order references
  while (hasPlaceholders) {
    hasPlaceholders = false;

    for (const key in process.env) {
      const value = process.env[key];

      if (typeof value === "string" && value.includes("${")) {
        process.env[key] = value.replace(regex, (_, varName) => {
          return process.env[varName] || "";
        });

        // If placeholders still exist after replacement, trigger another pass
        if (process.env[key]?.includes("${")) {
          hasPlaceholders = true;
        }
      }
    }
  }
}
