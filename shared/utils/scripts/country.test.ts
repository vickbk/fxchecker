import { describe, expect, test } from "vitest";
import { getCurrencyCountry } from "./country";

describe("Get country initials from Currencies", () => {
  test("should extract the country initials from currency", () => {
    const US = getCurrencyCountry("USD");
    expect(US).toBe("us");
  });

  test("should be able to overide exceptions", () => {
    const sn = getCurrencyCountry("XOF");
    expect(sn).toBe("sn");
  });
});
