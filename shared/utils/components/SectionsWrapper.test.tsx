import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionsWrapper } from "./SectionsWrapper";

describe("SectionsWrapper", () => {
  const defaultSectionId = "converter-heading-123";

  it("renders a section element with the specified aria-describedby attribute", () => {
    const { container } = render(
      <SectionsWrapper sectionId={defaultSectionId}>
        <h2>Section Title</h2>
      </SectionsWrapper>,
    );

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("aria-describedby", defaultSectionId);
    expect(section).toHaveClass("p-4");
  });

  it("applies the layout styling classes to the internal wrapper div", () => {
    const { container } = render(
      <SectionsWrapper sectionId={defaultSectionId}>
        <div>Content</div>
      </SectionsWrapper>,
    );

    const innerDiv = container.querySelector("section > div");
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass(
      "flex",
      "flex-wrap",
      "rounded-lg",
      "p-4",
      "gap-4",
      "bg-background-secondary",
      "items-center",
      "justify-between",
    );
  });

  it("renders single and multiple child elements inside the wrapper container", () => {
    render(
      <SectionsWrapper sectionId={defaultSectionId}>
        <button type="button">Action Button</button>
        <span data-testid="status-indicator">Active</span>
      </SectionsWrapper>,
    );

    expect(
      screen.getByRole("button", { name: "Action Button" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("status-indicator")).toHaveTextContent("Active");
  });

  it("handles primitive text and numerical children correctly", () => {
    render(
      <SectionsWrapper sectionId={defaultSectionId}>
        Plain Text Content
      </SectionsWrapper>,
    );

    expect(screen.getByText("Plain Text Content")).toBeInTheDocument();
  });

  it("handles null, undefined, or boolean children gracefully without breaking rendering", () => {
    const { container } = render(
      <SectionsWrapper sectionId={defaultSectionId}>
        {null}
        {undefined}
        {false}
        <p>Visible Paragraph</p>
      </SectionsWrapper>,
    );

    const innerDiv = container.querySelector("section > div");
    expect(innerDiv?.children).toHaveLength(1);
    expect(screen.getByText("Visible Paragraph")).toBeInTheDocument();
  });
});
