import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { URLState } from "../types";
import { buildStateQuery, readState } from "../utils/url";

export function useURLState(): URLState {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = readState(searchParams);

  const updateURL = (updates: {
    from?: string;
    to?: string;
    amount?: number;
  }) => {
    router.replace(`${pathname}?${buildStateQuery(updates, searchParams)}`, {
      scroll: false,
    });
  };

  return {
    ...state,
    setFrom: (value: string) => updateURL({ from: value }),
    setTo: (value: string) => updateURL({ to: value }),
    setAmount: (value: number) => updateURL({ amount: value }),

    // Beautifully clean atomic swap with zero double-parsing
    swapCurrencies: () =>
      updateURL({
        from: state.to,
        to: state.from,
      }),
  };
}
