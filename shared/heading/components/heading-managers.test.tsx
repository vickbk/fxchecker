import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { checkHeadingOrder, drawRegion } from "../scripts";
import { Article, Heading, Main, Section } from "./heading-managers";

describe("Heading Level Manager", () => {
  test("should render h1 if heading rendered out of heading context", async () => {
    render(
      <main>
        <Heading>Heading 1</Heading>
      </main>,
    );
    const heading = await screen.findByRole("heading", { name: "Heading 1" });
    expect(heading.tagName).toBe("H1");
  });

  test("renders correct heading levels for nested sections", async () => {
    render(
      <Main pageHasH1={false}>
        <Heading>Main Title</Heading>
        <Section>
          <Heading>Section 1</Heading>
          <Section>
            <Heading>Subsection 1.1</Heading>
          </Section>
        </Section>
        <Section>
          <Heading>Section 2</Heading>
        </Section>
      </Main>,
    );

    const headings = await screen.findAllByRole("heading");
    expect(headings).toHaveLength(4);

    // Assert tag names and text content
    expect(headings[0].tagName).toBe("H1");
    expect(headings[0]).toHaveTextContent("Main Title");

    expect(headings[1].tagName).toBe("H2");
    expect(headings[1]).toHaveTextContent("Section 1");

    expect(headings[2].tagName).toBe("H3");
    expect(headings[2]).toHaveTextContent("Subsection 1.1");

    expect(headings[3].tagName).toBe("H2");
    expect(headings[3]).toHaveTextContent("Section 2");
  });

  test("clamps heading level at H6 for deep nesting", async () => {
    render(
      <Main pageHasH1>
        <Heading>Level 1</Heading>
        <Section>
          <Heading>Level 2</Heading>
          <Section>
            <Heading>Level 3</Heading>
            <Section>
              <Heading>Level 4</Heading>
              <Section>
                <Heading>Level 5</Heading>
                <Section>
                  <Heading>Level 6</Heading>
                  <Section>
                    <Heading>Level 7</Heading>
                  </Section>
                </Section>
              </Section>
            </Section>
          </Section>
        </Section>
      </Main>,
    );

    const headings = await screen.findAllByRole("heading");
    // Only the last two should be H6
    expect(headings[5].tagName).toBe("H6");
    expect(headings[6].tagName).toBe("H6");
  });

  test("should render same level headers in the same region", () => {
    const { container } = render(
      <Section>
        <Heading>Heading 1</Heading>
        <Heading>Heading 2</Heading>
        <Heading>Heading 3</Heading>
      </Section>,
    );
    const { headings } = drawRegion(container);
    expect(headings.every((h) => h === headings[0])).toBe(true);
  });

  test("should detect a skipped heading level", async () => {
    render(
      <Main pageHasH1={false}>
        <Heading>Heading 1</Heading>
        <Section>
          <Heading>Heading 2</Heading>
          <Section>
            <Article>
              <Heading>Heading 4</Heading>
            </Article>
          </Section>
          <Section>
            <Heading>Heading 3</Heading>
          </Section>
        </Section>
      </Main>,
    );
    const heading4 = await screen.findByRole("heading", { name: "Heading 4" });
    expect(heading4.tagName).toBe("H4");

    const main = await screen.findByRole("main");
    const region = drawRegion(main);
    expect(checkHeadingOrder(region)).toBe(false);
  });

  test("should start with h2 in main if  pageHasH1 is true", async () => {
    render(
      <Main pageHasH1>
        <Heading>Heading 2</Heading>
      </Main>,
    );

    const heading = await screen.findByRole("heading");
    expect(heading.tagName).toBe("H2");
  });
});
