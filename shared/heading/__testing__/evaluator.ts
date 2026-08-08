import { expect, Locator, Page } from "@playwright/test";
import { Window } from "happy-dom";
import { checkHeadingOrderReport } from "../utils/check-heading-order-report";
import { drawRegion } from "../utils/region-drawer";

const w = new Window();
expect.extend({
  async toBeValidHeadingHierarchy(target: Page | Locator) {
    const locator = "locator" in target ? target.locator("body") : target;
    const elementHandle = await locator.elementHandle();

    if (!elementHandle) {
      return {
        message: () => "Failed to find element to audit heading hierarchy.",
        pass: false,
      };
    }

    const html = await elementHandle.evaluate((e) => e.outerHTML);

    if (!html)
      return {
        message: () =>
          "HTML Failed to find element to audit heading hierarchy.",
        pass: false,
      };
    const parser = new w.DOMParser();

    const content = parser.parseFromString(html, "text/html");
    const regionTree = drawRegion(content.body as unknown as Element);

    const report = checkHeadingOrderReport(regionTree);

    if (report.isValid) {
      return {
        message: () => "No violation found in heading hieararchy",
        pass: true,
      };
    }

    // Format rich error output for Playwright test failure runner
    const formattedErrors = report.errors
      .map((err, i) => {
        const textSnippet = err.text ? ` ("${err.text}")` : "";
        const selectorInfo = err.element ? ` [Selector: ${err.element}]` : "";
        return `${i + 1}. Path: ${err.path}\n   Message: ${err.message}${textSnippet}${selectorInfo}`;
      })
      .join("\n\n");

    return {
      message: () =>
        `Found ${report.errors.length} heading accessibility hierarchy violation(s):\n\n${formattedErrors}`,
      pass: false,
    };
  },
});
