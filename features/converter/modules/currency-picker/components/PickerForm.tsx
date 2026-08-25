import { BiIcon, LoadingPlaceholder, SROnly } from "@/shared/utils";
import { useCurrencyPicker } from "../hooks/useCurrencyPicker";
import { CurrencyGroup } from "./CurrencyGroup";

export const PickerForm = ({
  isSend,
  popover,
}: {
  isSend: boolean;
  popover: string;
}) => {
  const {
    actualCurr,
    filterOptions: { openMenu, isOpen, closeMenu, setQuery },
    setChoice,
    choice,
    setCurrencyQuery,
    filteredCurrencies,
    filteredFavorites,
    otherCurrencies,
  } = useCurrencyPicker({ isSend });

  if (!actualCurr) return null;

  const listProps = {
    currencies: filteredFavorites,
    title: "Favorites",
    popover,
    actualCurr,
    choice,
    setChoice,
  };

  return (
    <form
      popover=""
      id={popover}
      aria-live="polite"
      onToggle={(e) => {
        if (e.newState === "open") openMenu();
        else {
          setCurrencyQuery(choice);
          closeMenu();
        }
      }}
      className={`bg-btn inset-auto [position-area:bottom_span-left] [position-try:flip-block] mt-4 p-4 rounded-lg text-foreground`}
    >
      <label className="relative w-full">
        <SROnly>
          Enter the currency you like ({isSend ? "base" : "quote"})
        </SROnly>{" "}
        <BiIcon name="search absolute left-2 top-[.005em]" />
        <input
          type="text"
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search for ${isSend ? "base" : "quote"} currency`}
          className="pl-8 outline outline-foreground-secondary rounded-sm p-2 w-full"
        />
      </label>
      {!isOpen ? (
        <LoadingPlaceholder className="h-[30vh] w-64 bg-card" />
      ) : (
        <div className="max-h-80 overflow-y-auto scrollbar-none">
          {filteredFavorites.length > 0 && <CurrencyGroup {...listProps} />}
          {otherCurrencies.length > 0 && (
            <CurrencyGroup
              {...{
                ...listProps,
                currencies: otherCurrencies,
                title: "Other currencies",
              }}
            />
          )}
          {filteredCurrencies.length === 0 && (
            <p className="flex h-full items-center justify-center text-sm">
              No results found
            </p>
          )}
        </div>
      )}
    </form>
  );
};
