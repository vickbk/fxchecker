import { usePathname, useSearchParams } from "next/navigation";
import { options } from "./utils";

export const useActiveOption = (text?: string) => {
  const pathname = usePathname();
  const query = useSearchParams();

  const queryString = query.toString().trim();

  const isHistory = text === "history";
  const isActive =
    text && (isHistory ? pathname === "/" : pathname.includes(text));

  return {
    isActive,
    isHistory,
    queryString,
    text:
      text ??
      options.find(
        (option) =>
          pathname.includes(option) ||
          (pathname === "/" && option === "history"),
      ),
  };
};
