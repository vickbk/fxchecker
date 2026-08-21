import { describe, expect, it } from "vitest";
import { FilterAction, FilterState } from "../types";
import {
  currencyFilterReducer,
  INITIAL_HIGHLIGHT,
  initialFilterState,
} from "./currencyFilterReducer";

describe("currencyFilterReducer", () => {
  describe("Initial State & Action Fallbacks", () => {
    it("exports the expected initial state defaults", () => {
      expect(INITIAL_HIGHLIGHT).toBe(-1);
      expect(initialFilterState).toEqual({
        isOpen: false,
        query: "",
        highlightedIndex: -1,
      });
    });

    it("returns original state reference when receiving an unknown action type", () => {
      const state: FilterState = {
        isOpen: true,
        query: "USD",
        highlightedIndex: 2,
      };
      const unknownAction = {
        type: "UNKNOWN_ACTION",
      } as unknown as FilterAction;

      const result = currencyFilterReducer(state, unknownAction);

      expect(result).toBe(state);
    });
  });

  describe("SET_QUERY", () => {
    it("updates query string and defaults highlightedIndex to 0 for non-empty input", () => {
      const state: FilterState = {
        isOpen: false,
        query: "",
        highlightedIndex: INITIAL_HIGHLIGHT,
      };
      const action: FilterAction = { type: "SET_QUERY", payload: "EUR" };

      const result = currencyFilterReducer(state, action);

      expect(result).toEqual({
        isOpen: false,
        query: "EUR",
        highlightedIndex: 0,
      });
    });

    it("resets highlightedIndex to INITIAL_HIGHLIGHT (-1) when query is set to empty string", () => {
      const state: FilterState = {
        isOpen: true,
        query: "EUR",
        highlightedIndex: 3,
      };
      const action: FilterAction = { type: "SET_QUERY", payload: "" };

      const result = currencyFilterReducer(state, action);

      expect(result).toEqual({
        isOpen: true,
        query: "",
        highlightedIndex: INITIAL_HIGHLIGHT,
      });
    });
  });

  describe("OPEN", () => {
    it("sets isOpen to true while preserving query and highlightedIndex", () => {
      const state: FilterState = {
        isOpen: false,
        query: "CAD",
        highlightedIndex: 1,
      };

      const result = currencyFilterReducer(state, { type: "OPEN" });

      expect(result).toEqual({
        isOpen: true,
        query: "CAD",
        highlightedIndex: 1,
      });
    });
  });

  describe("RESET", () => {
    it("resets dirty state completely back to initialFilterState reference", () => {
      const dirtyState: FilterState = {
        isOpen: true,
        query: "GBP",
        highlightedIndex: 4,
      };

      const result = currencyFilterReducer(dirtyState, { type: "RESET" });

      expect(result).toEqual(initialFilterState);
    });
  });

  describe("SET_HIGHLIGHT", () => {
    it("updates highlightedIndex to given numeric index payload", () => {
      const state: FilterState = {
        isOpen: true,
        query: "JPY",
        highlightedIndex: 0,
      };
      const action: FilterAction = { type: "SET_HIGHLIGHT", payload: 3 };

      const result = currencyFilterReducer(state, action);

      expect(result).toEqual({
        isOpen: true,
        query: "JPY",
        highlightedIndex: 3,
      });
    });

    it("allows resetting highlightedIndex back to INITIAL_HIGHLIGHT (-1)", () => {
      const state: FilterState = {
        isOpen: true,
        query: "JPY",
        highlightedIndex: 3,
      };
      const action: FilterAction = {
        type: "SET_HIGHLIGHT",
        payload: INITIAL_HIGHLIGHT,
      };

      const result = currencyFilterReducer(state, action);

      expect(result.highlightedIndex).toBe(-1);
    });
  });

  describe("KEY_NAVIGATE: ArrowDown", () => {
    it("opens menu and sets highlightedIndex to 0 when menu is closed and list has items", () => {
      const state = { ...initialFilterState, isOpen: false };
      const action: FilterAction = {
        type: "KEY_NAVIGATE",
        key: "ArrowDown",
        totalLength: 5,
      };

      const result = currencyFilterReducer(state, action);

      expect(result).toEqual({
        isOpen: true,
        query: "",
        highlightedIndex: 0,
      });
    });

    it("opens menu but keeps highlightedIndex at INITIAL_HIGHLIGHT when menu is closed and list is empty", () => {
      const state = { ...initialFilterState, isOpen: false };
      const action: FilterAction = {
        type: "KEY_NAVIGATE",
        key: "ArrowDown",
        totalLength: 0,
      };

      const result = currencyFilterReducer(state, action);

      expect(result).toEqual({
        isOpen: true,
        query: "",
        highlightedIndex: INITIAL_HIGHLIGHT,
      });
    });

    it("returns unchanged state reference when menu is open but totalLength is 0", () => {
      const state: FilterState = {
        isOpen: true,
        query: "NO_MATCH",
        highlightedIndex: INITIAL_HIGHLIGHT,
      };
      const action: FilterAction = {
        type: "KEY_NAVIGATE",
        key: "ArrowDown",
        totalLength: 0,
      };

      const result = currencyFilterReducer(state, action);

      expect(result).toBe(state);
    });

    it("moves highlightedIndex from -1 to 0 when menu is open", () => {
      const state: FilterState = {
        isOpen: true,
        query: "",
        highlightedIndex: -1,
      };
      const action: FilterAction = {
        type: "KEY_NAVIGATE",
        key: "ArrowDown",
        totalLength: 3,
      };

      const result = currencyFilterReducer(state, action);

      expect(result.highlightedIndex).toBe(0);
    });

    it("increments highlightedIndex by 1 when below index bound", () => {
      const state: FilterState = {
        isOpen: true,
        query: "",
        highlightedIndex: 1,
      };
      const action: FilterAction = {
        type: "KEY_NAVIGATE",
        key: "ArrowDown",
        totalLength: 4,
      };

      const result = currencyFilterReducer(state, action);

      expect(result.highlightedIndex).toBe(2);
    });

    it("clamps highlightedIndex to totalLength - 1 on excess ArrowDown presses", () => {
      const state: FilterState = {
        isOpen: true,
        query: "",
        highlightedIndex: 3,
      };
      const action: FilterAction = {
        type: "KEY_NAVIGATE",
        key: "ArrowDown",
        totalLength: 4,
      };

      const result = currencyFilterReducer(state, action);

      expect(result.highlightedIndex).toBe(3);
    });
  });

  describe("KEY_NAVIGATE: ArrowUp", () => {
    it("returns unchanged state reference when totalLength is 0", () => {
      const state: FilterState = {
        isOpen: true,
        query: "EMPTY",
        highlightedIndex: INITIAL_HIGHLIGHT,
      };
      const action: FilterAction = {
        type: "KEY_NAVIGATE",
        key: "ArrowUp",
        totalLength: 0,
      };

      const result = currencyFilterReducer(state, action);

      expect(result).toBe(state);
    });

    it("decrements highlightedIndex by 1 when index is greater than 0", () => {
      const state: FilterState = {
        isOpen: true,
        query: "",
        highlightedIndex: 2,
      };
      const action: FilterAction = {
        type: "KEY_NAVIGATE",
        key: "ArrowUp",
        totalLength: 4,
      };

      const result = currencyFilterReducer(state, action);

      expect(result.highlightedIndex).toBe(1);
    });

    it("clamps highlightedIndex to 0 when pressed at index 0", () => {
      const state: FilterState = {
        isOpen: true,
        query: "",
        highlightedIndex: 0,
      };
      const action: FilterAction = {
        type: "KEY_NAVIGATE",
        key: "ArrowUp",
        totalLength: 4,
      };

      const result = currencyFilterReducer(state, action);

      expect(result.highlightedIndex).toBe(0);
    });

    it("forces highlightedIndex to 0 when ArrowUp is pressed while index is negative (-1)", () => {
      const state: FilterState = {
        isOpen: true,
        query: "",
        highlightedIndex: -1,
      };
      const action: FilterAction = {
        type: "KEY_NAVIGATE",
        key: "ArrowUp",
        totalLength: 4,
      };

      const result = currencyFilterReducer(state, action);

      expect(result.highlightedIndex).toBe(0);
    });
  });

  describe("KEY_NAVIGATE: Unsupported Keys", () => {
    it("returns unchanged state when receiving unsupported keys in KEY_NAVIGATE", () => {
      const state: FilterState = {
        isOpen: true,
        query: "",
        highlightedIndex: 1,
      };
      const action = {
        type: "KEY_NAVIGATE",
        key: "Tab",
        totalLength: 4,
      } as unknown as FilterAction;

      const result = currencyFilterReducer(state, action);

      expect(result).toBe(state);
    });
  });
});
