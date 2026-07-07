import { useLocation } from "react-router-dom";

export function useRouteWithSearch() {
  const { search } = useLocation();
  return {
    keepQuery(path = "/") {
      return path + search;
    },
  };
}
