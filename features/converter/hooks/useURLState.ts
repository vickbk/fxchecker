import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { URLState } from "../types";
import { buildStateQuery, readState } from "../utils/helpers";

export function useURLState(): URLState {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = readState(searchParams);

  const updateParams = (
    updates: "from" | "to" | "amount",
    value: string | number,
  ) => {
    const params = buildStateQuery(updates, searchParams, value);

    const nextUrl = params.toString() ? `?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  return {
    ...state,
    setFrom: (value: string) => updateParams("from", value),
    setTo: (value: string) => updateParams("to", value),
    setAmount: (value: number) => updateParams("amount", value),
  };
}
