"use client";
import { useURLState } from "@/shared/url";
import { BiIcon, SROnly } from "@/shared/utils";

export const Swapper = () => {
  const { swapCurrencies, from, to } = useURLState();
  return (
    <button
      className="bg-card self-center p-4 rounded-lg font-medium hover:scale-105 action-btn sm:rotate-90"
      type="button"
      onClick={swapCurrencies}
    >
      <SROnly>{`Swap send (${from}) and receive (${to}) currencies`}</SROnly>
      <BiIcon name="arrow-down-up" />
    </button>
  );
};
