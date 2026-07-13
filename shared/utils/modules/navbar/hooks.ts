import { usePathname, useSearchParams } from "next/navigation";

export const useActiveOption = (text: string) => {
  const pathname = usePathname();
  const query = useSearchParams();

  const queryString = query.toString().trim();

  const isHistory = text === "history";
  const isActive = isHistory ? pathname === "/" : pathname.includes(text);

  return { isActive, isHistory, queryString };
};
