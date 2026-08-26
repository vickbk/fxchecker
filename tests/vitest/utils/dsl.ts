import { patternToRegex, TEXT_PATTERN } from "@/tests/common";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import { ToggleState } from "../types";

function shouldGetByText(...textes: (string | RegExp)[]) {
  return textes.map((text) => {
    const regex = patternToRegex(text);
    return expect(screen.queryByText(regex));
  });
}
export const shouldSee = (...texts: (string | RegExp)[]) => {
  shouldGetByText(...texts).forEach((matcher) => matcher.toBeInTheDocument());
};

export const shouldNotSee = (...texts: (string | RegExp)[]) => {
  shouldGetByText(...texts).forEach((matcher) =>
    matcher.not.toBeInTheDocument(),
  );
};

export const userClicks = async (
  target: string | RegExp,
  container?: HTMLElement,
) => {
  const user = userEvent.setup();
  const regex = patternToRegex(target);

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
  const regex = patternToRegex(target);

  const searchArea = getSearchArea(container);
  const element =
    searchArea.queryByLabelText(regex) ||
    searchArea.queryByPlaceholderText(regex) ||
    searchArea.getByRole("textbox", { name: regex });

  await user.clear(element);
  await user.type(element, text);
};

export function isChecked(selector: TEXT_PATTERN, container?: HTMLElement) {
  const searchArea = getSearchArea(container);

  const name = patternToRegex(selector);
  const element =
    searchArea.getByLabelText(name) ||
    searchArea.getByRole("radio", { name }) ||
    searchArea.getByRole("checkbox", { name });
  expect(element).toBeChecked();
}

function getSearchArea(container?: HTMLElement) {
  return container ? within(container) : screen;
}

export function resolvedPromise<T>(value: T) {
  const promise = Promise.resolve(value);
  return Object.assign(promise, { status: "fulfilled" as const, value });
}

export function rejectedPromise(reason: unknown) {
  const promise = Promise.reject(reason);
  promise.catch(() => {}); // Suppresses Vitest unhandledRejection noise
  return Object.assign(promise, { status: "rejected" as const, reason });
}

// function togglePopover(id: string) {
//   const element = document.getElementById(id);
//   if (!element) return;
//   fireEvent.toggle(element);
// }

export function togglePopover({
  container,
  selector,
  newState = "open",
}: {
  container?: HTMLElement;
  selector: string;
  newState?: ToggleState;
}) {
  const element = (container ?? document).querySelector(selector);
  if (!element) return;
  fireEvent.toggle(element, { newState });
  return element;
}
