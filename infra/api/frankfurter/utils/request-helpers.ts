import { FrankfurterValidationError } from "./errors";

export function assertSafeRequestPath(path: string): void {
  if (!path.startsWith("/")) {
    throw new FrankfurterValidationError("Invalid request path.");
  }

  if (
    path.includes("://") ||
    path.includes("..") ||
    path.includes("\\") ||
    /[\r\n\t]/.test(path)
  ) {
    throw new FrankfurterValidationError("Unsafe request path detected.");
  }
}
