import { useURLState } from "@/shared/url/hooks";
import { useActionState, useMemo } from "react";
import { loadRate } from "../actions";
import { useAutoDispatch } from "./useAutoDispatch";

export function useRate() {
  const { from, to, amount } = useURLState();
  const [results, getRate, loading] = useActionState(loadRate, null);

  useAutoDispatch(getRate, { from, to }, [from, to]);

  const rate = results?.rate ?? 0;

  return useMemo(
    () => ({ from, to, rate, amount, loading }),
    [from, to, rate, amount, loading],
  );
}
