"use client";
import { Flag, useCurrencies } from "@/shared/currencies";
import { Article } from "@/shared/heading";
import { useURLState } from "@/shared/url/hooks";
import { BiIcon, SROnly } from "@/shared/utils";
import { useId } from "react";
import { PickerForm } from "../modules/currency-picker";

export const CurrencyCard = ({ isSend = false }: { isSend: boolean }) => {
  const id = useId();
  const popover = useId();

  const { from, to } = useURLState();
  const { currencies } = useCurrencies();
  const actualCurr =
    currencies.find(({ code }) => code === (isSend ? from : to)) ??
    currencies.find(({ code }) => code === (isSend ? "USD" : "EUR"));

  if (!actualCurr) return null;

  return (
    <Article id={`${id}`}>
      <button
        className={`p-4 rounded-md bg-btn flex gap-2 items-center hover:scale-105 action-btn [anchor-name:--${popover}]`}
        type="button"
        popoverTarget={popover}
      >
        <Flag currency={actualCurr.code} alt={`${actualCurr.name} flag`} />{" "}
        <SROnly>Change {isSend ? "send" : "receive"} currency(</SROnly>
        {actualCurr.code}
        <SROnly>)</SROnly> <BiIcon name="caret-down-fill" />
      </button>
      <PickerForm {...{ isSend, popover }} />
    </Article>
  );
};
