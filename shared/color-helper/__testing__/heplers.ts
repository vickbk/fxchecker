import { screen } from "@testing-library/react";
import { expect } from "vitest";

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
