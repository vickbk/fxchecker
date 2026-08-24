import { renderHook } from "@testing-library/react";
import { startTransition } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAutoDispatch } from "./useAutoDispatch";

// Mock React's startTransition to inspect transition wrapping
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    startTransition: vi.fn((cb: () => void) => cb()),
  };
});

describe("useAutoDispatch Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Execution", () => {
    it("dispatches payload inside startTransition on initial mount", () => {
      const dispatch = vi.fn();
      const payload = { type: "SET_CURRENCY", code: "USD" };

      renderHook(() => useAutoDispatch(dispatch, payload, []));

      expect(startTransition).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(payload);
    });

    it("handles primitive payloads (string, number, null, undefined)", () => {
      const dispatch = vi.fn();

      const { rerender } = renderHook(
        ({ value, deps }) => useAutoDispatch(dispatch, value, deps),
        {
          initialProps: { value: 100 as number | null | undefined, deps: [1] },
        },
      );

      expect(dispatch).toHaveBeenLastCalledWith(100);

      rerender({ value: null, deps: [2] });
      expect(dispatch).toHaveBeenLastCalledWith(null);

      rerender({ value: undefined, deps: [3] });
      expect(dispatch).toHaveBeenLastCalledWith(undefined);
    });
  });

  describe("Dependency Triggers & Re-renders", () => {
    it("executes dispatch when dependency array items change", () => {
      const dispatch = vi.fn();

      const { rerender } = renderHook(
        ({ payload, deps }) => useAutoDispatch(dispatch, payload, deps),
        {
          initialProps: {
            payload: "EUR",
            deps: ["EUR"],
          },
        },
      );

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenLastCalledWith("EUR");

      // Change dependency
      rerender({
        payload: "GBP",
        deps: ["GBP"],
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith("GBP");
    });

    it("does NOT trigger dispatch when component re-renders with unchanged dependencies", () => {
      const dispatch = vi.fn();

      const { rerender } = renderHook(
        ({}) => useAutoDispatch(dispatch, "ACTIVE", [1]),
        { initialProps: { count: 0 } },
      );

      expect(dispatch).toHaveBeenCalledTimes(1);

      // Re-render component without changing deps
      rerender({ count: 1 });
      rerender({ count: 2 });

      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    it("does NOT trigger dispatch if payload changes without dependency array changing", () => {
      const dispatch = vi.fn();

      const { rerender } = renderHook(
        ({ payload }) => useAutoDispatch(dispatch, payload, [42]),
        { initialProps: { payload: "INITIAL_PAYLOAD" } },
      );

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenLastCalledWith("INITIAL_PAYLOAD");

      // Payload prop changes, but deps stayed [42]
      rerender({ payload: "UPDATED_PAYLOAD" });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenLastCalledWith("INITIAL_PAYLOAD");
    });
  });

  describe("Dispatch Reference Stability (useRef)", () => {
    it("uses the initial dispatch ref across renders even if dispatch function identity changes", () => {
      const initialDispatch = vi.fn();
      const updatedDispatch = vi.fn();

      const { rerender } = renderHook(
        ({ fn, dep }) => useAutoDispatch(fn, "PAYLOAD", [dep]),
        {
          initialProps: {
            fn: initialDispatch,
            dep: 1,
          },
        },
      );

      expect(initialDispatch).toHaveBeenCalledTimes(1);

      // Re-render with new dispatch function reference and updated dependency
      rerender({
        fn: updatedDispatch,
        dep: 2,
      });

      // Because dispatchRef is initialized once via useRef(dispatch) without an assignment in render,
      // initialDispatch remains stored in dispatchRef.current
      expect(initialDispatch).toHaveBeenCalledTimes(2);
      expect(updatedDispatch).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases & Complex Payloads", () => {
    it("handles empty dependency array [] by executing strictly once on mount", () => {
      const dispatch = vi.fn();

      const { rerender } = renderHook(() =>
        useAutoDispatch(dispatch, { init: true }, []),
      );

      expect(dispatch).toHaveBeenCalledTimes(1);

      rerender();
      rerender();

      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    it("handles complex object structures and arrays as payloads", () => {
      const dispatch = vi.fn();
      const complexPayload = {
        filters: ["USD", "EUR"],
        meta: { page: 1, query: "fx" },
      };

      renderHook(() => useAutoDispatch(dispatch, complexPayload, [1]));

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: ["USD", "EUR"],
          meta: { page: 1, query: "fx" },
        }),
      );
    });
  });
});
