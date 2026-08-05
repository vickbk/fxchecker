export function logError(error: unknown, shouldLog = true): void {
  if (error instanceof Error && shouldLog) {
    console.error(`Error:`, error);
  }
}
