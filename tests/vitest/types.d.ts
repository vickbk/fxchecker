import { FireFunction, FireObject } from "@testing-library/react";

type ToggleState = "open" | "closed";

export type ToggleConfig = Record<"oldState" | "newState", ToggleState>;

type CustomFireExtensions = {
  toggle: (
    element: Document | Element | Window | Node,
    initDict?: Partial<ToggleConfig>,
  ) => boolean;
};

declare module "@testing-library/react" {
  export const fireEvent: FireFunction & FireObject & CustomFireExtensions;
}
