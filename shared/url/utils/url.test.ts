import { describe, expect, it } from "vitest";
import { DEFAULT_AMOUNT, DEFAULT_FROM, DEFAULT_TO } from "./formatting";
import { buildStateQuery, readState } from "./url";

describe("readState", () => {
  it("falls back to the system defaults for null, undefined, or empty params", () => {
    expect(readState(null)).toMatchObject({
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
      amount: DEFAULT_AMOUNT,
    });

    expect(readState(undefined)).toMatchObject({
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
      amount: DEFAULT_AMOUNT,
    });

    expect(readState(new URLSearchParams(""))).toMatchObject({
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
      amount: DEFAULT_AMOUNT,
    });
  });

  it("hydrates partial queries while preserving the remaining defaults", () => {
    const state = readState(new URLSearchParams("from=GBP"));

    expect(state.from).toBe("GBP");
    expect(state.to).toBe(DEFAULT_TO);
    expect(state.amount).toBe(DEFAULT_AMOUNT);
  });

  it("normalizes lowercase or poorly spaced currency tokens", () => {
    const state = readState(new URLSearchParams("from=  usd  &to=  eur  "));

    expect(state.from).toBe("USD");
    expect(state.to).toBe("EUR");
  });

  it("coerces invalid or non-positive amounts back to the default", () => {
    expect(readState(new URLSearchParams("amount=not-a-number")).amount).toBe(
      DEFAULT_AMOUNT,
    );
    expect(readState(new URLSearchParams("amount=-250")).amount).toBe(
      DEFAULT_AMOUNT,
    );
  });

  it("preserves valid fractional amounts without rounding anomalies", () => {
    const state = readState(new URLSearchParams("amount=12.345"));

    expect(state.amount).toBe(12.345);
  });
});

describe("buildStateQuery", () => {
  it("serializes updates while preserving existing params", () => {
    const params = new URLSearchParams("from=USD&to=EUR&amount=100");
    const nextQuery = buildStateQuery({ from: "gbp", amount: 250 }, params);

    expect(nextQuery).toBe("from=GBP&to=EUR&amount=250");
  });
});
