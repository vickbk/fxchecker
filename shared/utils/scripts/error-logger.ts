export function logError(error: unknown, shouldLog = true): void {
  if (error && shouldLog) {
    console.error(error);
  }
}
