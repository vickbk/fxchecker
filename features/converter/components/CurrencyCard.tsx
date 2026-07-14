"use client";
import { useCurrencies } from "@/shared/currencies";
import { Article, Heading, Section } from "@/shared/heading";
import { BiIcon, Flag, getCurrencyCountry, SROnly } from "@/shared/utils";
import { SRHidden } from "@/shared/utils/components/SRHidden";
import { useCurrencyFilter } from "../hooks/useCurrencyFilter";
import { useURLState } from "../hooks/useURLState";

export const CurrencyCard = ({ isSend = false }: { isSend: boolean }) => {
  const [id, searchId, popover] = crypto.randomUUID().split("-");

  const { from, to, setFrom, setTo } = useURLState();
  const { currencies } = useCurrencies();
  const { filteredCurrencies, setQuery, isOpen, openMenu, closeMenu } =
    useCurrencyFilter({
      currencies,
    });

  const actualCurr =
    currencies.find(({ code }) => code === (isSend ? from : to)) ??
    currencies.find(({ code }) => code === (isSend ? "USD" : "EUR"));

  if (!actualCurr) return null;
  const country = getCurrencyCountry(actualCurr!.code);

  return (
    <Article id={`${id}`}>
      <button
        className={`p-4 rounded-md bg-btn flex gap-2 items-center [anchor-name:--${popover}]`}
        type="button"
        popoverTarget={popover}
      >
        <Flag
          src={
            country.startsWith("x")
              ? "/globe.svg"
              : `https://flagcdn.com/${country}.svg`
          }
          alt={`${actualCurr.name} flag`}
        />{" "}
        <SROnly>Change {isSend ? "send" : "receive"} currency(</SROnly>
        {actualCurr.code}
        <SROnly>)</SROnly> <BiIcon name="caret-down-fill" />
      </button>
      <form
        popover=""
        id={popover}
        aria-live="polite"
        onToggle={(e) => {
          if (e.newState === "open") openMenu();
          else closeMenu();
        }}
        className={`bg-btn inset-auto [position-anchor:--${popover}] [position-area:bottom_span-left] [position-try:flip-block] mt-4 p-4 rounded-lg text-foreground`}
      >
        {isOpen && (
          <>
            <label className="relative w-full">
              <SROnly>Enter the currency you like</SROnly>{" "}
              <BiIcon name="search absolute left-2 top-[.005em]" />
              <input
                type="text"
                id={searchId}
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for currencies..."
                className="pl-8 outline outline-foreground-secondary rounded-sm p-2 w-full"
              />
            </label>

            <Section>
              <Heading className="flex justify-between border-b border-foreground-secondary py-4 text-foreground-secondary">
                Currencies <span>{filteredCurrencies.length}</span>
              </Heading>
              <ul className="mt-4 max-h-[40vh] overflow-y-auto scrollbar-none">
                {filteredCurrencies.map(({ name, code }) => (
                  <li key={code}>
                    <button
                      type="button"
                      popoverTarget={popover}
                      onClick={() => {
                        (isSend ? setFrom : setTo)(code);
                      }}
                      className="flex gap-2 text-sm text-foreground-secondary items-center p-2 w-full"
                    >
                      <Flag
                        src={`https://flagcdn.com/${getCurrencyCountry(code)}.svg`}
                        alt=""
                      />{" "}
                      <SRHidden className="text-lg text-foreground">
                        {code}
                      </SRHidden>{" "}
                      <span className="truncate max-w-48">{name}</span>
                      {code === actualCurr.code && (
                        <BiIcon name="check text-lg ml-auto" />
                      )}
                    </button>
                  </li>
                ))}
                {filteredCurrencies.length === 0 && (
                  <li className="flex h-full items-center justify-center text-sm">
                    No results found
                  </li>
                )}
              </ul>
            </Section>
          </>
        )}
      </form>
    </Article>
  );
};
