import { Currency } from "@/infra/api/frankfurter";
import { Flag } from "@/shared/currencies";
import { BiIcon, scrollIntoView } from "@/shared/utils";
import { SRHidden } from "@/shared/utils/components/SRHidden";

export const CurrencyGroup = ({
  title,
  currencies,
  popover,
  actualCurr,
  choice,
  setChoice,
}: {
  currencies: Currency[];
  title: string;
  popover: string;
  actualCurr: Currency;
  choice: string;
  setChoice: (choice: string) => void;
}) => {
  return (
    <fieldset>
      <legend className="w-full flex justify-between border-b border-foreground-secondary py-4 text-foreground-secondary sticky top-1 z-1 bg-btn">
        {title} <span> {currencies.length}</span>
      </legend>
      <div className="mt-4 w-64 p-1">
        {
          <>
            {currencies.map(({ name, code }) => (
              <label
                key={code}
                ref={actualCurr.code === code ? scrollIntoView : undefined}
                className="relative rounded-lg flex gap-2 text-sm text-foreground-secondary items-center p-2 w-full hover:outline hover:outline-foreground-secondary has-focus-visible:outline has-focus-visible:outline-lime-500 action-btn cursor-pointer"
              >
                <input
                  type="radio"
                  name="convert-currency"
                  defaultChecked={actualCurr.code === code || code === choice}
                  className="absolute scale-0 opacity-0 peer"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setChoice(code);
                    }
                  }}
                  onKeyDown={(e) => {
                    if ([" ", "Enter"].includes(e.key))
                      document.getElementById(popover)?.hidePopover();
                  }}
                  onClick={(e) => {
                    const isKeyboard = e.screenX === 0 && e.screenY === 0;
                    if (!isKeyboard)
                      document.getElementById(popover)?.hidePopover();
                  }}
                />
                <Flag alt="" currency={code} />{" "}
                <SRHidden className="text-lg text-foreground">{code}</SRHidden>{" "}
                <span className="truncate max-w-48">{name}</span>
                <BiIcon name="check text-lg ml-auto peer-not-checked:hidden" />
              </label>
            ))}
          </>
        }
      </div>
    </fieldset>
  );
};
