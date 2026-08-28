import { fireEvent } from "@testing-library/react";
import { ToggleConfig } from "../types";

if (typeof globalThis.ToggleEvent === "undefined") {
  class ToggleEvent extends Event {
    oldState: string;
    newState: string;
    source: Element | null = null;
    constructor(type: string, eventInitDict: ToggleEventInit = {}) {
      super(type, eventInitDict);
      this.oldState = eventInitDict.oldState || "closed";
      this.newState = eventInitDict.newState || "open";
    }
  }

  globalThis.ToggleEvent = ToggleEvent;
}

fireEvent.toggle = (
  element: Document | Element | Node | Window,
  initDict: Partial<ToggleConfig> = { oldState: "closed", newState: "open" },
) => {
  const event = new ToggleEvent("toggle", {
    bubbles: false,
    cancelable: false,
    ...initDict,
  });

  return fireEvent(element, event);
};
