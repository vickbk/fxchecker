import { startTransition, useActionState, useEffect } from "react";
import { loadRate } from "../actions";
import { useURLState } from "./useURLState";

export function useRate() {
  const { from, to, amount } = useURLState();
  const [results, getRate, loading] = useActionState(loadRate, null);

  useEffect(() => {
    startTransition(() => {
      getRate({ from, to });
    });
  }, [from, to, getRate]);

  return { from, to, rate: results?.rate || 0, amount, loading };
}
