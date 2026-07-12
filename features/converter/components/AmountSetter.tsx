"use client";

import { useURLState } from "../hooks/useURLState";

export const AmountSetter = () => {
  const { setAmount, amount } = useURLState();
  return (
    <>
      <label className="sr-only" htmlFor="exchange-amount">
        Exchange amount
      </label>
      <input
        className="max-w-30 shrink text-4xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        id="exchange-amount"
        type="number"
        placeholder="100"
        defaultValue={amount}
        onChange={(e) => setAmount(+e.target.value)}
      />
    </>
  );
};
