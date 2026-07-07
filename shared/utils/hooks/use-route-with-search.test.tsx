import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useRouteWithSearch } from "./use-route-with-search";

describe("Tests for use route with search hook", () => {
  it("keepQuery should be a function", () => {
    const search = "?foo=bar&baz=qux";
    const { result } = renderHook(() => useRouteWithSearch(), {
      wrapper: renderRouteWithSearchWrapper(search),
    });
    expect(typeof result.current.keepQuery).toBe("function");
  });

  it("keepQuery should return the path with the search query", () => {
    const search = "?foo=bar&baz=qux";
    const { result } = renderHook(() => useRouteWithSearch(), {
      wrapper: renderRouteWithSearchWrapper(search),
    });
    expect(result.current.keepQuery("/test")).toBe(`/test${search}`);
  });

  it("keepQuery should return the search query when no path is provided", () => {
    const search = "?foo=bar&baz=qux";
    const { result } = renderHook(() => useRouteWithSearch(), {
      wrapper: renderRouteWithSearchWrapper(search),
    });
    expect(result.current.keepQuery()).toBe(`/${search}`);
  });

  it("keepQuery should handle empty search query", () => {
    const search = "";
    const { result } = renderHook(() => useRouteWithSearch(), {
      wrapper: renderRouteWithSearchWrapper(search),
    });
    expect(result.current.keepQuery("/test")).toBe("/test");
  });

  it("keepQuery should handle search query with special characters", () => {
    const search = "?foo=bar%20baz&qux=quux%26corge";
    const { result } = renderHook(() => useRouteWithSearch(), {
      wrapper: renderRouteWithSearchWrapper(search),
    });
    expect(result.current.keepQuery("/test")).toBe(`/test${search}`);
  });
});

function renderRouteWithSearchWrapper(search = "?foo=bar&baz=qux") {
  return ({ children }: { children: React.ReactNode }) => {
    return (
      <MemoryRouter initialEntries={[`/${search}`]}>{children}</MemoryRouter>
    );
  };
}
