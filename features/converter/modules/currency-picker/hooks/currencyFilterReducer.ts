import { FilterAction, FilterState, Handlers } from "../types";

export const INITIAL_HIGHLIGHT = -1;

export const initialFilterState: FilterState = {
  isOpen: false,
  query: "",
  highlightedIndex: INITIAL_HIGHLIGHT,
};

const handlers: Handlers = {
  SET_QUERY: (state, action) => ({
    ...state,
    query: action.payload,
    highlightedIndex: action.payload !== "" ? 0 : INITIAL_HIGHLIGHT,
  }),

  OPEN: (state) => ({ ...state, isOpen: true }),

  RESET: () => initialFilterState,

  SET_HIGHLIGHT: (state, action) => ({
    ...state,
    highlightedIndex: action.payload,
  }),

  KEY_NAVIGATE: (state, action) => {
    const { key, totalLength } = action;

    if (key === "ArrowDown") {
      if (!state.isOpen) {
        return {
          ...state,
          isOpen: true,
          highlightedIndex: totalLength > 0 ? 0 : INITIAL_HIGHLIGHT,
        };
      }
      if (totalLength === 0) return state;

      const nextIndex =
        state.highlightedIndex < 0
          ? 0
          : Math.min(state.highlightedIndex + 1, totalLength - 1);

      return { ...state, highlightedIndex: nextIndex };
    }

    if (key === "ArrowUp") {
      if (totalLength === 0) return state;

      const nextIndex =
        state.highlightedIndex <= 0
          ? 0
          : Math.max(state.highlightedIndex - 1, 0);

      return { ...state, highlightedIndex: nextIndex };
    }

    return state;
  },
};

export function currencyFilterReducer(
  state: FilterState,
  action: FilterAction,
): FilterState {
  const handler = handlers[action.type] as (
    s: FilterState,
    a: FilterAction,
  ) => FilterState;

  return handler?.(state, action) ?? state;
}
