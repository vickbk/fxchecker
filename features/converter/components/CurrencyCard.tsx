"use client";
import { Currency } from "@/infra/api/frankfurter";
import { Article, Heading, Section } from "@/shared/heading";
import { BiIcon, Flag, getCurrencyCountry, SROnly } from "@/shared/utils";
import { SRHidden } from "@/shared/utils/components/SRHidden";
import { useURLState } from "../hooks/useURLState";

export const CurrencyCard = ({
  currencies,
  isSend = false,
}: {
  currencies: Currency[];
  isSend: boolean;
}) => {
  const [id, searchId, popover] = crypto.randomUUID().split("-");

  const { from, to } = useURLState();
  const actualCurr = currencies.find(
    ({ code }) =>
      code === (isSend ? from : to) || code === (isSend ? "USD" : "EUR"),
  )!;

  return (
    <Article id={`${id}`}>
      <button
        className={`p-4 rounded-md bg-btn flex gap-2 items-center [anchor-name:--${popover}]`}
        type="button"
        popoverTarget={popover}
      >
        <Flag
          src={`https://flagcdn.com/${getCurrencyCountry(actualCurr!.code)}.svg`}
          alt={`${actualCurr.name} flag`}
        />{" "}
        {actualCurr.code} <BiIcon name="caret-down-fill" />
      </button>
      <form
        popover=""
        id={popover}
        aria-live="polite"
        className={`bg-btn inset-auto [position-anchor:--${popover}] [position-area:bottom_span-right] mt-4 p-4 rounded-lg text-foreground`}
      >
        <label className="relative">
          <SROnly>Enter the currency you like</SROnly>{" "}
          <BiIcon name="search absolute left-2 top-[.005em]" />
          <input
            type="text"
            id={searchId}
            placeholder="Search for currencies..."
            className="pl-8 outline outline-card p-2"
          />
        </label>

        <Section>
          <Heading className="flex justify-between border-b py-4 text-foreground-secondary">
            Currencies <span>{currencies.length}</span>
          </Heading>
          <ul className="mt-4">
            {currencies.map(({ name, code }) => (
              <li
                key={code}
                className="flex gap-2 text-sm text-foreground-secondary items-center"
              >
                <Flag
                  src={`https://flagcdn.com/${getCurrencyCountry(code)}.svg`}
                  alt=""
                />{" "}
                <SRHidden className="text-lg text-foreground">{code}</SRHidden>{" "}
                {name}
                <BiIcon name="check text-lg ml-auto" />
              </li>
            ))}
          </ul>
        </Section>
      </form>
    </Article>
  );
};
