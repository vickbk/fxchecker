import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import { ZodSchema } from "zod/v3";

export const shouldSee = (...texts: (string | RegExp)[]) => {
  texts.forEach((text) => {
    const regex = typeof text === "string" ? new RegExp(text, "i") : text;
    expect(screen.getByText(regex)).toBeInTheDocument();
  });
};

export const shouldNotSee = (...texts: (string | RegExp)[]) => {
  texts.forEach((text) => {
    const regex = typeof text === "string" ? new RegExp(text, "i") : text;
    expect(screen.queryByText(regex)).not.toBeInTheDocument();
  });
};

export const userClicks = async (
  target: string | RegExp,
  container?: HTMLElement,
) => {
  const user = userEvent.setup();
  const regex = typeof target === "string" ? new RegExp(target, "i") : target;

  const searchArea = container ? within(container) : screen;
  const element =
    searchArea.queryByRole("button", { name: regex }) ||
    searchArea.getByText(regex);

  await user.click(element);
};

export const userTypes = async (
  target: string | RegExp,
  text: string,
  container?: HTMLElement,
) => {
  const user = userEvent.setup();
  const regex = typeof target === "string" ? new RegExp(target, "i") : target;

  const searchArea = container ? within(container) : screen;
  const element =
    searchArea.queryByLabelText(regex) ||
    searchArea.queryByPlaceholderText(regex) ||
    searchArea.getByRole("textbox", { name: regex });

  await user.type(element, text);
};

// Pure Logic Assertions
export const shouldBe = <T>(actual: T, expected: T) => {
  expect(actual).toBe(expected);
};

export const shouldContain = (collection: unknown, item: unknown) => {
  expect(collection).toContainEqual(expect.objectContaining(item));
};

export const shouldMatch = (data: unknown, schema: ZodSchema) => {
  const parsed = schema.safeParse(data);
  expect(parsed.success).toBe(true);
};

export const shouldFail = (data: unknown, schema: ZodSchema) => {
  const parsed = schema.safeParse(data);
  expect(parsed.success).toBe(false);
};
