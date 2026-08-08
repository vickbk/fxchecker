import "@playwright/test";

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeValidHeadingHierarchy(): Promise<R>;
    }
  }
}
