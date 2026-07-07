import { checkHeadingOrder } from "./check-heading-order";

describe("Check Heading Order", () => {
  test("should be false if heading order skipped", () => {
    expect(
      checkHeadingOrder({
        headings: ["H1"],
        tagName: "TEST",
        children: [{ tagName: "TEST", headings: ["H3"], children: [] }],
      }),
    ).toBeFalsy();
  });

  test("should be true if only one level", () => {
    expect(
      checkHeadingOrder({ headings: ["H1"], tagName: "TEST", children: [] }, 1),
    ).toBeTruthy();
  });

  test("should be true if heading order is correct", () => {
    expect(
      checkHeadingOrder({
        headings: ["H1"],
        tagName: "TEST",
        children: [
          { tagName: "TEST", headings: ["H2"], children: [] },
          { tagName: "TEST", headings: ["H2"], children: [] },
        ],
      }),
    ).toBeTruthy();
  });
});
