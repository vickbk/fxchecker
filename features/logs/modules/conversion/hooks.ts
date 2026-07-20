import { useURLState } from "@/shared/url/hooks";
import { startTransition, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { loadConversionRate } from "./utils";

export function useConversion() {
  const { from, to, amount } = useURLState();
  const [rate, setRate, loading] = useActionState(loadConversionRate, null);
  const { pending } = useFormStatus();

  useEffect(() => {
    startTransition(() => {
      setRate({ from, to });
    });
  }, [from, setRate, to]);
  return { from, to, amount, rate, pending, loading };
}
